'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets, CloudRain, Thermometer, Sun, Wind, AlertTriangle,
  Upload, Camera, CheckCircle2, Circle, ChevronDown, ChevronRight,
  TrendingUp, TrendingDown, Minus, Leaf, Flower2, Sprout,
  Scissors, Hourglass, AlertCircle, Info, Shield, Zap,
  ArrowRight, Check, X, Loader2, Eye, UploadCloud,
  Clock, MapPin, Gauge, Waves, Beaker, TestTubes,
  CalendarDays, Navigation2, Truck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  PageHeader, CircularProgress, MarketPriceCard, AIInsightCard,
  SectionWrapper, fadeIn, fadeInUp, staggerContainer, scaleIn,
} from '@/components/shared/SharedComponents';
import { useAppStore } from '@/store/use-app-store';
import {
  mockSoilHealth, mockCropRecommendations, mockDiseaseResult,
  mockFertilizerRecs, mockIrrigationStatus, mockWeather,
  mockForecast, mockMarketPrices, mockMarketPrediction, priceHistory,
} from '@/data/mock-data';
import type { CropRecommendation, DiseaseDetection, CropStage } from '@/types';
import { cn } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';

// ============================================================
// 1. SOIL HEALTH PAGE
// ============================================================
export function SoilHealthPage() {
  const [showUpload, setShowUpload] = useState(false);
  const soil = mockSoilHealth;

  const nutrients = [
    { label: 'Nitrogen', value: '245 kg/ha', status: 'low' as const, statusLabel: 'LOW', icon: <Beaker className='w-4 h-4' /> },
    { label: 'Phosphorus', value: '32 kg/ha', status: 'optimal' as const, statusLabel: 'OPTIMAL', icon: <TestTubes className='w-4 h-4' /> },
    { label: 'Potassium', value: '380 kg/ha', status: 'optimal' as const, statusLabel: 'OPTIMAL', icon: <Gauge className='w-4 h-4' /> },
    { label: 'pH', value: '6.8', status: 'optimal' as const, statusLabel: 'OPTIMAL', icon: <Droplets className='w-4 h-4' /> },
    { label: 'Organic Carbon', value: '0.72%', status: 'optimal' as const, statusLabel: 'OPTIMAL', icon: <Leaf className='w-4 h-4' /> },
  ];

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      case 'optimal': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'high': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader title="Soil Health Intelligence" subtitle="Monitor and improve your soil quality" />

      {/* Hero Card with Circular Progress */}
      <motion.div {...fadeInUp}>
        <Card className='border-0 gradient-green text-white'>
          <CardContent className='p-6'>
            <div className='flex flex-col sm:flex-row items-center gap-6'>
              <CircularProgress value={soil.score} label={String(soil.score)} sublabel={soil.grade.toUpperCase()} color='#ffffff' />
              <div className='text-center sm:text-left'>
                <h2 className='text-xl font-bold'>Overall Soil Health</h2>
                <p className='text-white/80 mt-1 text-sm'>Last tested: {soil.lastTestDate}</p>
                <div className='flex flex-wrap gap-2 mt-3'>
                  {soil.suitableCrops.slice(0, 3).map(crop => (
                    <Badge key={crop} className='bg-white/20 text-white hover:bg-white/30 border-0'>{crop}</Badge>
                  ))}
                  {soil.suitableCrops.length > 3 && (
                    <Badge className='bg-white/20 text-white hover:bg-white/30 border-0'>+{soil.suitableCrops.length - 3} more</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Nutrient Cards */}
      <SectionWrapper title="Nutrient Levels" subtitle="Detailed breakdown of soil nutrients">
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
          {nutrients.map((n, i) => (
            <motion.div key={n.label} {...fadeIn} transition={{ delay: i * 0.08 }}>
              <Card className='hover:shadow-md transition-shadow'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='p-1.5 rounded-lg bg-primary/10 text-primary'>{n.icon}</div>
                    <span className='text-xs text-muted-foreground font-medium'>{n.label}</span>
                  </div>
                  <p className='text-lg font-bold'>{n.value}</p>
                  <Badge className={cn('mt-2 text-[10px] px-1.5 py-0', statusBadgeColor(n.status))} variant='secondary'>
                    {n.statusLabel}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* AI Analysis */}
      <AIInsightCard
        title="AI Soil Analysis"
        message="Your soil is suitable for vegetable cultivation, but nitrogen levels should be improved for optimal tomato growth."
        type='info'
      />

      {/* Recommended Actions */}
      <SectionWrapper title="Recommended Actions" subtitle="Tasks to improve soil health">
        <div className='space-y-3'>
          {soil.recommendations.map((rec, i) => (
            <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.08 }}>
              <Card className='hover:shadow-sm transition-shadow'>
                <CardContent className='p-4 flex items-start gap-3'>
                  <div className='mt-0.5'>
                    <Circle className='w-5 h-5 text-muted-foreground/40' />
                  </div>
                  <p className='text-sm leading-relaxed'>{rec}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA Button */}
      <motion.div {...fadeIn} className='pb-4'>
        <Button
          onClick={() => setShowUpload(true)}
          className='w-full sm:w-auto gradient-green text-white hover:opacity-90'
          size='lg'
        >
          <UploadCloud className='w-4 h-4 mr-2' />
          Analyze New Soil Report
        </Button>
      </motion.div>

      {/* Upload Dialog (visual only) */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Soil Report</DialogTitle>
            <DialogDescription>Upload your soil test report for AI analysis</DialogDescription>
          </DialogHeader>
          <div className='border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center space-y-3 hover:border-primary/50 transition-colors cursor-pointer'>
            <Upload className='w-10 h-10 mx-auto text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>Drag & drop your soil report here</p>
            <p className='text-xs text-muted-foreground'>PDF, JPG, PNG up to 10MB</p>
            <Button variant='outline' size='sm'>Browse Files</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// 2. CROP RECOMMENDATIONS PAGE
// ============================================================
export function CropRecommendationsPage() {
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [waterFilter, setWaterFilter] = useState('all');
  const [selectedRec, setSelectedRec] = useState<CropRecommendation | null>(null);

  const filtered = mockCropRecommendations.filter(rec => {
    if (seasonFilter !== 'all' && rec.season !== seasonFilter) return false;
    if (waterFilter !== 'all' && rec.waterRequirement !== waterFilter) return false;
    return true;
  });

  const riskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default: return '';
    }
  };

  const waterIcon = (w: string) => {
    switch (w) {
      case 'low': return <Droplets className='w-3 h-3' />;
      case 'medium': return <Waves className='w-3 h-3' />;
      case 'high': return <CloudRain className='w-3 h-3' />;
      default: return null;
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader title="Crop Recommendations" subtitle="AI-powered crop suggestions for your farm" />

      {/* Filters */}
      <motion.div {...fadeIn} className='flex flex-wrap gap-2'>
        <div className='flex items-center gap-1.5 mr-2'>
          <span className='text-xs text-muted-foreground font-medium'>Season:</span>
          {['all', 'kharif', 'rabi', 'zaid'].map(s => (
            <Button
              key={s}
              size='sm'
              variant={seasonFilter === s ? 'default' : 'outline'}
              onClick={() => setSeasonFilter(s)}
              className='text-xs h-8'
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
        <Separator orientation='vertical' className='h-8 hidden sm:block' />
        <div className='flex items-center gap-1.5'>
          <span className='text-xs text-muted-foreground font-medium'>Water:</span>
          {['all', 'low', 'medium', 'high'].map(w => (
            <Button
              key={w}
              size='sm'
              variant={waterFilter === w ? 'default' : 'outline'}
              onClick={() => setWaterFilter(w)}
              className='text-xs h-8'
            >
              {w === 'all' ? 'All' : w.charAt(0).toUpperCase() + w.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Recommendation Grid */}
      <motion.div
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
        variants={staggerContainer}
        initial='initial'
        animate='animate'
      >
        {filtered.map((rec) => (
          <motion.div key={rec.id} {...scaleIn}>
            <Card className='hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full'
              onClick={() => setSelectedRec(selectedRec?.id === rec.id ? null : rec)}
            >
              <CardContent className='p-4 space-y-3'>
                <div className='flex items-start gap-3'>
                  <div className='text-3xl'>{rec.icon}</div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <h3 className='font-semibold'>{rec.cropName}</h3>
                      <span className='text-2xl font-bold text-emerald-600'>{rec.suitability}%</span>
                    </div>
                    <p className='text-xs text-muted-foreground'>Suitability Score</p>
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-2 text-center'>
                  <div className='bg-muted/50 rounded-lg p-2'>
                    <p className='text-xs text-muted-foreground'>Revenue</p>
                    <p className='text-sm font-semibold'>{rec.expectedRevenue}</p>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-2'>
                    <p className='text-xs text-muted-foreground'>Water</p>
                    <p className='text-sm font-semibold flex items-center justify-center gap-1'>
                      {waterIcon(rec.waterRequirement)}
                      {rec.waterRequirement.charAt(0).toUpperCase() + rec.waterRequirement.slice(1)}
                    </p>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-2'>
                    <p className='text-xs text-muted-foreground'>Risk</p>
                    <Badge className={cn('text-[10px]', riskColor(rec.risk))} variant='secondary'>
                      {rec.risk.charAt(0).toUpperCase() + rec.risk.slice(1)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full text-xs'
                  onClick={(e) => { e.stopPropagation(); setSelectedRec(selectedRec?.id === rec.id ? null : rec); }}
                >
                  <Eye className='w-3 h-3 mr-1' />
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Detail Section */}
      <AnimatePresence>
        {selectedRec && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className='border-primary/30 shadow-lg'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <span className='text-3xl'>{selectedRec.icon}</span>
                  <div>
                    <CardTitle>{selectedRec.cropName} Details</CardTitle>
                    <p className='text-sm text-muted-foreground mt-1'>Growing Duration: {selectedRec.growingDuration}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-5'>
                <div>
                  <h4 className='font-semibold text-sm mb-2 flex items-center gap-2'>
                    <CheckCircle2 className='w-4 h-4 text-emerald-600' /> Why This Crop?
                  </h4>
                  <ul className='space-y-2'>
                    {selectedRec.reasons.map((r, i) => (
                      <li key={i} className='flex items-start gap-2 text-sm text-muted-foreground'>
                        <Check className='w-4 h-4 text-emerald-600 mt-0.5 shrink-0' />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className='font-semibold text-sm mb-2 flex items-center gap-2'>
                    <TrendingUp className='w-4 h-4 text-emerald-600' /> Market Opportunity
                  </h4>
                  <p className='text-sm text-muted-foreground'>{selectedRec.marketOpportunity}</p>
                </div>
                <Separator />
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-muted/50 rounded-lg p-3'>
                    <p className='text-xs text-muted-foreground'>Investment</p>
                    <p className='font-semibold'>{selectedRec.investment}</p>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-3'>
                    <p className='text-xs text-muted-foreground'>Expected Yield</p>
                    <p className='font-semibold'>{selectedRec.expectedYield}</p>
                  </div>
                </div>
                <Button className='w-full gradient-green text-white hover:opacity-90' size='lg'>
                  Select This Crop
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// 3. DISEASE DETECTION PAGE
// ============================================================
export function DiseaseDetectionPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseDetection | null>(null);
  const { navigate } = useAppStore();

  const handleScan = useCallback(() => {
    if (analyzing) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(mockDiseaseResult);
    }, 2000);
  }, [analyzing]);

  const severityColor = (s: string) => {
    switch (s) {
      case 'low': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'moderate': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      case 'severe': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default: return '';
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader title="Disease Detection" subtitle="AI-powered crop disease identification" />

      {/* Scan Area */}
      <motion.div {...fadeInUp}>
        <Card className='border-0 overflow-hidden'>
          <CardContent className='p-0'>
            <div
              className='border-2 border-dashed border-muted-foreground/30 rounded-2xl p-8 sm:p-12 text-center space-y-4 bg-muted/20 hover:border-primary/40 transition-colors cursor-pointer'
              onClick={handleScan}
            >
              {analyzing ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='space-y-4'
                >
                  <div className='relative inline-flex items-center justify-center'>
                    <div className='w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin' />
                    <div className='absolute'>
                      <Loader2 className='w-8 h-8 text-primary animate-spin' />
                    </div>
                  </div>
                  <p className='text-lg font-semibold'>Analyzing with AI...</p>
                  <p className='text-sm text-muted-foreground'>Identifying diseases and providing recommendations</p>
                </motion.div>
              ) : (
                <>
                  <div className='text-6xl'>📷</div>
                  <div>
                    <h3 className='text-lg font-semibold'>Scan Your Crop</h3>
                    <p className='text-sm text-muted-foreground mt-1'>Take a photo or upload an image of the affected area</p>
                  </div>
                  <div className='flex items-center justify-center gap-3 pt-2'>
                    <Button className='gradient-green text-white hover:opacity-90'>
                      <Camera className='w-4 h-4 mr-2' />
                      Take Photo
                    </Button>
                    <Button variant='outline' onClick={(e) => { e.stopPropagation(); handleScan(); }}>
                      <Upload className='w-4 h-4 mr-2' />
                      Upload
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disease Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='space-y-4'
          >
            {/* Disease Header Card */}
            <Card className='border-red-200 dark:border-red-800'>
              <CardContent className='p-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2.5 rounded-xl bg-red-100 dark:bg-red-950'>
                      <AlertTriangle className='w-5 h-5 text-red-600 dark:text-red-400' />
                    </div>
                    <div>
                      <h3 className='font-bold text-lg'>{result.diseaseName}</h3>
                      <p className='text-sm text-muted-foreground'>Detected in {result.cropName}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-red-600'>{result.confidence}%</p>
                      <p className='text-xs text-muted-foreground'>Confidence</p>
                    </div>
                    <Badge className={cn('text-xs', severityColor(result.severity))} variant='secondary'>
                      {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className='p-4'>
                <h4 className='font-semibold text-sm mb-2 flex items-center gap-2'>
                  <Info className='w-4 h-4 text-blue-500' /> Description
                </h4>
                <p className='text-sm text-muted-foreground leading-relaxed'>{result.description}</p>
              </CardContent>
            </Card>

            {/* Causes */}
            <Card>
              <CardContent className='p-4'>
                <h4 className='font-semibold text-sm mb-3 flex items-center gap-2'>
                  <AlertCircle className='w-4 h-4 text-amber-500' /> Causes
                </h4>
                <ul className='space-y-2'>
                  {result.causes.map((c, i) => (
                    <li key={i} className='flex items-start gap-2 text-sm text-muted-foreground'>
                      <ChevronRight className='w-4 h-4 text-amber-500 mt-0.5 shrink-0' />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardContent className='p-4'>
                <h4 className='font-semibold text-sm mb-3 flex items-center gap-2'>
                  <Zap className='w-4 h-4 text-emerald-500' /> Recommended Actions
                </h4>
                <ul className='space-y-2'>
                  {result.recommendedActions.map((a, i) => (
                    <li key={i} className='flex items-start gap-2 text-sm text-muted-foreground'>
                      <div className='w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0 mt-0.5'>
                        <span className='text-[10px] font-bold text-emerald-700 dark:text-emerald-300'>{i + 1}</span>
                      </div>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Prevention Tips */}
            <Card>
              <CardContent className='p-4'>
                <h4 className='font-semibold text-sm mb-3 flex items-center gap-2'>
                  <Shield className='w-4 h-4 text-blue-500' /> Prevention Tips
                </h4>
                <ul className='space-y-2'>
                  {result.preventionTips.map((t, i) => (
                    <li key={i} className='flex items-start gap-2 text-sm text-muted-foreground'>
                      <CheckCircle2 className='w-4 h-4 text-blue-500 mt-0.5 shrink-0' />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Consult Expert Button */}
            <Button
              className='w-full gradient-green text-white hover:opacity-90'
              size='lg'
              onClick={() => navigate('expert/dashboard')}
            >
              Consult Expert
              <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Scans - empty state */}
      {!result && !analyzing && (
        <SectionWrapper title="Recent Scans" subtitle="Your recent disease detection results">
          <Card>
            <CardContent className='p-8 text-center'>
              <div className='text-4xl mb-3'>🔍</div>
              <p className='text-sm text-muted-foreground'>No scans yet. Scan your crop to detect diseases.</p>
            </CardContent>
          </Card>
        </SectionWrapper>
      )}
    </div>
  );
}

// ============================================================
// 4. FERTILIZER PAGE
// ============================================================
const STAGES: { key: CropStage; label: string; icon: React.ReactNode }[] = [
  { key: 'planting', label: 'Planting', icon: <Sprout className='w-4 h-4' /> },
  { key: 'vegetative', label: 'Vegetative', icon: <Leaf className='w-4 h-4' /> },
  { key: 'flowering', label: 'Flowering', icon: <Flower2 className='w-4 h-4' /> },
  { key: 'harvest', label: 'Harvest', icon: <Scissors className='w-4 h-4' /> },
];

export function FertilizerPage() {
  const [farm, setFarm] = useState('farm1');
  const [crop, setCrop] = useState('tomato');
  const currentStage: CropStage = 'flowering';
  const currentStageIdx = STAGES.findIndex(s => s.key === currentStage);

  const stageLabel = (stage: string) => {
    const s = STAGES.find(st => st.key === stage);
    return s ? s.label : stage;
  };

  return (
    <div className='space-y-6'>
      <PageHeader title="Fertilizer Recommendations" subtitle="Crop-stage specific fertilizer guidance" />

      {/* Selectors */}
      <motion.div {...fadeIn} className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div>
          <label className='text-xs text-muted-foreground font-medium mb-1.5 block'>Farm</label>
          <Select value={farm} onValueChange={setFarm}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value='farm1'>Green Valley Farm</SelectItem>
              <SelectItem value='farm2'>Cherry Blossom Acres</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className='text-xs text-muted-foreground font-medium mb-1.5 block'>Crop</label>
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value='tomato'>🍅 Tomato</SelectItem>
              <SelectItem value='rice'>🌾 Rice</SelectItem>
              <SelectItem value='chilli'>🌶️ Chilli</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Growth Timeline */}
      <motion.div {...fadeInUp}>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between relative'>
              {/* Progress line */}
              <div className='absolute top-5 left-8 right-8 h-0.5 bg-muted hidden sm:block'>
                <div
                  className='h-full bg-primary transition-all'
                  style={{ width: `${(currentStageIdx / (STAGES.length - 1)) * 100}%` }}
                />
              </div>
              {STAGES.map((stage, idx) => {
                const isCompleted = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div key={stage.key} className='flex flex-col items-center gap-2 relative z-10 flex-1'>
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                      isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse-green',
                      isCompleted && 'bg-primary text-primary-foreground',
                      !isCurrent && !isCompleted && 'bg-muted text-muted-foreground'
                    )}>
                      {stage.icon}
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      isCurrent && 'text-primary',
                      isCompleted && 'text-muted-foreground',
                      !isCurrent && !isCompleted && 'text-muted-foreground'
                    )}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fertilizer Recommendation Cards */}
      <SectionWrapper title="Fertilizer Schedule" subtitle="Stage-wise fertilizer recommendations">
        <div className='space-y-4'>
          {mockFertilizerRecs.map((rec, i) => {
            const isCurrent = rec.stage === currentStage;
            return (
              <motion.div key={rec.id} {...fadeIn} transition={{ delay: i * 0.08 }}>
                <Card className={cn(
                  'transition-all hover:shadow-md',
                  isCurrent && 'border-2 border-primary shadow-md bg-primary/[0.02]'
                )}>
                  <CardContent className='p-4'>
                    <div className='flex flex-col sm:flex-row sm:items-start gap-4'>
                      <div className='flex items-center gap-2 sm:flex-col sm:items-center sm:text-center sm:min-w-[100px]'>
                        <Badge className={cn(
                          'text-xs',
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )} variant={isCurrent ? 'default' : 'secondary'}>
                          {stageLabel(rec.stage)}
                        </Badge>
                        {isCurrent && (
                          <span className='text-[10px] text-primary font-medium'>CURRENT STAGE</span>
                        )}
                      </div>
                      <div className='flex-1 space-y-2'>
                        <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm'>
                          <div>
                            <span className='text-muted-foreground text-xs'>Nutrient: </span>
                            <span className='font-medium'>{rec.nutrient}</span>
                          </div>
                          <div>
                            <span className='text-muted-foreground text-xs'>Quantity: </span>
                            <span className='font-medium'>{rec.quantity}</span>
                          </div>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          <span className='font-medium text-foreground/70'>Method:</span> {rec.applicationMethod}
                        </p>
                        <div className='flex flex-wrap gap-3 text-xs text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <Clock className='w-3 h-3' /> {rec.timing}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Leaf className='w-3 h-3' /> {rec.product}
                          </span>
                        </div>
                        {rec.warning && (
                          <div className='flex items-start gap-2 bg-amber-50 dark:bg-amber-950 rounded-lg p-2.5 text-xs text-amber-800 dark:text-amber-200'>
                            <AlertTriangle className='w-3.5 h-3.5 mt-0.5 shrink-0' />
                            <span>{rec.warning}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>
    </div>
  );
}

// ============================================================
// 5. IRRIGATION PAGE
// ============================================================
export function IrrigationPage() {
  const status = mockIrrigationStatus;

  const factorCardColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'low': return 'border-amber-300 dark:border-amber-700';
      case 'normal': return 'border-emerald-300 dark:border-emerald-700';
      case 'critical': return 'border-red-300 dark:border-red-700';
      default: return 'border-border';
    }
  };

  const factorDotColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'low': return 'bg-amber-500';
      case 'normal': return 'bg-emerald-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const factors = [
    { label: 'Soil Moisture', value: `${status.factors.soilMoisture.value}%`, status: status.factors.soilMoisture.status, icon: <Droplets className='w-5 h-5' /> },
    { label: 'Temperature', value: `${status.factors.temperature.value}°C`, status: status.factors.temperature.status, icon: <Thermometer className='w-5 h-5' /> },
    { label: 'Rain Probability', value: `${status.factors.rainProbability.value}%`, status: status.factors.rainProbability.status, icon: <CloudRain className='w-5 h-5' /> },
    { label: 'Crop Stage', value: status.factors.cropStage.value, status: status.factors.cropStage.status, icon: <Flower2 className='w-5 h-5' /> },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader title="Irrigation Management" subtitle="Smart water management for your crops" />

      {/* Big Status Card */}
      <motion.div {...fadeInUp}>
        <Card className={cn('border-0', status.required ? 'gradient-green' : 'bg-blue-500') + ' text-white'}>
          <CardContent className='p-6'>
            <div className='flex flex-col sm:flex-row items-center gap-6'>
              <div className='text-6xl'>💧</div>
              <div className='text-center sm:text-left'>
                <h2 className='text-xl font-bold'>{status.required ? 'Irrigation Recommended' : 'No Irrigation Needed'}</h2>
                <p className='text-white/80 mt-1 text-sm'>Based on current conditions and crop needs</p>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4 mt-6'>
              <div className='bg-white/15 rounded-xl p-4 text-center'>
                <p className='text-white/70 text-xs'>Recommended Water</p>
                <p className='text-2xl font-bold mt-1'>{status.recommendedWater.toLocaleString()} Liters</p>
              </div>
              <div className='bg-white/15 rounded-xl p-4 text-center'>
                <p className='text-white/70 text-xs'>Best Time</p>
                <p className='text-2xl font-bold mt-1'>{status.bestTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Factor Cards 2x2 Grid */}
      <SectionWrapper title="Irrigation Factors" subtitle="Key parameters affecting irrigation decision">
        <div className='grid grid-cols-2 gap-3'>
          {factors.map((f, i) => (
            <motion.div key={f.label} {...fadeIn} transition={{ delay: i * 0.08 }}>
              <Card className={cn('h-full', factorCardColor(f.status))}>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='p-2 rounded-lg bg-muted text-muted-foreground'>{f.icon}</div>
                    <div className='flex items-center gap-1.5'>
                      <div className={cn('w-2 h-2 rounded-full', factorDotColor(f.status))} />
                      <span className={cn(
                        'text-[10px] font-semibold uppercase',
                        f.status === 'Low' && 'text-amber-600',
                        f.status === 'Normal' && 'text-emerald-600',
                        f.status === 'Critical' && 'text-red-600',
                      )}>
                        {f.status}
                      </span>
                    </div>
                  </div>
                  <p className='text-xs text-muted-foreground'>{f.label}</p>
                  <p className='text-xl font-bold mt-1'>{f.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* AI Explanation */}
      <AIInsightCard
        title="AI Irrigation Analysis"
        message={status.aiExplanation}
        type={status.required ? 'success' : 'info'}
      />
    </div>
  );
}

// ============================================================
// 6. WEATHER PAGE
// ============================================================
export function WeatherPage() {
  const weather = mockWeather;
  const forecast = mockForecast;
  const alerts = forecast.filter(f => f.farmingAlert);

  // Determine gradient based on weather condition
  const getWeatherGradient = () => {
    const cond = weather.condition.toLowerCase();
    if (cond.includes('sunny')) return 'from-emerald-600 via-emerald-500 to-teal-500';
    if (cond.includes('rain') || cond.includes('thunder')) return 'from-blue-600 via-blue-500 to-cyan-600';
    if (cond.includes('cloud')) return 'from-slate-500 via-gray-400 to-slate-500';
    return 'from-emerald-600 via-emerald-500 to-teal-500';
  };

  // Farming impact cards data
  const farmingImpacts = [
    {
      title: 'Irrigation Need',
      status: weather.temperature > 30 && weather.humidity < 60 ? 'High' : 'Moderate',
      severity: weather.temperature > 30 && weather.humidity < 60 ? 'red' : 'green',
      icon: Droplets,
      message: weather.temperature > 30 && weather.humidity < 60
        ? 'High evaporation rate detected. Water crops early morning or evening to minimize loss.'
        : 'Normal conditions. Maintain regular watering schedule.',
    },
    {
      title: 'Pesticide Spray',
      status: weather.rainProbability > 50 ? 'Not Recommended' : 'Suitable',
      severity: weather.rainProbability > 50 ? 'amber' : 'green',
      icon: Shield,
      message: weather.rainProbability > 50
        ? 'Rain expected within 24hrs. Pesticides will be washed off crops.'
        : 'Weather is suitable for pesticide application today.',
    },
    {
      title: 'Harvest Window',
      status: 'Good for next 3 days',
      severity: 'green',
      icon: CalendarDays,
      message: 'Clear weather forecasted for next 3 days. Ideal for harvesting ready crops.',
    },
    {
      title: 'Soil Work',
      status: weather.rainProbability > 60 ? 'Avoid' : 'Good',
      severity: weather.rainProbability > 60 ? 'red' : 'green',
      icon: Sprout,
      message: weather.rainProbability > 60
        ? 'Soil too wet for plowing or transplanting. Wait 2-3 days.'
        : 'Soil conditions favorable for field operations.',
    },
  ];

  // Weather alerts data
  const weatherAlerts = [
    {
      title: 'Heat Wave Warning',
      message: 'Temperature may exceed 40\u00b0C in next 48 hours. Ensure adequate irrigation and provide shade for sensitive crops.',
      severity: 'red' as const,
      time: 'Valid: Jan 7 \u2013 Jan 9',
      icon: Thermometer,
    },
    {
      title: 'Heavy Rain Expected Thursday',
      message: 'Heavy rainfall (80-90mm) expected. Avoid fertilizer application and postpone harvesting.',
      severity: 'amber' as const,
      time: 'Valid: Jan 8 \u2013 Jan 9',
      icon: CloudRain,
    },
  ];

  const severityStyles: Record<string, string> = {
    red: 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800',
    amber: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    green: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  };

  const iconBgStyles: Record<string, string> = {
    red: 'bg-red-200 dark:bg-red-900 text-red-600 dark:text-red-400',
    amber: 'bg-amber-200 dark:bg-amber-900 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className='space-y-6'>
      <PageHeader title="Farming Weather" subtitle="Weather intelligence for better farming decisions" />

      {/* Current Weather Hero */}
      <motion.div {...fadeInUp}>
        <Card className='border-0 overflow-hidden'>
          <div className={cn('bg-gradient-to-br text-white p-6', getWeatherGradient())}>
            <div className='flex items-center gap-2 text-white/70 text-sm mb-1'>
              <MapPin className='w-3.5 h-3.5' /> {weather.location}
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <div className='text-8xl'>{weather.icon}</div>
                <div>
                  <p className='text-6xl font-bold tracking-tight'>{weather.temperature}&deg;C</p>
                  <p className='text-white/80 text-lg mt-1'>{weather.condition}</p>
                  <p className='text-white/60 text-sm'>Feels like {weather.feelsLike}&deg;C</p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                <div className='bg-white/10 rounded-xl p-3 text-center min-w-[80px] backdrop-blur-sm'>
                  <Droplets className='w-5 h-5 mx-auto mb-1' />
                  <p className='text-lg font-bold'>{weather.humidity}%</p>
                  <p className='text-[10px] text-white/60'>Humidity</p>
                </div>
                <div className='bg-white/10 rounded-xl p-3 text-center min-w-[80px] backdrop-blur-sm'>
                  <Wind className='w-5 h-5 mx-auto mb-1' />
                  <p className='text-lg font-bold'>{weather.windSpeed} km/h</p>
                  <p className='text-[10px] text-white/60'>Wind {weather.windDirection}</p>
                </div>
                <div className='bg-white/10 rounded-xl p-3 text-center min-w-[80px] backdrop-blur-sm'>
                  <CloudRain className='w-5 h-5 mx-auto mb-1' />
                  <p className='text-lg font-bold'>{weather.rainProbability}%</p>
                  <p className='text-[10px] text-white/60'>Rain</p>
                </div>
                <div className='bg-white/10 rounded-xl p-3 text-center min-w-[80px] backdrop-blur-sm'>
                  <Sun className='w-5 h-5 mx-auto mb-1' />
                  <p className='text-lg font-bold'>{weather.uvIndex}</p>
                  <p className='text-[10px] text-white/60'>UV Index</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 7-Day Forecast Strip */}
      <SectionWrapper title="7-Day Forecast" subtitle="Plan your farming activities ahead">
        <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-thin'>
          {forecast.map((day, i) => (
            <motion.div key={day.date} {...fadeIn} transition={{ delay: i * 0.05 }} className='shrink-0'>
              <Card className={cn(
                'w-[110px] hover:shadow-md transition-shadow cursor-pointer',
                i === 0
                  ? 'bg-primary text-primary-foreground border-primary'
                  : ''
              )}>
                <CardContent className='p-3 text-center'>
                  <p className={cn('text-xs font-semibold', i === 0 ? 'text-primary-foreground' : 'text-muted-foreground')}>
                    {day.day}
                  </p>
                  <div className='text-3xl my-2'>{day.icon}</div>
                  <div className='flex items-center justify-center gap-1'>
                    <span className={cn('text-sm font-bold', i === 0 && 'text-primary-foreground')}>{day.high}&deg;</span>
                    <span className={cn('text-xs', i === 0 ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{day.low}&deg;</span>
                  </div>
                  <p className={cn(
                    'text-[10px] mt-1.5',
                    day.rainProbability > 30
                      ? (i === 0 ? 'text-primary-foreground/80' : 'text-blue-500')
                      : (i === 0 ? 'text-primary-foreground/50' : 'text-muted-foreground')
                  )}>
                    &#x1F4A7; {day.rainProbability}%
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Farming Impact Cards */}
      <SectionWrapper title="Farming Impact" subtitle="How today's weather affects your farm operations">
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
          {farmingImpacts.map((impact, i) => (
            <motion.div key={impact.title} {...fadeInUp} transition={{ delay: i * 0.08 }}>
              <Card className={cn('border', severityStyles[impact.severity])}>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <impact.icon className='w-4 h-4' />
                    <span className='text-xs font-medium opacity-70'>{impact.title}</span>
                  </div>
                  <p className='font-bold text-sm'>{impact.status}</p>
                  <p className='text-xs opacity-80 mt-1 leading-relaxed'>{impact.message}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Weather Alerts */}
      <SectionWrapper title="Weather Alerts" subtitle="Active warnings and advisories for your region">
        <div className='space-y-3'>
          {weatherAlerts.map((alert, i) => (
            <motion.div key={alert.title} {...fadeInUp} transition={{ delay: i * 0.1 }}>
              <Card className={cn('border', severityStyles[alert.severity])}>
                <CardContent className='p-4'>
                  <div className='flex items-start gap-3'>
                    <div className={cn('p-2 rounded-lg shrink-0', iconBgStyles[alert.severity])}>
                      <alert.icon className='w-5 h-5' />
                    </div>
                    <div className='flex-1'>
                      <p className='font-semibold text-sm mb-1'>{alert.title}</p>
                      <p className='text-sm opacity-80 leading-relaxed'>{alert.message}</p>
                      <p className='text-xs opacity-60 mt-1.5 flex items-center gap-1'>
                        <Clock className='w-3 h-3' /> {alert.time}
                      </p>
                    </div>
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

// ============================================================
// 7. MARKET PRICES PAGE
// ============================================================

const monthlyPriceHistory: Record<string, { month: string; price: number }[]> = {
  tomato: [
    { month: 'Aug', price: 18 }, { month: 'Sep', price: 22 }, { month: 'Oct', price: 20 },
    { month: 'Nov', price: 24 }, { month: 'Dec', price: 26 }, { month: 'Jan', price: 28 },
  ],
  chilli: [
    { month: 'Aug', price: 140 }, { month: 'Sep', price: 155 }, { month: 'Oct', price: 148 },
    { month: 'Nov', price: 160 }, { month: 'Dec', price: 170 }, { month: 'Jan', price: 180 },
  ],
  onion: [
    { month: 'Aug', price: 60 }, { month: 'Sep', price: 55 }, { month: 'Oct', price: 42 },
    { month: 'Nov', price: 38 }, { month: 'Dec', price: 35 }, { month: 'Jan', price: 35 },
  ],
  rice: [
    { month: 'Aug', price: 30 }, { month: 'Sep', price: 31 }, { month: 'Oct', price: 32 },
    { month: 'Nov', price: 33 }, { month: 'Dec', price: 32 }, { month: 'Jan', price: 32 },
  ],
  brinjal: [
    { month: 'Aug', price: 20 }, { month: 'Sep', price: 22 }, { month: 'Oct', price: 21 },
    { month: 'Nov', price: 23 }, { month: 'Dec', price: 24 }, { month: 'Jan', price: 25 },
  ],
  cotton: [
    { month: 'Aug', price: 7200 }, { month: 'Sep', price: 7300 }, { month: 'Oct', price: 7400 },
    { month: 'Nov', price: 7450 }, { month: 'Dec', price: 7500 }, { month: 'Jan', price: 7521 },
  ],
  maize: [
    { month: 'Aug', price: 18 }, { month: 'Sep', price: 19 }, { month: 'Oct', price: 20 },
    { month: 'Nov', price: 21 }, { month: 'Dec', price: 21 }, { month: 'Jan', price: 22 },
  ],
  potato: [
    { month: 'Aug', price: 18 }, { month: 'Sep', price: 22 }, { month: 'Oct', price: 24 },
    { month: 'Nov', price: 23 }, { month: 'Dec', price: 21 }, { month: 'Jan', price: 20 },
  ],
};

export function MarketPricesPage() {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [chartTab, setChartTab] = useState<'weekly' | 'monthly'>('weekly');

  const cropKey = selectedCrop.toLowerCase();
  const weeklyData = priceHistory[cropKey as keyof typeof priceHistory] || [];
  const monthlyData = monthlyPriceHistory[cropKey as keyof typeof monthlyPriceHistory] || [];
  const chartData = chartTab === 'weekly' ? weeklyData : monthlyData;
  const xKey = chartTab === 'weekly' ? 'week' : 'month';

  const prediction = mockMarketPrediction;
  const directionIcon = prediction.direction === 'up'
    ? <TrendingUp className='w-5 h-5 text-emerald-600' />
    : prediction.direction === 'down'
      ? <TrendingDown className='w-5 h-5 text-red-600' />
      : <Minus className='w-5 h-5 text-amber-600' />;

  const confidenceColor = prediction.confidence === 'high'
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
    : prediction.confidence === 'medium'
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
      : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';

  // Enhanced chart data with prediction line
  const trend = chartData.length >= 2
    ? chartData[chartData.length - 1].price - chartData[chartData.length - 2].price
    : 0;

  const enhancedChartData = chartData.map((item, idx) => {
    const remaining = chartData.length - 1 - idx;
    if (remaining > 2) return { ...item, predicted: undefined as number | undefined };
    const futureOffset = (3 - remaining) * 0.35;
    return {
      ...item,
      predicted: +(Math.max(0, item.price + trend * futureOffset)).toFixed(1),
    };
  });

  // MSP values per crop
  const mspValues: Record<string, number> = {
    tomato: 25, rice: 29, chilli: 150, onion: 32,
    cotton: 7000, maize: 19, brinjal: 20, potato: 18,
  };
  const currentMsp = mspValues[cropKey];

  // Market comparison data
  const getMarketComparison = () => {
    const basePrice = mockMarketPrices.find(mp => mp.crop === selectedCrop)?.price ?? 0;
    const markets = [
      { name: 'Warangal', offset: 0, delta: 2.5 },
      { name: 'Hyderabad', offset: 2, delta: -1.8 },
      { name: 'Karimnagar', offset: -2, delta: 1.5 },
      { name: 'Nizamabad', offset: -1, delta: -0.5 },
      { name: 'Khammam', offset: -3, delta: -1.2 },
    ];
    return markets.map(m => ({
      market: m.name,
      todayPrice: basePrice + m.offset,
      yesterday: +(basePrice + m.offset - m.delta).toFixed(1),
      change: m.delta,
    }));
  };

  const marketComparison = getMarketComparison();
  const bestMarket = marketComparison.reduce((best, m) => m.todayPrice > best.todayPrice ? m : best);

  return (
    <div className='space-y-6'>
      <PageHeader title="Market Prices" subtitle="Today's commodity prices and AI predictions" />

      {/* Market Overview Bar */}
      <motion.div {...fadeIn}>
        <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-thin'>
          {mockMarketPrices.slice(0, 5).map(mp => {
            const isUp = mp.change >= 0;
            return (
              <div key={mp.crop} className='flex items-center gap-2 bg-muted/50 border rounded-lg px-3 py-2 shrink-0 min-w-[150px]'>
                <span className='text-xs text-muted-foreground font-medium'>{mp.crop}</span>
                <span className='text-sm font-bold'>&#x20B9;{mp.price.toLocaleString('en-IN')}</span>
                <span className='text-[10px] text-muted-foreground'>/{mp.unit}</span>
                <div className={cn('flex items-center gap-0.5 text-xs font-semibold', isUp ? 'text-emerald-600' : 'text-red-600')}>
                  {isUp ? <TrendingUp className='w-3 h-3' /> : <TrendingDown className='w-3 h-3' />}
                  {isUp ? '+' : ''}{mp.changePercent}%
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Crop Selector Row */}
      <motion.div {...fadeIn}>
        <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-thin'>
          {mockMarketPrices.map(mp => (
            <Button
              key={mp.crop}
              size='sm'
              variant={selectedCrop === mp.crop ? 'default' : 'outline'}
              onClick={() => setSelectedCrop(mp.crop)}
              className='shrink-0 text-xs'
            >
              {mp.crop}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Price Cards Grid */}
      <motion.div
        className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'
        variants={staggerContainer}
        initial='initial'
        animate='animate'
      >
        {mockMarketPrices.map(mp => (
          <motion.div key={mp.crop} {...scaleIn}>
            <MarketPriceCard
              crop={mp.crop}
              price={mp.price}
              unit={mp.unit}
              change={mp.change}
              changePercent={mp.changePercent}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Price History Chart */}
      <SectionWrapper title={`Price History - ${selectedCrop}`} subtitle='Track price trends with AI predictions'>
        <Card>
          <CardContent className='p-4'>
            <Tabs value={chartTab} onValueChange={(v) => setChartTab(v as 'weekly' | 'monthly')}>
              <TabsList className='mb-4'>
                <TabsTrigger value='weekly'>Weekly</TabsTrigger>
                <TabsTrigger value='monthly'>Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value={chartTab} className='mt-0'>
                {chartData.length > 0 ? (
                  <div className='h-[280px] w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={enhancedChartData}>
                        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                        <XAxis
                          dataKey={xKey}
                          tick={{ fontSize: 12 }}
                          className='text-muted-foreground'
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          className='text-muted-foreground'
                          tickFormatter={(v) => `\u20B9${v}`}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                          formatter={(value: number, name: string) => [
                            `\u20B9${value?.toLocaleString('en-IN')}`,
                            name,
                          ]}
                        />
                        <Legend verticalAlign='top' height={36} iconType='line' />
                        {/* MSP Reference Line */}
                        {currentMsp && (
                          <ReferenceLine
                            y={currentMsp}
                            stroke='#ef4444'
                            strokeDasharray='5 5'
                            strokeWidth={1.5}
                            label={{
                              value: 'MSP',
                              fill: '#ef4444',
                              fontSize: 11,
                              position: 'right' as const,
                            }}
                          />
                        )}
                        {/* Actual Price Line */}
                        <Line
                          type='monotone'
                          dataKey='price'
                          name='Actual Price'
                          stroke='#16a34a'
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#16a34a' }}
                          activeDot={{ r: 6 }}
                        />
                        {/* Predicted Price Line (dashed) */}
                        <Line
                          type='monotone'
                          dataKey='predicted'
                          name='AI Predicted'
                          stroke='#f59e0b'
                          strokeWidth={2}
                          strokeDasharray='6 4'
                          dot={{ r: 3, fill: '#f59e0b' }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className='h-[280px] flex items-center justify-center'>
                    <p className='text-sm text-muted-foreground'>No price history available for {selectedCrop}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Price Comparison Table */}
      <SectionWrapper title="Market Comparison" subtitle={`${selectedCrop} prices across major Telangana markets today`}>
        <Card>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b bg-muted/50'>
                    <th className='text-left p-3 font-medium text-muted-foreground'>Market</th>
                    <th className='text-right p-3 font-medium text-muted-foreground'>Today&apos;s Price</th>
                    <th className='text-right p-3 font-medium text-muted-foreground'>Yesterday</th>
                    <th className='text-right p-3 font-medium text-muted-foreground'>Change</th>
                    <th className='text-right p-3 font-medium text-muted-foreground'>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {marketComparison.map((row) => (
                    <tr key={row.market} className='border-b last:border-0 hover:bg-muted/30 transition-colors'>
                      <td className='p-3 font-medium'>{row.market}</td>
                      <td className='text-right p-3 font-semibold'>&#x20B9;{row.todayPrice.toLocaleString('en-IN')}</td>
                      <td className='text-right p-3 text-muted-foreground'>&#x20B9;{row.yesterday.toLocaleString('en-IN')}</td>
                      <td className={cn('text-right p-3 font-medium', row.change >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                        {row.change >= 0 ? '+' : ''}&#x20B9;{row.change.toFixed(1)}
                      </td>
                      <td className='text-right p-3'>
                        {row.change >= 0
                          ? <TrendingUp className='w-4 h-4 text-emerald-600 inline' />
                          : <TrendingDown className='w-4 h-4 text-red-600 inline' />
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Best Sell Recommendation */}
      <motion.div {...fadeInUp}>
        <Card className='border-0 overflow-hidden'>
          <div className='bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='p-1.5 bg-white/20 rounded-lg'>
                    <TrendingUp className='w-5 h-5' />
                  </div>
                  <h3 className='text-lg font-bold'>Best Market to Sell Today</h3>
                </div>
                <p className='text-white/80 text-sm mb-3'>
                  AI recommends selling your <span className='font-bold text-white'>{selectedCrop}</span> at:
                </p>
                <div className='flex items-baseline gap-2'>
                  <span className='text-3xl font-bold'>
                    &#x20B9;{bestMarket.todayPrice.toLocaleString('en-IN')}
                  </span>
                  <span className='text-white/60 text-sm'>per {mockMarketPrices.find(mp => mp.crop === selectedCrop)?.unit}</span>
                </div>
                <p className='text-white/80 text-sm mt-1'>
                  at <span className='font-semibold'>{bestMarket.market} Market</span>
                </p>
                <div className='flex items-center gap-3 mt-3 text-sm'>
                  <span className='flex items-center gap-1 text-white/70'>
                    <Truck className='w-3.5 h-3.5' /> Est. transport: &#x20B9;150
                  </span>
                  <span className='flex items-center gap-1 text-white/70'>
                    <MapPin className='w-3.5 h-3.5' /> 45 km away
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-2 sm:items-end'>
                <Button
                  variant='secondary'
                  className='bg-white text-emerald-700 hover:bg-white/90 font-semibold'
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                >
                  <Navigation2 className='w-4 h-4 mr-2' />
                  View Directions
                </Button>
                <p className='text-white/60 text-xs text-right'>
                  Based on today&apos;s highest bid price
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* AI Market Prediction */}
      <SectionWrapper title="AI Market Prediction" subtitle='Machine learning-based price forecasts'>
        <Card className='border-amber-200 dark:border-amber-800'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-xl'>&#x1F916;</span>
                <CardTitle className='text-base'>Price Prediction - {selectedCrop}</CardTitle>
              </div>
              <div className='flex items-center gap-2'>
                {directionIcon}
                <Badge className={confidenceColor} variant='secondary'>
                  {prediction.confidence.charAt(0).toUpperCase() + prediction.confidence.slice(1)} Confidence
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-muted-foreground leading-relaxed'>{prediction.outlook}</p>
            <div>
              <p className='text-xs text-muted-foreground font-medium mb-2'>Key Factors:</p>
              <div className='flex flex-wrap gap-2'>
                {prediction.factors.map((f, i) => (
                  <Badge key={i} variant='outline' className='text-xs'>
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
            <div className='flex items-center gap-2 bg-amber-50 dark:bg-amber-950 rounded-lg p-3'>
              <AlertTriangle className='w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0' />
              <p className='text-xs text-amber-800 dark:text-amber-200'>
                &#x26A0;&#xFE0F; AI Prediction - Not guaranteed. Prices are influenced by many unpredictable factors.
              </p>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
}
