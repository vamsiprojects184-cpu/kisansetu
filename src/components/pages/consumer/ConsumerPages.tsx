'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Search, ChevronRight, Package, MapPin, Phone,
  Mail, LogOut, Globe, Bell, Plus, Truck, Clock, User, Leaf,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useAppStore } from '@/store/use-app-store';
import { useAuthStore } from '@/store/use-auth-store';
import { useCartStore } from '@/store/use-cart-store';
import { mockConsumerProducts } from '@/data/mock-data';
import {
  PageHeader, StatCard, fadeIn, fadeInUp, staggerContainer,
  SectionWrapper, EmptyState,
} from '@/components/shared/SharedComponents';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const statusColor = (s: OrderStatus) =>
  ({ placed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', preparing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', quality_verified: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', out_for_delivery: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' }[s] || 'bg-gray-100 text-gray-700');

const spendingData = [
  { month: 'Aug', amount: 2400 },
  { month: 'Sep', amount: 1800 },
  { month: 'Oct', amount: 3200 },
  { month: 'Nov', amount: 2600 },
  { month: 'Dec', amount: 2900 },
  { month: 'Jan', amount: 3400 },
];

const categories = [
  { name: 'Vegetables', emoji: '🥬', count: 24, tint: 'bg-green-50 dark:bg-green-950/40 border-green-200/60 dark:border-green-800/40' },
  { name: 'Grains', emoji: '🌾', count: 18, tint: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40' },
  { name: 'Spices', emoji: '🌶️', count: 15, tint: 'bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-800/40' },
  { name: 'Dairy', emoji: '🥛', count: 12, tint: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-800/40' },
  { name: 'Fruits', emoji: '🍎', count: 20, tint: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/40' },
  { name: 'Organic', emoji: '🌱', count: 16, tint: 'bg-lime-50 dark:bg-lime-950/40 border-lime-200/60 dark:border-lime-800/40' },
];

const trackingSteps = [
  { label: 'Placed', key: 'placed' as OrderStatus },
  { label: 'Verified', key: 'quality_verified' as OrderStatus },
  { label: 'Preparing', key: 'preparing' as OrderStatus },
  { label: 'Delivered', key: 'delivered' as OrderStatus },
];

const statusStepIndex: Record<string, number> = {
  placed: 0,
  quality_verified: 1,
  preparing: 2,
  out_for_delivery: 3,
  delivered: 4,
};

// ============== CONSUMER DASHBOARD ==============
export function ConsumerDashboard() {
  const { navigate } = useAppStore();
  const { orders, addToCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const recentOrders = orders.slice(0, 2);
  const trackingOrder = activeOrders[0] || null;
  const currentStepIndex = trackingOrder ? (statusStepIndex[trackingOrder.status] ?? 0) : -1;

  const filteredProducts = mockConsumerProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  const handleAddToCart = (product: typeof mockConsumerProducts[0]) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className='space-y-6'>
      {/* 1. Welcome Banner */}
      <motion.div {...fadeInUp}>
        <Card className='bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <Avatar className='size-14 ring-2 ring-white/30'>
                <AvatarFallback className='bg-white/20 text-white text-xl font-bold'>PS</AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <h1 className='text-2xl font-bold'>Welcome back, Priya 👋</h1>
                  <Badge className='bg-white/20 text-white border-white/30 hover:bg-white/30'>Consumer</Badge>
                </div>
                <p className='text-white/80 text-sm mt-1'>Fresh farm produce delivered to your doorstep.</p>
              </div>
              <div className='hidden sm:block text-5xl'>🛒</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Row + Savings Badge */}
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
        <StatCard
          title='Total Orders' value={orders.length} subtitle='All time'
          icon={<Package className='size-5' />}
          trend={{ value: 18, isPositive: true }}
          onClick={() => navigate('consumer/orders')}
        />
        <StatCard
          title='Active Orders' value={activeOrders.length} subtitle='In progress'
          icon={<Truck className='size-5' />}
        />
        <StatCard
          title='Cart Items' value={useCartStore.getState().getItemCount()} subtitle='Ready to checkout'
          icon={<ShoppingCart className='size-5' />}
          onClick={() => navigate('marketplace/cart')}
        />
        {/* 5. Savings Badge */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
          <Card className='bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 backdrop-blur-sm hover:shadow-md transition-all hover:-translate-y-0.5'>
            <CardContent className='p-4 flex items-center gap-3'>
              <div className='text-3xl'>🐷</div>
              <div>
                <p className='text-xs text-emerald-600 dark:text-emerald-400 font-medium'>Monthly Savings</p>
                <p className='text-lg font-bold text-emerald-700 dark:text-emerald-300'>₹420 saved!</p>
              </div>
              <Leaf className='size-5 text-emerald-500 ml-auto' />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 2. Spending Overview Chart */}
      <motion.div {...fadeInUp} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={spendingData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id='spendGradient' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stopColor='#22c55e' stopOpacity={0.3} />
                      <stop offset='100%' stopColor='#22c55e' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                  <XAxis dataKey='month' className='text-xs' tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis className='text-xs' tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <Area type='monotone' dataKey='amount' stroke='#22c55e' strokeWidth={2.5} fill='url(#spendGradient)' />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3. Category Browse */}
      <SectionWrapper title='Browse Categories' subtitle='Shop by category'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              {...fadeIn}
              transition={{ delay: idx * 0.06 }}
            >
              <Card
                className={cn(
                  'cursor-pointer hover-lift rounded-xl border',
                  cat.tint,
                )}
                onClick={() => navigate('marketplace/home')}
              >
                <CardContent className='p-5 flex flex-col items-center text-center gap-2'>
                  <span className='text-5xl'>{cat.emoji}</span>
                  <h3 className='font-semibold'>{cat.name}</h3>
                  <Badge variant='secondary' className='text-xs'>
                    {cat.count} products
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* 4. Order Tracking Widget + Recent Orders side by side on desktop */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Order Tracking Widget */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {trackingOrder ? (
                <>
                  <p className='text-sm text-muted-foreground mb-1'>Order #{trackingOrder.id}</p>
                  <p className='text-xs text-muted-foreground mb-5'>
                    Est. delivery: {trackingOrder.estimatedDelivery
                      ? new Date(trackingOrder.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                      : 'Soon'}
                  </p>
                  <div className='flex items-center justify-between relative'>
                    {/* Connecting line background */}
                    <div className='absolute top-3.5 left-6 right-6 h-0.5 bg-muted z-0' />
                    {/* Connecting line filled */}
                    <div
                      className='absolute top-3.5 left-6 h-0.5 bg-emerald-500 z-0 transition-all duration-500'
                      style={{ width: currentStepIndex >= 0 ? `${(currentStepIndex / (trackingSteps.length - 1)) * (100 - 12)}%` : '0%' }}
                    />
                    {trackingSteps.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div key={step.key} className='flex flex-col items-center relative z-10'>
                          <div
                            className={cn(
                              'size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                              isCompleted && 'bg-emerald-500 text-white',
                              isCurrent && 'bg-emerald-500 text-white ring-4 ring-emerald-500/20',
                              !isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
                            )}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <p className={cn(
                            'text-[11px] mt-1.5 font-medium',
                            (isCompleted || isCurrent) ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
                          )}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    size='sm'
                    className='w-full mt-5'
                    variant='outline'
                    onClick={() => navigate('marketplace/order-tracking', { orderId: trackingOrder.id })}
                  >
                    <Truck className='size-4 mr-1.5' /> Track Order
                  </Button>
                </>
              ) : (
                <div className='flex flex-col items-center py-6 text-center'>
                  <Package className='size-10 text-muted-foreground/40 mb-2' />
                  <p className='text-sm text-muted-foreground'>No active orders to track</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        <motion.div {...fadeInUp} transition={{ delay: 0.25 }}>
          <Card className='h-full'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-base'>Recent Orders</CardTitle>
                <Button variant='ghost' size='sm' className='text-primary h-7' onClick={() => navigate('consumer/orders')}>
                  View all <ChevronRight className='h-4 w-4 ml-1' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {recentOrders.length === 0 ? (
                  <EmptyState icon='📦' title='No orders yet' description='Your orders will appear here' />
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className='flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer'
                      onClick={() => navigate('marketplace/order-tracking', { orderId: order.id })}
                    >
                      <div className='w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-lg shrink-0'>
                        {order.status === 'delivered' ? '✅' : order.status === 'cancelled' ? '❌' : '📦'}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-sm truncate'>{order.id}</p>
                        <p className='text-xs text-muted-foreground'>
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className='text-right shrink-0'>
                        <p className='font-semibold text-sm'>₹{order.total.toLocaleString('en-IN')}</p>
                        <Badge className={cn('text-[10px] px-1.5 py-0', statusColor(order.status))} variant='secondary'>
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Product Search (kept for existing functionality) */}
      <SectionWrapper title='Quick Shop' subtitle='Search and add products to cart'>
        <div className='mb-4 relative max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='Search for products...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {filteredProducts.map((p, idx) => (
            <motion.div key={p.id} {...fadeIn} transition={{ delay: idx * 0.08 }}>
              <Card className='h-full hover:shadow-md transition-all hover:-translate-y-0.5'>
                <CardContent className='p-4 flex flex-col h-full'>
                  <div className='aspect-square rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-900/30 flex items-center justify-center text-4xl mb-3'>
                    {p.category === 'Vegetables' ? '🥬' : p.category === 'Grains' ? '🌾' : p.category === 'Spices' ? '🌶️' : p.category === 'Dairy' ? '🥚' : '📦'}
                  </div>
                  <h3 className='font-semibold text-sm truncate'>{p.name}</h3>
                  {p.farmer && (
                    <p className='text-xs text-muted-foreground mt-0.5 flex items-center gap-1'>
                      🌾 {p.farmer}
                    </p>
                  )}
                  <div className='flex items-center gap-1 mt-auto pt-3'>
                    <span className='text-lg font-bold text-emerald-700 dark:text-emerald-400'>
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span className='text-xs text-muted-foreground'>/{p.unit}</span>
                  </div>
                  <Button
                    size='sm'
                    className='w-full mt-2'
                    onClick={() => handleAddToCart(p)}
                  >
                    <Plus className='size-4 mr-1' /> Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <EmptyState
            icon='🔍'
            title='No products found'
            description='Try a different search term'
          />
        )}
      </SectionWrapper>
    </div>
  );
}

// ============== CONSUMER ORDERS ==============
export function ConsumerOrdersPage() {
  const { navigate } = useAppStore();
  const { orders } = useCartStore();
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const deliveredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  return (
    <div className='space-y-6'>
      <PageHeader title='My Orders' subtitle={`${orders.length} total orders`} />

      <Tabs defaultValue='active' className='w-full'>
        <TabsList>
          <TabsTrigger value='active'>
            Active ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value='delivered'>
            Delivered ({deliveredOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='active' className='mt-4'>
          <motion.div {...staggerContainer.animate} className='space-y-3'>
            {activeOrders.length === 0 ? (
              <EmptyState
                icon='📦'
                title='No active orders'
                description='Your active orders will appear here'
              />
            ) : (
              activeOrders.map((order, idx) => (
                <motion.div key={order.id} {...fadeIn} transition={{ delay: idx * 0.05 }}>
                  <Card
                    className='hover:shadow-sm transition-all cursor-pointer'
                    onClick={() => navigate('marketplace/order-tracking', { orderId: order.id })}
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='font-semibold text-sm'>{order.id}</p>
                            <Badge className={statusColor(order.status)} variant='secondary'>
                              {order.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <p className='text-xs text-muted-foreground mt-0.5'>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-bold'>₹{order.total.toLocaleString('en-IN')}</p>
                          {order.estimatedDelivery && (
                            <p className='text-xs text-muted-foreground'>
                              Est. {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='flex flex-wrap gap-1.5 mb-2'>
                        {order.items.map(i => (
                          <Badge key={i.product.id} variant='outline' className='text-xs'>
                            {i.product.name} × {i.quantity}
                          </Badge>
                        ))}
                      </div>
                      <div className='flex items-center justify-end text-primary text-xs font-medium'>
                        View details <ChevronRight className='size-3 ml-1' />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value='delivered' className='mt-4'>
          <motion.div {...staggerContainer.animate} className='space-y-3'>
            {deliveredOrders.length === 0 ? (
              <EmptyState
                icon='✅'
                title='No delivered orders yet'
                description='Your completed orders will show here'
              />
            ) : (
              deliveredOrders.map((order, idx) => (
                <motion.div key={order.id} {...fadeIn} transition={{ delay: idx * 0.05 }}>
                  <Card
                    className='hover:shadow-sm transition-all cursor-pointer'
                    onClick={() => navigate('marketplace/order-tracking', { orderId: order.id })}
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='font-semibold text-sm'>{order.id}</p>
                            <Badge className={statusColor(order.status)} variant='secondary'>
                              {order.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <p className='text-xs text-muted-foreground mt-0.5'>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <p className='font-bold'>₹{order.total.toLocaleString('en-IN')}</p>
                      </div>
                      <div className='flex flex-wrap gap-1.5'>
                        {order.items.map(i => (
                          <Badge key={i.product.id} variant='outline' className='text-xs'>
                            {i.product.name} × {i.quantity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============== CONSUMER PROFILE ==============
export function ConsumerProfilePage() {
  const { user, logout } = useAuthStore();
  const [emailNotif, setEmailNotif] = useState(true);
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className='space-y-6 max-w-2xl'>
      <PageHeader title='Profile' subtitle='Manage your account settings' />

      <motion.div {...fadeIn}>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg'>
                {user?.name?.charAt(0) || 'P'}
              </div>
              <div className='flex-1'>
                <h2 className='text-xl font-bold'>{user?.name || 'Priya Sharma'}</h2>
                <p className='text-sm text-muted-foreground'>Consumer</p>
              </div>
              <Button variant='outline' size='sm'>
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center'>
                <Mail className='size-5 text-emerald-600' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Email</p>
                <p className='text-sm font-medium'>{user?.email || 'priya@gmail.com'}</p>
              </div>
            </div>
            <Separator />
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center'>
                <Phone className='size-5 text-emerald-600' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Phone</p>
                <p className='text-sm font-medium'>{user?.phone || '+91 9123456789'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Delivery Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-start gap-3 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20'>
              <MapPin className='size-5 text-emerald-600 mt-0.5 shrink-0' />
              <div className='flex-1'>
                <p className='font-medium text-sm'>Home</p>
                <p className='text-sm text-muted-foreground mt-0.5'>
                  Flat 302, Green Towers, Madhapur, Hyderabad, Telangana 500081
                </p>
              </div>
              <Badge variant='secondary' className='bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'>
                Default
              </Badge>
            </div>
            <Button variant='outline' size='sm' className='mt-3'>
              <Plus className='size-4 mr-1' /> Add New Address
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Preferences</CardTitle>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Globe className='size-5 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Language</p>
                  <p className='text-xs text-muted-foreground'>Choose your preferred language</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className='rounded-lg border border-input bg-background px-3 py-1.5 text-sm'
              >
                <option value='English'>English</option>
                <option value='Telugu'>తెలుగు</option>
                <option value='Hindi'>हिन्दी</option>
              </select>
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Bell className='size-5 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Email Notifications</p>
                  <p className='text-xs text-muted-foreground'>Receive order updates via email</p>
                </div>
              </div>
              <Switch
                checked={emailNotif}
                onCheckedChange={setEmailNotif}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
        <Button
          variant='outline'
          className='w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30'
          onClick={handleLogout}
        >
          <LogOut className='h-4 w-4 mr-2' />
          Logout
        </Button>
      </motion.div>
    </div>
  );
}
