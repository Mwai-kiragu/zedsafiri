import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Calendar, MapPin, User, Phone, Mail, CreditCard } from 'lucide-react';
import { SIMULATED_BOOKINGS, getBookingsByState, getRecentBookings } from '@/data/simulatedBookings';
import { Booking, BookingState } from '@/types/booking';
import { useLanguage } from '@/contexts/LanguageContext';

const BookingsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { t } = useLanguage();

  const getStateColor = (state: BookingState): string => {
    switch (state) {
      case 'INITIATED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AWAITING_PAYMENT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
      case 'TICKETED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStateIcon = (state: BookingState): string => {
    switch (state) {
      case 'INITIATED': return '⏳';
      case 'AWAITING_PAYMENT': return '💳';
      case 'PAID': return '✅';
      case 'TICKETED': return '🎫';
      case 'CANCELLED': return '❌';
      case 'EXPIRED': return '⏰';
      default: return '❓';
    }
  };

  const filteredBookings = SIMULATED_BOOKINGS.filter(booking => 
    booking.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.passengerPhone.includes(searchQuery)
  );

  const bookingCounts = {
    all: SIMULATED_BOOKINGS.length,
    ticketed: getBookingsByState('TICKETED').length,
    paid: getBookingsByState('PAID').length,
    awaiting: getBookingsByState('AWAITING_PAYMENT').length,
    cancelled: getBookingsByState('CANCELLED').length
  };

  const BookingCard = ({ booking, onClick }: { booking: Booking; onClick: () => void }) => (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{booking.pnr}</h3>
          <p className="text-muted-foreground text-sm">{booking.passengerName}</p>
        </div>
        <Badge className={getStateColor(booking.state)}>
          {getStateIcon(booking.state)} {booking.state}
        </Badge>
      </div>
      
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{t('bookings.route')}: {booking.tripId.includes('dar_dodoma') ? 'Dar es Salaam → Dodoma' : 
                         booking.tripId.includes('dar_arusha') ? 'Dar es Salaam → Arusha' :
                         booking.tripId.includes('dar_mwanza') ? 'Dar es Salaam → Mwanza' :
                         booking.tripId.includes('dar_mbeya') ? 'Dar es Salaam → Mbeya' :
                         booking.tripId.includes('dar_tanga') ? 'Dar es Salaam → Tanga' :
                         booking.tripId.includes('dar_morogoro') ? 'Dar es Salaam → Morogoro' :
                         booking.tripId.includes('arusha_mwanza') ? 'Arusha → Mwanza' :
                         booking.tripId.includes('dar_kigoma') ? 'Dar es Salaam → Kigoma' : 'Unknown Route'}</span>
          </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{booking.createdAt.toLocaleDateString('en-GB')}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">TZS {booking.fareBreakdown.grossFare.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <span className="text-xs text-muted-foreground">
          {t('bookings.seats')}: {booking.seatNumbers.join(', ')}
        </span>
        <span className="text-xs text-muted-foreground">
          {booking.tripId.includes('train') ? `🚂 ${t('bookings.train')}` : `🚌 ${t('bookings.bus')}`}
        </span>
      </div>
    </Card>
  );

  const BookingDetails = ({ booking }: { booking: Booking }) => (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{booking.pnr}</h2>
          <p className="text-muted-foreground">{t('bookings.bookingInfo')}</p>
        </div>
        <Badge className={`${getStateColor(booking.state)} text-lg px-3 py-1`}>
          {getStateIcon(booking.state)} {booking.state}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> {t('bookings.passengerDetails')}
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>{t('bookings.name')}:</strong> {booking.passengerName}</p>
              <p className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                {booking.passengerPhone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                {booking.passengerEmail}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {t('bookings.tripDetails')}
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Trip ID:</strong> {booking.tripId}</p>
              <p><strong>{t('bookings.seats')}:</strong> {booking.seatNumbers.join(', ')}</p>
              <p><strong>Channel:</strong> {booking.channel}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> {t('bookings.fareBreakdown')}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('bookings.baseFare')}:</span>
                <span>TZS {booking.fareBreakdown.baseFare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>LATRA Fee:</span>
                <span>TZS {booking.fareBreakdown.latraFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Fee:</span>
                <span>TZS {booking.fareBreakdown.transactionFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>{t('bookings.totalFare')}:</span>
                <span>TZS {booking.fareBreakdown.grossFare.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Timestamps
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>{t('bookings.createdAt')}:</strong> {booking.createdAt.toLocaleString()}</p>
              <p><strong>{t('bookings.updatedAt')}:</strong> {booking.updatedAt.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <Button onClick={() => setSelectedBooking(null)} variant="outline">
          {t('bookings.backToList')}
        </Button>
      </div>
    </Card>
  );

  if (selectedBooking) {
    return <BookingDetails booking={selectedBooking} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('bookings.managementTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('bookings.managementSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('bookings.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">{t('bookings.all')} ({bookingCounts.all})</TabsTrigger>
          <TabsTrigger value="ticketed">{t('bookings.ticketed')} ({bookingCounts.ticketed})</TabsTrigger>
          <TabsTrigger value="paid">{t('bookings.paid')} ({bookingCounts.paid})</TabsTrigger>
          <TabsTrigger value="awaiting">{t('bookings.awaiting')} ({bookingCounts.awaiting})</TabsTrigger>
          <TabsTrigger value="cancelled">{t('bookings.cancelled')} ({bookingCounts.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ticketed" className="space-y-4">
          <div className="grid gap-4">
            {getBookingsByState('TICKETED').filter(booking => 
              booking.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.passengerPhone.includes(searchQuery)
            ).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <div className="grid gap-4">
            {getBookingsByState('PAID').filter(booking => 
              booking.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.passengerPhone.includes(searchQuery)
            ).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="awaiting" className="space-y-4">
          <div className="grid gap-4">
            {getBookingsByState('AWAITING_PAYMENT').filter(booking => 
              booking.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.passengerPhone.includes(searchQuery)
            ).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <div className="grid gap-4">
            {getBookingsByState('CANCELLED').filter(booking => 
              booking.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.passengerPhone.includes(searchQuery)
            ).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingsView;