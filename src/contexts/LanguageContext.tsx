import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const translations: Record<string, Translations> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.bookings': 'Bookings',
    'nav.settings': 'Settings',
    
    // Dashboard Header
    'header.english': 'English',
    'header.swahili': 'Kiswahili',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    'header.passenger': 'Passenger',
    
    // Welcome Section
    'welcome.title': 'Welcome Back!',
    'welcome.subtitle': 'Ready to book your next journey?',
    
    // Booking Stats
    'stats.totalBookings': 'Total Bookings',
    'stats.activeTrips': 'Active Trips',
    'stats.completedJourneys': 'Completed Journeys',
    
    // Booking Form
    'form.transportation': 'Transportation',
    'form.bus': 'Bus',
    'form.train': 'Train',
    'form.from': 'From',
    'form.to': 'To',
    'form.departure': 'Departure',
    'form.passengers': 'Passengers',
    'form.adult': 'Adult',
    'form.child': 'Child',
    'form.searchTickets': 'Search Tickets',
    
    // Bookings View
    'bookings.title': 'My Bookings',
    'bookings.search': 'Search by PNR, name, or phone...',
    'bookings.all': 'All',
    'bookings.ticketed': 'Ticketed',
    'bookings.paid': 'Paid',
    'bookings.awaiting': 'Awaiting',
    'bookings.cancelled': 'Cancelled',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Settings functionality coming soon...'
  },
  sw: {
    // Navigation
    'nav.home': 'Nyumbani',
    'nav.bookings': 'Mahifadhi',
    'nav.settings': 'Mipangilio',
    
    // Dashboard Header
    'header.english': 'Kiingereza',
    'header.swahili': 'Kiswahili',
    'header.profile': 'Wasifu',
    'header.logout': 'Toka',
    'header.passenger': 'Abiria',
    
    // Welcome Section
    'welcome.title': 'Karibu Tena!',
    'welcome.subtitle': 'Uko tayari kuhifadhi safari yako ijayo?',
    
    // Booking Stats
    'stats.totalBookings': 'Mahifadhi Yote',
    'stats.activeTrips': 'Safari za Sasa',
    'stats.completedJourneys': 'Safari Zilizokamilika',
    
    // Booking Form
    'form.transportation': 'Usafiri',
    'form.bus': 'Basi',
    'form.train': 'Gari la Moshi',
    'form.from': 'Kutoka',
    'form.to': 'Kwenda',
    'form.departure': 'Kuondoka',
    'form.passengers': 'Abiria',
    'form.adult': 'Mtu Mzima',
    'form.child': 'Mtoto',
    'form.searchTickets': 'Tafuta Tiketi',
    
    // Bookings View
    'bookings.title': 'Mahifadhi Yangu',
    'bookings.search': 'Tafuta kwa PNR, jina, au simu...',
    'bookings.all': 'Yote',
    'bookings.ticketed': 'Yenye Tiketi',
    'bookings.paid': 'Yalipolipwa',
    'bookings.awaiting': 'Yasubiri',
    'bookings.cancelled': 'Yaliyofutwa',
    
    // Settings
    'settings.title': 'Mipangilio',
    'settings.subtitle': 'Utendaji wa mipangilio unakuja hivi karibuni...'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (language: string) => {
    const langCode = language === 'Kiswahili' ? 'sw' : 'en';
    setCurrentLanguage(langCode);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};