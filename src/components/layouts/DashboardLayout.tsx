'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useAppStore } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import NotificationDropdown from '@/components/shared/NotificationDropdown';
import CommandPalette from '@/components/shared/CommandPalette';
import { useCommandPaletteOpen } from '@/components/shared/CommandPalette';
import type { RoutePath, UserRole } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  route: RoutePath;
}

const navConfig: Record<string, NavItem[]> = {
  consumer: [
    { label: 'Dashboard', icon: <span className='text-lg'>🏠</span>, route: 'consumer/dashboard' },
    { label: 'Marketplace', icon: <span className='text-lg'>🛒</span>, route: 'marketplace/home' },
    { label: 'My Orders', icon: <span className='text-lg'>📦</span>, route: 'consumer/orders' },
    { label: 'Profile', icon: <span className='text-lg'>👤</span>, route: 'consumer/profile' },
  ],
  collection_center: [
    { label: 'Dashboard', icon: <span className='text-lg'>📊</span>, route: 'collection-center/dashboard' },
    { label: 'Inventory', icon: <span className='text-lg'>📦</span>, route: 'collection-center/inventory' },
    { label: 'Incoming', icon: <span className='text-lg'>🚚</span>, route: 'collection-center/incoming' },
    { label: 'Quality Check', icon: <span className='text-lg'>✅</span>, route: 'collection-center/quality-check' },
    { label: 'Payouts', icon: <span className='text-lg'>💰</span>, route: 'collection-center/payouts' },
  ],
  expert: [
    { label: 'Dashboard', icon: <span className='text-lg'>🔬</span>, route: 'expert/dashboard' },
    { label: 'Disease Cases', icon: <span className='text-lg'>🐛</span>, route: 'expert/disease-cases' },
    { label: 'Advisories', icon: <span className='text-lg'>📋</span>, route: 'expert/advisories' },
  ],
  admin: [
    { label: 'Dashboard', icon: <span className='text-lg'>📊</span>, route: 'admin/dashboard' },
    { label: 'Users', icon: <span className='text-lg'>👥</span>, route: 'admin/users' },
    { label: 'Farmers', icon: <span className='text-lg'>🌾</span>, route: 'admin/farmers' },
    { label: 'Products', icon: <span className='text-lg'>📦</span>, route: 'admin/products' },
    { label: 'Orders', icon: <span className='text-lg'>🛒</span>, route: 'admin/orders' },
    { label: 'Collection Centers', icon: <span className='text-lg'>🏢</span>, route: 'admin/collection-centers' },
    { label: 'Analytics', icon: <span className='text-lg'>📈</span>, route: 'admin/analytics' },
  ],
};

interface DashboardLayoutProps {
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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const { currentRoute, navigate, sidebarOpen, setSidebarOpen } = useAppStore();
  const { setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = user?.role || 'farmer';
  const items = navConfig[role] || navConfig.consumer;

  const roleColors: Record<string, string> = {
    consumer: 'from-orange-500 to-amber-500',
    collection_center: 'from-sky-500 to-cyan-500',
    expert: 'from-violet-500 to-purple-500',
    admin: 'from-slate-700 to-slate-900',
  };

  const roleLabels: Record<string, string> = {
    consumer: 'Consumer',
    collection_center: 'Collection Center',
    expert: 'Agricultural Expert',
    admin: 'Admin Panel',
  };

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col border-r bg-card transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-16'
      )}>
        <div className='flex items-center gap-2 p-4 border-b'>
          <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shrink-0', roleColors[role])}>
            K
          </div>
          {sidebarOpen && <span className='font-bold text-lg'>KrishiAI</span>}
        </div>
        <nav className='flex-1 overflow-y-auto scrollbar-thin py-2 px-2'>
          {items.map(item => {
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
              </button>
            );
          })}
        </nav>
        <div className='p-3 border-t'>
          {sidebarOpen && <p className='text-xs text-muted-foreground mb-2 px-2'>{roleLabels[role]}</p>}
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
        <header className='h-14 border-r-0 border-b flex items-center justify-between px-4 lg:px-6 bg-card shrink-0'>
          <div className='flex items-center gap-3'>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className='lg:hidden'>
                <Button variant='ghost' size='icon'><Menu size={20} /></Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-72 p-0'>
                <div className='flex items-center gap-2 p-4 border-b'>
                  <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm', roleColors[role])}>K</div>
                  <span className='font-bold text-lg'>KrishiAI</span>
                </div>
                <nav className='overflow-y-auto py-2 px-2'>
                  {items.map(item => {
                    const isActive = currentRoute === item.route;
                    return (
                      <button key={item.route} onClick={() => { navigate(item.route); setMobileMenuOpen(false); }}
                        className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5',
                          isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>
                        {item.icon}<span className='truncate'>{item.label}</span>
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
            <Avatar className='h-8 w-8'>
              <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto scrollbar-thin'>
          <AnimatePresence mode='wait'>
            <motion.div key={currentRoute} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className='p-4 lg:p-6'>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
