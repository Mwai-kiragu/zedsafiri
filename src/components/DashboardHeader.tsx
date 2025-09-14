import React from 'react';
import { Globe, Bell, ChevronDown, User, LogOut, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', displayName: t('header.english') },
    { code: 'sw', name: 'Kiswahili', displayName: t('header.swahili') }
  ];

  const getCurrentLanguageDisplay = () => {
    return languages.find(lang => lang.code === currentLanguage)?.displayName || 'English';
  };

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
  };

  const handleProfileClick = () => {
    // Navigate to settings tab or profile page
    window.location.href = '/dashboard?tab=settings';
  };

  const handleLogoutClick = () => {
    // Handle logout - clear session and redirect to login
    navigate('/');
  };

  return (
    <header 
      className="flex items-center justify-between py-4 border-b border-border/40"
      role="banner"
    >
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src="https://api.builder.io/api/v1/image/assets/c88c6030e63c40c6b5ec787e5d7f1a8c/8b38132fcf06c4e7e02e8e1f628ee71f332c7504?placeholderIfAbsent=true"
          alt="LATRA Bus Booking System Logo"
          className="h-12 w-auto object-contain"
        />
        <div className="hidden md:block ml-4 border-l border-border pl-4">
          <h1 className="text-lg font-semibold text-foreground">Passenger Dashboard</h1>
        </div>
      </div>
      
      {/* Actions Section */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              aria-label="Select language"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{getCurrentLanguageDisplay()}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 bg-background border shadow-lg">
            {languages.map((language) => (
              <DropdownMenuItem 
                key={language.code}
                className="cursor-pointer flex items-center justify-between"
                onClick={() => handleLanguageChange(language.name)}
              >
                <span>{language.displayName}</span>
                {currentLanguage === language.code && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notifications */}
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          aria-label={t('header.notifications')}
        >
          <Bell className="w-5 h-5" />
          {/* Notification badge - hidden when no notifications */}
          <span className="sr-only">No new notifications</span>
        </Button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="flex items-center gap-3 bg-muted/50 hover:bg-muted px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="User account menu"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/c88c6030e63c40c6b5ec787e5d7f1a8c/122002ef1a95914ed358cfb0d7b3d4139966712b?placeholderIfAbsent=true"
                alt="Alex Kamau profile picture"
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium text-foreground">
                  Alex Kamau
                </span>
                <span className="text-xs text-muted-foreground">
                  {t('header.passenger')}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg">
            <DropdownMenuItem 
              className="cursor-pointer focus:bg-muted" 
              onClick={handleProfileClick}
            >
              <User className="mr-3 h-4 w-4" />
              <span>{t('header.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" 
              onClick={handleLogoutClick}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>{t('header.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;