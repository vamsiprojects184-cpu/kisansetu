'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Tractor, Package, ShoppingCart, Building2, TrendingUp,
  Bug, DollarSign, ArrowUpRight, ArrowDownRight, Search, BarChart3, MapPin,
  Star, Eye, Shield, Activity, AlertTriangle, Info,
  ChevronLeft, ChevronRight, Server, Zap, Repeat,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  mockAdminStats, mockCollectionCenters, mockConsumerProducts,
  mockSeedProducts, mockQualityChecks, mockDiseaseCases,
} from '@/data/mock-data';
import {
  PageHeader, StatCard, fadeIn, fadeInUp, staggerContainer,
  SectionWrapper,
} from '@/components/shared/SharedComponents';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
  AreaChart, Area, ReferenceLine,
} from 'recharts';
import { cn } from '@/lib/utils';

// ============== ADMIN DASHBOARD ==============
export function AdminDashboard() {
  const s = mockAdminStats;

  const chartData = [
    { month: 'Jul', users: 5200, farmers: 1800 },
    { month: 'Aug', users: 5800, farmers: 2050 },
    { month: 'Sep', users: 6500, farmers: 2200 },
    { month: 'Oct', users: 7200, farmers: 2400 },
    { month: 'Nov', users: 8100, farmers: 2600 },
    { month: 'Dec', users: 8934, farmers: 2847 },
  ];

  const recentActivity = [
    { id: 1, text: 'New farmer Vamsi Krishna registered', time: '5 min ago', icon: '👨‍🌾', type: 'info' },
    { id: 2, text: 'Order #ORD-2025-015 delivered successfully', time: '15 min ago', icon: '✅', type: 'success' },
    { id: 3, text: '3 new disease cases submitted for review', time: '1 hour ago', icon: '🔬', type: 'warning' },
    { id: 4, text: 'Collection Center Warangal reached 80% capacity', time: '2 hours ago', icon: '📦', type: 'alert' },
    { id: 5, text: 'Monthly revenue report generated', time: '3 hours ago', icon: '📊', type: 'info' },
  ];

  const alerts = [
    { id: 1, title: 'High pending payouts', message: '₹1.2L in pending farmer payouts need attention', severity: 'warning' },
    { id: 2, title: 'Server load alert', message: 'Platform load at 85% capacity during peak hours', severity: 'alert' },
    { id: 3, title: 'New feature deployed', message: 'AI disease detection v2.1 is now live', severity: 'info' },
  ];

  const severityBg = (s: string) =>
    ({ warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800', alert: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800', info: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800' }[s] || 'bg-gray-50 border-gray-200');

  return (
    <div className='space-y-6'>
      <motion.div {...fadeInUp}>
        <h1 className='text-2xl font-bold tracking-tight'>Admin Dashboard</h1>
        <p className='text-muted-foreground mt-1'>Platform overview and management</p>
      </motion.div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard title='Total Farmers' value={s.totalFarmers.toLocaleString()} icon={<Tractor className='size-5' />} trend={{ value: s.growth.farmers, isPositive: true }} />
        <StatCard title='Active Farms' value={s.activeFarms.toLocaleString()} icon={<Building2 className='size-5' />} trend={{ value: 8, isPositive: true }} />
        <StatCard title='Total Orders' value={s.totalOrders.toLocaleString()} icon={<ShoppingCart className='size-5' />} trend={{ value: s.growth.orders, isPositive: true }} />
        <StatCard title='Revenue' value={`₹${(s.revenue / 100000).toFixed(1)}L`} icon={<DollarSign className='size-5' />} trend={{ value: s.growth.revenue, isPositive: true }} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Monthly User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis dataKey='month' className='text-xs' />
                <YAxis className='text-xs' />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey='farmers' name='Farmers' fill='#16a34a' radius={[4, 4, 0, 0]} />
                <Bar dataKey='users' name='Total Users' fill='#f59e0b' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='text-base'>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='divide-y'>
              {recentActivity.map((activity, idx) => (
                <motion.div key={activity.id} {...fadeIn} transition={{ delay: idx * 0.05 }} className='flex items-center gap-3 p-3 px-4'>
                  <span className='text-lg'>{activity.icon}</span>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm'>{activity.text}</p>
                  </div>
                  <span className='text-xs text-muted-foreground shrink-0'>{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Alerts</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {alerts.map(alert => (
              <div key={alert.id} className={cn('rounded-xl border p-3', severityBg(alert.severity))}>
                <div className='flex items-start gap-2'>
                  {alert.severity === 'warning' && <AlertTriangle className='size-4 text-amber-600 mt-0.5 shrink-0' />}
                  {alert.severity === 'alert' && <AlertTriangle className='size-4 text-red-600 mt-0.5 shrink-0' />}
                  {alert.severity === 'info' && <Info className='size-4 text-emerald-600 mt-0.5 shrink-0' />}
                  <div>
                    <p className='text-sm font-medium'>{alert.title}</p>
                    <p className='text-xs mt-0.5 opacity-80'>{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============== ADMIN USERS ==============
export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const users = [
    { id: 'u1', name: 'Vamsi Krishna', email: 'vamsi@farm.ai', role: 'Farmer', status: 'active', joined: 'Jun 15, 2024' },
    { id: 'u2', name: 'Priya Sharma', email: 'priya@gmail.com', role: 'Consumer', status: 'active', joined: 'Sep 1, 2024' },
    { id: 'u3', name: 'Rajesh Kumar', email: 'rajesh@greenagri.in', role: 'Collection Center', status: 'active', joined: 'Mar 10, 2024' },
    { id: 'u4', name: 'Dr. Anitha Reddy', email: 'anitha@agri-expert.in', role: 'Expert', status: 'active', joined: 'Jan 20, 2024' },
    { id: 'u5', name: 'Ramesh Reddy', email: 'ramesh@farm.in', role: 'Farmer', status: 'inactive', joined: 'Aug 22, 2024' },
    { id: 'u6', name: 'Lakshmi Devi', email: 'lakshmi@farm.in', role: 'Farmer', status: 'active', joined: 'Jul 5, 2024' },
    { id: 'u7', name: 'Rahul Verma', email: 'rahul@gmail.com', role: 'Consumer', status: 'active', joined: 'Oct 12, 2024' },
    { id: 'u8', name: 'Suresh Babu', email: 'suresh@farm.in', role: 'Farmer', status: 'active', joined: 'Nov 3, 2024' },
  ];

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const roleColor = (r: string) =>
    ({ Farmer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', Consumer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', 'Collection Center': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', Expert: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' }[r] || 'bg-gray-100 text-gray-700');

  return (
    <div className='space-y-6'>
      <PageHeader title='All Users' subtitle={`${users.length} registered users`} />

      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input placeholder='Search by name or email...' value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className='pl-10' />
        </div>
        <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Roles</SelectItem>
            <SelectItem value='farmer'>Farmer</SelectItem>
            <SelectItem value='consumer'>Consumer</SelectItem>
            <SelectItem value='collection center'>Collection Center</SelectItem>
            <SelectItem value='expert'>Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className='hidden sm:table-cell'>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='hidden md:table-cell'>Joined</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((u, idx) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs'>
                        {u.name.charAt(0)}
                      </div>
                      <span className='font-medium text-sm'>{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-muted-foreground text-sm'>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant='secondary' className={roleColor(u.role)}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary' className={u.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='hidden md:table-cell text-muted-foreground text-sm'>{u.joined}</TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='sm' onClick={() => toast.info(`Viewing ${u.name}`)}>
                      <Eye className='size-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          <Button variant='outline' size='sm' disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            <ChevronLeft className='size-4' />
          </Button>
          <span className='text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </span>
          <Button variant='outline' size='sm' disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            <ChevronRight className='size-4' />
          </Button>
        </div>
      )}
    </div>
  );
}

// ============== ADMIN FARMERS ==============
export function AdminFarmers() {
  const [searchQuery, setSearchQuery] = useState('');

  const farmers = [
    { id: 'f1', name: 'Vamsi Krishna', location: 'Siddipet, Telangana', farmCount: 2, soilScore: 82, crops: 'Tomato, Rice', status: 'active' },
    { id: 'f2', name: 'Ramesh Reddy', location: 'Warangal, Telangana', farmCount: 1, soilScore: 71, crops: 'Chilli', status: 'active' },
    { id: 'f3', name: 'Lakshmi Devi', location: 'Karimnagar, Telangana', farmCount: 2, soilScore: 88, crops: 'Cotton, Maize', status: 'active' },
    { id: 'f4', name: 'Suresh Babu', location: 'Adilabad, Telangana', farmCount: 1, soilScore: 65, crops: 'Onion', status: 'inactive' },
    { id: 'f5', name: 'Anita Reddy', location: 'Nizamabad, Telangana', farmCount: 3, soilScore: 91, crops: 'Rice, Tomato', status: 'active' },
    { id: 'f6', name: 'Krishna Murthy', location: 'Khammam, Telangana', farmCount: 1, soilScore: 76, crops: 'Cotton', status: 'active' },
  ];

  const filtered = farmers.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const soilColor = (score: number) =>
    score >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    : score >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';

  return (
    <div className='space-y-6'>
      <PageHeader title='All Farmers' subtitle={`${farmers.length} registered farmers`} />

      <div className='relative max-w-sm'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input placeholder='Search farmers...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
      </div>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className='hidden sm:table-cell'>Location</TableHead>
                <TableHead>Farms</TableHead>
                <TableHead>Soil Score</TableHead>
                <TableHead className='hidden md:table-cell'>Crops</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f, idx) => (
                <motion.tr key={f.id} {...fadeIn} transition={{ delay: idx * 0.03 }}>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-xs font-semibold'>
                        {f.name.charAt(0)}
                      </div>
                      <span className='font-medium text-sm'>{f.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-muted-foreground text-sm'>{f.location}</TableCell>
                  <TableCell className='text-sm'>{f.farmCount}</TableCell>
                  <TableCell>
                    <Badge variant='secondary' className={soilColor(f.soilScore)}>
                      {f.soilScore}
                    </Badge>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='flex gap-1 flex-wrap'>
                      {f.crops.split(', ').map(c => (
                        <Badge key={c} variant='outline' className='text-xs'>{c}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary' className={f.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}>
                      {f.status}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== ADMIN PRODUCTS ==============
export function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');

  const allProducts = [...mockConsumerProducts, ...mockSeedProducts];
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <PageHeader title='All Products' subtitle={`${allProducts.length} products in marketplace`} />

      <div className='relative max-w-sm'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input placeholder='Search products...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
      </div>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className='hidden sm:table-cell'>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className='hidden md:table-cell'>Stock</TableHead>
                <TableHead className='hidden lg:table-cell'>Rating</TableHead>
                <TableHead className='hidden lg:table-cell'>Seller</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p, idx) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg'>
                        {p.category.includes('Vegetable') ? '🥬' : p.category.includes('Grain') ? '🌾' : p.category.includes('Spice') ? '🌶️' : p.category.includes('Fiber') ? '🧵' : p.category.includes('Dairy') ? '🥚' : p.category.includes('Fruit') ? '🍉' : p.category.includes('Organic') ? '🌿' : '📦'}
                      </span>
                      <span className='font-medium text-sm truncate max-w-[150px]'>{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-muted-foreground text-sm'>{p.category}</TableCell>
                  <TableCell className='text-sm font-medium'>₹{p.price.toLocaleString('en-IN')}<span className='text-muted-foreground'>/{p.unit}</span></TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <Badge variant='secondary' className={p.inStock ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}>
                      {p.inStock ? 'In Stock' : 'Out'}
                    </Badge>
                  </TableCell>
                  <TableCell className='hidden lg:table-cell'>
                    <span className='flex items-center gap-1 text-sm'>
                      <Star className='size-3 text-amber-500 fill-amber-500' /> {p.rating}
                    </span>
                  </TableCell>
                  <TableCell className='hidden lg:table-cell text-muted-foreground text-sm'>{p.farmer || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant='secondary' className={p.inStock ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}>
                      {p.inStock ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== ADMIN ORDERS ==============
export function AdminOrders() {
  const [activeTab, setActiveTab] = useState('all');

  const orders = [
    { id: 'ORD-2025-001', customer: 'Priya Sharma', items: 'Tomato × 5, Brinjal × 2', total: 270, status: 'Delivered', date: 'Dec 28, 2024' },
    { id: 'ORD-2025-002', customer: 'Rahul Verma', items: 'Eggs × 3', total: 240, status: 'Out for Delivery', date: 'Jan 5, 2025' },
    { id: 'ORD-2025-003', customer: 'Anita Desai', items: 'Rice × 2, Chilli Powder × 1', total: 520, status: 'Placed', date: 'Jan 6, 2025' },
    { id: 'ORD-2025-004', customer: 'Meena Kumari', items: 'Onion × 10', total: 450, status: 'Preparing', date: 'Jan 6, 2025' },
    { id: 'ORD-2025-005', customer: 'Rajesh Patel', items: 'Tomato × 3, Eggs × 2', total: 280, status: 'Cancelled', date: 'Jan 4, 2025' },
    { id: 'ORD-2025-006', customer: 'Sunitha Reddy', items: 'Brinjal × 4', total: 140, status: 'Quality Verified', date: 'Jan 6, 2025' },
  ];

  const statusColor = (s: string) =>
    ({ Delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', 'Out for Delivery': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', Placed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', Preparing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', 'Quality Verified': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' }[s] || 'bg-gray-100 text-gray-700');

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status.toLowerCase().replace(/ /g, '_') === activeTab);

  return (
    <div className='space-y-6'>
      <PageHeader title='All Orders' subtitle={`${orders.length} total orders`} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='flex-wrap'>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='placed'>Placed</TabsTrigger>
          <TabsTrigger value='preparing'>Preparing</TabsTrigger>
          <TabsTrigger value='quality_verified'>QC Done</TabsTrigger>
          <TabsTrigger value='out_for_delivery'>Shipping</TabsTrigger>
          <TabsTrigger value='delivered'>Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='mt-4'>
          <Card>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className='hidden md:table-cell'>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='hidden sm:table-cell'>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((o, idx) => (
                    <TableRow key={o.id}>
                      <TableCell className='font-medium text-sm'>{o.id}</TableCell>
                      <TableCell className='text-sm'>{o.customer}</TableCell>
                      <TableCell className='hidden md:table-cell text-muted-foreground text-sm truncate max-w-[200px]'>{o.items}</TableCell>
                      <TableCell className='font-semibold text-sm'>₹{o.total.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Badge variant='secondary' className={statusColor(o.status)}>{o.status}</Badge>
                      </TableCell>
                      <TableCell className='hidden sm:table-cell text-muted-foreground text-sm'>{o.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============== ADMIN COLLECTION CENTERS ==============
export function AdminCollectionCenters() {
  return (
    <div className='space-y-6'>
      <PageHeader title='Collection Centers' subtitle={`${mockCollectionCenters.length} centers registered`} action={
        <Button onClick={() => toast.success('Add center form coming soon!')}>
          <Building2 className='size-4 mr-1' /> Add Center
        </Button>
      } />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {mockCollectionCenters.map((c, idx) => (
          <motion.div key={c.id} {...fadeIn} transition={{ delay: idx * 0.08 }}>
            <Card className='hover:shadow-md transition-all'>
              <CardContent className='p-4 sm:p-6'>
                <div className='flex items-start justify-between mb-3'>
                  <div>
                    <h3 className='font-semibold text-sm'>{c.name}</h3>
                    <p className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
                      <MapPin className='size-3' /> {c.address}
                    </p>
                  </div>
                  <Badge variant='secondary' className={
                    c.isOpen
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }>
                    {c.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>

                <div className='space-y-2 mb-3'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>Capacity Usage</span>
                    <span className='font-medium'>{c.currentCapacity}/{c.maxCapacity} tons</span>
                  </div>
                  <Progress value={(c.currentCapacity / c.maxCapacity) * 100} className='h-2' />
                </div>

                <div className='flex flex-wrap gap-1.5'>
                  {c.acceptedCrops.slice(0, 4).map(cr => (
                    <Badge key={cr} variant='outline' className='text-xs'>{cr}</Badge>
                  ))}
                  {c.acceptedCrops.length > 4 && (
                    <Badge variant='outline' className='text-xs'>+{c.acceptedCrops.length - 4}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============== ADMIN ANALYTICS ==============
export function AdminAnalytics() {
  // KPI data
  const kpiCards = [
    { label: 'Total Revenue', value: '₹24.5L', trend: '+12.5%', trendUp: true, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/40' },
    { label: 'Active Users', value: '8,934', trend: '+8.2%', trendUp: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { label: 'Orders This Month', value: '1,247', trend: '+15.3%', trendUp: true, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Avg Order Value', value: '₹342', trend: '-2.1%', trendUp: false, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/40' },
    { label: 'Farmer Retention', value: '87%', trend: '+3.8%', trendUp: true, icon: Repeat, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/40' },
  ];

  // Revenue trend data (12 months)
  const revenueData = [
    { month: 'Jan', revenue: 1450000, expenses: 980000 },
    { month: 'Feb', revenue: 1320000, expenses: 910000 },
    { month: 'Mar', revenue: 1680000, expenses: 1050000 },
    { month: 'Apr', revenue: 1890000, expenses: 1120000 },
    { month: 'May', revenue: 1750000, expenses: 1080000 },
    { month: 'Jun', revenue: 1920000, expenses: 1150000 },
    { month: 'Jul', revenue: 2100000, expenses: 1200000 },
    { month: 'Aug', revenue: 2050000, expenses: 1180000 },
    { month: 'Sep', revenue: 2280000, expenses: 1250000 },
    { month: 'Oct', revenue: 2350000, expenses: 1280000 },
    { month: 'Nov', revenue: 2180000, expenses: 1220000 },
    { month: 'Dec', revenue: 2450000, expenses: 1310000 },
  ];

  // User growth by role (Jul-Dec)
  const userGrowthData = [
    { month: 'Jul', Farmers: 620, Consumers: 840, Experts: 12, 'CC Staff': 18 },
    { month: 'Aug', Farmers: 710, Consumers: 920, Experts: 14, 'CC Staff': 19 },
    { month: 'Sep', Farmers: 785, Consumers: 1010, Experts: 15, 'CC Staff': 20 },
    { month: 'Oct', Farmers: 860, Consumers: 1120, Experts: 16, 'CC Staff': 21 },
    { month: 'Nov', Farmers: 920, Consumers: 1210, Experts: 17, 'CC Staff': 22 },
    { month: 'Dec', Farmers: 980, Consumers: 1340, Experts: 19, 'CC Staff': 24 },
  ];

  // Top products table
  const topProducts = [
    { rank: 1, product: 'Basmati Rice (Premium)', category: 'Grains', units: 3240, revenue: '₹10.4L', growth: 24.5 },
    { rank: 2, product: 'Organic Turmeric Powder', category: 'Spices', units: 2870, revenue: '₹8.2L', growth: 18.2 },
    { rank: 3, product: 'Fresh Tomatoes', category: 'Vegetables', units: 4560, revenue: '₹6.8L', growth: 12.7 },
    { rank: 4, product: 'Cotton Bales (Grade A)', category: 'Fibers', units: 890, revenue: '₹5.9L', growth: 8.4 },
    { rank: 5, product: 'Red Chilli (Guntur)', category: 'Spices', units: 2100, revenue: '₹5.1L', growth: 6.1 },
    { rank: 6, product: 'Farm Fresh Eggs', category: 'Dairy', units: 18200, revenue: '₹4.5L', growth: -2.3 },
    { rank: 7, product: 'Hybrid Tomato Seeds', category: 'Seeds', units: 1560, revenue: '₹3.8L', growth: 15.9 },
    { rank: 8, product: 'Green Gram (Moong Dal)', category: 'Grains', units: 1980, revenue: '₹3.2L', growth: 4.2 },
    { rank: 9, product: 'Cauliflower', category: 'Vegetables', units: 3210, revenue: '₹2.8L', growth: -1.5 },
    { rank: 10, product: 'Sunflower Oil (Cold Press)', category: 'Oils', units: 980, revenue: '₹2.1L', growth: 9.3 },
  ];

  // Geographic distribution
  const districts = [
    { name: 'Warangal', farmers: 2340, percentage: 23, color: 'bg-green-600' },
    { name: 'Hyderabad', farmers: 1832, percentage: 18, color: 'bg-green-500' },
    { name: 'Karimnagar', farmers: 1527, percentage: 15, color: 'bg-emerald-500' },
    { name: 'Nizamabad', farmers: 1221, percentage: 12, color: 'bg-emerald-400' },
    { name: 'Khammam', farmers: 1018, percentage: 10, color: 'bg-green-400' },
  ];

  // Platform health metrics
  const healthMetrics = [
    { label: 'Uptime', value: '99.7%', status: 'green', icon: Server },
    { label: 'API Response', value: '142ms', status: 'green', icon: Zap },
    { label: 'Error Rate', value: '0.3%', status: 'amber', icon: AlertTriangle },
    { label: 'Active Sessions', value: '342', status: 'green', icon: Activity },
  ];

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div className='space-y-6' variants={containerVariants} initial='hidden' animate='visible'>
      <PageHeader title='Platform Analytics' subtitle='Detailed insights and performance metrics' />

      {/* ===== KPI Cards Row ===== */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} variants={itemVariants}>
              <Card className='hover-lift cursor-default'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className={cn('p-2 rounded-lg', kpi.bg)}>
                      <Icon className={cn('h-4 w-4', kpi.color)} />
                    </div>
                    <span className={cn('text-xs font-medium flex items-center gap-0.5',
                      kpi.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                    )}>
                      {kpi.trendUp ? <ArrowUpRight className='h-3 w-3' /> : <ArrowDownRight className='h-3 w-3' />}
                      {kpi.trend}
                    </span>
                  </div>
                  <p className='text-2xl font-bold tracking-tight'>{kpi.value}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>{kpi.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ===== Revenue Trend Chart ===== */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[320px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id='revenueGrad' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#16a34a' stopOpacity={0.3} />
                      <stop offset='95%' stopColor='#16a34a' stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id='expenseGrad' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#f43f5e' stopOpacity={0.25} />
                      <stop offset='95%' stopColor='#f43f5e' stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                  <XAxis dataKey='month' className='text-xs' tick={{ fontSize: 12 }} />
                  <YAxis className='text-xs' tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number, name: string) => [
                      `₹${(value / 100000).toFixed(2)}L`,
                      name,
                    ]}
                  />
                  <ReferenceLine y={1200000} stroke='hsl(var(--muted-foreground))' strokeDasharray='6 4' label={{ value: 'Break-even', position: 'insideTopRight', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Area type='monotone' dataKey='revenue' name='Revenue' stroke='#16a34a' strokeWidth={2} fill='url(#revenueGrad)' />
                  <Area type='monotone' dataKey='expenses' name='Expenses' stroke='#f43f5e' strokeWidth={2} fill='url(#expenseGrad)' />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== User Growth + Top Products ===== */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* User Growth by Role - Stacked Bar */}
        <motion.div variants={itemVariants}>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className='text-base'>User Growth by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-[340px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                    <XAxis dataKey='month' className='text-xs' tick={{ fontSize: 12 }} />
                    <YAxis className='text-xs' tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                      iconType='circle'
                      iconSize={8}
                    />
                    <Bar dataKey='Farmers' stackId='a' fill='#16a34a' radius={[0, 0, 0, 0]} />
                    <Bar dataKey='Consumers' stackId='a' fill='#f59e0b' radius={[0, 0, 0, 0]} />
                    <Bar dataKey='Experts' stackId='a' fill='#8b5cf6' radius={[0, 0, 0, 0]} />
                    <Bar dataKey='CC Staff' stackId='a' fill='#14b8a6' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products Table */}
        <motion.div variants={itemVariants}>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='max-h-[340px] overflow-y-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                      <TableHead className='w-10 text-xs'>#</TableHead>
                      <TableHead className='text-xs'>Product</TableHead>
                      <TableHead className='text-xs hidden sm:table-cell'>Category</TableHead>
                      <TableHead className='text-xs text-right hidden md:table-cell'>Units</TableHead>
                      <TableHead className='text-xs text-right'>Revenue</TableHead>
                      <TableHead className='text-xs text-right'>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((p) => (
                      <TableRow key={p.rank} className={cn(
                        p.rank <= 3 && 'border-l-2 border-l-amber-400'
                      )}>
                        <TableCell className='text-xs font-medium text-muted-foreground'>{p.rank}</TableCell>
                        <TableCell className='text-xs font-medium'>{p.product}</TableCell>
                        <TableCell className='text-xs text-muted-foreground hidden sm:table-cell'>
                          <Badge variant='secondary' className='text-[10px] px-1.5 py-0'>{p.category}</Badge>
                        </TableCell>
                        <TableCell className='text-xs text-right hidden md:table-cell'>{p.units.toLocaleString('en-IN')}</TableCell>
                        <TableCell className='text-xs text-right font-medium'>{p.revenue}</TableCell>
                        <TableCell className='text-xs text-right'>
                          <span className={cn('inline-flex items-center gap-0.5 font-medium',
                            p.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                          )}>
                            {p.growth >= 0 ? <ArrowUpRight className='h-3 w-3' /> : <ArrowDownRight className='h-3 w-3' />}
                            {Math.abs(p.growth)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ===== Geographic Distribution + Platform Health ===== */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
        {/* Geographic Distribution */}
        <motion.div variants={itemVariants} className='lg:col-span-3'>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {districts.map((d) => (
                  <div key={d.name} className='space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-3.5 w-3.5 text-muted-foreground' />
                        <span className='text-sm font-medium'>{d.name}</span>
                      </div>
                      <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                        <span>{d.farmers.toLocaleString('en-IN')} farmers</span>
                        <span className='font-semibold text-foreground'>{d.percentage}%</span>
                      </div>
                    </div>
                    <div className='h-2.5 w-full rounded-full bg-muted overflow-hidden'>
                      <motion.div
                        className={cn('h-full rounded-full', d.color)}
                        initial={{ width: 0 }}
                        animate={{ width: `${d.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Health Metrics */}
        <motion.div variants={itemVariants} className='lg:col-span-2'>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4'>
                {healthMetrics.map((m) => {
                  const Icon = m.icon;
                  const dotColor = m.status === 'green'
                    ? 'bg-green-500'
                    : 'bg-amber-500';
                  const textColor = m.status === 'green'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-amber-600 dark:text-amber-400';
                  return (
                    <div
                      key={m.label}
                      className='flex flex-col items-center justify-center p-4 rounded-xl border bg-muted/30'
                    >
                      <div className='relative mb-2'>
                        <div className={cn('h-12 w-12 rounded-full border-2 flex items-center justify-center',
                          m.status === 'green' ? 'border-green-200 dark:border-green-800' : 'border-amber-200 dark:border-amber-800'
                        )}>
                          <Icon className={cn('h-5 w-5', textColor)} />
                        </div>
                        <div className={cn('absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full', dotColor)} />
                      </div>
                      <span className='text-lg font-bold tracking-tight'>{m.value}</span>
                      <span className='text-xs text-muted-foreground'>{m.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
