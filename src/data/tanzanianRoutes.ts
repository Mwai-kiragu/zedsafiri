import { Trip } from '@/types/booking';

export interface TanzanianCity {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number]; // [lat, lng]
}

export const TANZANIAN_CITIES: TanzanianCity[] = [
  // Major Cities
  { id: 'dar', name: 'Dar es Salaam', region: 'Dar es Salaam', coordinates: [-6.7924, 39.2083] },
  { id: 'dodoma', name: 'Dodoma', region: 'Dodoma', coordinates: [-6.1630, 35.7516] },
  { id: 'mwanza', name: 'Mwanza', region: 'Mwanza', coordinates: [-2.5164, 32.9175] },
  { id: 'arusha', name: 'Arusha', region: 'Arusha', coordinates: [-3.3869, 36.6830] },
  { id: 'mbeya', name: 'Mbeya', region: 'Mbeya', coordinates: [-8.9094, 33.4607] },
  { id: 'morogoro', name: 'Morogoro', region: 'Morogoro', coordinates: [-6.8235, 37.6604] },
  { id: 'tanga', name: 'Tanga', region: 'Tanga', coordinates: [-5.0692, 39.0987] },
  { id: 'tabora', name: 'Tabora', region: 'Tabora', coordinates: [-5.0167, 32.8000] },
  { id: 'kigoma', name: 'Kigoma', region: 'Kigoma', coordinates: [-4.8765, 29.6269] },
  { id: 'mtwara', name: 'Mtwara', region: 'Mtwara', coordinates: [-10.2669, 40.1827] },
  { id: 'iringa', name: 'Iringa', region: 'Iringa', coordinates: [-7.7699, 35.6990] },
  { id: 'shinyanga', name: 'Shinyanga', region: 'Shinyanga', coordinates: [-3.6638, 33.4218] },
  { id: 'songea', name: 'Songea', region: 'Ruvuma', coordinates: [-10.6839, 35.6503] },
  { id: 'musoma', name: 'Musoma', region: 'Mara', coordinates: [-1.5000, 33.8000] },
  { id: 'bukoba', name: 'Bukoba', region: 'Kagera', coordinates: [-1.3356, 31.8120] },
  { id: 'sumbawanga', name: 'Sumbawanga', region: 'Rukwa', coordinates: [-7.9667, 31.6167] },
  { id: 'lindi', name: 'Lindi', region: 'Lindi', coordinates: [-9.9971, 39.7178] },
  { id: 'singida', name: 'Singida', region: 'Singida', coordinates: [-4.8167, 34.7500] },
  { id: 'njombe', name: 'Njombe', region: 'Njombe', coordinates: [-9.3333, 34.7667] },
  { id: 'kilifi', name: 'Kilifi', region: 'Kilimanjaro', coordinates: [-3.2083, 37.3167] }
];

export interface RouteInfo {
  id: string;
  origin: TanzanianCity;
  destination: TanzanianCity;
  distanceKm: number;
  durationHours: number;
  baseFare: number;
  popular: boolean;
  transportType: 'bus' | 'train';
}

