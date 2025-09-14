import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  currentLanguage: 'en' | 'sw';
  toggleLanguage: () => void;
  t: (key: string) => string;
  getCurrentLanguageDisplay: () => string;
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
    'header.profile': 'Profile Settings',
    'header.logout': 'Sign Out',
    'header.passenger': 'Passenger',
    'header.notifications': 'Notifications',
    
    // Welcome Section
    'welcome.greeting': 'Welcome back, Alex 👋',
    'welcome.subtitle': 'Here\'s your booking dashboard overview',
    'welcome.noBookings': 'You don\'t have any upcoming bookings.',
    'welcome.actionPrompt': 'Ready to book your next trip?',
    
    // Booking Stats
    'stats.upcomingBookings': 'Upcoming Bookings',
    'stats.noUpcomingText': 'No trips scheduled yet',
    'stats.bookNowAction': 'Start booking below',
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
    'bookings.managementTitle': 'Booking Management',
    'bookings.managementSubtitle': 'View and manage all your travel bookings',
    'bookings.search': 'Search by PNR, name, or phone...',
    'bookings.all': 'All Bookings',
    'bookings.ticketed': 'Confirmed',
    'bookings.paid': 'Paid',
    'bookings.awaiting': 'Pending Payment',
    'bookings.cancelled': 'Cancelled',
    'bookings.route': 'Route',
    'bookings.seats': 'Seats',
    'bookings.bus': 'Bus',
    'bookings.train': 'Train',
    'bookings.backToList': 'Back to Bookings',
    'bookings.passengerDetails': 'Passenger Information',
    'bookings.tripDetails': 'Trip Information',
    'bookings.fareBreakdown': 'Fare Breakdown',
    'bookings.bookingInfo': 'Booking Details',
    'bookings.name': 'Full Name',
    'bookings.phone': 'Phone',
    'bookings.email': 'Email',
    'bookings.from': 'From',
    'bookings.to': 'To',
    'bookings.date': 'Date',
    'bookings.time': 'Time',
    'bookings.operator': 'Operator',
    'bookings.baseFare': 'Base Fare',
    'bookings.taxes': 'Taxes & Fees',
    'bookings.totalFare': 'Total Amount',
    'bookings.bookingId': 'Booking ID',
    'bookings.pnr': 'PNR',
    'bookings.status': 'Status',
    'bookings.createdAt': 'Booked On',
    'bookings.updatedAt': 'Last Updated',
    
    // Settings
    'settings.title': 'Account Settings',
    'settings.subtitle': 'Manage your preferences, notifications, and account details',
    
    // Auth Forms
    'auth.signin': 'Sign in',
    'auth.signup': 'Sign up',
    'auth.welcome': 'Hi, Welcome',
    'auth.signupWelcome': 'Create Account',
    'auth.signinSubtitle': 'Sign in to book or view your tickets.',
    'auth.signupSubtitle': 'Create an account to book tickets and manage your trips.',
    'auth.mobileNumber': 'Mobile Number',
    'auth.email': 'Email',
    'auth.emailAddress': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.phoneNumber': 'Phone Number',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.createAccount': 'Create an account?',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.orContinueWith': 'or continue with',
    'auth.google': 'Google',
    'auth.apple': 'Apple'
  },
  sw: {
    // Navigation
    'nav.home': 'Nyumbani',
    'nav.bookings': 'Mahifadhi',
    'nav.settings': 'Mipangilio',
    
    // Dashboard Header
    'header.english': 'Kiingereza',
    'header.swahili': 'Kiswahili',
    'header.profile': 'Mipangilio ya Wasifu',
    'header.logout': 'Ondoka',
    'header.passenger': 'Msafiri',
    'header.notifications': 'Arifa',
    
    // Welcome Section
    'welcome.greeting': 'Karibu tena, Alex 👋',
    'welcome.subtitle': 'Hapa kuna muhtasari wa dashibodi yako',
    'welcome.noBookings': 'Huna mahifadhi yoyote ya baadaye.',
    'welcome.actionPrompt': 'Uko tayari kuhifadhi safari yako inayofuata?',
    
    // Booking Stats
    'stats.upcomingBookings': 'Mahifadhi ya Baadaye',
    'stats.noUpcomingText': 'Hakuna safari zilizopangwa bado',
    'stats.bookNowAction': 'Anza kuhifadhi hapa chini',
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
    'bookings.managementTitle': 'Usimamizi wa Mahifadhi',
    'bookings.managementSubtitle': 'Ona na simamia mahifadhi yako yote ya usafiri',
    'bookings.search': 'Tafuta kwa PNR, jina, au simu...',
    'bookings.all': 'Mahifadhi Yote',
    'bookings.ticketed': 'Yaliyothibitishwa',
    'bookings.paid': 'Yaliyelipwa',
    'bookings.awaiting': 'Yanasubiri Malipo',
    'bookings.cancelled': 'Yalifutwa',
    'bookings.route': 'Njia',
    'bookings.seats': 'Viti',
    'bookings.bus': 'Basi',
    'bookings.train': 'Gari la Moshi',
    'bookings.backToList': 'Rudi kwenye Mahifadhi',
    'bookings.passengerDetails': 'Taarifa za Msafiri',
    'bookings.tripDetails': 'Taarifa za Safari',
    'bookings.fareBreakdown': 'Mgawanyo wa Nauli',
    'bookings.bookingInfo': 'Maelezo ya Uhifadhi',
    'bookings.name': 'Jina Kamili',
    'bookings.phone': 'Simu',
    'bookings.email': 'Barua Pepe',
    'bookings.from': 'Kutoka',
    'bookings.to': 'Kwenda',
    'bookings.date': 'Tarehe',
    'bookings.time': 'Muda',
    'bookings.operator': 'Mkaguzi',
    'bookings.baseFare': 'Nauli ya Msingi',
    'bookings.taxes': 'Kodi na Ada',
    'bookings.totalFare': 'Jumla ya Kiasi',
    'bookings.bookingId': 'Kitambulisho cha Uhifadhi',
    'bookings.pnr': 'PNR',
    'bookings.status': 'Hali',
    'bookings.createdAt': 'Ilihifadhiwa',
    'bookings.updatedAt': 'Ilisasishwa Mwisho',
    
    // Settings
    'settings.title': 'Mipangilio ya Akaunti',
    'settings.subtitle': 'Dhibiti mapendeleo yako, arifa, na maelezo ya akaunti',
    
    // Auth Forms
    'auth.signin': 'Ingia',
    'auth.signup': 'Jiunge',
    'auth.welcome': 'Hujambo, Karibu',
    'auth.signupWelcome': 'Tengeneza Akaunti',
    'auth.signinSubtitle': 'Ingia ili kuhifadhi au kuona tiketi zako.',
    'auth.signupSubtitle': 'Tengeneza akaunti ili kuhifadhi tiketi na kusimamia safari zako.',
    'auth.mobileNumber': 'Namba ya Simu',
    'auth.email': 'Barua Pepe',
    'auth.emailAddress': 'Anwani ya Barua Pepe',
    'auth.password': 'Nenosiri',
    'auth.confirmPassword': 'Thibitisha Nenosiri',
    'auth.fullName': 'Jina Kamili',
    'auth.phoneNumber': 'Namba ya Simu',
    'auth.forgotPassword': 'Umesahau Nenosiri?',
    'auth.createAccount': 'Tengeneza akaunti?',
    'auth.alreadyHaveAccount': 'Tayari una akaunti?',
    'auth.orContinueWith': 'au endelea na',
    'auth.google': 'Google',
    'auth.apple': 'Apple'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sw'>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'sw' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const toggleLanguage = () => {
    console.log('Before toggle - Current language:', currentLanguage);
    setCurrentLanguage(prev => {
      const newLang = prev === 'en' ? 'sw' : 'en';
      console.log('After toggle - New language:', newLang);
      return newLang;
    });
  };

  const getCurrentLanguageDisplay = () => {
    return currentLanguage === 'en' ? 'English' : 'Kiswahili';
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage, t, getCurrentLanguageDisplay }}>
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