import { Booking, BookingState } from '@/types/booking';
import { TANZANIAN_CITIES } from './tanzanianRoutes';

export const SIMULATED_BOOKINGS: Booking[] = [
  {
    id: 'booking_001',
    pnr: 'PNR2025001',
    tripId: 'trip_dar_dodoma_kilimanjaro_express_Economy_0',
    passengerName: 'John Mwalimu',
    passengerPhone: '+255712345678',
    passengerEmail: 'john.mwalimu@gmail.com',
    seatNumbers: ['A12', 'A13'],
    fareBreakdown: {
      baseFare: 36000,
      latraFee: 1800,
      transactionFee: 720,
      commission: 1080,
      grossFare: 38520
    },
    state: 'TICKETED' as BookingState,
    channel: 'WEB',
    createdAt: new Date('2025-01-10T08:30:00'),
    updatedAt: new Date('2025-01-10T08:35:00')
  },
  {
    id: 'booking_002',
    pnr: 'PNR2025002',
    tripId: 'trip_dar_arusha_scandinavian_express_Business_1',
    passengerName: 'Fatuma Hassan',
    passengerPhone: '+255754123456',
    passengerEmail: 'fatuma.hassan@yahoo.com',
    seatNumbers: ['B08'],
    fareBreakdown: {
      baseFare: 30000,
      latraFee: 1500,
      transactionFee: 600,
      commission: 900,
      grossFare: 32100
    },
    state: 'PAID' as BookingState,
    channel: 'WEB',
    createdAt: new Date('2025-01-12T14:20:00'),
    updatedAt: new Date('2025-01-12T14:25:00')
  },
  {
    id: 'booking_003',
    pnr: 'PNR2025003',
    tripId: 'train_dar_mwanza_trc_express_Economy_0',
    passengerName: 'Peter Kimaro',
    passengerPhone: '+255765987654',
    passengerEmail: 'p.kimaro@hotmail.com',
    seatNumbers: ['C15'],
    fareBreakdown: {
      baseFare: 45000,
      latraFee: 2250,
      transactionFee: 900,
      commission: 1350,
      grossFare: 48150
    },
    state: 'AWAITING_PAYMENT' as BookingState,
    channel: 'WEB',
    createdAt: new Date('2025-01-15T11:10:00'),
    updatedAt: new Date('2025-01-15T11:10:00')
  },
  {
    id: 'booking_004',
    pnr: 'PNR2025004',
    tripId: 'trip_dar_mbeya_royal_coach_Royal_2',
    passengerName: 'Grace Msigwa',
    passengerPhone: '+255789654321',
    passengerEmail: 'grace.msigwa@gmail.com',
    seatNumbers: ['R05', 'R06'],
    fareBreakdown: {
      baseFare: 64000,
      latraFee: 3200,
      transactionFee: 1280,
      commission: 1920,
      grossFare: 68480
    },
    state: 'CANCELLED' as BookingState,
    channel: 'WEB',
    createdAt: new Date('2025-01-08T16:45:00'),
    updatedAt: new Date('2025-01-09T09:30:00')
  },
  {
    id: 'booking_005',
    pnr: 'PNR2025005',
    tripId: 'trip_dar_tanga_dar_express_Economy_1',
    passengerName: 'Hassan Ally',
    passengerPhone: '+255692147483',
    passengerEmail: 'hassan.ally@outlook.com',
    seatNumbers: ['D22'],
    fareBreakdown: {
      baseFare: 15000,
      latraFee: 750,
      transactionFee: 300,
      commission: 450,
      grossFare: 16050
    },
    state: 'TICKETED' as BookingState,
    channel: 'WEB',
    createdAt: new Date('2025-01-14T07:15:00'),
    updatedAt: new Date('2025-01-14T07:20:00')
  },
  {
    id: 'booking_006',
    pnr: 'PNR2025006',
    tripId: 'train_dar_kigoma_tazara_railway_Business_0',
    passengerName: 'Mary Ngowi',
    passengerPhone: '+255713456789',
    passengerEmail: 'mary.ngowi@gmail.com',
    seatNumbers: ['B12'],
    fareBreakdown: {
      baseFare: 57600,
      latraFee: 2880,
      transactionFee: 1152,
      commission: 1728,
      grossFare: 61632
    },
    state: 'EXPIRED' as BookingState,
    channel: 'WEB',
    createdAt: new Date('2025-01-05T20:30:00'),
    updatedAt: new Date('2025-01-06T20:30:00')
  },
  {
    id: 'booking_007',
    pnr: 'PNR2025007',
    tripId: 'trip_arusha_mwanza_hood_bus_Economy_0',
    passengerName: 'Emmanuel Mlanga',
    passengerPhone: '+255744556677',
    passengerEmail: 'e.mlanga@yahoo.com',
    seatNumbers: ['A18'],
    fareBreakdown: {
      baseFare: 20000,
      latraFee: 1000,
      transactionFee: 400,
      commission: 600,
      grossFare: 21400
    },
    state: 'TICKETED' as BookingState,
    channel: 'WEB',
    createdAt: new Date('2025-01-13T12:00:00'),
    updatedAt: new Date('2025-01-13T12:05:00')
  },
  {
    id: 'booking_008',
    pnr: 'PNR2025008',
    tripId: 'trip_dar_morogoro_riverside_shuttle_Business_1',
    passengerName: 'Amina Juma',
    passengerPhone: '+255756789012',
    passengerEmail: 'amina.juma@hotmail.com',
    seatNumbers: ['B04'],
    fareBreakdown: {
      baseFare: 9600,
      latraFee: 480,
      transactionFee: 192,
      commission: 288,
      grossFare: 10272
    },
    state: 'PAID' as BookingState,
    channel: 'WEB',
    createdAt: new Date('2025-01-16T09:45:00'),
    updatedAt: new Date('2025-01-16T09:50:00')
  }
];

export function getBookingsByState(state: BookingState): Booking[] {
  return SIMULATED_BOOKINGS.filter(booking => booking.state === state);
}

export function getRecentBookings(limit: number = 5): Booking[] {
  return SIMULATED_BOOKINGS
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export function getUserBookings(phone: string): Booking[] {
  return SIMULATED_BOOKINGS.filter(booking => booking.passengerPhone === phone);
}

export function getBookingByPNR(pnr: string): Booking | undefined {
  return SIMULATED_BOOKINGS.find(booking => booking.pnr === pnr);
}