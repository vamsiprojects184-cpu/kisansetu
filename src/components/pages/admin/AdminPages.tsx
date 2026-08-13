'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Tractor, Package, ShoppingCart, Building2, TrendingUp,
  Bug, DollarSign, ArrowUpRight, Search, BarChart3, MapPin,
  Star, Eye, Shield, Activity, AlertTriangle, Info,
  ChevronLeft, ChevronRight,
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
  const monthlyOrders = [
    { month: 'Jul', orders: 6200 }, { month: 'Aug', orders: 7800 },
    { month: 'Sep', orders: 8900 }, { month: 'Oct', orders: 9800 },
    { month: 'Nov', orders: 11000 }, { month: 'Dec', orders: 12450 },
  ];

  const revenueByCategory = [
    { category: 'Vegetables', revenue: 520000 },
    { category: 'Grains', revenue: 380000 },
    { category: 'Spices', revenue: 290000 },
    { category: 'Fibers', revenue: 210000 },
    { category: 'Dairy', revenue: 180000 },
    { category: 'Seeds', revenue: 270000 },
  ];

  const userDistribution = [
    { name: 'Farmers', value: 2847, color: '#16a34a' },
    { name: 'Consumers', value: 4231, color: '#f59e0b' },
    { name: 'Collection Centers', value: 24, color: '#8b5cf6' },
    { name: 'Experts', value: 18, color: '#ef4444' },
    { name: 'Admins', value: 6, color: '#06b6d4' },
  ];

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
  };

  return (
    <div className='space-y-6'>
      <PageHeader title='Platform Analytics' subtitle='Detailed insights and metrics' />

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Monthly Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis dataKey='month' className='text-xs' />
                <YAxis className='text-xs' />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type='monotone' dataKey='orders' name='Orders' stroke='#16a34a' strokeWidth={2} dot={{ fill: '#16a34a', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={revenueByCategory} layout='vertical'>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                  <XAxis type='number' className='text-xs' tickFormatter={(v) => `₹${(v / 1000)}K`} />
                  <YAxis dataKey='category' type='category' className='text-xs' width={80} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                  <Bar dataKey='revenue' name='Revenue' fill='#16a34a' radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>User Distribution by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={100}
                    dataKey='value'
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {userDistribution.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
