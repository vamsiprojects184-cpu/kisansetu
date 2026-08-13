'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Search, ChevronRight, Package, MapPin, Phone,
  Mail, LogOut, Globe, Bell, Plus, Truck, Clock, User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
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

// ============== CONSUMER DASHBOARD ==============
export function ConsumerDashboard() {
  const { navigate } = useAppStore();
  const { orders, addToCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const recentOrders = orders.slice(0, 2);

  const filteredProducts = mockConsumerProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  const handleAddToCart = (product: typeof mockConsumerProducts[0]) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className='space-y-6'>
      <motion.div {...fadeInUp}>
        <h1 className='text-2xl font-bold tracking-tight'>Welcome back, Priya 👋</h1>
        <p className='text-muted-foreground mt-1'>Fresh farm produce delivered to your doorstep.</p>
      </motion.div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
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
      </div>

      <SectionWrapper title='Fresh Picks' subtitle='Handpicked products just for you'>
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

      <SectionWrapper
        title='Your Orders'
        subtitle={`${orders.length} orders placed`}
        action={
          <Button variant='ghost' size='sm' className='text-primary' onClick={() => navigate('consumer/orders')}>
            View all <ChevronRight className='h-4 w-4 ml-1' />
          </Button>
        }
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {recentOrders.map((order, idx) => (
            <motion.div key={order.id} {...fadeIn} transition={{ delay: idx * 0.1 }}>
              <Card
                className='hover:shadow-sm transition-all cursor-pointer'
                onClick={() => navigate('marketplace/order-tracking', { orderId: order.id })}
              >
                <CardContent className='p-4'>
                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <p className='font-semibold text-sm'>{order.id}</p>
                      <p className='text-xs text-muted-foreground'>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge className={statusColor(order.status)} variant='secondary'>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className='flex flex-wrap gap-1.5 mb-2'>
                    {order.items.map(i => (
                      <Badge key={i.product.id} variant='outline' className='text-xs'>
                        {i.product.name} × {i.quantity}
                      </Badge>
                    ))}
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='font-bold text-sm'>₹{order.total.toLocaleString('en-IN')}</p>
                    <span className='text-primary text-xs font-medium flex items-center gap-0.5'>
                      Track <ChevronRight className='size-3' />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
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
