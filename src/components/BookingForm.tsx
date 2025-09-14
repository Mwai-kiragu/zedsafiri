import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Bus, Train } from 'lucide-react';
import { getAllCities } from '@/data/tanzanianRoutes';
import { toast } from 'sonner';

// BookingForm component with mock data and city dropdowns
const BookingForm = () => {
  const [transportType, setTransportType] = useState('bus');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [today, setToday] = useState('');
  
  const navigate = useNavigate();
  const cities = getAllCities();

  useEffect(() => {
    // Format today's date as YYYY-MM-DD for input[type=date]
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayFormatted = `${yyyy}-${mm}-${dd}`;
    setToday(todayFormatted);
    setTravelDate(todayFormatted); // Pre-fill with today's date
  }, []);

  const handleSearch = () => {
    // Validate form inputs
    if (!fromLocation || !toLocation) {
      toast.error('Please select both origin and destination cities');
      return;
    }
    
    if (!travelDate) {
      toast.error('Please select a travel date');
      return;
    }
    
    if (fromLocation === toLocation) {
      toast.error('Origin and destination cannot be the same');
      return;
    }

    // Navigate to search results with query parameters
    const searchParams = new URLSearchParams({
      from: fromLocation,
      to: toLocation,
      date: travelDate,
      type: transportType,
      passengers: '1'
    });
    
    if (returnDate) {
      searchParams.append('returnDate', returnDate);
    }
    
    navigate(`/search-results?${searchParams.toString()}`);
    toast.success(`Searching for ${transportType} trips from ${fromLocation} to ${toLocation}`);
  };

  return (
    <section className="w-full bg-brand-dark mt-10 pt-10 pb-14 px-8 rounded-3xl shadow-sm max-md:max-w-full max-md:px-5">
      <div className="w-full max-md:max-w-full">
        <h2 className="text-brand-light text-3xl font-semibold">
          Book Your Next Trip
        </h2>
          <form 
            className="w-full text-sm font-normal mt-8 max-md:max-w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
          <div className="flex w-full gap-6 flex-wrap max-md:max-w-full">
            <div className="flex items-center bg-brand-light rounded-xl p-1.5 w-fit">
              <button
                type="button"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  transportType === 'bus'
                    ? 'text-white bg-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setTransportType('bus')}
              >
                <Bus className="w-5 h-5" />
                <span>Bus</span>
              </button>
              <button
                type="button"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  transportType === 'train'
                    ? 'text-white bg-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setTransportType('train')}
              >
                <Train className="w-5 h-5" />
                <span>Train</span>
              </button>
            </div>
            
            <div className="flex-1 min-w-60">
              <Select value={fromLocation} onValueChange={setFromLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="From - Select origin city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}, {city.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-60">
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="To - Select destination city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}, {city.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex w-full gap-6 flex-wrap mt-6 max-md:max-w-full">
            <div className="flex-1 min-w-60">
              <div className="relative">
                <Input
                  type="date"
                  placeholder="Travel Date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="pr-10"
                  min={today}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex-1 min-w-60">
              <div className="relative">
                <Input
                  type="date"
                  placeholder="Return Date (Optional)"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="pr-10"
                  min={travelDate || today}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <Button
              type="submit"
              className="flex-1 min-w-60 bg-brand-light text-primary hover:bg-brand-light/90 font-semibold"
            >
              Search
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;