'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf, Bug, Mic, CloudSun, TrendingUp, ShoppingCart,
  MapPin, Droplets, Sprout, Clock, ChevronRight, Plus,
  Bell, ArrowLeft, Edit3, Check, X, LogOut, CreditCard,
  Package, Tractor, Activity,
  BarChart3, ThermometerSun, Layers, ArrowUpRight, ArrowDownRight, Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  WeatherCard, CropCard, MarketPriceCard, AIInsightCard,
  CircularProgress, SectionWrapper, PageHeader, fadeIn, fadeInUp,
} from '@/components/shared/SharedComponents';
import { useAppStore } from '@/store/use-app-store';
import { useAuthStore } from '@/store/use-auth-store';
import { useCartStore } from '@/store/use-cart-store';
import {
  mockWeather, mockCrops, mockFarms, mockMarketPrices,
  mockNotifications, mockSoilHealth, mockCropRecommendations,
  mockDiseaseResult, mockFertilizerRecs, mockIrrigationStatus,
  mockForecast, mockMarketPrediction, priceHistory, mockCollectionCenters,
} from '@/data/mock-data';
import type { RoutePath, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ============== HELPER ==============
const statusColor = (status: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    placed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-amber-100 text-amber-700',
    quality_verified: 'bg-purple-100 text-purple-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const statusLabel = (status: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    placed: 'Placed',
    preparing: 'Preparing',
    quality_verified: 'Quality Verified',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
};

const notifIcon = (type: string) => {
  const map: Record<string, React.ReactNode> = {
    info: <Bell className='h-5 w-5 text-blue-500' />,
    warning: <CloudSun className='h-5 w-5 text-amber-500' />,
    success: <Check className='h-5 w-5 text-emerald-500' />,
    alert: <Activity className='h-5 w-5 text-red-500' />,
  };
  return map[type] || <Bell className='h-5 w-5 text-muted-foreground' />;
};

// ============== 1. FARMER DASHBOARD ==============
export function FarmerDashboard() {
  const { navigate } = useAppStore();

  const quickActions = [
    { label: 'Test Soil', icon: <Leaf className='h-6 w-6' />, route: 'farmer/soil-health' as RoutePath, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200' },
    { label: 'Scan Crop', icon: <Bug className='h-6 w-6' />, route: 'farmer/disease-detection' as RoutePath, color: 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200' },
    { label: 'Ask AI', icon: <Mic className='h-6 w-6' />, route: 'farmer/dashboard' as RoutePath, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200' },
    { label: 'Check Weather', icon: <CloudSun className='h-6 w-6' />, route: 'farmer/weather' as RoutePath, color: 'bg-sky-50 text-sky-600 hover:bg-sky-100 border-sky-200' },
    { label: 'Market Prices', icon: <TrendingUp className='h-6 w-6' />, route: 'farmer/market-prices' as RoutePath, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200' },
    { label: 'Sell Products', icon: <ShoppingCart className='h-6 w-6' />, route: 'farmer/sell' as RoutePath, color: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200' },
  ];

  const upcomingTasks = [
    { text: 'Apply fertilizer to Tomato field', due: 'Tomorrow', icon: <Sprout className='h-4 w-4 text-emerald-500' /> },
    { text: 'Check irrigation schedule for Rice', due: 'Today, 6:00 PM', icon: <Droplets className='h-4 w-4 text-sky-500' /> },
    { text: 'Visit collection center for payment collection', due: 'Jan 8, 2025', icon: <CreditCard className='h-4 w-4 text-amber-500' /> },
  ];

  // --- Market Price Ticker data ---
  const tickerItems = [
    { emoji: '🍚', name: 'Rice', price: '₹2,150', change: '+3.2%', up: true },
    { emoji: '🌾', name: 'Wheat', price: '₹2,280', change: '+1.5%', up: true },
    { emoji: '🌶️', name: 'Chilli', price: '₹12,500', change: '-2.1%', up: false },
    { emoji: '🧅', name: 'Onion', price: '₹1,850', change: '+5.4%', up: true },
    { emoji: '🥔', name: 'Potato', price: '₹980', change: '-0.8%', up: false },
    { emoji: '🍅', name: 'Tomato', price: '₹3,200', change: '+7.1%', up: true },
    { emoji: '🌱', name: 'Cotton', price: '₹6,400', change: '-1.3%', up: false },
    { emoji: '🫘', name: 'Tur Dal', price: '₹8,900', change: '+2.6%', up: true },
  ];
  const doubledTicker = [...tickerItems, ...tickerItems];

  // --- Profile Completion data ---
  const profileItems = [
    { label: 'Phone Verified', done: true },
    { label: 'Farm Added', done: true },
    { label: 'Soil Tested', done: false },
    { label: 'First Sale', done: false },
    { label: 'Bank Details', done: false },
  ];
  const completedCount = profileItems.filter((i) => i.done).length;
  const completionPercent = Math.round((completedCount / profileItems.length) * 100);
  const ringRadius = 38;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (completionPercent / 100) * ringCircumference;

  // --- Today's Tasks ---
  const [todayTasks, setTodayTasks] = useState([
    { id: 1, text: 'Water tomato beds', time: 'Morning', done: false },
    { id: 2, text: 'Apply fertilizer to rice paddy', time: 'Afternoon', done: false },
    { id: 3, text: 'Check chilli plants for pests', time: '', done: true },
    { id: 4, text: 'Update market prices', time: 'Evening', done: true },
  ]);
  const toggleTask = (id: number) => {
    setTodayTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };
  const doneCount = todayTasks.filter((t) => t.done).length;

  // --- Quick Tips ---
  const tips = [
    'Water your plants early morning to reduce evaporation by up to 40%.',
    'Test your soil pH every 3 months for optimal nutrient absorption.',
    'Rotate crops each season to prevent soil depletion and reduce pest buildup.',
    'Apply mulch around plants to retain moisture and suppress weeds naturally.',
    'Monitor weather forecasts regularly — plan irrigation 2–3 days ahead of dry spells.',
  ];
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='space-y-6'>
      {/* Greeting */}
      <motion.div {...fadeInUp}>
        <h1 className='text-2xl font-bold tracking-tight'>Good Morning, Vamsi 👋</h1>
        <p className='text-muted-foreground mt-1'>Your farm is looking healthy today.</p>
      </motion.div>

      {/* Market Price Ticker */}
      <motion.div {...fadeIn} transition={{ duration: 0.3 }}>
        <div className='relative overflow-hidden rounded-lg bg-muted/60 border border-border/40 py-2.5 px-4'>
          <div className='flex items-center gap-6 whitespace-nowrap' style={{ animation: 'ticker-scroll 35s linear infinite' }}>
            {doubledTicker.map((item, idx) => (
              <span key={idx} className='inline-flex items-center gap-2 text-sm'>
                <span className='text-base'>{item.emoji}</span>
                <span className='font-medium'>{item.name}</span>
                <span className='text-muted-foreground'>{item.price}</span>
                <span className={cn('text-xs font-semibold', item.up ? 'text-emerald-600' : 'text-red-500')}>
                  {item.up ? '↑' : '↓'} {item.change}
                </span>
              </span>
            ))}
          </div>
          <style>{`
            @keyframes ticker-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      </motion.div>

      {/* Summary Cards Row - Weather & Soil */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <WeatherCard
          temperature={mockWeather.temperature}
          condition={mockWeather.condition}
          icon={mockWeather.icon}
          rainProbability={mockWeather.rainProbability}
          humidity={mockWeather.humidity}
        />

        <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className='h-full'>
            <CardContent className='p-4 flex items-center gap-4'>
              <CircularProgress value={82} size={90} strokeWidth={8} label='82' sublabel='/ 100' />
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>Soil Health</p>
                <p className='text-lg font-semibold'>Good</p>
                <p className='text-xs text-muted-foreground'>Last tested: Dec 15</p>
                <Button
                  variant='link' className='text-primary p-0 h-auto text-sm'
                  onClick={() => navigate('farmer/soil-health')}
                >
                  View details →
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Profile Completion + Weather Warning */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className='glass-card h-full'>
            <CardContent className='p-5'>
              <div className='flex items-start gap-5'>
                {/* Circular progress ring */}
                <div className='relative flex-shrink-0'>
                  <svg width={96} height={96} className='-rotate-90'>
                    <defs>
                      <linearGradient id='profileGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
                        <stop offset='0%' stopColor='#22c55e' />
                        <stop offset='100%' stopColor='#16a34a' />
                      </linearGradient>
                    </defs>
                    <circle
                      cx={48} cy={48} r={ringRadius}
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={7}
                      className='text-muted/30'
                    />
                    <circle
                      cx={48} cy={48} r={ringRadius}
                      fill='none'
                      stroke='url(#profileGrad)'
                      strokeWidth={7}
                      strokeLinecap='round'
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                    />
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-lg font-bold'>{completionPercent}%</span>
                    <span className='text-[10px] text-muted-foreground -mt-0.5'>Complete</span>
                  </div>
                </div>

                {/* Checklist */}
                <div className='flex-1 space-y-2.5'>
                  <p className='font-semibold text-sm mb-3'>Profile Completion</p>
                  {profileItems.map((item) => (
                    <div key={item.label} className='flex items-center gap-2'>
                      {item.done ? (
                        <Check className='h-4 w-4 text-emerald-500 flex-shrink-0' />
                      ) : (
                        <div className='h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0' />
                      )}
                      <span className={cn('text-sm', item.done ? 'text-foreground' : 'text-muted-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <Button
                    size='sm'
                    className='mt-3 w-full'
                    onClick={() => navigate('farmer/profile')}
                  >
                    Complete Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AIInsightCard
          title='Weather Warning'
          message='Heavy rainfall expected tomorrow. Avoid fertilizer application and field operations. Consider covering sensitive crops.'
          type='warning'
          action='View forecast'
          onAction={() => navigate('farmer/weather')}
        />
      </div>

      {/* Active Crops */}
      <SectionWrapper
        title='Active Crops'
        subtitle={`${mockCrops.length} crops across ${mockFarms.length} farms`}
        action={
          <Button variant='ghost' size='sm' className='text-primary' onClick={() => navigate('farmer/my-farm')}>
            View all <ChevronRight className='h-4 w-4 ml-1' />
          </Button>
        }
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {mockCrops.map((crop) => (
            <CropCard
              key={crop.id}
              name={crop.name}
              icon={crop.icon}
              stage={crop.stage}
              health={crop.health}
              daysToHarvest={crop.daysToHarvest}
              onClick={() => navigate('farmer/farm-details')}
            />
          ))}
        </div>
      </SectionWrapper>

      {/* Today's Tasks */}
      <SectionWrapper
        title="Today's Tasks"
        subtitle={`${doneCount}/${todayTasks.length} completed`}
      >
        <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card>
            <CardContent className='p-4 space-y-1'>
              {todayTasks.map((task) => (
                <label
                  key={task.id}
                  className='flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer'
                >
                  <div
                    className={cn(
                      'h-5 w-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                      task.done
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-muted-foreground/40',
                    )}
                  >
                    {task.done && <Check className='h-3.5 w-3.5 text-white' />}
                  </div>
                  <input
                    type='checkbox'
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className='sr-only'
                  />
                  <span className={cn('flex-1 text-sm', task.done && 'line-through text-muted-foreground')}>
                    {task.text}
                  </span>
                  {task.time && (
                    <span className='text-xs text-muted-foreground flex items-center gap-1'>
                      <Clock className='h-3 w-3' />
                      {task.time}
                    </span>
                  )}
                </label>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </SectionWrapper>

      {/* Quick Tips */}
      <motion.div {...fadeInUp} transition={{ duration: 0.4 }}>
        <Card className='bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30'>
          <CardContent className='p-4 flex items-start gap-3'>
            <Lightbulb className='h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5' />
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1'>Daily Tip</p>
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className='text-sm text-amber-800/80 dark:text-amber-200/80 italic leading-relaxed'
              >
                {tips[tipIndex]}
              </motion.p>
              <div className='flex gap-1.5 mt-2'>
                {tips.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full transition-colors',
                      i === tipIndex ? 'bg-amber-500' : 'bg-amber-300/50 dark:bg-amber-700/40',
                    )}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <SectionWrapper title='Quick Actions' subtitle='Common farming tasks at your fingertips'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.route)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${action.color}`}
            >
              {action.icon}
              <span className='font-medium text-sm'>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </SectionWrapper>

      {/* Market Prices */}
      <SectionWrapper
        title='Market Prices'
        subtitle='Today&apos;s prices from nearby markets'
        action={
          <Button variant='ghost' size='sm' className='text-primary' onClick={() => navigate('farmer/market-prices')}>
            See all <ChevronRight className='h-4 w-4 ml-1' />
          </Button>
        }
      >
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
          {mockMarketPrices.slice(0, 4).map((mp) => (
            <MarketPriceCard
              key={mp.crop}
              crop={mp.crop}
              price={mp.price}
              unit={mp.unit}
              change={mp.change}
              changePercent={mp.changePercent}
            />
          ))}
        </div>
      </SectionWrapper>

      {/* Upcoming Tasks */}
      <SectionWrapper title='Upcoming Tasks' subtitle='Don&apos;t forget these important tasks'>
        <Card>
          <CardContent className='p-0'>
            <div className='divide-y'>
              {upcomingTasks.map((task, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className='flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors'
                >
                  <div className='p-2 rounded-lg bg-muted'>{task.icon}</div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-sm'>{task.text}</p>
                    <p className='text-xs text-muted-foreground'>{task.due}</p>
                  </div>
                  <ChevronRight className='h-4 w-4 text-muted-foreground' />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
}

// ============== 2. MY FARM PAGE ==============
export function MyFarmPage() {
  const { navigate } = useAppStore();

  const soilColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700';
    if (score >= 60) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className='space-y-6'>
      <PageHeader title='My Farms' subtitle={`${mockFarms.length} farms registered`} />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {mockFarms.map((farm, idx) => (
          <motion.div
            key={farm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card
              className='hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full'
              onClick={() => navigate('farmer/farm-details')}
            >
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='text-base'>{farm.name}</CardTitle>
                    <p className='text-sm text-muted-foreground flex items-center gap-1 mt-1'>
                      <MapPin className='h-3 w-3' /> {farm.location}
                    </p>
                  </div>
                  <Badge className={soilColor(farm.soilHealthScore)} variant='secondary'>
                    {farm.soilHealthScore}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='pt-0'>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div className='flex items-center gap-2'>
                    <Layers className='h-4 w-4 text-muted-foreground' />
                    <span>{farm.totalAcres} acres</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Sprout className='h-4 w-4 text-muted-foreground' />
                    <span>{farm.activeCrops.length} active crops</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Droplets className='h-4 w-4 text-muted-foreground' />
                    <span>{farm.irrigationAvailable ? 'Irrigated' : 'Rain-fed'}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Tractor className='h-4 w-4 text-muted-foreground' />
                    <span>{farm.soilType}</span>
                  </div>
                </div>
                <div className='flex items-center justify-end mt-3 text-primary text-sm font-medium'>
                  View details <ChevronRight className='h-4 w-4 ml-1' />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add New Farm Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mockFarms.length * 0.1 }}
        >
          <Card
            className='border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer h-full flex items-center justify-center min-h-[180px]'
            onClick={() => toast.success('Add farm feature coming soon!')}
          >
            <CardContent className='flex flex-col items-center gap-2 text-muted-foreground'>
              <div className='p-3 rounded-full bg-muted'>
                <Plus className='h-6 w-6' />
              </div>
              <p className='font-medium'>Add New Farm</p>
              <p className='text-xs text-muted-foreground'>Register a new farm</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// ============== 3. FARM DETAILS PAGE ==============
export function FarmDetailsPage() {
  const { navigate } = useAppStore();
  const farm = mockFarms[0];
  const [activeTab, setActiveTab] = useState('overview');

  const monthlyData = [
    { month: 'Aug', yield: 1200, revenue: 28000 },
    { month: 'Sep', yield: 1450, revenue: 34000 },
    { month: 'Oct', yield: 1100, revenue: 26000 },
    { month: 'Nov', yield: 1600, revenue: 38000 },
    { month: 'Dec', yield: 1350, revenue: 32000 },
    { month: 'Jan', yield: 1800, revenue: 42000 },
  ];

  const activities = [
    { date: 'Dec 28, 2024', text: 'Applied pesticide to Tomato field', icon: <Bug className='h-4 w-4 text-orange-500' /> },
    { date: 'Dec 15, 2024', text: 'Soil health test completed — Score: 82', icon: <Activity className='h-4 w-4 text-emerald-500' /> },
    { date: 'Dec 1, 2024', text: 'Irrigated Rice field — 1200L', icon: <Droplets className='h-4 w-4 text-sky-500' /> },
    { date: 'Nov 15, 2024', text: 'Applied fertilizer to Tomato field', icon: <Sprout className='h-4 w-4 text-green-500' /> },
    { date: 'Nov 1, 2024', text: 'Planted Tomato (Hybrid GT-4)', icon: <Leaf className='h-4 w-4 text-emerald-600' /> },
    { date: 'Oct 15, 2024', text: 'Planted Rice (BPT-5204)', icon: <Leaf className='h-4 w-4 text-emerald-600' /> },
    { date: 'Oct 1, 2024', text: 'Land preparation completed', icon: <Tractor className='h-4 w-4 text-amber-600' /> },
    { date: 'Jun 15, 2024', text: 'Farm registered on KrishiAI', icon: <Check className='h-4 w-4 text-primary' /> },
  ];

  return (
    <div className='space-y-6'>
      {/* Header with back */}
      <div>
        <button
          onClick={() => navigate('farmer/my-farm')}
          className='text-muted-foreground hover:text-foreground mb-2 text-sm flex items-center gap-1 transition-colors'
        >
          <ArrowLeft className='h-4 w-4' /> Back to My Farms
        </button>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>{farm.name}</h1>
            <p className='text-muted-foreground text-sm flex items-center gap-1 mt-1'>
              <MapPin className='h-3.5 w-3.5' /> {farm.location}, {farm.district}, {farm.state}
            </p>
          </div>
          <Badge variant='secondary' className='bg-emerald-100 text-emerald-700'>
            Active
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='crops'>Crops</TabsTrigger>
          <TabsTrigger value='soil'>Soil</TabsTrigger>
          <TabsTrigger value='activities'>Activities</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='mt-4'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            <motion.div {...fadeIn} transition={{ delay: 0 }}>
              <Card>
                <CardContent className='p-4 text-center'>
                  <Layers className='h-6 w-6 mx-auto text-primary mb-2' />
                  <p className='text-2xl font-bold'>{farm.totalAcres}</p>
                  <p className='text-sm text-muted-foreground'>Total Acres</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
              <Card>
                <CardContent className='p-4 text-center'>
                  <Droplets className='h-6 w-6 mx-auto text-sky-500 mb-2' />
                  <p className='text-2xl font-bold'>{farm.irrigationAvailable ? 'Yes' : 'No'}</p>
                  <p className='text-sm text-muted-foreground'>Irrigation</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent className='p-4 text-center'>
                  <ThermometerSun className='h-6 w-6 mx-auto text-amber-500 mb-2' />
                  <p className='text-lg font-bold'>{farm.soilType}</p>
                  <p className='text-sm text-muted-foreground'>Soil Type</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
              <Card>
                <CardContent className='p-4 text-center'>
                  <Activity className='h-6 w-6 mx-auto text-emerald-500 mb-2' />
                  <p className='text-2xl font-bold'>{farm.soilHealthScore}/100</p>
                  <p className='text-sm text-muted-foreground'>Soil Score</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Crops Tab */}
        <TabsContent value='crops' className='mt-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {farm.activeCrops.map((crop) => (
              <CropCard
                key={crop.id}
                name={crop.name}
                icon={crop.icon}
                stage={crop.stage}
                health={crop.health}
                daysToHarvest={crop.daysToHarvest}
              />
            ))}
          </div>
        </TabsContent>

        {/* Soil Tab */}
        <TabsContent value='soil' className='mt-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Soil Health Summary</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col items-center pb-6'>
                <CircularProgress
                  value={mockSoilHealth.score}
                  size={140}
                  strokeWidth={10}
                  label={String(mockSoilHealth.score)}
                  sublabel={mockSoilHealth.grade.toUpperCase()}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Nutrient Levels</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <NutrientBar label='Nitrogen (N)' value={245} status={mockSoilHealth.nitrogen.status} />
                <NutrientBar label='Phosphorus (P)' value={32} status={mockSoilHealth.phosphorus.status} />
                <NutrientBar label='Potassium (K)' value={380} status={mockSoilHealth.potassium.status} />
                <Separator className='my-2' />
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-muted-foreground'>pH Level</p>
                    <p className='font-semibold'>{mockSoilHealth.ph}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Organic Carbon</p>
                    <p className='font-semibold'>{mockSoilHealth.organicCarbon}%</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Moisture</p>
                    <p className='font-semibold'>{mockSoilHealth.moisture}%</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Last Tested</p>
                    <p className='font-semibold'>{mockSoilHealth.lastTestDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value='activities' className='mt-4'>
          <Card>
            <CardContent className='p-0'>
              <div className='divide-y'>
                {activities.map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className='flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors'
                  >
                    <div className='p-2 rounded-lg bg-muted'>{activity.icon}</div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm'>{activity.text}</p>
                      <p className='text-xs text-muted-foreground'>{activity.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value='analytics' className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Monthly Farm Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                    <XAxis dataKey='month' className='text-xs' />
                    <YAxis className='text-xs' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey='yield' name='Yield (kg)' fill='#16a34a' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='revenue' name='Revenue (₹)' fill='#f59e0b' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component for nutrient bar
function NutrientBar({ label, value, status }: { label: string; value: number; status: string }) {
  const statusColor = status === 'optimal'
    ? 'bg-emerald-500'
    : status === 'low'
    ? 'bg-amber-500'
    : 'bg-red-500';
  const barWidth = Math.min(100, (value / 500) * 100);
  return (
    <div>
      <div className='flex items-center justify-between text-sm mb-1'>
        <span>{label}</span>
        <span className='text-muted-foreground'>{value} kg/ha</span>
      </div>
      <div className='h-2 rounded-full bg-muted overflow-hidden'>
        <div className={`h-full rounded-full ${statusColor} transition-all`} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}

// ============== 4. FARMER PROFILE PAGE ==============
export function FarmerProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    location: user?.location || '',
    state: user?.state || '',
    district: user?.district || '',
    village: user?.village || '',
    language: user?.language || 'en',
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData({
      phone: user?.phone || '',
      email: user?.email || '',
      location: user?.location || '',
      state: user?.state || '',
      district: user?.district || '',
      village: user?.village || '',
      language: user?.language || 'en',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const fields = [
    { label: 'Phone', key: 'phone' as const, icon: <Clock className='h-4 w-4 text-muted-foreground' /> },
    { label: 'Email', key: 'email' as const, icon: <Bell className='h-4 w-4 text-muted-foreground' /> },
    { label: 'Location', key: 'location' as const, icon: <MapPin className='h-4 w-4 text-muted-foreground' /> },
    { label: 'State', key: 'state' as const, icon: <MapPin className='h-4 w-4 text-muted-foreground' /> },
    { label: 'District', key: 'district' as const, icon: <MapPin className='h-4 w-4 text-muted-foreground' /> },
    { label: 'Village', key: 'village' as const, icon: <MapPin className='h-4 w-4 text-muted-foreground' /> },
  ];

  return (
    <div className='space-y-6 max-w-2xl'>
      <PageHeader title='Profile' subtitle='Manage your account settings' />

      {/* Avatar & Name */}
      <motion.div {...fadeIn}>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 rounded-full gradient-green flex items-center justify-center text-white text-2xl font-bold'>
                {user?.name?.charAt(0) || 'F'}
              </div>
              <div className='flex-1'>
                <h2 className='text-xl font-bold'>{user?.name || 'Farmer'}</h2>
                <p className='text-sm text-muted-foreground'>{user?.role || 'farmer'}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>Member since {user?.joinedDate || '2024'}</p>
              </div>
              {!isEditing ? (
                <Button variant='outline' size='sm' onClick={() => setIsEditing(true)}>
                  <Edit3 className='h-4 w-4 mr-1' /> Edit
                </Button>
              ) : (
                <div className='flex gap-2'>
                  <Button size='sm' onClick={handleSave}>
                    <Check className='h-4 w-4 mr-1' /> Save
                  </Button>
                  <Button variant='outline' size='sm' onClick={handleCancel}>
                    <X className='h-4 w-4 mr-1' /> Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Info */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {fields.map((field) => (
              <div key={field.key} className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0'>
                  {field.icon}
                </div>
                {isEditing ? (
                  <Input
                    className='flex-1'
                    value={editData[field.key]}
                    onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                    placeholder={field.label}
                  />
                ) : (
                  <div className='flex-1'>
                    <p className='text-xs text-muted-foreground'>{field.label}</p>
                    <p className='text-sm font-medium'>{user?.[field.key as keyof typeof user] || '-'}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Language Preference */}
      <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Language Preference</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className='flex gap-2'>
                {['en', 'te', 'hi'].map((lang) => (
                  <Button
                    key={lang}
                    variant={editData.language === lang ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setEditData({ ...editData, language: lang })}
                  >
                    {lang === 'en' ? 'English' : lang === 'te' ? 'తెలుగు' : 'हिंदी'}
                  </Button>
                ))}
              </div>
            ) : (
              <p className='text-sm'>
                {user?.language === 'en' ? 'English' : user?.language === 'te' ? 'తెలుగు' : 'हिंदी'}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Settings */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Settings</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center'>
                  <Bell className='h-4 w-4 text-muted-foreground' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Push Notifications</p>
                  <p className='text-xs text-muted-foreground'>Receive weather alerts and reminders</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center'>
                  <BarChart3 className='h-4 w-4 text-muted-foreground' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Dark Mode</p>
                  <p className='text-xs text-muted-foreground'>Toggle dark theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logout */}
      <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
        <Button
          variant='outline'
          className='w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30'
          onClick={handleLogout}
        >
          <LogOut className='h-4 w-4 mr-2' /> Logout
        </Button>
      </motion.div>
    </div>
  );
}

// ============== 5. NOTIFICATIONS PAGE ==============
export function NotificationsPage() {
  const { notifications, markNotificationRead } = useAppStore();

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id);
    });
    toast.success('All notifications marked as read');
  };

  const typeBg = (type: string) => {
    const map: Record<string, string> = {
      info: 'bg-blue-50',
      warning: 'bg-amber-50',
      success: 'bg-emerald-50',
      alert: 'bg-red-50',
    };
    return map[type] || 'bg-gray-50';
  };

  const typeBorder = (type: string) => {
    const map: Record<string, string> = {
      info: 'border-l-blue-500',
      warning: 'border-l-amber-500',
      success: 'border-l-emerald-500',
      alert: 'border-l-red-500',
    };
    return map[type] || 'border-l-gray-500';
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Notifications</h1>
          <p className='text-sm text-muted-foreground mt-1'>Stay updated with your farm alerts</p>
        </div>
        <Button variant='outline' size='sm' onClick={handleMarkAllRead}>
          <Check className='h-4 w-4 mr-1' /> Mark all as read
        </Button>
      </div>

      <Card>
        <CardContent className='p-0'>
          <div className='divide-y max-h-[70vh] overflow-y-auto scrollbar-thin'>
            {notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => !notif.read && markNotificationRead(notif.id)}
                className={cn(
                  'flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 border-l-4',
                  typeBorder(notif.type),
                  !notif.read ? typeBg(notif.type) : 'opacity-60'
                )}
              >
                <div className='text-2xl mt-0.5'>{notif.icon || '🔔'}</div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <h3 className={cn('text-sm font-semibold', !notif.read && 'text-foreground')}>
                      {notif.title}
                    </h3>
                    {!notif.read && <span className='w-2 h-2 rounded-full bg-primary' />}
                  </div>
                  <p className='text-sm text-muted-foreground mt-0.5'>{notif.message}</p>
                  <p className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    {new Date(notif.createdAt).toLocaleString('en-IN', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== 6. FARMER ORDERS PAGE ==============
export function FarmerOrdersPage() {
  const { navigate } = useAppStore();
  const { orders } = useCartStore();
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');
  const displayOrders = tab === 'active' ? activeOrders : completedOrders;

  return (
    <div className='space-y-6'>
      <PageHeader title='My Orders' subtitle={`${orders.length} total orders`} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'completed')}>
        <TabsList>
          <TabsTrigger value='active'>Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value='completed'>Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className='mt-4'>
          {displayOrders.length === 0 ? (
            <Card>
              <CardContent className='py-12 text-center text-muted-foreground'>
                <Package className='h-10 w-10 mx-auto mb-3 opacity-40' />
                <p className='font-medium'>No {tab} orders</p>
                <p className='text-sm mt-1'>Your {tab} orders will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-3'>
              {displayOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card
                    className='hover:shadow-md transition-all cursor-pointer'
                    onClick={() => navigate('marketplace/order-tracking', { orderId: order.id })}
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between mb-2'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='font-semibold text-sm'>{order.id}</p>
                            <Badge className={statusColor(order.status)} variant='secondary'>
                              {statusLabel(order.status)}
                            </Badge>
                          </div>
                          <p className='text-xs text-muted-foreground mt-0.5'>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-bold'>₹{order.total.toLocaleString('en-IN')}</p>
                          <p className='text-xs text-muted-foreground'>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {order.items.map((item) => (
                          <Badge key={item.product.id} variant='outline' className='text-xs'>
                            {item.product.name} × {item.quantity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============== 7. FARMER PAYMENTS PAGE ==============
export function FarmerPaymentsPage() {
  const transactions = [
    { id: 't1', description: 'Payment received for Tomatoes', amount: 12500, date: 'Jan 5, 2025', type: 'credit' as const },
    { id: 't2', description: 'Payment received for Chilli', amount: 8500, date: 'Dec 28, 2024', type: 'credit' as const },
    { id: 't3', description: 'Seed purchase — Tomato Hybrid GT-4', amount: -450, date: 'Dec 15, 2024', type: 'debit' as const },
    { id: 't4', description: 'Payment received for Brinjal', amount: 6200, date: 'Dec 10, 2024', type: 'credit' as const },
    { id: 't5', description: 'Fertilizer purchase — DAP', amount: -1200, date: 'Dec 5, 2024', type: 'debit' as const },
    { id: 't6', description: 'Payment received for Rice', amount: 18000, date: 'Nov 25, 2024', type: 'credit' as const },
  ];

  const handleWithdraw = () => {
    toast.success('Withdrawal request submitted! Amount will be credited in 2-3 business days.');
  };

  return (
    <div className='space-y-6'>
      <PageHeader title='Payments' subtitle='Track your earnings and transactions' />

      {/* Balance Card */}
      <motion.div {...fadeInUp}>
        <Card className='gradient-green text-white border-0'>
          <CardContent className='p-6'>
            <p className='text-white/80 text-sm'>Total Earnings</p>
            <p className='text-4xl font-bold mt-1'>₹45,000</p>
            <p className='text-white/70 text-sm mt-2'>Available for withdrawal</p>
            <div className='flex gap-3 mt-4'>
              <Button
                variant='secondary'
                className='bg-white/20 hover:bg-white/30 text-white border-0'
                onClick={handleWithdraw}
              >
                <CreditCard className='h-4 w-4 mr-2' /> Withdraw
              </Button>
              <Button
                variant='secondary'
                className='bg-white/20 hover:bg-white/30 text-white border-0'
              >
                <BarChart3 className='h-4 w-4 mr-2' /> Statement
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <SectionWrapper title='Recent Transactions' subtitle='Your latest payment activity'>
        <Card>
          <CardContent className='p-0'>
            <div className='divide-y max-h-96 overflow-y-auto scrollbar-thin'>
              {transactions.map((tx, idx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className='flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors'
                >
                  <div className={cn(
                    'p-2 rounded-lg',
                    tx.type === 'credit' ? 'bg-emerald-50' : 'bg-red-50'
                  )}>
                    {tx.type === 'credit'
                      ? <ArrowDownRight className='h-4 w-4 text-emerald-600' />
                      : <ArrowUpRight className='h-4 w-4 text-red-500' />
                    }
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-sm'>{tx.description}</p>
                    <p className='text-xs text-muted-foreground'>{tx.date}</p>
                  </div>
                  <p className={cn(
                    'font-semibold text-sm',
                    tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'
                  )}>
                    {tx.type === 'credit' ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
}

// ============== 8. SOIL HEALTH PAGE ==============
export function SoilHealthPage() {
  const sh = mockSoilHealth;

  return (
    <div className='space-y-6'>
      <PageHeader title='Soil Health' subtitle='Comprehensive analysis of your soil' />

      {/* Score + Grade */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <motion.div {...fadeIn} className='md:col-span-1'>
          <Card className='h-full'>
            <CardContent className='p-6 flex flex-col items-center'>
              <CircularProgress value={sh.score} size={160} strokeWidth={12} label={String(sh.score)} sublabel={sh.grade.toUpperCase()} color={sh.score >= 80 ? '#16a34a' : sh.score >= 60 ? '#f59e0b' : '#ef4444'} />
              <p className='text-sm text-muted-foreground mt-3'>Last tested: {sh.lastTestDate}</p>
              <Badge className='mt-2 bg-emerald-100 text-emerald-700' variant='secondary'>Good Health</Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className='md:col-span-2'>
          <Card className='h-full'>
            <CardHeader><CardTitle className='text-base'>Nutrient Levels</CardTitle></CardHeader>
            <CardContent className='space-y-4'>
              <NutrientBar label='Nitrogen (N)' value={sh.nitrogen.value} status={sh.nitrogen.status} />
              <NutrientBar label='Phosphorus (P)' value={sh.phosphorus.value} status={sh.phosphorus.status} />
              <NutrientBar label='Potassium (K)' value={sh.potassium.value} status={sh.potassium.status} />
              <Separator className='my-2' />
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm'>
                <div><p className='text-muted-foreground'>pH Level</p><p className='font-semibold'>{sh.ph}</p></div>
                <div><p className='text-muted-foreground'>Organic Carbon</p><p className='font-semibold'>{sh.organicCarbon}%</p></div>
                <div><p className='text-muted-foreground'>Moisture</p><p className='font-semibold'>{sh.moisture}%</p></div>
                <div><p className='text-muted-foreground'>Soil Type</p><p className='font-semibold'>Red Sandy</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations & Suitable Crops */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <Card className='h-full'>
            <CardHeader><CardTitle className='text-base'>AI Recommendations</CardTitle></CardHeader>
            <CardContent className='space-y-3'>
              {sh.recommendations.map((rec, i) => (
                <div key={i} className='flex gap-3 items-start'>
                  <div className='size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5'>{i + 1}</div>
                  <p className='text-sm'>{rec}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
          <Card className='h-full'>
            <CardHeader><CardTitle className='text-base'>Recommended Crops</CardTitle></CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {sh.suitableCrops.map((crop) => (
                  <Badge key={crop} variant='secondary' className='text-sm py-1.5 px-3'>{crop}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// ============== 9. CROP RECOMMENDATIONS PAGE ==============
export function CropRecommendationsPage() {
  return (
    <div className='space-y-6'>
      <PageHeader title='Crop Recommendations' subtitle='AI-suggested crops based on your soil, weather & market' />

      <AIInsightCard
        title='AI Crop Advisor'
        message='Recommendations based on your soil health (score: 82), current rabi season, local weather patterns, and real-time market demand analysis.'
        type='info'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {mockCropRecommendations.map((rec, idx) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <Card className='hover:shadow-md transition-all hover:-translate-y-0.5 h-full'>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <span className='text-3xl'>{rec.icon}</span>
                    <div>
                      <CardTitle className='text-base'>{rec.cropName}</CardTitle>
                      <p className='text-xs text-muted-foreground'>{rec.growingDuration} · {rec.season}</p>
                    </div>
                  </div>
                  <Badge className={rec.suitability >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} variant='secondary'>
                    {rec.suitability}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='grid grid-cols-2 gap-2 text-sm'>
                  <div className='p-2 rounded-lg bg-muted/50'><p className='text-xs text-muted-foreground'>Expected Revenue</p><p className='font-semibold'>{rec.expectedRevenue}</p></div>
                  <div className='p-2 rounded-lg bg-muted/50'><p className='text-xs text-muted-foreground'>Expected Yield</p><p className='font-semibold'>{rec.expectedYield}</p></div>
                  <div className='p-2 rounded-lg bg-muted/50'><p className='text-xs text-muted-foreground'>Water Need</p><p className='font-semibold capitalize'>{rec.waterRequirement}</p></div>
                  <div className='p-2 rounded-lg bg-muted/50'><p className='text-xs text-muted-foreground'>Investment</p><p className='font-semibold'>{rec.investment}</p></div>
                </div>
                <div className='space-y-1.5'>
                  <p className='text-xs font-medium text-muted-foreground'>Why this crop?</p>
                  {rec.reasons.slice(0, 2).map((r, i) => (
                    <p key={i} className='text-xs text-muted-foreground flex gap-1.5'><span className='text-primary mt-0.5'>•</span>{r}</p>
                  ))}
                </div>
                <div className='p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'>
                  <p className='text-xs font-medium text-emerald-800 dark:text-emerald-300'>📈 Market: {rec.marketOpportunity}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============== 10. DISEASE DETECTION PAGE ==============
export function DiseaseDetectionPage() {
  const { navigate } = useAppStore();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<typeof mockDiseaseResult | null>(null);

  const handleScan = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult(mockDiseaseResult);
    setScanning(false);
    toast.success('Disease detected successfully!');
  };

  return (
    <div className='space-y-6'>
      <PageHeader title='Disease Detection' subtitle='AI-powered crop disease identification' />

      {/* Scanner Area */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center justify-center min-h-[200px]'>
            {scanning ? (
              <div className='text-center space-y-4'>
                <div className='relative'>
                  <div className='size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin' />
                  <Bug className='size-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                </div>
                <p className='font-medium'>Analyzing crop image...</p>
                <p className='text-sm text-muted-foreground'>AI is checking for diseases and pests</p>
              </div>
            ) : (
              <div className='text-center space-y-4'>
                <div className='size-20 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mx-auto'>
                  <Bug className='size-10 text-orange-500' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg'>Scan Your Crop</h3>
                  <p className='text-sm text-muted-foreground mt-1'>Take a photo of the affected area for instant AI analysis</p>
                </div>
                <Button size='lg' onClick={handleScan} className='rounded-xl'>
                  <Leaf className='h-4 w-4 mr-2' /> Simulate Scan (Demo)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className='border-orange-200 dark:border-orange-800'>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='text-base'>{result.diseaseName}</CardTitle>
                  <p className='text-sm text-muted-foreground'>Detected in {result.cropName}</p>
                </div>
                <Badge className={result.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'} variant='secondary'>
                  {result.severity} · {result.confidence}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sm'>{result.description}</p>
              {result.needsExpertReview && (
                <AIInsightCard title='Expert Review Needed' message='Low confidence detection. An expert will review this case.' type='warning' action='Contact Expert' onAction={() => navigate('farmer/dashboard')} />
              )}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20'>
                  <h4 className='font-semibold text-sm mb-2 text-emerald-800 dark:text-emerald-300'>✅ Recommended Actions</h4>
                  <ul className='space-y-1.5'>{result.recommendedActions.map((a, i) => <li key={i} className='text-sm text-emerald-700 dark:text-emerald-400 flex gap-2'><span>•</span>{a}</li>)}</ul>
                </div>
                <div className='p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20'>
                  <h4 className='font-semibold text-sm mb-2 text-sky-800 dark:text-sky-300'>🛡️ Prevention Tips</h4>
                  <ul className='space-y-1.5'>{result.preventionTips.map((t, i) => <li key={i} className='text-sm text-sky-700 dark:text-sky-400 flex gap-2'><span>•</span>{t}</li>)}</ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ============== 11. FERTILIZER PAGE ==============
export function FertilizerPage() {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const stages = ['all', 'planting', 'vegetative', 'flowering', 'fruiting', 'harvest'];
  const filtered = selectedStage === 'all' ? mockFertilizerRecs : mockFertilizerRecs.filter(f => f.stage === selectedStage);

  const stageColors: Record<string, string> = {
    planting: 'bg-emerald-100 text-emerald-700', vegetative: 'bg-sky-100 text-sky-700',
    flowering: 'bg-violet-100 text-violet-700', fruiting: 'bg-amber-100 text-amber-700',
    harvest: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className='space-y-6'>
      <PageHeader title='Fertilizer Guide' subtitle='AI-recommended fertilizer schedule based on crop stage' />

      <AIInsightCard title='Personalized Schedule' message='Fertilizer recommendations based on your Tomato crop at flowering stage and soil test results (N: low, P: optimal, K: optimal).' type='info' />

      <div className='flex gap-2 flex-wrap'>
        {stages.map(s => (
          <Button key={s} variant={selectedStage === s ? 'default' : 'outline'} size='sm' className='rounded-lg capitalize' onClick={() => setSelectedStage(s)}>
            {s}
          </Button>
        ))}
      </div>

      <div className='space-y-3'>
        {filtered.map((rec, idx) => (
          <motion.div key={rec.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}>
            <Card className='hover:shadow-sm transition-shadow'>
              <CardContent className='p-4'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-center gap-3'>
                    <Badge className={stageColors[rec.stage] || ''} variant='secondary'>{rec.stage}</Badge>
                    <div>
                      <h3 className='font-semibold text-sm'>{rec.nutrient}</h3>
                      <p className='text-xs text-muted-foreground'>{rec.timing}</p>
                    </div>
                  </div>
                  <span className='text-lg font-bold text-primary'>{rec.quantity}</span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
                  <div className='flex items-start gap-2'><span className='text-muted-foreground shrink-0'>Method:</span><span>{rec.applicationMethod}</span></div>
                  <div className='flex items-start gap-2'><span className='text-muted-foreground shrink-0'>Product:</span><span>{rec.product}</span></div>
                </div>
                {rec.warning && (
                  <div className='mt-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm'>
                    ⚠️ {rec.warning}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============== 12. IRRIGATION PAGE ==============
export function IrrigationPage() {
  const ir = mockIrrigationStatus;
  const factorColor = (status: string) => status === 'Critical' || status === 'Low' ? 'text-red-500' : 'text-emerald-500';

  return (
    <div className='space-y-6'>
      <PageHeader title='Smart Irrigation' subtitle='AI-powered irrigation recommendations' />

      {/* Main Status Card */}
      <motion.div {...fadeInUp}>
        <Card className={ir.required ? 'border-primary' : ''}>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className={cn('size-12 rounded-xl flex items-center justify-center', ir.required ? 'bg-sky-100 dark:bg-sky-900/30' : 'bg-muted')}>
                  <Droplets className={cn('size-6', ir.required ? 'text-sky-500' : 'text-muted-foreground')} />
                </div>
                <div>
                  <h2 className='text-lg font-bold'>{ir.required ? 'Irrigation Required Today' : 'No Irrigation Needed'}</h2>
                  <p className='text-sm text-muted-foreground'>Best time: {ir.bestTime}</p>
                </div>
              </div>
              <Badge className={ir.required ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'} variant='secondary'>
                {ir.required ? 'Water Now' : 'Skip Today'}
              </Badge>
            </div>
            {ir.required && (
              <div className='p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 mb-4'>
                <p className='text-sm text-sky-800 dark:text-sky-300'><strong>Recommended:</strong> {ir.recommendedWater} liters via drip irrigation</p>
              </div>
            )}
            <p className='text-sm text-muted-foreground leading-relaxed'>{ir.aiExplanation}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Factors Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {Object.entries(ir.factors).map(([key, factor], idx) => {
          const labels: Record<string, string> = { soilMoisture: 'Soil Moisture', temperature: 'Temperature', rainProbability: 'Rain Probability', cropStage: 'Crop Stage' };
          const units: Record<string, string> = { soilMoisture: '%', temperature: '°C', rainProbability: '%', cropStage: '' };
          return (
            <motion.div key={key} {...fadeIn} transition={{ delay: idx * 0.05 }}>
              <Card>
                <CardContent className='p-4 text-center'>
                  <p className='text-xs text-muted-foreground'>{labels[key]}</p>
                  <p className='text-2xl font-bold mt-1'>{factor.value}{units[key]}</p>
                  <p className={cn('text-xs font-medium mt-1', factorColor(factor.status))}>{factor.status}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============== 13. WEATHER PAGE ==============
export function WeatherPage() {
  const w = mockWeather;
  const forecast = mockForecast;

  return (
    <div className='space-y-6'>
      <PageHeader title='Weather Intelligence' subtitle={`Hyperlocal weather for ${w.location}`} />

      {/* Current Weather */}
      <motion.div {...fadeInUp}>
        <Card className='gradient-green text-white border-0'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-white/80'>Current Weather</p>
                <p className='text-5xl font-bold mt-1'>{w.temperature}°C</p>
                <p className='text-white/90 mt-1'>{w.condition} · Feels like {w.feelsLike}°C</p>
                <p className='text-white/70 text-sm mt-2'>{w.location}</p>
              </div>
              <div className='text-7xl'>{w.icon}</div>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20'>
              <div><p className='text-white/60 text-xs'>Humidity</p><p className='font-semibold'>{w.humidity}%</p></div>
              <div><p className='text-white/60 text-xs'>Wind</p><p className='font-semibold'>{w.windSpeed} km/h {w.windDirection}</p></div>
              <div><p className='text-white/60 text-xs'>Rain Chance</p><p className='font-semibold'>{w.rainProbability}%</p></div>
              <div><p className='text-white/60 text-xs'>UV Index</p><p className='font-semibold'>{w.uvIndex}</p></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 7-Day Forecast */}
      <SectionWrapper title='7-Day Forecast'>
        <Card>
          <CardContent className='p-0'>
            <div className='divide-y'>
              {forecast.map((day, idx) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn('flex items-center gap-4 p-4', day.farmingAlert && 'bg-amber-50 dark:bg-amber-900/10')}
                >
                  <span className='text-2xl w-10 text-center'>{day.icon}</span>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-sm'>{day.day}</p>
                    <p className='text-xs text-muted-foreground'>{day.condition}</p>
                    {day.farmingAlert && <p className='text-xs text-amber-700 dark:text-amber-400 mt-0.5'>⚠️ {day.farmingAlert}</p>}
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold'>{day.high}° <span className='text-muted-foreground font-normal'>{day.low}°</span></p>
                    <p className='text-xs text-muted-foreground'>🌧 {day.rainProbability}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
}

// ============== 14. MARKET PRICES PAGE ==============
export function MarketPricesPage() {
  const prediction = mockMarketPrediction;
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const chartData = priceHistory[selectedCrop as keyof typeof priceHistory] || priceHistory.tomato;

  return (
    <div className='space-y-6'>
      <PageHeader title='Market Prices' subtitle='Real-time prices from nearby agricultural markets' />

      {/* AI Prediction */}
      <AIInsightCard
        title='AI Price Prediction'
        message={prediction.outlook}
        type={prediction.direction === 'up' ? 'success' : prediction.direction === 'down' ? 'alert' : 'info'}
      />

      {/* Price Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        {mockMarketPrices.map(mp => (
          <MarketPriceCard key={mp.crop} crop={mp.crop} price={mp.price} unit={mp.unit} change={mp.change} changePercent={mp.changePercent} />
        ))}
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-base'>Price Trends</CardTitle>
          <div className='flex gap-2'>
            {Object.keys(priceHistory).map(crop => (
              <Button key={crop} variant={selectedCrop === crop ? 'default' : 'outline'} size='sm' className='rounded-lg capitalize text-xs' onClick={() => setSelectedCrop(crop)}>
                {crop}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-[280px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis dataKey='week' className='text-xs' />
                <YAxis className='text-xs' />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey='price' name='Price (₹/kg)' fill='#16a34a' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== 15. SELL PRODUCTS PAGE ==============
export function SellPage() {
  const { navigate } = useAppStore();
  const products = [
    { name: 'Tomato', icon: '🍅', quantity: '500 kg', price: '₹28/kg', status: 'Ready to sell' },
    { name: 'Chilli', icon: '🌶️', quantity: '200 kg', price: '₹180/kg', status: 'Harvesting' },
    { name: 'Rice (Paddy)', icon: '🌾', quantity: '1200 kg', price: '₹32/kg', status: 'Growing' },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader title='Sell Products' subtitle='List your produce for sale on KrishiAI marketplace' />

      <AIInsightCard title='Market Insight' message='Tomato prices are up 8% today. Great time to list your tomatoes for sale!' type='success' action='View prices' onAction={() => navigate('farmer/market-prices')} />

      {/* My Produce */}
      <SectionWrapper title='My Produce' subtitle='Your harvest ready for listing'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {products.map((p, idx) => (
            <motion.div key={p.name} {...fadeIn} transition={{ delay: idx * 0.1 }}>
              <Card className='hover:shadow-md transition-all h-full'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3 mb-3'>
                    <span className='text-3xl'>{p.icon}</span>
                    <div><h3 className='font-semibold'>{p.name}</h3><p className='text-sm text-muted-foreground'>{p.quantity}</p></div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='font-bold text-primary'>{p.price}</span>
                    <Badge variant='secondary' className={p.status === 'Ready to sell' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>{p.status}</Badge>
                  </div>
                  {p.status === 'Ready to sell' && (
                    <Button className='w-full mt-3' size='sm' onClick={() => toast.success('Product listed on marketplace!')}>
                      <ShoppingCart className='h-4 w-4 mr-1' /> List on Marketplace
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Sell to Collection Center */}
      <SectionWrapper title='Sell to Collection Centers' action={<Button variant='outline' size='sm' onClick={() => navigate('farmer/collection-centers')}>View all <ChevronRight className='h-4 w-4 ml-1' /></Button>}>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-4'>
              <div className='size-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center'><MapPin className='size-6 text-sky-600' /></div>
              <div className='flex-1'>
                <h3 className='font-semibold text-sm'>GreenAgri Collection Center</h3>
                <p className='text-xs text-muted-foreground'>4.2 km away · Accepts Tomato, Chilli, Onion, Brinjal</p>
              </div>
              <Button size='sm' onClick={() => navigate('farmer/collection-centers')}>Sell Here</Button>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
}

// ============== 16. COLLECTION CENTERS PAGE ==============
export function CollectionCentersPage() {
  const centers = mockCollectionCenters;

  return (
    <div className='space-y-6'>
      <PageHeader title='Collection Centers' subtitle='Nearby centers to sell your produce' />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {centers.map((center, idx) => (
          <motion.div key={center.id} {...fadeIn} transition={{ delay: idx * 0.1 }}>
            <Card className='hover:shadow-md transition-all h-full'>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className={cn('size-10 rounded-xl flex items-center justify-center', center.isOpen ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30')}>
                      <Building2Icon className={cn('size-5', center.isOpen ? 'text-emerald-600' : 'text-red-500')} />
                    </div>
                    <div>
                      <CardTitle className='text-base'>{center.name}</CardTitle>
                      <p className='text-xs text-muted-foreground'>{center.address}</p>
                    </div>
                  </div>
                  <Badge variant='secondary' className={center.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                    {center.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='grid grid-cols-3 gap-2 text-sm'>
                  <div className='p-2 rounded-lg bg-muted/50 text-center'><p className='text-xs text-muted-foreground'>Distance</p><p className='font-semibold'>{center.distance} km</p></div>
                  <div className='p-2 rounded-lg bg-muted/50 text-center'><p className='text-xs text-muted-foreground'>Capacity</p><p className='font-semibold'>{center.currentCapacity}/{center.maxCapacity}</p></div>
                  <div className='p-2 rounded-lg bg-muted/50 text-center'><p className='text-xs text-muted-foreground'>Hours</p><p className='font-semibold text-xs'>{center.operatingHours.split(' - ')[0]}</p></div>
                </div>
                <div className='flex flex-wrap gap-1.5'>
                  {center.acceptedCrops.map(crop => <Badge key={crop} variant='outline' className='text-xs'>{crop}</Badge>)}
                </div>
                <div className='flex items-center justify-between pt-2'>
                  <p className='text-xs text-muted-foreground'>📞 {center.phone}</p>
                  <Button size='sm' disabled={!center.isOpen} onClick={() => toast.success('Directions to collection center coming soon!')}>Get Directions</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Placeholder Building2 icon for collection centers page
function Building2Icon({ className }: { className?: string }) {
  return <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={className}><path d='M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z' /><path d='M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2' /><path d='M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2' /><path d='M10 6h4' /><path d='M10 10h4' /><path d='M10 14h4' /><path d='M10 18h4' /></svg>;
}
