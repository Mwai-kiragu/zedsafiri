// LATRA-Compliant Booking System Types

export type BookingState = 
  | 'INITIATED' 
  | 'AWAITING_PAYMENT' 
  | 'PAID' 
  | 'TICKETED' 
  | 'CANCELLED' 
  | 'EXPIRED' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED' 
  | 'NO_SHOW'
  | 'PAID_NO_SEAT';

export type PaymentStatus = 
  | 'CREATED' 
  | 'PENDING' 
  | 'SUCCEEDED' 
  | 'FAILED' 
  | 'EXPIRED' 
  | 'REVERSED';

export type SeatStatus = 'FREE' | 'HELD' | 'OCCUPIED' | 'BLOCKED';

export type PaymentMethod = 'STK_PUSH' | 'CARD' | 'BANK_TRANSFER';

export interface Trip {
  id: string;
  routeId: string;
  operatorId: string;
  vehicleId: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  class: 'Economy' | 'Business' | 'Royal';
  status: 'Scheduled' | 'Departed' | 'Cancelled';
  baseFare: number;
  seatsAvailable: number;
  totalSeats: number;
}

export interface FareBreakdown {
  baseFare: number;
  latraFee: number;
  transactionFee: number;
  commission: number;
  grossFare: number;
}

export interface SeatLock {
  id: string;
  tripId: string;
  seatIds: string[];
  pnr?: string;
  expiresAt: Date;
  status: 'HELD' | 'EXPIRED' | 'REPLACED' | 'CONVERTED';
  userId: string;
}

export interface PaymentIntent {
  id: string;
  pnr: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayRef?: string;
  idempotencyKey: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface Booking {
  id: string;
  pnr: string;
  tripId: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  seatNumbers: string[];
  fareBreakdown: FareBreakdown;
  state: BookingState;
  channel: 'WEB' | 'MOBILE' | 'AGENT';
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  pnr: string;
  ticketNumber: string;
  seatNumber: string;
  passengerName: string;
  tripId: string;
  issuedAt: Date;
  status: 'ISSUED' | 'VOID' | 'REFUNDED';
  qrCode: string;
}