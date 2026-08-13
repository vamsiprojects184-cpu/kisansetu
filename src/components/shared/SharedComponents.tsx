'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React from 'react';

// ============== ANIMATION VARIANTS ==============
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 },
};

// ============== STAT CARD ==============
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
  onClick?: () => void;
}

export function StatCard({ title, value, subtitle, icon, trend, className, onClick }: StatCardProps) {
  return (
    <motion.div {...fadeIn}>
      <Card className={cn('hover-lift cursor-pointer border-l-4 border-l-primary/60', className)} onClick={onClick}>
        <CardContent className='p-4'>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>{title}</p>
              <p className='text-2xl font-bold'>{value}</p>
              {subtitle && <p className='text-xs text-muted-foreground'>{subtitle}</p>}
              {trend && (
                <p className={cn('text-xs font-medium', trend.isPositive ? 'text-emerald-600' : 'text-red-500')}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </p>
              )}
            </div>
            <div className='p-2.5 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary'>{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============== WEATHER CARD ==============
interface WeatherCardProps {
  temperature: number;
  condition: string;
  icon: string;
  rainProbability: number;
  humidity: number;
}

export function WeatherCard({ temperature, condition, icon, rainProbability, humidity }: WeatherCardProps) {
  return (
    <motion.div {...fadeIn}>
      <Card className='gradient-green text-white border-0'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Today's Weather</p>
              <p className='text-3xl font-bold'>{temperature}°C</p>
              <p className='text-white/90 text-sm'>{condition}</p>
            </div>
            <div className='text-5xl'>{icon}</div>
          </div>
          <div className='flex gap-4 mt-3 pt-3 border-t border-white/20'>
            <span className='text-xs text-white/80'>🌧 {rainProbability}% rain</span>
            <span className='text-xs text-white/80'>💧 {humidity}% humidity</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============== CROP CARD ==============
interface CropCardProps {
  name: string;
  icon: string;
  stage: string;
  health: string;
  daysToHarvest: number;
  onClick?: () => void;
}

export function CropCard({ name, icon, stage, health, daysToHarvest, onClick }: CropCardProps) {
  const healthColor = health === 'healthy' ? 'bg-emerald-100 text-emerald-700' : health === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return (
    <motion.div {...scaleIn}>
      <Card className='hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer' onClick={onClick}>
        <CardContent className='p-4'>
          <div className='flex items-start gap-3'>
            <div className='text-3xl'>{icon}</div>
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold'>{name}</h3>
              <p className='text-sm text-muted-foreground'>Growth: {stage}</p>
            </div>
            <Badge className={healthColor} variant='secondary'>{health}</Badge>
          </div>
          <div className='mt-3 flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Days to Harvest</span>
            <span className='font-semibold text-primary'>{daysToHarvest} days</span>
          </div>
          <div className='mt-2 h-1.5 rounded-full bg-muted overflow-hidden'>
            <div className='h-full rounded-full bg-primary' style={{ width: `${Math.max(5, 100 - (daysToHarvest / 1.2))}%` }} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============== MARKET PRICE CARD ==============
interface MarketPriceCardProps {
  crop: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
}

export function MarketPriceCard({ crop, price, unit, change, changePercent }: MarketPriceCardProps) {
  const isPositive = change >= 0;
  return (
    <Card className='hover:shadow-sm transition-shadow'>
      <CardContent className='p-3'>
        <div className='flex items-center justify-between'>
          <span className='font-medium text-sm'>{crop}</span>
          <Badge variant={isPositive ? 'default' : 'destructive'} className='text-xs'>
            {isPositive ? '↑' : '↓'} {Math.abs(changePercent)}%
          </Badge>
        </div>
        <div className='flex items-baseline gap-1 mt-1'>
          <span className='text-lg font-bold'>₹{price.toLocaleString('en-IN')}</span>
          <span className='text-xs text-muted-foreground'>/{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============== AI INSIGHT CARD ==============
interface AIInsightCardProps {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'alert';
  action?: string;
  onAction?: () => void;
}

export function AIInsightCard({ title, message, type = 'info', action, onAction }: AIInsightCardProps) {
  const colors = {
    info: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200',
    alert: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
  };
  const icons = { info: '🤖', warning: '⚠️', success: '✅', alert: '🚨' };

  return (
    <motion.div {...fadeIn}>
      <div className={cn('rounded-xl border p-4', colors[type])}>
        <div className='flex items-start gap-3'>
          <span className='text-2xl'>{icons[type]}</span>
          <div className='flex-1'>
            <h3 className='font-semibold text-sm'>{title}</h3>
            <p className='text-sm mt-1 opacity-90'>{message}</p>
            {action && onAction && (
              <button onClick={onAction} className='text-sm font-semibold mt-2 underline underline-offset-2 hover:no-underline'>
                {action}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============== LOADING STATE ==============
export function LoadingState() {
  return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <div className='w-full max-w-sm space-y-4 px-4'>
        <div className='animate-shimmer h-5 w-1/3 rounded-md' />
        <div className='animate-shimmer h-8 w-2/3 rounded-md' />
        <div className='animate-shimmer h-4 w-1/2 rounded-md' />
        <div className='pt-4 text-center'>
          <p className='text-sm text-muted-foreground'>Loading...</p>
        </div>
      </div>
    </div>
  );
}

// ============== EMPTY STATE ==============
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, action, onAction }: EmptyStateProps) {
  return (
    <div className='flex items-center justify-center min-h-[40vh] p-8'>
      <div className='text-center space-y-4 max-w-sm'>
        <div className='text-5xl'>{icon}</div>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <p className='text-muted-foreground text-sm'>{description}</p>
        {action && onAction && (
          <button onClick={onAction} className='px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors'>
            {action}
          </button>
        )}
      </div>
    </div>
  );
}

// ============== SKELETON CARD ==============
export function SkeletonCard() {
  return (
    <Card>
      <CardContent className='p-4 space-y-3'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-3 w-48' />
      </CardContent>
    </Card>
  );
}

// ============== PAGE HEADER ==============
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, action, onBack }: PageHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-6 pb-4 border-b border-border/60'>
      <div className='space-y-0.5'>
        {onBack && (
          <button onClick={onBack} className='text-muted-foreground hover:text-foreground mb-1 text-sm flex items-center gap-1'>
            ← Back
          </button>
        )}
        <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
        {subtitle && <p className='text-muted-foreground text-sm mt-0.5'>{subtitle}</p>}
      </div>
      {action && <div className='flex-shrink-0 ml-4'>{action}</div>}
    </div>
  );
}

// ============== CIRCULAR PROGRESS ==============
interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({ value, size = 140, strokeWidth = 10, color = '#16a34a', label, sublabel }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className='flex flex-col items-center'>
      <svg width={size} height={size} className='-rotate-90'>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke='currentColor' className='text-muted/30' strokeWidth={strokeWidth} fill='none' />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill='none'
          strokeLinecap='round' strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className='-mt-[calc(var(--size)/2+0px)]' style={{ marginTop: `-${size / 2 + 4}px` }}>
        <div className='flex flex-col items-center justify-center' style={{ width: size, height: size }}>
          {label && <span className='text-3xl font-bold'>{label}</span>}
          {sublabel && <span className='text-sm text-muted-foreground'>{sublabel}</span>}
        </div>
      </div>
      <div style={{ height: size / 2 }} />
    </div>
  );
}

// ============== QUALITY SCORE RING ==============
interface QualityScoreProps {
  score: number;
  grade: string;
}

export function QualityScore({ score, grade }: QualityScoreProps) {
  const gradeColor = grade === 'premium' ? '#16a34a' : grade === 'standard' ? '#f59e0b' : '#ef4444';
  return <CircularProgress value={score} color={gradeColor} label={String(score)} sublabel={grade.toUpperCase()} />;
}

// ============== ORDER TIMELINE ==============
interface OrderTimelineProps {
  steps: { status: string; label: string; completed: boolean; time?: string }[];
}

export function OrderTimeline({ steps }: OrderTimelineProps) {
  return (
    <div className='space-y-0'>
      {steps.map((step, idx) => (
        <div key={step.status} className='flex gap-3'>
          <div className='flex flex-col items-center'>
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2',
              step.completed ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-muted-foreground/30'
            )}>
              {step.completed ? '✓' : idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div className={cn('w-0.5 h-8', step.completed ? 'bg-primary' : 'bg-muted')} />
            )}
          </div>
          <div className='pb-8'>
            <p className={cn('font-medium text-sm', step.completed ? 'text-foreground' : 'text-muted-foreground')}>{step.label}</p>
            {step.time && <p className='text-xs text-muted-foreground mt-0.5'>{step.time}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============== SECTION WRAPPER ==============
interface SectionWrapperProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ title, subtitle, action, children, className }: SectionWrapperProps) {
  return (
    <section className={cn('mb-8', className)}>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-lg font-semibold'>{title}</h2>
          {subtitle && <p className='text-sm text-muted-foreground'>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
