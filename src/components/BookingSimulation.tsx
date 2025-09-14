import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingStateMachine } from '@/services/bookingStateMachine';
import { FareEngine } from '@/services/fareEngine';
import { SeatLockService } from '@/services/seatLockService';
import { PaymentService } from '@/services/paymentService';
import { Booking, BookingState, Trip, SeatStatus, PaymentMethod } from '@/types/booking';
import { POPULAR_ROUTES, generateTripsForRoute, getOperatorInfo, getAllCities, RouteInfo } from '@/data/tanzanianRoutes';

const BookingSimulation = () => {
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [seatMap, setSeatMap] = useState<Map<string, SeatStatus>>(new Map());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [lockCountdown, setLockCountdown] = useState<number>(0);
  const [transportType, setTransportType] = useState<'bus' | 'train'>('bus');
  const [filteredRoutes, setFilteredRoutes] = useState<RouteInfo[]>(POPULAR_ROUTES.filter(r => r.transportType === 'bus'));
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo>(POPULAR_ROUTES.filter(r => r.transportType === 'bus')[0]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);
  const [travelDate, setTravelDate] = useState('2025-03-15');
  const [passengerDetails, setPassengerDetails] = useState({
    name: 'John Doe',
    phone: '+255712345678',
    email: 'john@example.com'
  });

  const cities = getAllCities();

  useEffect(() => {
    // Filter routes by transport type
    const routes = POPULAR_ROUTES.filter(r => r.transportType === transportType);
    setFilteredRoutes(routes);
    if (routes.length > 0) {
      setSelectedRoute(routes[0]);
    }
  }, [transportType]);

  useEffect(() => {
    // Generate trips for selected route
    const trips = generateTripsForRoute(selectedRoute, travelDate);
    setAvailableTrips(trips);
    if (trips.length > 0) {
      setSelectedTrip(trips[0]);
    }
  }, [selectedRoute, travelDate]);

  useEffect(() => {
    // Initialize seats when trip changes
    if (selectedTrip) {
      SeatLockService.initializeSeats(selectedTrip.id, selectedTrip.totalSeats);
      updateSeatMap();
      setSelectedSeats([]);
    }
  }, [selectedTrip]);

  useEffect(() => {
    // Update countdown timer
    const interval = setInterval(() => {
      if (currentBooking) {
        const userLock = SeatLockService.getUserActiveLock('user_123');
        if (userLock) {
          const remaining = SeatLockService.getLockCountdown(userLock.id);
          setLockCountdown(remaining);
          
          if (remaining <= 0) {
            updateSeatMap();
            setSelectedSeats([]);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentBooking]);

  const updateSeatMap = () => {
    if (selectedTrip) {
      const seats = SeatLockService.getSeatStatus(selectedTrip.id);
      setSeatMap(seats);
    }
  };

  const handleSeatSelection = async (seatId: string) => {
    if (!selectedTrip || seatMap.get(seatId) !== 'FREE') return;

    const newSelection = selectedSeats.includes(seatId) 
      ? selectedSeats.filter(id => id !== seatId)
      : [...selectedSeats, seatId];

    if (newSelection.length > 0) {
      const result = await SeatLockService.holdSeats(
        selectedTrip.id, 
        newSelection, 
        'user_123', 
        'WEB'
      );

      if (result.success) {
        setSelectedSeats(newSelection);
        updateSeatMap();
      } else {
        alert(`Seat conflict: ${result.conflictSeats?.join(', ')}`);
      }
    } else {
      SeatLockService.releaseUserLocks('user_123');
      setSelectedSeats([]);
      updateSeatMap();
    }
  };

  const createBooking = () => {
    if (selectedSeats.length === 0 || !selectedTrip) {
      alert('Please select seats first');
      return;
    }

    const pnr = `PNR${Date.now()}`;
    const fareBreakdown = FareEngine.calculateFare(selectedTrip, selectedSeats.length, 'WEB');

    const booking: Booking = {
      id: `booking_${Date.now()}`,
      pnr,
      tripId: selectedTrip.id,
      passengerName: passengerDetails.name,
      passengerPhone: passengerDetails.phone,
      passengerEmail: passengerDetails.email,
      seatNumbers: selectedSeats,
      fareBreakdown,
      state: 'INITIATED',
      channel: 'WEB',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const created = BookingStateMachine.createBooking(booking);
    if (created) {
      setCurrentBooking(booking);
    }
  };

  const initiatePayment = async (method: PaymentMethod) => {
    if (!currentBooking) return;

    const result = await PaymentService.initiatePayment(
      currentBooking.pnr,
      currentBooking.fareBreakdown.grossFare,
      method,
      passengerDetails.phone
    );

    if (result.success) {
      // Update booking state in UI
      const updatedBooking = BookingStateMachine.getBooking(currentBooking.pnr);
      if (updatedBooking) {
        setCurrentBooking(updatedBooking);
      }
    } else {
      alert(result.error);
    }
  };

  const refreshBookingState = () => {
    if (currentBooking) {
      const updated = BookingStateMachine.getBooking(currentBooking.pnr);
      if (updated) {
        setCurrentBooking(updated);
      }
    }
  };

  const getStateColor = (state: BookingState): string => {
    switch (state) {
      case 'INITIATED': return 'bg-blue-100 text-blue-800';
      case 'AWAITING_PAYMENT': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'TICKETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeatColor = (status: SeatStatus): string => {
    switch (status) {
      case 'FREE': return 'bg-green-100 hover:bg-green-200 border-green-300';
      case 'HELD': return 'bg-yellow-100 border-yellow-300';
      case 'OCCUPIED': return 'bg-red-100 border-red-300';
      case 'BLOCKED': return 'bg-gray-100 border-gray-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const formatCountdown = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">LATRA E-Ticketing System Simulation</h1>
      
      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="booking">Booking Flow</TabsTrigger>
          <TabsTrigger value="seats">Seat Selection</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="state">State Machine</TabsTrigger>
        </TabsList>

        <TabsContent value="booking" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Transport & Route Selection</h2>
            
            <div className="flex items-center bg-muted rounded-xl p-1.5 w-fit mb-4">
              <button
                type="button"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  transportType === 'bus'
                    ? 'text-white bg-primary'
                    : 'text-foreground hover:bg-muted-foreground/10'
                }`}
                onClick={() => setTransportType('bus')}
              >
                <span className="text-lg">🚌</span>
                <span>Bus</span>
              </button>
              <button
                type="button"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  transportType === 'train'
                    ? 'text-white bg-primary'
                    : 'text-foreground hover:bg-muted-foreground/10'
                }`}
                onClick={() => setTransportType('train')}
              >
                <span className="text-lg">🚂</span>
                <span>Train</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Select value={selectedRoute.id} onValueChange={(value) => {
                const route = filteredRoutes.find(r => r.id === value);
                if (route) setSelectedRoute(route);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredRoutes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.transportType === 'train' ? '🚂' : '🚌'} {route.origin.name} → {route.destination.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              
              <div className="text-sm text-muted-foreground">
                <p>{selectedRoute.distanceKm}km • {selectedRoute.durationHours}h</p>
                <p>Base fare: TZS {selectedRoute.baseFare.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Available Trips ({availableTrips.length})</h3>
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {availableTrips.map((trip) => {
                  const operator = getOperatorInfo(trip.operatorId);
                  return (
                    <div
                      key={trip.id}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        selectedTrip?.id === trip.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{operator?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {trip.departureTime.split(' ')[1]} - {trip.arrivalTime.split(' ')[1]} • {trip.class}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">TZS {trip.baseFare.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{trip.seatsAvailable} seats</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Full Name"
                value={passengerDetails.name}
                onChange={(e) => setPassengerDetails({...passengerDetails, name: e.target.value})}
              />
              <Input
                placeholder="Phone Number"
                value={passengerDetails.phone}
                onChange={(e) => setPassengerDetails({...passengerDetails, phone: e.target.value})}
              />
              <Input
                placeholder="Email"
                value={passengerDetails.email}
                onChange={(e) => setPassengerDetails({...passengerDetails, email: e.target.value})}
              />
            </div>
          </Card>

          {selectedSeats.length > 0 && selectedTrip && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Fare Breakdown</h2>
              {(() => {
                const fareBreakdown = FareEngine.calculateFare(selectedTrip, selectedSeats.length, 'WEB');
                return (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Fare ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''})</span>
                      <span>TZS {fareBreakdown.baseFare.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LATRA Fee (5%)</span>
                      <span>TZS {fareBreakdown.latraFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction Fee (2%)</span>
                      <span>TZS {fareBreakdown.transactionFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>TZS {fareBreakdown.grossFare.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}
            </Card>
          )}

          {lockCountdown > 0 && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-yellow-800">
                ⏰ Seats held for: <strong>{formatCountdown(lockCountdown)}</strong>
              </p>
            </Card>
          )}

          <Button 
            onClick={createBooking} 
            disabled={selectedSeats.length === 0}
            className="w-full"
          >
            Create Booking
          </Button>
        </TabsContent>

        <TabsContent value="seats" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Seat Selection</h2>
            <div className="grid grid-cols-10 gap-2 mb-4">
              {Array.from(seatMap.entries()).map(([seatId, status]) => {
                const seatNumber = seatId.split('-')[1];
                const isSelected = selectedSeats.includes(seatId);
                
                return (
                  <Button
                    key={seatId}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`h-10 ${getSeatColor(status)} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handleSeatSelection(seatId)}
                    disabled={status !== 'FREE' && !isSelected}
                  >
                    {seatNumber}
                  </Button>
                );
              })}
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>Held</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span>Occupied</span>
              </div>
            </div>
            
            <p className="mt-4">Selected seats: {selectedSeats.join(', ') || 'None'}</p>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mobile Money & Payment Methods</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3 text-green-700">📱 Mobile Money</h3>
                <div className="grid grid-cols-2 gap-3">
                  {PaymentService.getPaymentMethods().filter(method => method.id === 'STK_PUSH').map((method, index) => (
                    <Button
                      key={`${method.id}-${index}`}
                      variant="outline"
                      className="h-16 justify-start border-green-200 hover:bg-green-50 hover:border-green-300"
                      onClick={() => currentBooking && currentBooking.state === 'AWAITING_PAYMENT' ? initiatePayment(method.id) : alert('Create a booking first')}
                    >
                      <span className="mr-3 text-2xl">{method.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">Instant payment</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-blue-700">💳 Other Payment Methods</h3>
                <div className="space-y-2">
                  {PaymentService.getPaymentMethods().filter(method => method.id !== 'STK_PUSH').map((method, index) => (
                    <Button
                      key={`${method.id}-${index}`}
                      variant="outline"
                      className="w-full justify-start h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => currentBooking && currentBooking.state === 'AWAITING_PAYMENT' ? initiatePayment(method.id) : alert('Create a booking first')}
                    >
                      <span className="mr-3 text-xl">{method.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.id === 'CARD' ? 'Visa, Mastercard accepted' : 'Bank to bank transfer'}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              {!currentBooking || currentBooking.state !== 'AWAITING_PAYMENT' ? (
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground mb-2">No active booking found</p>
                  <p className="text-sm text-muted-foreground">Go to "Booking Flow" tab to create a booking first</p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">✅</span>
                    <span className="font-medium text-green-800">Ready to pay</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Amount: <strong>TZS {currentBooking.fareBreakdown.grossFare.toLocaleString()}</strong>
                  </p>
                  <p className="text-sm text-green-700">
                    PNR: <strong>{currentBooking.pnr}</strong>
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="state" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Booking State</h2>
              <Button onClick={refreshBookingState} variant="outline" size="sm">
                Refresh
              </Button>
            </div>
            
            {currentBooking ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>PNR:</strong> {currentBooking.pnr}</p>
                    <p><strong>Passenger:</strong> {currentBooking.passengerName}</p>
                    <p><strong>Seats:</strong> {currentBooking.seatNumbers.join(', ')}</p>
                  </div>
                  <div>
                    <p><strong>Amount:</strong> TZS {currentBooking.fareBreakdown.grossFare.toLocaleString()}</p>
                    <p><strong>Channel:</strong> {currentBooking.channel}</p>
                    <p><strong>Created:</strong> {currentBooking.createdAt.toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div>
                  <Badge className={getStateColor(currentBooking.state)}>
                    {currentBooking.state}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Actions</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => BookingStateMachine.cancelBooking(currentBooking.pnr, 'User cancellation')}
                      variant="destructive"
                      size="sm"
                      disabled={!['INITIATED', 'AWAITING_PAYMENT', 'PAID'].includes(currentBooking.state)}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No active booking</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {BookingStateMachine.getAllBookings().map((booking) => (
                <div key={booking.pnr} className="flex justify-between items-center p-2 border rounded">
                  <span>{booking.pnr} - {booking.passengerName}</span>
                  <Badge className={getStateColor(booking.state)}>
                    {booking.state}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingSimulation;