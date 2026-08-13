'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/store/use-app-store';
import { useAuthStore } from '@/store/use-auth-store';
import type { RoutePath, UserRole } from '@/types';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Sprout,
  Leaf,
  Bug,
  TestTube,
  Droplets,
  CloudSun,
  TrendingUp,
  ShoppingCart,
  MapPin,
  Package,
  CreditCard,
  User,
  Bell,
  Store,
  Flower2,
  ShoppingBag,
  ClipboardList,
  Warehouse,
  Truck,
  ShieldCheck,
  Banknote,
  FileText,
  Users,
  Wheat,
  BarChart3,
  Building2,
  SearchX,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RouteEntry {
  route: RoutePath;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface RouteGroup {
  heading: string;
  routes: RouteEntry[];
}

const farmerRoutes: RouteEntry[] = [
  { route: 'farmer/dashboard', label: 'Dashboard', description: 'Overview of your farm activity', icon: LayoutDashboard },
  { route: 'farmer/my-farm', label: 'My Farm', description: 'Manage your farms and fields', icon: Sprout },
  { route: 'farmer/soil-health', label: 'Soil Health', description: 'Soil analysis and recommendations', icon: Leaf },
  { route: 'farmer/crop-recommendations', label: 'Crop Recommendations', description: 'AI-powered crop suggestions', icon: Flower2 },
  { route: 'farmer/disease-detection', label: 'Disease Detection', description: 'Scan and identify crop diseases', icon: Bug },
  { route: 'farmer/fertilizer', label: 'Fertilizer Advisor', description: 'Fertilizer recommendations', icon: TestTube },
  { route: 'farmer/irrigation', label: 'Smart Irrigation', description: 'Irrigation scheduling and monitoring', icon: Droplets },
  { route: 'farmer/weather', label: 'Weather Forecast', description: 'Local weather and farming alerts', icon: CloudSun },
  { route: 'farmer/market-prices', label: 'Market Prices', description: 'Current crop market rates', icon: TrendingUp },
  { route: 'farmer/sell', label: 'Sell Produce', description: 'List and sell your produce', icon: ShoppingCart },
  { route: 'farmer/collection-centers', label: 'Collection Centers', description: 'Nearby collection centers', icon: MapPin },
  { route: 'farmer/orders', label: 'My Orders', description: 'Track your orders', icon: Package },
  { route: 'farmer/payments', label: 'Payments', description: 'Payment history and status', icon: CreditCard },
  { route: 'farmer/profile', label: 'Profile', description: 'Account and profile settings', icon: User },
  { route: 'farmer/notifications', label: 'Notifications', description: 'View all notifications', icon: Bell },
];

const marketplaceRoutes: RouteEntry[] = [
  { route: 'marketplace/home', label: 'Marketplace', description: 'Browse agricultural products', icon: Store },
  { route: 'marketplace/seeds', label: 'Seeds', description: 'Browse quality seeds', icon: Flower2 },
  { route: 'marketplace/products', label: 'All Products', description: 'Full product catalog', icon: ShoppingBag },
  { route: 'marketplace/cart', label: 'Shopping Cart', description: 'Review your cart items', icon: ShoppingCart },
  { route: 'marketplace/checkout', label: 'Checkout', description: 'Complete your purchase', icon: CreditCard },
];

const consumerRoutes: RouteEntry[] = [
  { route: 'consumer/dashboard', label: 'Dashboard', description: 'Your shopping overview', icon: LayoutDashboard },
  { route: 'consumer/orders', label: 'My Orders', description: 'Track your purchases', icon: Package },
  { route: 'consumer/profile', label: 'Profile', description: 'Account and profile settings', icon: User },
];

const ccRoutes: RouteEntry[] = [
  { route: 'collection-center/dashboard', label: 'Dashboard', description: 'Collection center overview', icon: LayoutDashboard },
  { route: 'collection-center/inventory', label: 'Inventory', description: 'Manage stock and inventory', icon: Warehouse },
  { route: 'collection-center/incoming', label: 'Incoming', description: 'Incoming produce shipments', icon: Truck },
  { route: 'collection-center/quality-check', label: 'Quality Check', description: 'Quality verification process', icon: ShieldCheck },
  { route: 'collection-center/payouts', label: 'Payouts', description: 'Farmer payout management', icon: Banknote },
];

const expertRoutes: RouteEntry[] = [
  { route: 'expert/dashboard', label: 'Dashboard', description: 'Expert advisory overview', icon: LayoutDashboard },
  { route: 'expert/disease-cases', label: 'Disease Cases', description: 'Review and diagnose diseases', icon: Bug },
  { route: 'expert/advisories', label: 'Advisories', description: 'Farm advisories and reports', icon: FileText },
];

const adminRoutes: RouteEntry[] = [
  { route: 'admin/dashboard', label: 'Dashboard', description: 'Platform admin overview', icon: LayoutDashboard },
  { route: 'admin/users', label: 'Users', description: 'Manage platform users', icon: Users },
  { route: 'admin/farmers', label: 'Farmers', description: 'Manage registered farmers', icon: Wheat },
  { route: 'admin/products', label: 'Products', description: 'Manage marketplace products', icon: Package },
  { route: 'admin/orders', label: 'Orders', description: 'Manage all orders', icon: ClipboardList },
  { route: 'admin/collection-centers', label: 'Collection Centers', description: 'Manage collection centers', icon: Building2 },
  { route: 'admin/analytics', label: 'Analytics', description: 'Platform analytics and insights', icon: BarChart3 },
];

function getRouteGroups(role: UserRole): RouteGroup[] {
  switch (role) {
    case 'farmer':
      return [
        { heading: 'Main', routes: [farmerRoutes[0], farmerRoutes[13]] },
        { heading: 'Farm Management', routes: farmerRoutes.slice(1, 3).concat(farmerRoutes.slice(7, 12)) },
        { heading: 'AI Tools', routes: farmerRoutes.slice(3, 7) },
        { heading: 'Marketplace', routes: marketplaceRoutes },
        { heading: 'Account', routes: farmerRoutes.slice(12) },
      ];
    case 'consumer':
      return [
        { heading: 'Main', routes: [consumerRoutes[0]] },
        { heading: 'Marketplace', routes: marketplaceRoutes },
        { heading: 'Account', routes: consumerRoutes.slice(1) },
      ];
    case 'collection_center':
      return [
        { heading: 'Main', routes: [ccRoutes[0]] },
        { heading: 'Operations', routes: ccRoutes.slice(1) },
      ];
    case 'expert':
      return [
        { heading: 'Main', routes: [expertRoutes[0]] },
        { heading: 'Expert Tools', routes: expertRoutes.slice(1) },
      ];
    case 'admin':
      return [
        { heading: 'Main', routes: [adminRoutes[0]] },
        { heading: 'Management', routes: adminRoutes.slice(1) },
      ];
    default:
      return [];
  }
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 400 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
    transition: { duration: 0.12 },
  },
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { navigate } = useAppStore();
  const { user } = useAuthStore();
  const role = user?.role || 'farmer';
  const groups = getRouteGroups(role);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = useCallback(
    (route: RoutePath) => {
      navigate(route);
      setOpen(false);
    },
    [navigate]
  );

  // Only render portal on client
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className='fixed inset-0 z-50 bg-black/50'
            variants={overlayVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={() => setOpen(false)}
            aria-hidden='true'
          />
          <motion.div
            className='fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border bg-popover text-popover-foreground shadow-2xl overflow-hidden'
            variants={contentVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            role='dialog'
            aria-modal='true'
            aria-label='Search pages'
          >
            <Command className='[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5'>
              <CommandInput placeholder='Search pages...' />
              <CommandList className='max-h-[340px]'>
                <CommandEmpty className='flex flex-col items-center gap-2 py-8'>
                  <SearchX className='h-8 w-8 text-muted-foreground/40' />
                  <p className='text-sm text-muted-foreground'>No results found</p>
                  <p className='text-xs text-muted-foreground/60'>Try a different search term</p>
                </CommandEmpty>
                {groups.map(group => (
                  <CommandGroup key={group.heading} heading={group.heading}>
                    {group.routes.map(entry => {
                      const Icon = entry.icon;
                      return (
                        <CommandItem
                          key={entry.route}
                          value={`${entry.label} ${entry.description}`}
                          onSelect={() => handleSelect(entry.route)}
                          className='flex items-center gap-3 cursor-pointer'
                        >
                          <Icon className='h-4 w-4 text-muted-foreground shrink-0' />
                          <div className='flex flex-col min-w-0'>
                            <span className='text-sm font-medium'>{entry.label}</span>
                            <span className='text-xs text-muted-foreground truncate'>{entry.description}</span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/** Hook to open the command palette from external triggers */
export function useCommandPaletteOpen() {
  const openPalette = useCallback(() => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      })
    );
  }, []);
  return { openPalette };
}
