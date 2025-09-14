import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * BookingStats: Display upcoming bookings count with contextual actions
 * - Shows number of upcoming bookings
 * - Provides helpful message when no bookings exist
 * - Includes call-to-action for new bookings
 */
const BookingStats = () => {
  const { t } = useLanguage();
  const upcomingCount = 0; // This would come from actual booking data

  return (
    <section 
      className="bg-card shadow-sm flex flex-col justify-between min-w-[280px] w-[320px] p-8 rounded-3xl border"
      role="region"
      aria-label={t('stats.upcomingBookings')}
    >
      {/* Stats Display */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            {t('stats.upcomingBookings')}
          </h2>
        </div>
        
        <div className="space-y-3">
          <div className="text-4xl lg:text-5xl font-bold text-primary">
            {upcomingCount}
          </div>
          
          {upcomingCount === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('stats.noUpcomingText')}
              </p>
              <p className="text-sm font-medium text-foreground">
                {t('stats.bookNowAction')}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You have {upcomingCount} upcoming {upcomingCount === 1 ? 'trip' : 'trips'}
            </p>
          )}
        </div>
      </div>
      
      {/* Action Button */}
      {upcomingCount === 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-6 gap-2 self-start"
          onClick={() => {
            document.querySelector('#booking-form')?.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="Navigate to booking form"
        >
          Book Now
          <ArrowRight className="w-3 h-3" />
        </Button>
      )}
    </section>
  );
};

export default BookingStats;