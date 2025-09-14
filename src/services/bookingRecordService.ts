import { Booking, BookingState, FareBreakdown } from '@/types/booking';

interface BookingRecord {
  id: string;
  pnr: string;
  tripId: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  passengerIdNumber?: string;
  seatNumbers: string[];
  fareBreakdown: FareBreakdown;
  state: BookingState;
  channel: 'WEB' | 'MOBILE' | 'AGENT';
  createdAt: Date;
  updatedAt: Date;
  lockId?: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  event: string;
  bookingId: string;
  pnr: string;
  actorId: string;
  actorType: 'USER' | 'AGENT' | 'SYSTEM';
  details: Record<string, any>;
  immutable: true;
}

// Simulated database storage
export class BookingRecordService {
  private static bookings: Map<string, BookingRecord> = new Map();
  private static auditLogs: AuditLogEntry[] = [];
  private static pnrCounter = 1000;
  
  // Generate unique PNR with LATRA-compliant format
  static generatePNR(): string {
    const prefix = 'LTR'; // LATRA prefix
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const sequence = (this.pnrCounter++).toString().padStart(3, '0');
    return `${prefix}${timestamp}${sequence}`; // Format: LTR123456001
  }

  // Validate PNR uniqueness (should always be true with current logic)
  static validatePNRUniqueness(pnr: string): boolean {
    for (const booking of this.bookings.values()) {
      if (booking.pnr === pnr) {
        return false;
      }
    }
    return true;
  }

  // Calculate LATRA-compliant fare breakdown
  static calculateFareBreakdown(baseFare: number, seatCount: number): FareBreakdown {
    const totalBaseFare = baseFare * seatCount;
    
    // LATRA regulatory fees (simulated rates)
    const latraFee = Math.round(totalBaseFare * 0.05); // 5% LATRA fee
    const transactionFee = Math.round(totalBaseFare * 0.025); // 2.5% transaction fee
    const commission = Math.round(totalBaseFare * 0.02); // 2% operator commission
    
    const grossFare = totalBaseFare + latraFee + transactionFee + commission;

    return {
      baseFare: totalBaseFare,
      latraFee,
      transactionFee,
      commission,
      grossFare
    };
  }

  // Create booking record in INITIATED state
  static createBooking(
    tripId: string,
    passengerDetails: {
      name: string;
      phone: string;
      email: string;
      idNumber?: string;
    },
    seatNumbers: string[],
    baseFare: number,
    lockId?: string,
    actorId: string = 'user123'
  ): BookingRecord {
    
    // Generate unique PNR
    let pnr: string;
    do {
      pnr = this.generatePNR();
    } while (!this.validatePNRUniqueness(pnr));

    // Calculate fare breakdown
    const fareBreakdown = this.calculateFareBreakdown(baseFare, seatNumbers.length);

    // Create booking record
    const booking: BookingRecord = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pnr,
      tripId,
      passengerName: passengerDetails.name,
      passengerPhone: passengerDetails.phone,
      passengerEmail: passengerDetails.email,
      passengerIdNumber: passengerDetails.idNumber,
      seatNumbers,
      fareBreakdown,
      state: 'INITIATED',
      channel: 'WEB',
      createdAt: new Date(),
      updatedAt: new Date(),
      lockId
    };

    // Store booking
    this.bookings.set(booking.id, booking);

    // Create audit log entry
    this.createAuditLog('BOOKING_CREATED', booking.id, pnr, actorId, 'USER', {
      tripId,
      seatNumbers,
      fareBreakdown,
      passengerName: passengerDetails.name,
      channel: 'WEB'
    });

    return booking;
  }

  // Update booking state
  static updateBookingState(
    bookingId: string, 
    newState: BookingState, 
    actorId: string = 'system'
  ): boolean {
    const booking = this.bookings.get(bookingId);
    if (!booking) return false;

    const oldState = booking.state;
    booking.state = newState;
    booking.updatedAt = new Date();

    // Create audit log for state change
    this.createAuditLog('BOOKING_STATE_CHANGED', bookingId, booking.pnr, actorId, 'SYSTEM', {
      oldState,
      newState,
      timestamp: new Date()
    });

    return true;
  }

  // Get booking by PNR
  static getBookingByPNR(pnr: string): BookingRecord | null {
    for (const booking of this.bookings.values()) {
      if (booking.pnr === pnr) {
        return booking;
      }
    }
    return null;
  }

  // Get booking by ID
  static getBookingById(id: string): BookingRecord | null {
    return this.bookings.get(id) || null;
  }

  // Get all bookings for testing
  static getAllBookings(): BookingRecord[] {
    return Array.from(this.bookings.values());
  }

  // Create immutable audit log entry
  private static createAuditLog(
    event: string,
    bookingId: string,
    pnr: string,
    actorId: string,
    actorType: 'USER' | 'AGENT' | 'SYSTEM',
    details: Record<string, any>
  ): void {
    const auditEntry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      event,
      bookingId,
      pnr,
      actorId,
      actorType,
      details,
      immutable: true
    };

    this.auditLogs.push(auditEntry);
  }

  // Query audit logs (for compliance verification)
  static getAuditLogs(filters?: {
    bookingId?: string;
    pnr?: string;
    event?: string;
    actorId?: string;
  }): AuditLogEntry[] {
    let logs = this.auditLogs;

    if (filters) {
      if (filters.bookingId) {
        logs = logs.filter(log => log.bookingId === filters.bookingId);
      }
      if (filters.pnr) {
        logs = logs.filter(log => log.pnr === filters.pnr);
      }
      if (filters.event) {
        logs = logs.filter(log => log.event === filters.event);
      }
      if (filters.actorId) {
        logs = logs.filter(log => log.actorId === filters.actorId);
      }
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Validate mandatory passenger fields
  static validatePassengerDetails(details: {
    name: string;
    phone: string;
    email: string;
    idNumber?: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!details.name || details.name.trim().length < 2) {
      errors.push('Passenger name is required (minimum 2 characters)');
    }

    if (!details.phone || !/^[\+]?[1-9][\d]{7,14}$/.test(details.phone.replace(/\s/g, ''))) {
      errors.push('Valid phone number is required');
    }

    if (!details.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.push('Valid email address is required');
    }

    // ID number validation could be added based on country requirements
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Test utilities for validation
  static validateFareCalculation(booking: BookingRecord): boolean {
    const { baseFare, latraFee, transactionFee, commission, grossFare } = booking.fareBreakdown;
    const calculatedTotal = baseFare + latraFee + transactionFee + commission;
    
    return Math.abs(calculatedTotal - grossFare) < 0.01; // Allow for rounding differences
  }

  static validateLATRAFeeCompliance(booking: BookingRecord): boolean {
    const { baseFare, latraFee } = booking.fareBreakdown;
    const expectedLATRAFee = Math.round(baseFare * 0.05); // 5% rate
    
    return Math.abs(latraFee - expectedLATRAFee) <= 1; // Allow for rounding
  }

  // Reset for testing
  static resetForTesting(): void {
    this.bookings.clear();
    this.auditLogs = [];
    this.pnrCounter = 1000;
  }
}