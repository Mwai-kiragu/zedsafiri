import { Booking, BookingState, PaymentIntent, PaymentStatus } from '@/types/booking';

// Booking State Machine (Simulated)
export class BookingStateMachine {
  private static bookings: Map<string, Booking> = new Map();
  private static paymentIntents: Map<string, PaymentIntent> = new Map();

  // Valid state transitions
  private static readonly VALID_TRANSITIONS: Record<BookingState, BookingState[]> = {
    'INITIATED': ['AWAITING_PAYMENT', 'CANCELLED', 'EXPIRED'],
    'AWAITING_PAYMENT': ['PAID', 'EXPIRED', 'INITIATED', 'CANCELLED'],
    'PAID': ['TICKETED', 'PAID_NO_SEAT', 'CANCELLED'],
    'TICKETED': ['CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'NO_SHOW'],
    'CANCELLED': [],
    'EXPIRED': ['INITIATED'], // Allow retry
    'REFUNDED': [],
    'PARTIALLY_REFUNDED': ['REFUNDED'],
    'NO_SHOW': [],
    'PAID_NO_SEAT': ['TICKETED', 'REFUNDED'] // Manual reassignment path
  };

  static createBooking(booking: Booking): boolean {
    if (this.bookings.has(booking.pnr)) {
      return false; // PNR already exists
    }

    // Ensure booking starts in INITIATED state
    booking.state = 'INITIATED';
    booking.createdAt = new Date();
    booking.updatedAt = new Date();

    this.bookings.set(booking.pnr, booking);
    this.auditLog(booking.pnr, 'BOOKING_CREATED', 'INITIATED', booking);
    
    return true;
  }

  static transitionTo(pnr: string, newState: BookingState, reason?: string): boolean {
    const booking = this.bookings.get(pnr);
    if (!booking) {
      console.error(`Booking not found: ${pnr}`);
      return false;
    }

    const currentState = booking.state;
    const validTransitions = this.VALID_TRANSITIONS[currentState];

    if (!validTransitions.includes(newState)) {
      console.error(`Invalid transition: ${currentState} -> ${newState} for PNR: ${pnr}`);
      return false;
    }

    const previousState = booking.state;
    booking.state = newState;
    booking.updatedAt = new Date();

    this.auditLog(pnr, 'STATE_TRANSITION', `${previousState} -> ${newState}`, { reason });
    
    // Trigger side effects based on new state
    this.handleStateTransition(booking, previousState, newState);

    return true;
  }

  static getBooking(pnr: string): Booking | null {
    return this.bookings.get(pnr) || null;
  }

  static createPaymentIntent(pnr: string, paymentIntent: PaymentIntent): boolean {
    const booking = this.bookings.get(pnr);
    if (!booking || booking.state !== 'INITIATED') {
      return false;
    }

    this.paymentIntents.set(paymentIntent.id, paymentIntent);
    this.transitionTo(pnr, 'AWAITING_PAYMENT', 'Payment intent created');
    
    return true;
  }

  static processPayment(
    paymentIntentId: string,
    status: PaymentStatus,
    gatewayRef?: string
  ): boolean {
    const intent = this.paymentIntents.get(paymentIntentId);
    if (!intent) {
      return false;
    }

    const booking = this.bookings.get(intent.pnr);
    if (!booking) {
      return false;
    }

    // Idempotent payment processing
    if (booking.state === 'PAID' || booking.state === 'TICKETED') {
      return true; // Already processed
    }

    intent.status = status;
    if (gatewayRef) {
      intent.gatewayRef = gatewayRef;
    }

    if (status === 'SUCCEEDED') {
      this.transitionTo(intent.pnr, 'PAID', `Payment succeeded: ${gatewayRef}`);
      
      // Simulate ticket issuance after payment
      setTimeout(() => {
        this.issueTickets(intent.pnr);
      }, 1000);
      
    } else if (status === 'FAILED' || status === 'EXPIRED') {
      // Keep in AWAITING_PAYMENT for retry or transition back to INITIATED
      this.auditLog(intent.pnr, 'PAYMENT_FAILED', status, { gatewayRef });
    }

    return true;
  }

  static issueTickets(pnr: string): boolean {
    const booking = this.bookings.get(pnr);
    if (!booking || booking.state !== 'PAID') {
      return false;
    }

    // Simulate ticket generation
    const tickets = booking.seatNumbers.map((seat, index) => ({
      id: `ticket_${pnr}_${index}`,
      pnr,
      ticketNumber: `TKT${Date.now()}${index}`,
      seatNumber: seat,
      passengerName: booking.passengerName,
      tripId: booking.tripId,
      issuedAt: new Date(),
      status: 'ISSUED' as const,
      qrCode: `QR_${pnr}_${seat}`
    }));

    this.transitionTo(pnr, 'TICKETED', `${tickets.length} tickets issued`);
    
    // Simulate notification sending
    this.sendTicketNotification(booking, tickets);
    
    return true;
  }

  static cancelBooking(pnr: string, reason: string): boolean {
    const booking = this.bookings.get(pnr);
    if (!booking) {
      return false;
    }

    // Check if cancellation is allowed
    const allowedStates: BookingState[] = ['INITIATED', 'AWAITING_PAYMENT', 'PAID', 'TICKETED'];
    if (!allowedStates.includes(booking.state)) {
      return false;
    }

    return this.transitionTo(pnr, 'CANCELLED', reason);
  }

  private static handleStateTransition(
    booking: Booking,
    fromState: BookingState,
    toState: BookingState
  ): void {
    switch (toState) {
      case 'PAID':
        console.log(`✅ Payment confirmed for PNR: ${booking.pnr}`);
        break;
      
      case 'TICKETED':
        console.log(`🎫 Tickets issued for PNR: ${booking.pnr}`);
        break;
      
      case 'CANCELLED':
        console.log(`❌ Booking cancelled for PNR: ${booking.pnr}`);
        // Simulate refund processing
        if (fromState === 'PAID' || fromState === 'TICKETED') {
          this.processRefund(booking.pnr);
        }
        break;
      
      case 'EXPIRED':
        console.log(`⏰ Booking expired for PNR: ${booking.pnr}`);
        break;
    }
  }

  private static processRefund(pnr: string): void {
    // Simulate refund processing
    console.log(`💰 Processing refund for PNR: ${pnr}`);
  }

  private static sendTicketNotification(booking: Booking, tickets: any[]): void {
    // Simulate notification sending
    console.log(`📧 Sending tickets to ${booking.passengerEmail} for PNR: ${booking.pnr}`);
  }

  private static auditLog(
    pnr: string,
    action: string,
    details: string,
    metadata?: any
  ): void {
    const logEntry = {
      timestamp: new Date(),
      pnr,
      action,
      details,
      metadata
    };
    console.log('📋 AUDIT:', logEntry);
  }

  // Helper methods for testing and simulation
  static getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  static getBookingsByState(state: BookingState): Booking[] {
    return Array.from(this.bookings.values()).filter(b => b.state === state);
  }

  static simulatePaymentTimeout(paymentIntentId: string): void {
    setTimeout(() => {
      this.processPayment(paymentIntentId, 'EXPIRED');
    }, 90000); // 90 seconds timeout
  }
}
