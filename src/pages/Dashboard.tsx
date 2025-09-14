import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import WelcomeSection from '@/components/WelcomeSection';
import BookingStats from '@/components/BookingStats';
import BookingForm from '@/components/BookingForm';
import RecentBookings from '@/components/RecentBookings';
import BookingSimulation from '@/components/BookingSimulation';
import BookingsView from '@/components/BookingsView';
import MyTickets from '@/components/MyTickets';
import RouteConfigTable from '@/components/RouteConfigTable';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Dashboard: Main dashboard page with tabbed navigation
 * - Home: Overview with welcome, stats, booking form, and recent bookings
 * - Bookings: Full booking management interface
 * - Settings: Account settings and preferences
 */
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { t } = useLanguage();

  const renderMainContent = () => {
    switch (activeTab) {
      case 'bookings':
        return (
          <div className="space-y-8">
            <MyTickets />
            <BookingsView />
          </div>
        );
      
      case 'routes':
        return <RouteConfigTable />;
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
              <p className="text-muted-foreground mt-2">{t('settings.subtitle')}</p>
            </div>
            
            {/* Settings content would go here */}
            <div className="bg-card p-6 rounded-lg border">
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </div>
          </div>
        );
      
      default: // Home tab
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr,auto] gap-6 items-stretch">
              <WelcomeSection />
              <BookingStats />
            </div>
            
            {/* Booking Form */}
            <div id="booking-form">
              <BookingForm />
            </div>
            
            {/* Recent Activity */}
            <RecentBookings />
            
            {/* LATRA System Simulation */}
            <BookingSimulation />
          </div>
        );
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderMainContent()}
    </DashboardLayout>
  );
};

export default Dashboard;