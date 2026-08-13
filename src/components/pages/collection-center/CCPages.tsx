'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Truck, CheckCircle2, Clock, AlertTriangle, Warehouse,
  Download, Search, Eye, Check, X, Play,
  IndianRupee, ClipboardCheck, BoxIcon, DollarSign, BarChart3,
  MapPin, CalendarClock, Users, Timer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/use-app-store';
import {
  PageHeader, StatCard, CircularProgress, fadeIn, fadeInUp,
  SectionWrapper, EmptyState,
} from '@/components/shared/SharedComponents';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ============== CC DASHBOARD ==============
export function CCDashboard() {
  const { navigate } = useAppStore();

  const recentSubmissions = [
    { id: 'in1', farmer: 'Vamsi Krishna', crop: 'Tomato', qty: '500 kg', time: '10:30 AM', status: 'pending' as const },
    { id: 'in2', farmer: 'Ramesh Reddy', crop: 'Chilli', qty: '200 kg', time: '09:15 AM', status: 'qc_started' as const },
    { id: 'in3', farmer: 'Lakshmi Devi', crop: 'Brinjal', qty: '350 kg', time: '08:00 AM', status: 'verified' as const },
  ];

  const quickActions = [
    { label: 'Receive Product', icon: <Package className='size-5' />, route: 'collection-center/incoming' as const },
    { label: 'Start Quality Check', icon: <ClipboardCheck className='size-5' />, route: 'collection-center/quality-check' as const },
    { label: 'View Inventory', icon: <Warehouse className='size-5' />, route: 'collection-center/inventory' as const },
    { label: 'Process Payouts', icon: <DollarSign className='size-5' />, route: 'collection-center/payouts' as const },
  ];

  const submissionStatusColor = (s: string) =>
    ({ pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', qc_started: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' }[s] || 'bg-gray-100 text-gray-700');

  const todaySchedule = [
    { id: 'sch1', time: '9:00 AM', farmer: 'Vamsi Krishna', crop: 'Tomato', qty: '500kg', status: 'completed' as const, icon: '🍅' },
    { id: 'sch2', time: '10:30 AM', farmer: 'Ramesh Reddy', crop: 'Chilli', qty: '200kg', status: 'completed' as const, icon: '🌶️' },
    { id: 'sch3', time: '11:00 AM', farmer: 'Sunita Devi', crop: 'Rice', qty: '800kg', status: 'pending' as const, icon: '🌾' },
    { id: 'sch4', time: '2:00 PM', farmer: 'Lakshmi', crop: 'Brinjal', qty: '350kg', status: 'upcoming' as const, icon: '🍆' },
  ];

  const scheduleStatusColor = (s: string) =>
    ({ completed: 'bg-emerald-500', pending: 'bg-amber-500', upcoming: 'bg-gray-400' }[s] || 'bg-gray-400');

  const scheduleStatusLabel = (s: string) =>
    ({ completed: 'Completed', pending: 'Pending', upcoming: 'Upcoming' }[s] || 'Unknown');

  return (
    <div className='space-y-6'>
      {/* Welcome Banner */}
      <motion.div {...fadeInUp}>
        <div className='rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 sm:p-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex items-start gap-4'>
              <div className='text-4xl shrink-0'>🏭</div>
              <div>
                <h1 className='text-2xl font-bold tracking-tight'>GreenAgri Collection Center</h1>
                <div className='flex items-center gap-1.5 mt-1.5 text-white/80 text-sm'>
                  <MapPin className='size-3.5' />
                  <span>Warangal Rural, Telangana — Near Main Market Road</span>
                </div>
              </div>
            </div>
            <Badge className='bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm px-3 py-1 shrink-0'>
              <Truck className='size-3.5 mr-1.5' />
              Today: 12 incoming
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard title="Today's Incoming" value={12} subtitle='deliveries expected' icon={<Truck className='size-5' />} trend={{ value: 8, isPositive: true }} onClick={() => navigate('collection-center/incoming')} />
        <StatCard title='Pending QC' value={5} subtitle='awaiting verification' icon={<AlertTriangle className='size-5' />} onClick={() => navigate('collection-center/quality-check')} />
        <StatCard title='Inventory Items' value={45} subtitle='items in stock' icon={<BoxIcon className='size-5' />} onClick={() => navigate('collection-center/inventory')} />
        <StatCard title='Pending Payouts' value='₹1.2L' subtitle='to be processed' icon={<IndianRupee className='size-5' />} onClick={() => navigate('collection-center/payouts')} />
      </div>

      {/* Capacity Meter */}
      <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-base flex items-center gap-2'>
                <Warehouse className='size-4 text-teal-600' />
                Warehouse Capacity
              </CardTitle>
              <span className='text-2xl font-bold text-teal-600'>78%</span>
            </div>
          </CardHeader>
          <CardContent className='pt-0'>
            <Progress value={78} className='h-4 mb-4 [&>[data-slot=indicator]]:bg-gradient-to-r [&>[data-slot=indicator]]:from-teal-500 [&>[data-slot=indicator]]:to-cyan-500' />
            <p className='text-sm font-semibold text-muted-foreground mb-2'>78% Full</p>
            <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
              <span>🍅 Vegetables: <span className='font-medium text-foreground'>45%</span></span>
              <span>🌾 Grains: <span className='font-medium text-foreground'>25%</span></span>
              <span>🌶️ Spices: <span className='font-medium text-foreground'>8%</span></span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Schedule */}
      <motion.div {...fadeInUp} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base flex items-center gap-2'>
              <CalendarClock className='size-4 text-teal-600' />
              Today&rsquo;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='space-y-4'>
              {todaySchedule.map((item, idx) => (
                <div key={item.id} className='flex items-start gap-4'>
                  {/* Timeline dot + line */}
                  <div className='flex flex-col items-center shrink-0'>
                    <div className={cn('w-3 h-3 rounded-full shrink-0 mt-1', scheduleStatusColor(item.status))} />
                    {idx < todaySchedule.length - 1 && <div className='w-px h-12 bg-border mt-1' />}
                  </div>
                  {/* Content */}
                  <div className='flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 pb-1'>
                    <Badge variant='outline' className='w-fit text-xs font-mono shrink-0 border-muted-foreground/30'>
                      {item.time}
                    </Badge>
                    <div className='flex items-center gap-2 min-w-0 flex-1'>
                      <span className='text-lg shrink-0'>{item.icon}</span>
                      <p className='text-sm font-medium truncate'>{item.farmer}</p>
                      <span className='text-xs text-muted-foreground hidden sm:inline'>· {item.crop}, {item.qty}</span>
                    </div>
                    <span className={cn(
                      'text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0',
                      item.status === 'completed' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                      item.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
                      item.status === 'upcoming' && 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                    )}>
                      {scheduleStatusLabel(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <SectionWrapper title='Quick Actions'>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          {quickActions.map((action, idx) => (
            <motion.div key={action.label} {...fadeIn} transition={{ delay: idx * 0.05 }}>
              <Card className='hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5' onClick={() => navigate(action.route)}>
                <CardContent className='p-4 flex flex-col items-center text-center gap-2'>
                  <div className='w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600'>
                    {action.icon}
                  </div>
                  <p className='text-xs font-medium'>{action.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper title='Recent Submissions' action={<Button variant='ghost' size='sm' className='text-primary' onClick={() => navigate('collection-center/incoming')}>View all <Eye className='size-4 ml-1' /></Button>}>
        <Card>
          <CardContent className='p-0'>
            <div className='divide-y'>
              {recentSubmissions.map((item, idx) => (
                <motion.div key={item.id} {...fadeIn} transition={{ delay: idx * 0.05 }} className='flex items-center gap-4 p-4'>
                  <div className='text-2xl'>
                    {item.crop === 'Tomato' ? '🍅' : item.crop === 'Chilli' ? '🌶️' : '🍆'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-sm'>{item.farmer}</p>
                    <p className='text-xs text-muted-foreground'>{item.crop} · {item.qty} · {item.time}</p>
                  </div>
                  <Badge variant='secondary' className={submissionStatusColor(item.status)}>
                    {item.status.replace(/_/g, ' ')}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
}

// ============== CC INVENTORY ==============
export function CCInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const inventoryItems = [
    { id: 'inv1', name: 'Tomato', icon: '🍅', quantity: '500 kg', grade: 'Premium', received: '2025-01-06', status: 'available' as const },
    { id: 'inv2', name: 'Chilli', icon: '🌶️', quantity: '200 kg', grade: 'Standard', received: '2025-01-06', status: 'available' as const },
    { id: 'inv3', name: 'Onion', icon: '🧅', quantity: '800 kg', grade: 'Premium', received: '2025-01-05', status: 'available' as const },
    { id: 'inv4', name: 'Brinjal', icon: '🍆', quantity: '350 kg', grade: 'Standard', received: '2025-01-05', status: 'reserved' as const },
    { id: 'inv5', name: 'Rice', icon: '🌾', quantity: '1200 kg', grade: 'Premium', received: '2025-01-04', status: 'available' as const },
    { id: 'inv6', name: 'Maize', icon: '🌽', quantity: '400 kg', grade: 'Standard', received: '2025-01-04', status: 'available' as const },
    { id: 'inv7', name: 'Cotton', icon: '🧵', quantity: '150 kg', grade: 'Premium', received: '2025-01-03', status: 'dispatched' as const },
    { id: 'inv8', name: 'Okra', icon: '🥬', quantity: '250 kg', grade: 'Standard', received: '2025-01-03', status: 'available' as const },
  ];

  const categories = ['All', 'Vegetables', 'Grains', 'Fibers'];
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' ||
      (activeCategory === 'Vegetables' && ['Tomato', 'Chilli', 'Onion', 'Brinjal', 'Okra'].includes(item.name)) ||
      (activeCategory === 'Grains' && ['Rice', 'Maize'].includes(item.name)) ||
      (activeCategory === 'Fibers' && ['Cotton'].includes(item.name));
    return matchesSearch && matchesCategory;
  });

  const gradeColor = (g: string) =>
    ({ Premium: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', Standard: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' }[g] || 'bg-gray-100 text-gray-700');

  const statusColor = (s: string) =>
    ({ available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', reserved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', dispatched: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className='space-y-6'>
      <PageHeader title='Inventory' subtitle='Current stock at your center' action={
        <Button variant='outline' size='sm' onClick={() => toast.success('Inventory exported!')}>
          <Download className='size-4 mr-1' /> Export
        </Button>
      } />

      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input placeholder='Search inventory...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
        </div>
        <div className='flex gap-2 flex-wrap'>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/50'>
                  <th className='text-left p-3 font-medium'>Product</th>
                  <th className='text-left p-3 font-medium'>Quantity</th>
                  <th className='text-left p-3 font-medium'>Grade</th>
                  <th className='text-left p-3 font-medium hidden sm:table-cell'>Received Date</th>
                  <th className='text-left p-3 font-medium'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {filteredItems.map((item, idx) => (
                  <motion.tr key={item.id} {...fadeIn} transition={{ delay: idx * 0.03 }} className='hover:bg-muted/30'>
                    <td className='p-3'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xl'>{item.icon}</span>
                        <span className='font-medium'>{item.name}</span>
                      </div>
                    </td>
                    <td className='p-3 font-medium'>{item.quantity}</td>
                    <td className='p-3'>
                      <Badge variant='secondary' className={gradeColor(item.grade)}>{item.grade}</Badge>
                    </td>
                    <td className='p-3 text-muted-foreground hidden sm:table-cell'>
                      {new Date(item.received).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className='p-3'>
                      <Badge variant='secondary' className={statusColor(item.status)}>{item.status}</Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredItems.length === 0 && (
        <EmptyState icon='📦' title='No items found' description='Try a different search or filter' />
      )}
    </div>
  );
}

// ============== CC INCOMING ==============
export function CCIncoming() {
  const { navigate } = useAppStore();

  const incomingItems = [
    { id: 'in1', farmer: 'Vamsi Krishna', crop: 'Tomato', quantity: '500 kg', arrival: '10:30 AM', icon: '🍅' },
    { id: 'in2', farmer: 'Ramesh Reddy', crop: 'Chilli', quantity: '200 kg', arrival: '11:15 AM', icon: '🌶️' },
    { id: 'in3', farmer: 'Lakshmi Devi', crop: 'Brinjal', quantity: '350 kg', arrival: '12:00 PM', icon: '🍆' },
    { id: 'in4', farmer: 'Suresh Kumar', crop: 'Onion', quantity: '600 kg', arrival: '1:30 PM', icon: '🧅' },
    { id: 'in5', farmer: 'Anita Reddy', crop: 'Rice', quantity: '1000 kg', arrival: '3:00 PM', icon: '🌾' },
  ];

  const handleStartQC = (id: string) => {
    toast.success('Quality check started!');
    navigate('collection-center/quality-check');
  };

  return (
    <div className='space-y-6'>
      <PageHeader title="Today's Incoming Products" subtitle={`${incomingItems.length} deliveries scheduled`} />

      <div className='space-y-3'>
        {incomingItems.map((item, idx) => (
          <motion.div key={item.id} {...fadeIn} transition={{ delay: idx * 0.05 }}>
            <Card className='hover:shadow-sm transition-all'>
              <CardContent className='p-4'>
                <div className='flex items-center gap-4'>
                  <div className='size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-2xl shrink-0'>
                    {item.icon}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4'>
                      <p className='font-medium text-sm'>{item.farmer}</p>
                      <span className='text-xs text-muted-foreground sm:hidden'>
                        {item.crop} · {item.quantity}
                      </span>
                    </div>
                    <div className='hidden sm:flex items-center gap-4 text-xs text-muted-foreground mt-0.5'>
                      <span>{item.crop}</span>
                      <span>·</span>
                      <span>{item.quantity}</span>
                      <span>·</span>
                      <span className='flex items-center gap-1'>
                        <Clock className='size-3' /> Arrival: {item.arrival}
                      </span>
                    </div>
                    <div className='flex sm:hidden items-center gap-2 text-xs text-muted-foreground mt-1'>
                      <span className='flex items-center gap-1'>
                        <Clock className='size-3' /> {item.arrival}
                      </span>
                    </div>
                  </div>
                  <Button
                    size='sm'
                    className='shrink-0'
                    onClick={() => handleStartQC(item.id)}
                  >
                    <Play className='size-4 mr-1' /> Start QC
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============== CC QUALITY CHECK ==============
const QC_FLOW_STEPS = ['Received', 'Quality Test', 'Grading', 'Priced'] as const;

type QcFlowStatus = 'pending' | 'in_progress' | 'qc_started' | 'verified' | 'approved' | 'rejected';

function getQcStepIndex(status: QcFlowStatus): number {
  const map: Record<QcFlowStatus, number> = {
    pending: 0,
    in_progress: 1,
    qc_started: 2,
    verified: 2,
    approved: 3,
    rejected: -1,
  };
  return map[status] ?? 0;
}

function QcFlowStepper({ status }: { status: QcFlowStatus }) {
  const currentStep = getQcStepIndex(status);
  const isRejected = status === 'rejected';

  return (
    <div className='flex items-center gap-0 w-full'>
      {QC_FLOW_STEPS.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep && !isRejected;
        const isFuture = idx > currentStep;

        return (
          <React.Fragment key={step}>
            <div className='flex flex-col items-center gap-1 flex-1 min-w-0'>
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors',
                isCompleted && 'bg-emerald-500 text-white',
                isCurrent && 'bg-teal-500 text-white ring-2 ring-teal-200 dark:ring-teal-800',
                isFuture && 'bg-muted text-muted-foreground',
                isRejected && idx === 0 && 'bg-red-500 text-white',
              )}>
                {isCompleted ? <Check className='size-3' /> : isRejected && idx === 0 ? <X className='size-3' /> : idx + 1}
              </div>
              <span className={cn(
                'text-[10px] leading-tight text-center truncate w-full',
                (isCompleted || isCurrent) ? 'text-foreground font-medium' : 'text-muted-foreground',
              )}>
                {step}
              </span>
            </div>
            {idx < QC_FLOW_STEPS.length - 1 && (
              <div className={cn(
                'h-0.5 flex-1 mb-4 shrink-0',
                idx < currentStep ? 'bg-emerald-500' : 'bg-muted',
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const extendedQcItems = [
  { id: 'qc_ext1', productName: 'Tomato', farmerName: 'Vamsi Krishna', qualityScore: 92, grade: 'premium', status: 'approved' as const, quantity: '500 kg' },
  { id: 'qc_ext2', productName: 'Chilli', farmerName: 'Ramesh Reddy', qualityScore: 78, grade: 'standard', status: 'qc_started' as const, quantity: '200 kg' },
  { id: 'qc_ext3', productName: 'Brinjal', farmerName: 'Suresh Kumar', qualityScore: 0, grade: 'standard', status: 'pending' as const, quantity: '350 kg' },
  { id: 'qc_ext4', productName: 'Onion', farmerName: 'Lakshmi Devi', qualityScore: 85, grade: 'premium', status: 'approved' as const, quantity: '600 kg' },
  { id: 'qc_ext5', productName: 'Rice', farmerName: 'Sunita Devi', qualityScore: 0, grade: 'standard', status: 'in_progress' as const, quantity: '800 kg' },
];

export function CCQualityCheck() {

  const qcStats = [
    { label: 'Pending', value: 5, icon: <Clock className='size-4' />, color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    { label: 'In Progress', value: 2, icon: <Play className='size-4' />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    { label: 'Approved', value: 12, icon: <CheckCircle2 className='size-4' />, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    { label: 'Rejected', value: 1, icon: <X className='size-4' />, color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  ];

  const gradeColor = (g: string) =>
    ({ premium: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', standard: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' }[g] || 'bg-gray-100 text-gray-700');

  const gradeRingColor = (g: string) =>
    ({ premium: '#16a34a', standard: '#f59e0b', rejected: '#ef4444' }[g] || '#6b7280');

  const getQcAction = (status: QcFlowStatus) => {
    if (status === 'pending') return { label: 'Start QC', variant: 'default' as const, handler: () => toast.success('QC started!') };
    if (status === 'in_progress' || status === 'qc_started') return { label: 'Continue QC', variant: 'outline' as const, handler: () => toast.info('Continuing quality check...') };
    if (status === 'verified') return { label: 'Approve', variant: 'default' as const, handler: () => toast.success('Item approved!') };
    return null;
  };

  const getQcProductIcon = (name: string) =>
    ({ Tomato: '🍅', Chilli: '🌶️', Brinjal: '🍆', Onion: '🧅', Rice: '🌾' }[name] || '📦');

  return (
    <div className='space-y-6'>
      <PageHeader title='Quality Check' subtitle={`${extendedQcItems.length} items to verify`} />

      {/* QC Stats Bar */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        {qcStats.map((stat, idx) => (
          <motion.div key={stat.label} {...fadeIn} transition={{ delay: idx * 0.05 }}>
            <Card className={cn('border', stat.border)}>
              <CardContent className='p-4 flex items-center gap-3'>
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', stat.color)}>
                  {stat.icon}
                </div>
                <div>
                  <p className='text-2xl font-bold leading-none'>{stat.value}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* QC Items with Flow Stepper */}
      <div className='space-y-4'>
        {extendedQcItems.map((qc, idx) => {
          const action = getQcAction(qc.status);
          return (
            <motion.div key={qc.id} {...fadeIn} transition={{ delay: idx * 0.05 }}>
              <Card className={qc.status === 'pending' ? 'border-amber-200 dark:border-amber-800' : ''}>
                <CardContent className='p-4 sm:p-6 space-y-4'>
                  {/* Top row: product info + score + badge */}
                  <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='text-2xl shrink-0'>{getQcProductIcon(qc.productName)}</div>
                      <div className='min-w-0'>
                        <h3 className='font-semibold text-sm'>{qc.productName}</h3>
                        <p className='text-xs text-muted-foreground'>{qc.farmerName} · {qc.quantity}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 shrink-0'>
                      {qc.status === 'approved' && qc.qualityScore > 0 && (
                        <div className='flex items-center gap-2'>
                          <CircularProgress
                            value={qc.qualityScore}
                            size={52}
                            strokeWidth={5}
                            color={gradeRingColor(qc.grade)}
                            label={String(qc.qualityScore)}
                          />
                          <span className='text-xs font-medium text-muted-foreground hidden sm:block'>
                            Grade {qc.grade.charAt(0).toUpperCase() + qc.grade.slice(1)}: {qc.qualityScore}/100
                          </span>
                        </div>
                      )}
                      <Badge variant='secondary' className={gradeColor(qc.grade)}>
                        {qc.grade.toUpperCase()}
                      </Badge>
                      <Badge variant='secondary' className={
                        qc.status === 'approved' || qc.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : qc.status === 'rejected'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      }>
                        {qc.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* QC Flow Stepper */}
                  <QcFlowStepper status={qc.status} />

                  {/* Action buttons */}
                  <div className='flex items-center justify-between pt-1'>
                    <p className='text-xs text-muted-foreground'>Step {Math.max(1, getQcStepIndex(qc.status) + 1)} of {QC_FLOW_STEPS.length}</p>
                    <div className='flex gap-2'>
                      {qc.status === 'pending' && (
                        <Button variant='outline' size='sm' onClick={() => { toast.info('Marked as rejected'); }}>
                          <X className='size-3.5 mr-1' /> Reject
                        </Button>
                      )}
                      {action && (
                        <Button size='sm' variant={action.variant} onClick={action.handler}>
                          {action.label === 'Start QC' && <Play className='size-3.5 mr-1' />}
                          {action.label === 'Continue QC' && <Play className='size-3.5 mr-1' />}
                          {action.label === 'Approve' && <Check className='size-3.5 mr-1' />}
                          {action.label}
                        </Button>
                      )}
                      {qc.status === 'approved' && (
                        <Button size='sm' variant='outline' onClick={() => toast.info('Viewing payout details...')}>
                          <IndianRupee className='size-3.5 mr-1' /> View Payout
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============== CC PAYOUTS ==============
const payoutChartData = [
  { day: 'Mon', amount: 68000 },
  { day: 'Tue', amount: 45000 },
  { day: 'Wed', amount: 92000 },
  { day: 'Thu', amount: 73000 },
  { day: 'Fri', amount: 55000 },
  { day: 'Sat', amount: 85000 },
  { day: 'Sun', amount: 62000 },
];

export function CCPayouts() {
  const [payouts, setPayouts] = useState([
    { id: 'p1', farmer: 'Vamsi Krishna', crop: 'Tomato', amount: 14000, date: 'Jan 6, 2025', status: 'pending' as const },
    { id: 'p2', farmer: 'Ramesh Reddy', crop: 'Chilli', amount: 36000, date: 'Jan 5, 2025', status: 'pending' as const },
    { id: 'p3', farmer: 'Lakshmi Devi', crop: 'Brinjal', amount: 8750, date: 'Jan 4, 2025', status: 'completed' as const },
    { id: 'p4', farmer: 'Suresh Kumar', crop: 'Onion', amount: 22000, date: 'Jan 3, 2025', status: 'completed' as const },
    { id: 'p5', farmer: 'Sunita Devi', crop: 'Rice', amount: 48000, date: 'Jan 2, 2025', status: 'completed' as const },
  ]);

  const pendingTotal = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const completedTotal = payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalMonth = pendingTotal + completedTotal;
  const farmersPaid = payouts.filter(p => p.status === 'completed').length;

  const handleProcessAll = () => {
    setPayouts(prev => prev.map(p => ({ ...p, status: 'completed' as const })));
    toast.success('All payouts processed successfully!');
  };

  const handleProcessOne = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'completed' as const } : p));
    toast.success('Payout processed!');
  };

  const handleScheduleLater = (id: string) => {
    toast.info(`Payment for ${payouts.find(p => p.id === id)?.farmer} scheduled for later`);
  };

  const statusColor = (s: string) =>
    ({ completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Payouts'
        subtitle='Farmer payment management'
        action={
          <Button
            onClick={handleProcessAll}
            disabled={payouts.every(p => p.status === 'completed')}
          >
            <CheckCircle2 className='size-4 mr-1' /> Process All
          </Button>
        }
      />

      {/* Payout Summary */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        <motion.div {...fadeIn} transition={{ delay: 0 }}>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                <IndianRupee className='size-4' />
                <span className='text-xs font-medium'>Total Payouts This Month</span>
              </div>
              <p className='text-xl sm:text-2xl font-bold'>₹{(totalMonth / 100000).toFixed(1)}L</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <Card className='border-amber-200 dark:border-amber-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1'>
                <Clock className='size-4' />
                <span className='text-xs font-medium'>Pending</span>
              </div>
              <p className='text-xl sm:text-2xl font-bold'>₹{(pendingTotal / 100000).toFixed(1)}L</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className='border-emerald-200 dark:border-emerald-800'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1'>
                <CheckCircle2 className='size-4' />
                <span className='text-xs font-medium'>Processed</span>
              </div>
              <p className='text-xl sm:text-2xl font-bold'>₹{(completedTotal / 100000).toFixed(1)}L</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                <Users className='size-4' />
                <span className='text-xs font-medium'>Farmers Paid</span>
              </div>
              <p className='text-xl sm:text-2xl font-bold'>{farmersPaid}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payment History Chart */}
      <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base flex items-center gap-2'>
              <BarChart3 className='size-4 text-teal-600' />
              Daily Payout History
            </CardTitle>
            <p className='text-xs text-muted-foreground'>Last 7 days</p>
          </CardHeader>
          <CardContent>
            <div className='h-48'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={payoutChartData}>
                  <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
                  <XAxis dataKey='day' tick={{ fontSize: 12 }} stroke='hsl(var(--muted-foreground))' />
                  <YAxis tick={{ fontSize: 11 }} stroke='hsl(var(--muted-foreground))' tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Payout']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey='amount' fill='url(#payoutGradient)' radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id='payoutGradient' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stopColor='#14b8a6' />
                      <stop offset='100%' stopColor='#06b6d4' />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Payout Details</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/50'>
                  <th className='text-left p-3 font-medium'>Farmer</th>
                  <th className='text-left p-3 font-medium'>Crop</th>
                  <th className='text-left p-3 font-medium'>Amount</th>
                  <th className='text-left p-3 font-medium hidden sm:table-cell'>Date</th>
                  <th className='text-left p-3 font-medium'>Status</th>
                  <th className='text-left p-3 font-medium'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {payouts.map((p, idx) => (
                  <motion.tr key={p.id} {...fadeIn} transition={{ delay: idx * 0.05 }} className='hover:bg-muted/30'>
                    <td className='p-3 font-medium'>{p.farmer}</td>
                    <td className='p-3'>{p.crop}</td>
                    <td className='p-3 font-semibold'>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className='p-3 text-muted-foreground hidden sm:table-cell'>{p.date}</td>
                    <td className='p-3'>
                      <Badge variant='secondary' className={statusColor(p.status)}>{p.status}</Badge>
                    </td>
                    <td className='p-3'>
                      {p.status === 'pending' ? (
                        <div className='flex gap-2'>
                          <Button size='sm' onClick={() => handleProcessOne(p.id)}>
                            <CheckCircle2 className='size-3.5 mr-1' /> Process Payment
                          </Button>
                          <Button size='sm' variant='outline' onClick={() => handleScheduleLater(p.id)}>
                            <Timer className='size-3.5 mr-1' /> Schedule
                          </Button>
                        </div>
                      ) : (
                        <span className='text-xs text-muted-foreground'>Paid</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
