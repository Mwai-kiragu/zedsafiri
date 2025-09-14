// Ticket Service - Simulates ticket storage using localStorage
import type { Ticket, Booking } from '@/types/booking';

export interface SavedTicket {
  id: string;
  pnr: string;
  ticketNumber: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  route: string;
  operator: string;
  vehicleType: string;
  departureTime: string;
  arrivalTime: string;
  seatNumbers: string[];
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  bookingDate: string;
  travelDate: string;
  status: 'ISSUED' | 'USED' | 'CANCELLED';
  qrCode: string;
}

class TicketService {
  private storageKey = 'user_tickets';

  generatePNR(): string {
    return 'LTR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 3).toUpperCase();
  }

  generateTicketNumber(): string {
    return 'TK' + Date.now().toString() + Math.random().toString().substr(2, 4);
  }

  generateQRCode(ticketData: any): string {
    // Simulate QR code generation - in real app this would be actual QR code
    return `QR_${ticketData.ticketNumber}_${ticketData.pnr}`;
  }

  saveTicket(bookingData: any, passengerDetails: any, paymentMethod: string, totalAmount: number, currency: string): SavedTicket {
    const pnr = this.generatePNR();
    const ticketNumber = this.generateTicketNumber();
    
    const ticket: SavedTicket = {
      id: `ticket_${Date.now()}`,
      pnr,
      ticketNumber,
      passengerName: passengerDetails.fullName,
      passengerEmail: passengerDetails.email,
      passengerPhone: passengerDetails.phone,
      route: `${bookingData.searchParams.from} → ${bookingData.searchParams.to}`,
      operator: bookingData.booking.operator,
      vehicleType: bookingData.booking.type,
      departureTime: bookingData.booking.departureTime,
      arrivalTime: bookingData.booking.arrivalTime,
      seatNumbers: this.generateSeatNumbers(bookingData.searchParams.passengers),
      totalAmount,
      currency,
      paymentMethod,
      bookingDate: new Date().toISOString(),
      travelDate: bookingData.searchParams.date,
      status: 'ISSUED',
      qrCode: ''
    };

    // Generate QR code after ticket is created
    ticket.qrCode = this.generateQRCode(ticket);

    // Save to localStorage
    const existingTickets = this.getUserTickets();
    existingTickets.push(ticket);
    localStorage.setItem(this.storageKey, JSON.stringify(existingTickets));

    return ticket;
  }

  getUserTickets(): SavedTicket[] {
    const tickets = localStorage.getItem(this.storageKey);
    return tickets ? JSON.parse(tickets) : [];
  }

  getTicketByPNR(pnr: string): SavedTicket | undefined {
    return this.getUserTickets().find(ticket => ticket.pnr === pnr);
  }

  private generateSeatNumbers(passengerCount: number): string[] {
    const seats = [];
    for (let i = 0; i < passengerCount; i++) {
      // Generate random seat numbers (simulate seat assignment)
      const row = Math.floor(Math.random() * 20) + 1;
      const letter = String.fromCharCode(65 + (i % 4)); // A, B, C, D
      seats.push(`${row}${letter}`);
    }
    return seats;
  }

  cancelTicket(ticketId: string): boolean {
    const tickets = this.getUserTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex !== -1) {
      tickets[ticketIndex].status = 'CANCELLED';
      localStorage.setItem(this.storageKey, JSON.stringify(tickets));
      return true;
    }
    return false;
  }
}

export const ticketService = new TicketService();