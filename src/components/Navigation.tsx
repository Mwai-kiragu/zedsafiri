import React, { useState } from 'react';
import { Home, Calendar, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navigationItems = [
    {
      id: 'home',
      name: 'Home',
      icon: Home
    },
    {
      id: 'bookings',
      name: 'Bookings',
      icon: Calendar
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings
    }
  ];

  return (
    <nav className="bg-card shadow-sm flex flex-col w-[202px] p-8 rounded-3xl border max-md:px-5">
      <div className="w-full max-w-[138px]">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className={`flex w-full items-center gap-2 p-4 cursor-pointer transition-colors rounded-2xl ${
                index > 0 ? 'mt-4' : ''
              } ${
                activeTab === item.id
                  ? 'text-primary font-semibold bg-brand-light'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <IconComponent className="w-5 h-5" />
              <div className="text-sm">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;