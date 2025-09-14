import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Navigation from '@/components/Navigation';
import WelcomeSection from '@/components/WelcomeSection';
import BookingStats from '@/components/BookingStats';
import BookingForm from '@/components/BookingForm';
import RecentBookings from '@/components/RecentBookings';
import BookingSimulation from '@/components/BookingSimulation';
import BookingsView from '@/components/BookingsView';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderMainContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingsView />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            <p className="text-muted-foreground">Settings functionality coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="flex w-full items-stretch gap-[37px] flex-wrap max-md:max-w-full">
              <WelcomeSection />
              <BookingStats />
            </div>
            <BookingForm />
            <RecentBookings />
            <BookingSimulation />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background px-8 lg:px-32 max-md:px-5">
      <DashboardHeader />
      <div className="flex w-full gap-[37px] flex-wrap mt-4 max-md:max-w-full">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 shrink basis-16 max-md:max-w-full">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;