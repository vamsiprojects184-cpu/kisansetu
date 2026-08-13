'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Truck, CheckCircle2, Clock, AlertTriangle, Warehouse,
  ArrowDownRight, Download, Search, Eye, Check, X, Play,
  IndianRupee, ClipboardCheck, BoxIcon, DollarSign, Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/use-app-store';
import { mockQualityChecks, mockCollectionCenters } from '@/data/mock-data';
import {
  PageHeader, StatCard, CircularProgress, fadeIn, fadeInUp,
  staggerContainer, SectionWrapper, EmptyState,
} from '@/components/shared/SharedComponents';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ============== CC DASHBOARD ==============
export function CCDashboard() {
  const { navigate } = useAppStore();
  const pending = mockQualityChecks.filter(q => q.status === 'pending').length;

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

  return (
    <div className='space-y-6'>
      <motion.div {...fadeInUp}>
        <h1 className='text-2xl font-bold tracking-tight'>Collection Center</h1>
        <p className='text-muted-foreground mt-1'>Manage incoming produce, quality checks, and payouts</p>
      </motion.div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard title="Today's Incoming" value={12} subtitle='deliveries expected' icon={<Truck className='size-5' />} trend={{ value: 8, isPositive: true }} onClick={() => navigate('collection-center/incoming')} />
        <StatCard title='Pending QC' value={5} subtitle='awaiting verification' icon={<AlertTriangle className='size-5' />} onClick={() => navigate('collection-center/quality-check')} />
        <StatCard title='Inventory Items' value={45} subtitle='items in stock' icon={<BoxIcon className='size-5' />} onClick={() => navigate('collection-center/inventory')} />
        <StatCard title='Pending Payouts' value='₹1.2L' subtitle='to be processed' icon={<IndianRupee className='size-5' />} onClick={() => navigate('collection-center/payouts')} />
      </div>

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
export function CCQualityCheck() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const gradeColor = (g: string) =>
    ({ premium: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', standard: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' }[g] || 'bg-gray-100 text-gray-700');

  const gradeRingColor = (g: string) =>
    ({ premium: '#16a34a', standard: '#f59e0b', rejected: '#ef4444' }[g] || '#6b7280');

  return (
    <div className='space-y-6'>
      <PageHeader title='Quality Check' subtitle={`${mockQualityChecks.length} items to verify`} />

      <div className='space-y-4'>
        {mockQualityChecks.map((qc, idx) => (
          <motion.div key={qc.id} {...fadeIn} transition={{ delay: idx * 0.05 }}>
            <Card className={qc.status === 'pending' ? 'border-amber-200 dark:border-amber-800' : ''}>
              <CardContent className='p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='text-3xl shrink-0'>
                      {qc.productName === 'Tomato' ? '🍅' : qc.productName === 'Chilli' ? '🌶️' : '🥬'}
                    </div>
                    <div className='min-w-0'>
                      <h3 className='font-semibold text-sm'>{qc.productName}</h3>
                      <p className='text-xs text-muted-foreground'>{qc.farmerName}</p>
                    </div>
                    {qc.status === 'verified' && (
                      <div className='shrink-0'>
                        <CircularProgress
                          value={qc.qualityScore}
                          size={70}
                          strokeWidth={6}
                          color={gradeRingColor(qc.grade)}
                          label={String(qc.qualityScore)}
                        />
                      </div>
                    )}
                  </div>
                  <div className='flex items-center gap-3'>
                    <Badge variant='secondary' className={gradeColor(qc.grade)}>
                      {qc.grade.toUpperCase()}
                    </Badge>
                    <Badge variant='secondary' className={
                      qc.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    }>
                      {qc.status}
                    </Badge>
                    {qc.status === 'pending' && (
                      <Button size='sm' onClick={() => setExpandedId(expandedId === qc.id ? null : qc.id)}>
                        Review
                      </Button>
                    )}
                  </div>
                </div>

                {expandedId === qc.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='mt-4 pt-4 border-t space-y-4'
                  >
                    <p className='text-sm text-muted-foreground'>Quality assessment metrics:</p>

                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                      {[
                        { label: 'Freshness', value: qc.freshness },
                        { label: 'Size Consistency', value: qc.sizeConsistency },
                        { label: 'Appearance', value: qc.appearance },
                        { label: 'Damage Check', value: qc.damageCheck },
                      ].map(metric => (
                        <div key={metric.label} className='space-y-2'>
                          <div className='flex justify-between text-xs'>
                            <span className='text-muted-foreground'>{metric.label}</span>
                            <span className='font-medium'>{metric.value > 0 ? `${metric.value}%` : 'Pending'}</span>
                          </div>
                          <Progress value={metric.value} className='h-2' />
                        </div>
                      ))}
                    </div>

                    <div className='flex gap-2 justify-end pt-2'>
                      <Button variant='outline' size='sm' onClick={() => { toast.info('Marked as rejected'); setExpandedId(null); }}>
                        <X className='size-4 mr-1' /> Reject
                      </Button>
                      <Button size='sm' onClick={() => { toast.success('Quality check verified!'); setExpandedId(null); }}>
                        <Check className='size-4 mr-1' /> Verify
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============== CC PAYOUTS ==============
export function CCPayouts() {
  const [payouts, setPayouts] = useState([
    { id: 'p1', farmer: 'Vamsi Krishna', crop: 'Tomato', amount: 14000, date: 'Jan 6, 2025', status: 'pending' as const },
    { id: 'p2', farmer: 'Ramesh Reddy', crop: 'Chilli', amount: 36000, date: 'Jan 5, 2025', status: 'pending' as const },
    { id: 'p3', farmer: 'Lakshmi Devi', crop: 'Brinjal', amount: 8750, date: 'Jan 4, 2025', status: 'completed' as const },
    { id: 'p4', farmer: 'Suresh Kumar', crop: 'Onion', amount: 22000, date: 'Jan 3, 2025', status: 'completed' as const },
  ]);

  const pendingTotal = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const completedTotal = payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  const handleProcessAll = () => {
    setPayouts(prev => prev.map(p => ({ ...p, status: 'completed' as const })));
    toast.success('All payouts processed successfully!');
  };

  const handleProcessOne = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'completed' as const } : p));
    toast.success('Payout processed!');
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

      <motion.div {...fadeInUp}>
        <Card className='bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0'>
          <CardContent className='p-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-white/80 text-sm'>Pending Payouts</p>
                <p className='text-2xl font-bold mt-1'>₹{pendingTotal.toLocaleString('en-IN')}</p>
                <p className='text-white/70 text-xs mt-1'>{payouts.filter(p => p.status === 'pending').length} pending</p>
              </div>
              <div>
                <p className='text-white/80 text-sm'>Completed (This Month)</p>
                <p className='text-2xl font-bold mt-1'>₹{completedTotal.toLocaleString('en-IN')}</p>
                <p className='text-white/70 text-xs mt-1'>{payouts.filter(p => p.status === 'completed').length} completed</p>
              </div>
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
                      {p.status === 'pending' && (
                        <Button size='sm' variant='outline' onClick={() => handleProcessOne(p.id)}>
                          Pay
                        </Button>
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
