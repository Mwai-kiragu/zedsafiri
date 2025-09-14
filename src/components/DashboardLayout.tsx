import React from 'react';
import DashboardHeader from './DashboardHeader';
import Navigation from './Navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * DashboardLayout: Main layout component containing header, sidebar navigation, and content area
 * - Provides consistent spacing and responsive design
 * - Manages navigation state for the entire dashboard
 */
const DashboardLayout = ({ children, activeTab, onTabChange }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Container with consistent padding */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-32">
        {/* Dashboard Header */}
        <DashboardHeader />
        
        {/* Main Content Area */}
        <div className="flex gap-6 lg:gap-9 mt-4 flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <Navigation activeTab={activeTab} onTabChange={onTabChange} />
          </aside>
          
          {/* Main Content */}
          <main 
            className="flex-1 min-w-0" 
            role="main"
            aria-label="Dashboard main content"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;