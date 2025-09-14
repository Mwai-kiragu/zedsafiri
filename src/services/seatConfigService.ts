import { Trip } from '@/types/booking';

export interface SeatConfig {
  id: string;
  row: number;
  column: 'A' | 'B' | 'C' | 'D' | 'E';
  type: 'WINDOW' | 'AISLE' | 'MIDDLE';
  class: 'Economy' | 'Business' | 'Royal';
  isBlocked?: boolean;
  isOccupied?: boolean; // Pre-occupied seats for testing
}

export interface VehicleLayout {
  id: string;
  name: string;
  transportType: 'bus' | 'train';
  class: 'Economy' | 'Business' | 'Royal';
  totalSeats: number;
  rows: number;
  seatsPerRow: number;
  hasAisle: boolean;
  layout: SeatConfig[];
}

// Define vehicle layouts for different classes
export const VEHICLE_LAYOUTS: VehicleLayout[] = [
  // Economy Bus (49 seats, 4 seats per row, aisle in middle)
  {
    id: 'economy_bus_standard',
    name: 'Standard Economy Bus',
    transportType: 'bus',
    class: 'Economy',
    totalSeats: 48,
    rows: 12,
    seatsPerRow: 4,
    hasAisle: true,
    layout: []
  },
  // Business Bus (35 seats, 3+2 layout)
  {
    id: 'business_bus_standard',
    name: 'Business Class Bus',
    transportType: 'bus',
    class: 'Business',
    totalSeats: 35,
    rows: 7,
    seatsPerRow: 5,
    hasAisle: true,
    layout: []
  },
  // Royal Bus (28 seats, 2+2 layout, more legroom)
  {
    id: 'royal_bus_standard',
    name: 'Royal Class Bus',
    transportType: 'bus',
    class: 'Royal',
    totalSeats: 28,
    rows: 7,
    seatsPerRow: 4,
    hasAisle: true,
    layout: []
  },
  // Economy Train (larger capacity)
  {
    id: 'economy_train_standard',
    name: 'Economy Train Car',
    transportType: 'train',
    class: 'Economy',
    totalSeats: 72,
    rows: 18,
    seatsPerRow: 4,
    hasAisle: true,
    layout: []
  }
];

export class SeatConfigService {
  private static layouts: Map<string, VehicleLayout> = new Map();
  
  static {
    // Initialize layouts with actual seat configurations
    VEHICLE_LAYOUTS.forEach(layout => {
      layout.layout = this.generateSeatLayout(layout);
      this.layouts.set(layout.id, layout);
    });
  }
  
  private static generateSeatLayout(config: VehicleLayout): SeatConfig[] {
    const seats: SeatConfig[] = [];
    const { rows, seatsPerRow, class: vehicleClass, hasAisle } = config;
    
    for (let row = 1; row <= rows; row++) {
      if (hasAisle && seatsPerRow === 4) {
        // 2+2 layout with aisle
        seats.push({
          id: `${row}A`,
          row,
          column: 'A',
          type: 'WINDOW',
          class: vehicleClass
        });
        seats.push({
          id: `${row}B`,
          row,
          column: 'B',
          type: 'AISLE',
          class: vehicleClass
        });
        seats.push({
          id: `${row}C`,
          row,
          column: 'C',
          type: 'AISLE',
          class: vehicleClass
        });
        seats.push({
          id: `${row}D`,
          row,
          column: 'D',
          type: 'WINDOW',
          class: vehicleClass
        });
      } else if (hasAisle && seatsPerRow === 5) {
        // 3+2 layout (Business)
        seats.push({
          id: `${row}A`,
          row,
          column: 'A',
          type: 'WINDOW',
          class: vehicleClass
        });
        seats.push({
          id: `${row}B`,
          row,
          column: 'B',
          type: 'MIDDLE',
          class: vehicleClass
        });
        seats.push({
          id: `${row}C`,
          row,
          column: 'C',
          type: 'AISLE',
          class: vehicleClass
        });
        seats.push({
          id: `${row}D`,
          row,
          column: 'D',
          type: 'AISLE',
          class: vehicleClass
        });
        seats.push({
          id: `${row}E`,
          row,
          column: 'E',
          type: 'WINDOW',
          class: vehicleClass
        });
      }
    }
    
    return seats;
  }
  
  static getLayoutForTrip(trip: Trip): VehicleLayout {
    const layoutKey = `${trip.class.toLowerCase()}_${trip.operatorId.includes('train') ? 'train' : 'bus'}_standard`;
    const layout = this.layouts.get(layoutKey) || this.layouts.get('economy_bus_standard')!;
    
    // Clone and mark some seats as occupied for testing
    const testLayout = { ...layout };
    testLayout.layout = layout.layout.map(seat => ({
      ...seat,
      // Mark specific seats as occupied for testing scenarios
      isOccupied: this.isTestSeatOccupied(trip.id, seat.id),
      isBlocked: this.isTestSeatBlocked(trip.id, seat.id)
    }));
    
    return testLayout;
  }
  
  // Test data - some seats are pre-occupied for testing
  private static isTestSeatOccupied(tripId: string, seatId: string): boolean {
    // For TR123 (test trip), mark seat 1A as occupied
    if (tripId === 'TR123' && seatId === '1A') return true;
    
    // Randomly occupy some other seats for realism
    if (tripId.includes('scandinavian_express')) {
      return ['2B', '3C', '5A', '7D'].includes(seatId);
    }
    
    return false;
  }
  
  private static isTestSeatBlocked(tripId: string, seatId: string): boolean {
    // Block seats that are out of service
    return ['12D'].includes(seatId); // Last seat often blocked for maintenance
  }
  
  static getAllLayouts(): VehicleLayout[] {
    return Array.from(this.layouts.values());
  }
  
  static getSeatInfo(tripId: string, seatId: string): SeatConfig | null {
    // This would typically fetch from database
    // For now, return generic info
    const [row, column] = [parseInt(seatId.slice(0, -1)), seatId.slice(-1) as 'A'|'B'|'C'|'D'|'E'];
    
    return {
      id: seatId,
      row,
      column,
      type: ['A', 'E'].includes(column) ? 'WINDOW' : (['D'].includes(column) ? 'WINDOW' : 'AISLE'),
      class: 'Economy' // Default for demo
    };
  }
}