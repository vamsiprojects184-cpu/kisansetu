'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BellOff,
  CheckCheck,
  CloudRain,
  TrendingUp,
  Package,
  Bot,
  Settings,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ============== TYPES ==============
type NotificationCategory = 'weather' | 'market' | 'order' | 'ai' | 'system';

type FilterTab = 'all' | NotificationCategory;

interface FarmerNotification {
  id: string;
  emoji: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

// ============== CATEGORY CONFIG ==============
const categoryConfig: Record<
  NotificationCategory,
  { emoji: string; icon: React.ElementType; bgClass: string; label: string }
> = {
  weather: {
    emoji: '🌧️',
    icon: CloudRain,
    bgClass: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
    label: 'Weather',
  },
  market: {
    emoji: '📈',
    icon: TrendingUp,
    bgClass: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    label: 'Market',
  },
  order: {
    emoji: '📦',
    icon: Package,
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    label: 'Orders',
  },
  ai: {
    emoji: '🤖',
    icon: Bot,
    bgClass: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
    label: 'AI Advisory',
  },
  system: {
    emoji: '⚙️',
    icon: Settings,
    bgClass: 'bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400',
    label: 'System',
  },
};

// ============== MOCK DATA ==============
const initialNotifications: FarmerNotification[] = [
  {
    id: 'n1',
    emoji: '🌧️',
    category: 'weather',
    title: 'Heavy rain expected tomorrow',
    description: 'Avoid fertilizer application in the next 48 hours. Heavy rainfall predicted across your district.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    emoji: '📈',
    category: 'market',
    title: 'Tomato prices up 8% in Hyderabad market',
    description: 'Current wholesale price ₹32/kg. Consider selling your tomato produce at current rates.',
    timestamp: '4 hours ago',
    read: false,
  },
  {
    id: 'n3',
    emoji: '📦',
    category: 'order',
    title: 'Order ORD-2025-003 delivered successfully',
    description: 'Your order containing DAP fertilizer and micronutrients has been delivered to your farm address.',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 'n4',
    emoji: '🤖',
    category: 'ai',
    title: 'AI detected early blight risk on Tomato crop',
    description: 'Based on weather patterns and crop imagery, early blight risk is high. Apply preventive fungicide.',
    timestamp: 'Yesterday',
    read: false,
  },
  {
    id: 'n5',
    emoji: '⚙️',
    category: 'system',
    title: 'Your profile is 65% complete',
    description: 'Add farm details, soil information, and crop data to unlock personalized AI recommendations.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: 'n6',
    emoji: '🌧️',
    category: 'weather',
    title: 'Soil moisture below optimal',
    description: 'Irrigate your paddy field today. Current soil moisture at 28%, optimal range is 35-45%.',
    timestamp: '2 days ago',
    read: false,
  },
  {
    id: 'n7',
    emoji: '📈',
    category: 'market',
    title: 'Rice MSP increased to ₹2,300/quintal',
    description: 'Government has announced the new Minimum Support Price for Kharif 2025 season.',
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: 'n8',
    emoji: '📦',
    category: 'order',
    title: 'Payment of ₹12,500 processed for Order ORD-2025-001',
    description: 'Payment has been credited to your linked bank account. Ref: TXN2025011584291.',
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: 'n9',
    emoji: '🤖',
    category: 'ai',
    title: 'New advisory: Managing whitefly in cotton',
    description: 'Whitefly population increasing in your region. Recommended action: install yellow sticky traps.',
    timestamp: '4 days ago',
    read: true,
  },
  {
    id: 'n10',
    emoji: '🌧️',
    category: 'weather',
    title: 'No rain expected for next 5 days',
    description: 'Dry spell forecast. Plan irrigation schedule accordingly for your standing crops.',
    timestamp: '5 days ago',
    read: true,
  },
  {
    id: 'n11',
    emoji: '📦',
    category: 'system',
    title: 'New collection center opened in Karimnagar',
    description: 'A new center is now operational at Main Road, Karimnagar. Operating hours: 8 AM - 6 PM.',
    timestamp: '1 week ago',
    read: true,
  },
  {
    id: 'n12',
    emoji: '🤖',
    category: 'ai',
    title: 'Crop health score improved to 87/100',
    description: 'Your tomato crop health has improved after following AI recommendations. Keep up the good work!',
    timestamp: '1 week ago',
    read: false,
  },
];

// ============== TABS CONFIG ==============
const filterTabs: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'weather', label: 'Weather' },
  { value: 'market', label: 'Market' },
  { value: 'order', label: 'Orders' },
  { value: 'ai', label: 'AI Advisory' },
  { value: 'system', label: 'System' },
];

// ============== ANIMATION VARIANTS ==============
const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

// ============== MAIN COMPONENT ==============
export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [notifications, setNotifications] = useState<FarmerNotification[]>(initialNotifications);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  const unreadCountByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const n of notifications) {
      if (!n.read) {
        counts.all = (counts.all || 0) + 1;
        counts[n.category] = (counts[n.category] || 0) + 1;
      }
    }
    return counts;
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  return (
    <div className='space-y-6 p-4 md:p-6'>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
      >
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10'>
            <Bell className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h1 className='text-2xl font-bold tracking-tight gradient-text'>Notifications</h1>
            <p className='text-sm text-muted-foreground'>
              {unreadCountByCategory.all > 0
                ? `${unreadCountByCategory.all} unread notification${unreadCountByCategory.all > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={handleMarkAllAsRead}
          disabled={unreadCountByCategory.all === 0}
          className='hover-lift'
        >
          <CheckCheck className='h-4 w-4 mr-1.5' />
          Mark all as read
        </Button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList className='w-full sm:w-auto overflow-x-auto flex h-auto gap-1 bg-muted/50 p-1'>
            {filterTabs.map((tab) => {
              const count = unreadCountByCategory[tab.value] || 0;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className='relative flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm'
                >
                  {tab.label}
                  {count > 0 && (
                    <Badge
                      variant='default'
                      className='h-4 min-w-4 px-1 text-[10px] leading-none flex items-center justify-center'
                    >
                      {count}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Notification List */}
      <div className='space-y-3'>
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-center justify-center py-16 text-center'
          >
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4'>
              <BellOff className='h-8 w-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold text-foreground'>No notifications</h3>
            <p className='text-sm text-muted-foreground mt-1 max-w-xs'>
              No notifications in this category. Check back later for updates.
            </p>
          </motion.div>
        ) : (
          filteredNotifications.map((notification, idx) => {
            const config = categoryConfig[notification.category];
            const IconComponent = config.icon;
            return (
              <motion.div
                key={notification.id}
                custom={idx}
                variants={cardVariants}
                initial='hidden'
                animate='visible'
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                className={cn(
                  'flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors',
                  'hover:bg-accent/50',
                  notification.read
                    ? 'bg-background'
                    : 'bg-primary/5 border-primary/20'
                )}
              >
                {/* Left: Colored icon container */}
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg',
                    config.bgClass
                  )}
                >
                  {config.emoji}
                </div>

                {/* Middle: Content */}
                <div className='flex-1 min-w-0'>
                  <h3
                    className={cn(
                      'text-sm font-semibold leading-tight',
                      notification.read ? 'text-muted-foreground' : 'text-foreground'
                    )}
                  >
                    {notification.title}
                  </h3>
                  <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                    {notification.description}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1.5 flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    {notification.timestamp}
                  </p>
                </div>

                {/* Right: Unread dot */}
                <div className='flex-shrink-0 flex items-center'>
                  {!notification.read && (
                    <span className='w-2 h-2 rounded-full bg-primary' />
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
