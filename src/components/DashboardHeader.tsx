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
    <header className="flex w-full items-center justify-between flex-wrap py-4 max-md:max-w-full">
      <img
        src="https://api.builder.io/api/v1/image/assets/c88c6030e63c40c6b5ec787e5d7f1a8c/8b38132fcf06c4e7e02e8e1f628ee71f332c7504?placeholderIfAbsent=true"
        alt="Company Logo"
        className="w-[113px] h-20 object-contain"
      />
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="w-3 h-3" />
              {getCurrentLanguageDisplay()}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {languages.map((language) => (
              <DropdownMenuItem 
                key={language.code}
                className="cursor-pointer"
                onClick={() => handleLanguageChange(language.name)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{language.displayName}</span>
                  {currentLanguage === language.code && (
                    <Check className="w-4 h-4" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" size="icon" className="w-12 h-12">
          <Bell className="w-6 h-6" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 bg-brand-light px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-light/80 transition-colors">
              <img
                src="https://api.builder.io/api/v1/image/assets/c88c6030e63c40c6b5ec787e5d7f1a8c/122002ef1a95914ed358cfb0d7b3d4139966712b?placeholderIfAbsent=true"
                alt="User Avatar"
                className="w-6 h-6 rounded-full object-contain"
              />
              <div className="flex flex-col">
                <div className="text-sm font-semibold text-foreground">
                  Alex Kamau
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('header.passenger')}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>{t('header.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('header.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;