export const POPULAR_ROUTES: RouteInfo[] = [
  // Major bus routes
  {
    id: 'dar_dodoma',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'dodoma')!,
    distanceKm: 460,
    durationHours: 6,
    baseFare: 18000,
    popular: true,
    transportType: 'bus'
  },
  {
    id: 'dar_mwanza',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'mwanza')!,
    distanceKm: 1142,
    durationHours: 14,
    baseFare: 35000,
    popular: true,
    transportType: 'bus'
  },
  {
    id: 'dar_arusha',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'arusha')!,
    distanceKm: 635,
    durationHours: 8,
    baseFare: 25000,
    popular: true,
    transportType: 'bus'
  },
  {
    id: 'dar_mbeya',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'mbeya')!,
    distanceKm: 835,
    durationHours: 12,
    baseFare: 32000,
    popular: true,
    transportType: 'bus'
  },
  {
    id: 'dar_morogoro',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'morogoro')!,
    distanceKm: 196,
    durationHours: 3,
    baseFare: 8000,
    popular: true,
    transportType: 'bus'
  },
  {
    id: 'dar_tanga',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'tanga')!,
    distanceKm: 352,
    durationHours: 5,
    baseFare: 15000,
    popular: true,
    transportType: 'bus'
  },
  {
    id: 'arusha_mwanza',
    origin: TANZANIAN_CITIES.find(c => c.id === 'arusha')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'mwanza')!,
    distanceKm: 380,
    durationHours: 6,
    baseFare: 20000,
    popular: true,
    transportType: 'bus'
  },
  {
    id: 'dodoma_mwanza',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dodoma')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'mwanza')!,
    distanceKm: 441,
    durationHours: 7,
    baseFare: 22000,
    popular: true,
    transportType: 'bus'
  },
  {
    id: 'mbeya_iringa',
    origin: TANZANIAN_CITIES.find(c => c.id === 'mbeya')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'iringa')!,
    distanceKm: 285,
    durationHours: 4,
    baseFare: 12000,
    popular: false,
    transportType: 'bus'
  },
  {
    id: 'tabora_kigoma',
    origin: TANZANIAN_CITIES.find(c => c.id === 'tabora')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'kigoma')!,
    distanceKm: 374,
    durationHours: 6,
    baseFare: 18000,
    popular: false,
    transportType: 'bus'
  },
  {
    id: 'mwanza_bukoba',
    origin: TANZANIAN_CITIES.find(c => c.id === 'mwanza')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'bukoba')!,
    distanceKm: 290,
    durationHours: 5,
    baseFare: 15000,
    popular: false,
    transportType: 'bus'
  },
  {
    id: 'mtwara_lindi',
    origin: TANZANIAN_CITIES.find(c => c.id === 'mtwara')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'lindi')!,
    distanceKm: 152,
    durationHours: 3,
    baseFare: 7000,
    popular: false,
    transportType: 'bus'
  },
  {
    id: 'iringa_njombe',
    origin: TANZANIAN_CITIES.find(c => c.id === 'iringa')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'njombe')!,
    distanceKm: 180,
    durationHours: 3,
    baseFare: 9000,
    popular: false,
    transportType: 'bus'
  },
  {
    id: 'singida_tabora',
    origin: TANZANIAN_CITIES.find(c => c.id === 'singida')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'tabora')!,
    distanceKm: 206,
    durationHours: 4,
    baseFare: 10000,
    popular: false,
    transportType: 'bus'
  },
  {
    id: 'songea_mbeya',
    origin: TANZANIAN_CITIES.find(c => c.id === 'songea')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'mbeya')!,
    distanceKm: 387,
    durationHours: 6,
    baseFare: 18000,
    popular: false,
    transportType: 'bus'
  },
  // Train routes (TAZARA and TRC lines)
  {
    id: 'train_dar_dodoma',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'dodoma')!,
    distanceKm: 453,
    durationHours: 8,
    baseFare: 22000,
    popular: true,
    transportType: 'train'
  },
  {
    id: 'train_dar_mwanza',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'mwanza')!,
    distanceKm: 1206,
    durationHours: 18,
    baseFare: 45000,
    popular: true,
    transportType: 'train'
  },
  {
    id: 'train_dar_kigoma',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'kigoma')!,
    distanceKm: 1253,
    durationHours: 20,
    baseFare: 48000,
    popular: true,
    transportType: 'train'
  },
  {
    id: 'train_dar_mbeya',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dar')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'mbeya')!,
    distanceKm: 965,
    durationHours: 16,
    baseFare: 38000,
    popular: true,
    transportType: 'train'
  },
  {
    id: 'train_dodoma_mwanza',
    origin: TANZANIAN_CITIES.find(c => c.id === 'dodoma')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'mwanza')!,
    distanceKm: 753,
    durationHours: 12,
    baseFare: 28000,
    popular: false,
    transportType: 'train'
  },
  {
    id: 'train_tabora_mwanza',
    origin: TANZANIAN_CITIES.find(c => c.id === 'tabora')!,
    destination: TANZANIAN_CITIES.find(c => c.id === 'mwanza')!,
    distanceKm: 438,
    durationHours: 8,
    baseFare: 20000,
    popular: false,
    transportType: 'train'
  }
];

export const BUS_OPERATORS = [
  {
    id: 'kilimanjaro_express',
    name: 'Kilimanjaro Express',
    rating: 4.5,
    amenities: ['AC', 'WiFi', 'Entertainment', 'Refreshments'],
    classes: ['Economy', 'Business'],
    transportType: 'bus'
  },
  {
    id: 'dar_express',
    name: 'Dar Express',
    rating: 4.2,
    amenities: ['AC', 'Entertainment', 'Refreshments'],
    classes: ['Economy', 'Royal'],
    transportType: 'bus'
  },
  {
    id: 'scandinavian_express',
    name: 'Scandinavian Express',
    rating: 4.7,
    amenities: ['AC', 'WiFi', 'Entertainment', 'Refreshments', 'Charging'],
    classes: ['Economy', 'Business', 'Royal'],
    transportType: 'bus'
  },
  {
    id: 'hood_bus',
    name: 'Hood Bus',
    rating: 4.0,
    amenities: ['AC', 'Entertainment'],
    classes: ['Economy'],
    transportType: 'bus'
  },
  {
    id: 'riverside_shuttle',
    name: 'Riverside Shuttle',
    rating: 3.8,
    amenities: ['AC', 'Refreshments'],
    classes: ['Economy', 'Business'],
    transportType: 'bus'
  },
  {
    id: 'royal_coach',
    name: 'Royal Coach',
    rating: 4.6,
    amenities: ['AC', 'WiFi', 'Entertainment', 'Refreshments', 'Reclining Seats'],
    classes: ['Business', 'Royal'],
    transportType: 'bus'
  }
];

