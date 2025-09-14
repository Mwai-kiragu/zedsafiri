import React from 'react';
import { Home, Calendar, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NavItem from '@/components/ui/NavItem';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Navigation: Sidebar navigation component
 * - Clean, accessible navigation with icons and labels
 * - Active state management
 * - Responsive design with proper spacing
 */
const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { t } = useLanguage();
  
  const navigationItems = [
    {
      id: 'home',
      name: t('nav.home'),
      icon: Home,
      description: 'Dashboard overview with welcome, stats, and quick actions'
    },
    {
      id: 'bookings',
      name: t('nav.bookings'),
      icon: Calendar,
      description: 'View and manage all your travel bookings'
    },
    {
      id: 'settings',
      name: t('nav.settings'),
      icon: Settings,
      description: 'Account settings and preferences'
    }
  ];

  return (
    <nav 
      className="bg-card shadow-sm w-full lg:w-[240px] p-6 rounded-2xl border"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Navigation Header */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Main Menu
        </h2>
        
        {/* Navigation Items */}
        <div className="space-y-2" role="menu">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.name}
              isActive={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;