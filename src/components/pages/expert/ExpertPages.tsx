'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug, ClipboardList, CheckCircle2, AlertTriangle, MessageSquare,
  Eye, PenLine, BookOpen, ChevronDown, ChevronUp, Sparkles,
  Send, BarChart3, Stethoscope,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/use-app-store';
import { mockDiseaseCases } from '@/data/mock-data';
import {
  PageHeader, StatCard, fadeIn, fadeInUp, staggerContainer,
  SectionWrapper, EmptyState,
} from '@/components/shared/SharedComponents';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ============== EXPERT DASHBOARD ==============
export function ExpertDashboard() {
  const { navigate } = useAppStore();
  const pending = mockDiseaseCases.filter(c => c.status === 'pending').length;

  const quickActions = [
    { label: 'Review Cases', icon: <Bug className='size-5' />, route: 'expert/disease-cases' as const },
    { label: 'Write Advisory', icon: <PenLine className='size-5' />, route: 'expert/advisories' as const },
    { label: 'View Analytics', icon: <BarChart3 className='size-5' />, route: 'expert/dashboard' as const },
  ];

  return (
    <div className='space-y-6'>
      <motion.div {...fadeInUp}>
        <Card className='bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-white/80 text-sm'>Welcome back,</p>
                <h1 className='text-2xl font-bold mt-1'>Dr. Anitha Reddy</h1>
                <p className='text-white/70 text-sm mt-1'>Agricultural Expert · Telangana</p>
              </div>
              <div className='text-5xl'>👩‍⚕️</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard title='Pending Reviews' value={pending} subtitle='awaiting your review' icon={<Bug className='size-5' />} onClick={() => navigate('expert/disease-cases')} />
        <StatCard title='Cases This Week' value={12} subtitle='total reviewed' icon={<Stethoscope className='size-5' />} trend={{ value: 15, isPositive: true }} />
        <StatCard title='Published Advisories' value={8} subtitle='this month' icon={<BookOpen className='size-5' />} onClick={() => navigate('expert/advisories')} trend={{ value: 25, isPositive: true }} />
      </div>

      <SectionWrapper title='Recent Cases' action={<Button variant='ghost' size='sm' className='text-primary' onClick={() => navigate('expert/disease-cases')}>View all <Eye className='size-4 ml-1' /></Button>}>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {mockDiseaseCases.map((c, idx) => {
            const cropIcon = c.cropName === 'Tomato' ? '🍅' : c.cropName === 'Rice' ? '🌾' : c.cropName === 'Cotton' ? '🧵' : '🌱';
            return (
              <motion.div key={c.id} {...fadeIn} transition={{ delay: idx * 0.08 }}>
                <Card className='hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5' onClick={() => navigate('expert/disease-cases')}>
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-3 mb-3'>
                      <span className='text-2xl'>{cropIcon}</span>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-sm'>{c.cropName} Disease</h3>
                        <p className='text-xs text-muted-foreground'>{c.farmerName}</p>
                      </div>
                      <Badge variant='secondary' className={
                        c.status === 'pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      }>
                        {c.status}
                      </Badge>
                    </div>
                    <div className='space-y-1.5'>
                      <div className='flex justify-between text-xs'>
                        <span className='text-muted-foreground'>AI Confidence</span>
                        <span className='font-medium'>{c.confidence}%</span>
                      </div>
                      <Progress value={c.confidence} className='h-1.5' />
                    </div>
                    <div className='mt-3'>
                      <Button size='sm' variant='outline' className='w-full' onClick={(e) => { e.stopPropagation(); navigate('expert/disease-cases'); }}>
                        Review Case
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper title='Quick Actions'>
        <div className='grid grid-cols-3 gap-3'>
          {quickActions.map((action, idx) => (
            <motion.div key={action.label} {...fadeIn} transition={{ delay: idx * 0.05 }}>
              <Card className='hover:shadow-sm transition-all cursor-pointer' onClick={() => navigate(action.route)}>
                <CardContent className='p-4 flex flex-col items-center text-center gap-2'>
                  <div className='w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600'>
                    {action.icon}
                  </div>
                  <p className='text-xs font-medium'>{action.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}

// ============== EXPERT DISEASE CASES ==============
export function ExpertDiseaseCases() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    diseaseName: '',
    severity: '',
    notes: '',
    treatment: '',
  });
  const [activeTab, setActiveTab] = useState('pending');

  const pendingCases = mockDiseaseCases.filter(c => c.status === 'pending');
  const reviewedCases = mockDiseaseCases.filter(c => c.status === 'reviewed');

  const handleSubmitReview = () => {
    toast.success('Review submitted successfully!');
    setExpandedId(null);
    setFormData({ diseaseName: '', severity: '', notes: '', treatment: '' });
  };

  const cropIcon = (name: string) =>
    name === 'Tomato' ? '🍅' : name === 'Rice' ? '🌾' : name === 'Cotton' ? '🧵' : name === 'Chilli' ? '🌶️' : '🌱';

  return (
    <div className='space-y-6'>
      <PageHeader title='Disease Cases' subtitle={`${mockDiseaseCases.length} cases to review`} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList>
          <TabsTrigger value='pending'>
            Pending ({pendingCases.length})
          </TabsTrigger>
          <TabsTrigger value='reviewed'>
            Reviewed ({reviewedCases.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='pending' className='mt-4'>
          <div className='space-y-4'>
            {pendingCases.map((c, idx) => (
              <motion.div key={c.id} {...fadeIn} transition={{ delay: idx * 0.05 }}>
                <Card className={expandedId === c.id ? 'border-emerald-200 dark:border-emerald-800' : ''}>
                  <CardContent className='p-4 sm:p-6'>
                    <div
                      className='flex items-center gap-4 cursor-pointer'
                      onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    >
                      <div className='size-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-2xl shrink-0'>
                        {cropIcon(c.cropName)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-sm'>{c.cropName} Disease</h3>
                        <div className='flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground'>
                          <span>{c.farmerName}</span>
                          <span>·</span>
                          <span>{c.location}</span>
                          <span>·</span>
                          <span>Submitted: {new Date(c.submittedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2 shrink-0'>
                        <Badge variant='secondary' className='bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'>
                          {c.status}
                        </Badge>
                        {expandedId === c.id ? <ChevronUp className='size-4 text-muted-foreground' /> : <ChevronDown className='size-4 text-muted-foreground' />}
                      </div>
                    </div>

                    <div className='mt-3 flex items-center gap-3'>
                      <span className='text-xs text-muted-foreground'>AI Confidence</span>
                      <Progress value={c.confidence} className='flex-1 h-1.5' />
                      <span className='text-xs font-medium'>{c.confidence}%</span>
                    </div>

                    <AnimatePresence>
                      {expandedId === c.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className='overflow-hidden'
                        >
                          <div className='mt-4 pt-4 border-t space-y-4'>
                            <p className='text-sm font-medium flex items-center gap-2'>
                              <Sparkles className='size-4 text-amber-500' /> Expert Diagnosis Form
                            </p>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                              <div className='space-y-2'>
                                <Label htmlFor={`disease-${c.id}`}>Disease Name</Label>
                                <Input
                                  id={`disease-${c.id}`}
                                  placeholder='Enter identified disease'
                                  value={formData.diseaseName}
                                  onChange={(e) => setFormData({ ...formData, diseaseName: e.target.value })}
                                />
                              </div>
                              <div className='space-y-2'>
                                <Label htmlFor={`severity-${c.id}`}>Severity</Label>
                                <Select value={formData.severity} onValueChange={(val) => setFormData({ ...formData, severity: val })}>
                                  <SelectTrigger id={`severity-${c.id}`}>
                                    <SelectValue placeholder='Select severity' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='low'>Low</SelectItem>
                                    <SelectItem value='moderate'>Moderate</SelectItem>
                                    <SelectItem value='high'>High</SelectItem>
                                    <SelectItem value='severe'>Severe</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor={`notes-${c.id}`}>Notes</Label>
                              <Textarea
                                id={`notes-${c.id}`}
                                placeholder='Add diagnostic notes...'
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className='min-h-[80px]'
                              />
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor={`treatment-${c.id}`}>Recommended Treatment</Label>
                              <Textarea
                                id={`treatment-${c.id}`}
                                placeholder='Recommend treatment plan...'
                                value={formData.treatment}
                                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                                className='min-h-[80px]'
                              />
                            </div>

                            <div className='flex gap-2 justify-end'>
                              <Button variant='outline' size='sm' onClick={() => { setExpandedId(null); }}>
                                Cancel
                              </Button>
                              <Button size='sm' onClick={handleSubmitReview}>
                                <Send className='size-4 mr-1' /> Submit Review
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {pendingCases.length === 0 && (
              <EmptyState icon='✅' title='No pending cases' description='All cases have been reviewed' />
            )}
          </div>
        </TabsContent>

        <TabsContent value='reviewed' className='mt-4'>
          <div className='space-y-3'>
            {reviewedCases.map((c, idx) => (
              <motion.div key={c.id} {...fadeIn} transition={{ delay: idx * 0.05 }}>
                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-4'>
                      <div className='size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-xl'>
                        {cropIcon(c.cropName)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-medium text-sm'>{c.cropName} — {c.farmerName}</h3>
                        <p className='text-xs text-muted-foreground'>{c.location} · Confidence: {c.confidence}%</p>
                      </div>
                      <Badge variant='secondary' className='bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'>
                        Reviewed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============== EXPERT ADVISORIES ==============
export function ExpertAdvisories() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [advisoryForm, setAdvisoryForm] = useState({
    title: '',
    content: '',
    region: '',
  });

  const advisories = [
    {
      id: 'a1',
      title: 'Managing Early Blight in Tomato Crops',
      content: 'Early blight is a common fungal disease affecting tomato plants across Telangana. This advisory covers identification, prevention through proper spacing and drip irrigation, and treatment using Bordeaux mixture and neem-based organic solutions. Farmers should monitor their crops weekly during the flowering stage.',
      publishedDate: 'Jan 4, 2025',
      region: 'Telangana',
      views: 234,
    },
    {
      id: 'a2',
      title: 'Whitefly Control in Chilli Crop',
      content: 'Whitefly infestations have been reported in Guntur and surrounding chilli-growing regions. This advisory recommends yellow sticky traps for monitoring, application of imidacloprid as a soil drench, and release of Encarsia formosa parasitoids as biological control. Avoid overhead irrigation to reduce humidity.',
      publishedDate: 'Jan 2, 2025',
      region: 'Andhra Pradesh',
      views: 189,
    },
    {
      id: 'a3',
      title: 'Rice Blast Disease Prevention in Kharif Season',
      content: 'With kharif season approaching, rice blast disease management is critical. This advisory covers resistant variety selection (BPT-5204, MTU-1010), seed treatment with Tricyclazole, balanced nitrogen application, and proper water management. Farmers in Karimnagar and Warangal districts should be particularly vigilant.',
      publishedDate: 'Dec 28, 2024',
      region: 'Telangana',
      views: 312,
    },
  ];

  const handlePublish = () => {
    if (!advisoryForm.title || !advisoryForm.content || !advisoryForm.region) {
      toast.error('Please fill all fields');
      return;
    }
    toast.success('Advisory published successfully!');
    setIsDialogOpen(false);
    setAdvisoryForm({ title: '', content: '', region: '' });
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Published Advisories'
        subtitle={`${advisories.length} advisories published`}
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PenLine className='size-4 mr-1' /> Write New Advisory
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg'>
              <DialogHeader>
                <DialogTitle>New Advisory</DialogTitle>
                <DialogDescription>Write an advisory for farmers in your region.</DialogDescription>
              </DialogHeader>
              <div className='space-y-4 pt-2'>
                <div className='space-y-2'>
                  <Label htmlFor='advisory-title'>Title</Label>
                  <Input
                    id='advisory-title'
                    placeholder='e.g., Managing Pest Outbreak in Cotton'
                    value={advisoryForm.title}
                    onChange={(e) => setAdvisoryForm({ ...advisoryForm, title: e.target.value })}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='advisory-content'>Content</Label>
                  <Textarea
                    id='advisory-content'
                    placeholder='Write your advisory content here...'
                    value={advisoryForm.content}
                    onChange={(e) => setAdvisoryForm({ ...advisoryForm, content: e.target.value })}
                    className='min-h-[150px]'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='advisory-region'>Region</Label>
                  <Select value={advisoryForm.region} onValueChange={(val) => setAdvisoryForm({ ...advisoryForm, region: val })}>
                    <SelectTrigger id='advisory-region'>
                      <SelectValue placeholder='Select region' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Telangana'>Telangana</SelectItem>
                      <SelectItem value='Andhra Pradesh'>Andhra Pradesh</SelectItem>
                      <SelectItem value='Karnataka'>Karnataka</SelectItem>
                      <SelectItem value='Maharashtra'>Maharashtra</SelectItem>
                      <SelectItem value='All India'>All India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex gap-2 justify-end pt-2'>
                  <Button variant='outline' onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handlePublish}>Publish</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className='space-y-4'>
        {advisories.map((a, idx) => (
          <motion.div key={a.id} {...fadeIn} transition={{ delay: idx * 0.08 }}>
            <Card className='hover:shadow-md transition-all'>
              <CardContent className='p-4 sm:p-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0'>
                    <MessageSquare className='size-5 text-emerald-600' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-sm'>{a.title}</h3>
                    <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>{a.content}</p>
                    <div className='flex flex-wrap items-center gap-2 mt-3'>
                      <Badge variant='outline' className='text-xs'>
                        📍 {a.region}
                      </Badge>
                      <span className='text-xs text-muted-foreground'>{a.publishedDate}</span>
                      <span className='text-xs text-muted-foreground flex items-center gap-1'>
                        <Eye className='size-3' /> {a.views} views
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
