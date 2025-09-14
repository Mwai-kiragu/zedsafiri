import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon, ChevronDown, Bus, Train } from 'lucide-react';

const BookingForm = () => {
  const [transportType, setTransportType] = useState('bus');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleSearch = () => {
    console.log('Searching for trips...', {
      transportType,
      fromLocation,
      toLocation,
      travelDate,
      returnDate
    });
  };

  return (
    <section className="w-full bg-brand-dark mt-10 pt-10 pb-14 px-8 rounded-3xl shadow-sm max-md:max-w-full max-md:px-5">
      <div className="w-full max-md:max-w-full">
        <h2 className="text-brand-light text-3xl font-semibold">
          Book Your Next Trip
        </h2>
        <form className="w-full text-sm font-normal mt-8 max-md:max-w-full">
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
              <div className="relative">
                <Input
                  type="text"
                  placeholder="From"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="pr-10"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex-1 min-w-60">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="To"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="pr-10"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
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
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleSearch}
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