'use client';

import React from 'react';
import { useAppStore } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '@/types';

const typeStyles: Record<Notification['type'], string> = {
  info: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  alert: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const typeDots: Record<Notification['type'], string> = {
  info: 'bg-sky-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  alert: 'bg-red-500',
};

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const listItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: 'easeOut' },
  }),
};

interface NotificationDropdownProps {
  onViewAll?: () => void;
}

export default function NotificationDropdown({ onViewAll }: NotificationDropdownProps) {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    setNotifications,
  } = useAppStore();

  const recentNotifications = notifications.slice(0, 5);
  const count = unreadCount();

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationRead(id);
  };

  const handleViewAll = () => {
    onViewAll?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='relative p-2 rounded-lg hover:bg-accent transition-colors' aria-label='Notifications'>
          <Bell size={20} className='text-muted-foreground' />
          {count > 0 && (
            <span className='absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium'>
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        sideOffset={8}
        className='w-80 max-w-80 rounded-xl shadow-lg p-0 border'
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 pt-4 pb-2'>
          <h3 className='text-sm font-semibold'>Notifications</h3>
          {count > 0 && (
            <button
              onClick={handleMarkAllRead}
              className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
        </div>

        <Separator />

        {/* Notification List */}
        <ScrollArea className='max-h-80'>
          {recentNotifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 px-4 text-center'>
              <div className='w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3'>
                <BellOff size={20} className='text-muted-foreground' />
              </div>
              <p className='text-sm font-medium text-muted-foreground'>No new notifications</p>
              <p className='text-xs text-muted-foreground/70 mt-1'>
                We&apos;ll let you know when something arrives
              </p>
            </div>
          ) : (
            <div className='py-1'>
              <AnimatePresence initial={false}>
                {recentNotifications.map((notification, index) => (
                  <motion.button
                    key={notification.id}
                    custom={index}
                    variants={listItemVariants}
                    initial='hidden'
                    animate='visible'
                    exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                    onClick={(e) => handleNotificationClick(notification.id, e)}
                    className={cn(
                      'w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors',
                      !notification.read && 'bg-primary/[0.03]'
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5',
                        notification.icon
                          ? 'bg-muted'
                          : typeStyles[notification.type]
                      )}
                    >
                      {notification.icon || (
                        <span className={cn('w-2 h-2 rounded-full', typeDots[notification.type])} />
                      )}
                    </div>

                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-2'>
                        <p className={cn(
                          'text-sm leading-tight truncate',
                          !notification.read ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className='w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5' />
                        )}
                      </div>
                      <p className='text-xs text-muted-foreground/80 mt-0.5 line-clamp-2'>
                        {notification.message}
                      </p>
                      <p className='text-[11px] text-muted-foreground/60 mt-1'>
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className='px-4 py-2.5'>
              <button
                onClick={handleViewAll}
                className='w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors'
              >
                View all notifications
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
