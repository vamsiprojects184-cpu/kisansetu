'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useAppStore } from '@/store/use-app-store';
import { useCartStore } from '@/store/use-cart-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard, Sprout, Leaf, TestTube, Search, Bug, Droplets, CloudSun, TrendingUp,
  ShoppingCart, MapPin, Package, CreditCard, User, Menu, Mic, X, ChevronRight, LogOut,
  Sun, Moon, Settings,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import NotificationDropdown from '@/components/shared/NotificationDropdown';
import CommandPalette from '@/components/shared/CommandPalette';
import { useCommandPaletteOpen } from '@/components/shared/CommandPalette';
import type { RoutePath } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  route: RoutePath;
  badge?: number;
}

const farmerNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, route: 'farmer/dashboard' },
  { label: 'My Farm', icon: <Sprout size={20} />, route: 'farmer/my-farm' },
  { label: 'Soil Health', icon: <Leaf size={20} />, route: 'farmer/soil-health' },
  { label: 'Crop Plans', icon: <Search size={20} />, route: 'farmer/crop-recommendations' },
  { label: 'Disease Scan', icon: <Bug size={20} />, route: 'farmer/disease-detection' },
  { label: 'Fertilizer', icon: <TestTube size={20} />, route: 'farmer/fertilizer' },
  { label: 'Irrigation', icon: <Droplets size={20} />, route: 'farmer/irrigation' },
  { label: 'Weather', icon: <CloudSun size={20} />, route: 'farmer/weather' },
  { label: 'Market Prices', icon: <TrendingUp size={20} />, route: 'farmer/market-prices' },
  { label: 'Sell Products', icon: <ShoppingCart size={20} />, route: 'farmer/sell' },
  { label: 'Collection Centers', icon: <MapPin size={20} />, route: 'farmer/collection-centers' },
  { label: 'Marketplace', icon: <Package size={20} />, route: 'marketplace/home', badge: 0 },
  { label: 'Orders', icon: <Package size={20} />, route: 'farmer/orders' },
  { label: 'Payments', icon: <CreditCard size={20} />, route: 'farmer/payments' },
  { label: 'Settings', icon: <Settings size={20} />, route: 'settings' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Home', icon: <LayoutDashboard size={20} />, route: 'farmer/dashboard' },
  { label: 'My Farm', icon: <Sprout size={20} />, route: 'farmer/my-farm' },
  { label: 'AI', icon: <Mic size={20} />, route: 'farmer/dashboard' }, // Special: opens AI
  { label: 'Market', icon: <ShoppingCart size={20} />, route: 'marketplace/home' },
  { label: 'Profile', icon: <User size={20} />, route: 'farmer/profile' },
];

interface FarmerLayoutProps {
  children: React.ReactNode;
}

function SearchButton() {
  const { openPalette } = useCommandPaletteOpen();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={openPalette}
          className='p-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-1.5'
        >
          <Search size={20} className='text-muted-foreground' />
          <kbd className='hidden md:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
            ⌘K
          </kbd>
        </button>
      </TooltipTrigger>
      <TooltipContent>Search pages</TooltipContent>
    </Tooltip>
  );
}

export default function FarmerLayout({ children }: FarmerLayoutProps) {
  const { user, logout } = useAuthStore();
  const { currentRoute, navigate, sidebarOpen, setSidebarOpen, toggleChat } = useAppStore();
  const { setTheme, resolvedTheme } = useTheme();
  const itemCount = useCartStore(s => s.getItemCount());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (route: RoutePath) => {
 navigate(route);
    setMobileMenuOpen(false);
    // Special case: AI button in bottom nav
    if (route === 'farmer/dashboard') {
      // The bottom nav AI button will be handled separately
    }
  };

  const handleBottomNavClick = (item: NavItem, idx: number) => {
    if (idx === 2) {
      toggleChat();
    } else {
      navigate(item.route);
    }
  };

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col border-r bg-card transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}>
        <div className='flex items-center gap-2 p-4 border-b'>
          <div className='w-8 h-8 rounded-lg gradient-green flex items-center justify-center text-white font-bold text-sm shrink-0'>
            K
          </div>
          {sidebarOpen && <span className='font-bold text-lg'>KrishiAI</span>}
        </div>
        <nav className='flex-1 overflow-y-auto scrollbar-thin py-2 px-2'>
          {farmerNavItems.map(item => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  !sidebarOpen && 'justify-center px-0'
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                {item.icon}
                {sidebarOpen && <span className='truncate'>{item.label}</span>}
                {sidebarOpen && item.badge !== undefined && item.badge > 0 && (
                  <Badge className='ml-auto bg-primary-foreground/20 text-primary-foreground text-xs px-1.5'>{item.badge}</Badge>
                )}
              </button>
            );
          })}
        </nav>
        <div className='p-3 border-t'>
          <button
            onClick={logout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors',
              !sidebarOpen && 'justify-center px-0'
            )}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Top Bar */}
        <header className='h-14 border-b flex items-center justify-between px-4 lg:px-6 bg-card shrink-0'>
          <div className='flex items-center gap-3'>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className='lg:hidden'>
                <Button variant='ghost' size='icon'><Menu size={20} /></Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-72 p-0'>
                <div className='flex items-center gap-2 p-4 border-b'>
                  <div className='w-8 h-8 rounded-lg gradient-green flex items-center justify-center text-white font-bold text-sm'>K</div>
                  <span className='font-bold text-lg'>KrishiAI</span>
                </div>
                <nav className='overflow-y-auto py-2 px-2'>
                  {farmerNavItems.map(item => {
                    const isActive = currentRoute === item.route;
                    return (
                      <button
                        key={item.route}
                        onClick={() => handleNavClick(item.route)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5',
                          isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )}
                      >
                        {item.icon}
                        <span className='truncate'>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className='hidden lg:block text-muted-foreground hover:text-foreground'>
              <Menu size={20} />
            </button>
          </div>
          <div className='flex items-center gap-2'>
            <NotificationDropdown onViewAll={() => navigate('farmer/notifications')} />
            <SearchButton />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className='p-2 rounded-lg hover:bg-accent transition-colors'
                >
                  {resolvedTheme === 'dark' ? <Sun size={20} className='text-muted-foreground' /> : <Moon size={20} className='text-muted-foreground' />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}</TooltipContent>
            </Tooltip>
            {itemCount > 0 && (
              <button onClick={() => navigate('marketplace/cart')} className='relative p-2 rounded-lg hover:bg-accent transition-colors'>
                <ShoppingCart size={20} className='text-muted-foreground' />
                <span className='absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium'>
                  {itemCount}
                </span>
              </button>
            )}
            <button onClick={() => navigate('farmer/profile')} className='flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors'>
              <Avatar className='h-8 w-8'>
                <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className='hidden sm:block text-sm font-medium'>{user?.name?.split(' ')[0]}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto scrollbar-thin pb-20 lg:pb-0'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className='p-4 lg:p-6'
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className='lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 safe-area-bottom'>
        <div className='flex items-center justify-around h-16 px-2'>
          {bottomNavItems.map((item, idx) => {
            const isActive = idx !== 2 && currentRoute === item.route;
            const isAI = idx === 2;
            return (
              <button
                key={item.label}
                onClick={() => handleBottomNavClick(item, idx)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 rounded-lg transition-colors',
                  isAI ? 'text-primary' : isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center rounded-full',
                  isAI && 'w-12 h-12 gradient-green text-white animate-pulse-green'
                )}>
                  {item.icon}
                </div>
                <span className='text-[10px] font-medium'>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <CommandPalette />
    </div>
  );
}