export const TRAIN_OPERATORS = [
  {
    id: 'trc_express',
    name: 'TRC Express',
    rating: 4.1,
    amenities: ['Dining Car', 'Sleeping Berths', 'Luggage Storage'],
    classes: ['Economy', 'Business'],
    transportType: 'train'
  },
  {
    id: 'tazara_railway',
    name: 'TAZARA Railway',
    rating: 3.9,
    amenities: ['Dining Car', 'Sleeping Berths', 'AC'],
    classes: ['Economy', 'Business', 'Royal'],
    transportType: 'train'
  },
  {
    id: 'central_line',
    name: 'Central Railway',
    rating: 3.7,
    amenities: ['Dining Car', 'Luggage Storage'],
    classes: ['Economy', 'Business'],
    transportType: 'train'
  }
];

export function generateTripsForRoute(route: RouteInfo, date: string): Trip[] {
  const trips: Trip[] = [];
  const operators = route.transportType === 'bus' ? BUS_OPERATORS : TRAIN_OPERATORS;
  const departureTimes = route.transportType === 'bus' 
    ? ['06:00', '08:30', '11:00', '14:00', '17:30', '20:00']
    : ['07:00', '15:00', '22:00']; // Trains have fewer departures
  
  departureTimes.forEach((departureTime, index) => {
    // Not all operators run all times
    const availableOperators = operators.filter(() => Math.random() > 0.3);
    
    availableOperators.forEach(operator => {
      operator.classes.forEach(className => {
        const [hours, minutes] = departureTime.split(':').map(Number);
        const arrivalTime = new Date();
        arrivalTime.setHours(hours + route.durationHours);
        arrivalTime.setMinutes(minutes);
        
        const classMultiplier = className === 'Royal' ? 1.5 : className === 'Business' ? 1.2 : 1;
        const operatorMultiplier = operator.rating > 4.5 ? 1.1 : 1;
        
        trips.push({
          id: `trip_${route.id}_${operator.id}_${className}_${index}`,
          routeId: route.id,
          operatorId: operator.id,
          vehicleId: `vehicle_${operator.id}_${Math.floor(Math.random() * 20) + 1}`,
          origin: route.origin.name,
          destination: route.destination.name,
          departureTime: `${date} ${departureTime}`,
          arrivalTime: `${date} ${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`,
          class: className as 'Economy' | 'Business' | 'Royal',
          status: 'Scheduled',
          baseFare: Math.round(route.baseFare * classMultiplier * operatorMultiplier),
          seatsAvailable: Math.floor(Math.random() * 20) + 15, // 15-35 available seats
          totalSeats: className === 'Royal' ? 28 : className === 'Business' ? 35 : 49
        });
      });
    });
  });
  
  return trips.filter(() => Math.random() > 0.2); // Remove some trips for realism
}

export function getOperatorInfo(operatorId: string) {
  return [...BUS_OPERATORS, ...TRAIN_OPERATORS].find(op => op.id === operatorId);
}

export function searchRoutes(origin?: string, destination?: string, transportType?: 'bus' | 'train'): RouteInfo[] {
  let routes = POPULAR_ROUTES;
  
  if (transportType) {
    routes = routes.filter(route => route.transportType === transportType);
  }
  
  if (!origin && !destination) {
    return routes;
  }
  
  return routes.filter(route => {
    const matchesOrigin = !origin || route.origin.name.toLowerCase().includes(origin.toLowerCase()) || route.origin.region.toLowerCase().includes(origin.toLowerCase());
    const matchesDestination = !destination || route.destination.name.toLowerCase().includes(destination.toLowerCase()) || route.destination.region.toLowerCase().includes(destination.toLowerCase());
    return matchesOrigin && matchesDestination;
  });
}

export function getAllCities(): TanzanianCity[] {
  return TANZANIAN_CITIES;
}