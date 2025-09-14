import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * NavItem: Reusable navigation item component
 * - Consistent styling for navigation elements
 * - Active state highlighting
 * - Keyboard navigation support
 */
const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick, 
  className 
}: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-200",
        "hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isActive 
          ? "bg-primary/10 text-primary border-l-2 border-primary" 
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      type="button"
      role="menuitem"
      aria-current={isActive ? "page" : undefined}
    >
      <Icon 
        className={cn(
          "w-5 h-5 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )} 
      />
      <span className="truncate">{label}</span>
    </button>
  );
};

export default NavItem;