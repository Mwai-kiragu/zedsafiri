import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * WelcomeSection: Personalized greeting with contextual actions
 * - Displays personalized welcome message
 * - Provides quick access to main actions
 * - Responsive design with decorative background
 */
const WelcomeSection = () => {
  const { t } = useLanguage();

  return (
    <section 
      className="bg-card shadow-sm relative flex-1 min-w-[320px] pt-8 pb-10 px-8 lg:px-12 rounded-3xl border overflow-hidden"
      role="banner"
    >
      {/* Decorative Background Image */}
      <img
        src="https://api.builder.io/api/v1/image/assets/c88c6030e63c40c6b5ec787e5d7f1a8c/fba9e6156eba30459cc63f2685d338063a4d9ed5?placeholderIfAbsent=true"
        alt=""
        className="absolute bottom-0 left-[-39px] w-[673px] h-[213px] object-contain z-0 opacity-30 pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        <div>
          <h1 className="text-brand-dark text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight">
            {t('welcome.greeting')}
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg mt-3 max-w-md">
            {t('welcome.subtitle')}
          </p>
        </div>
        
        {/* Quick Action */}
        <div className="pt-4">
          <Button 
            className="gap-2"
            onClick={() => {
              // Scroll to booking form or navigate to booking
              document.querySelector('#booking-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Start booking a new trip"
          >
            <PlusCircle className="w-4 h-4" />
            Book New Trip
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;