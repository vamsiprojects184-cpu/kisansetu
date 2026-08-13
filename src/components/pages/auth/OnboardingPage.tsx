'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Sprout,
  Leaf,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Droplets,
  Tractor,
  Wheat,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useAuthStore } from '@/store/use-auth-store';
import { useAppStore } from '@/store/use-app-store';

// ============== DATA ==============

const states = [
  'Telangana',
  'Andhra Pradesh',
  'Maharashtra',
  'Karnataka',
  'Madhya Pradesh',
  'Rajasthan',
  'Uttar Pradesh',
];

const cropOptions = [
  { id: 'rice', name: 'Rice', emoji: '🌾' },
  { id: 'wheat', name: 'Wheat', emoji: '🌿' },
  { id: 'cotton', name: 'Cotton', emoji: '🧵' },
  { id: 'chilli', name: 'Chilli', emoji: '🌶️' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅' },
  { id: 'brinjal', name: 'Brinjal', emoji: '🍆' },
  { id: 'onion', name: 'Onion', emoji: '🧅' },
  { id: 'maize', name: 'Maize', emoji: '🌽' },
  { id: 'soybean', name: 'Soybean', emoji: '🫘' },
  { id: 'groundnut', name: 'Groundnut', emoji: '🥜' },
  { id: 'sugarcane', name: 'Sugarcane', emoji: '🎋' },
  { id: 'pulses', name: 'Pulses', emoji: '🫘' },
];

const soilTypes = ['Red Soil', 'Black Soil', 'Alluvial', 'Sandy', 'Clay', 'Loamy'];
const irrigationMethods = ['Drip', 'Sprinkler', 'Flood', 'Rainfed', 'Mixed'];
const farmingTypes = ['Organic', 'Conventional', 'Mixed'];

// ============== STEP INDICATOR ==============

const stepMeta = [
  { label: 'Location', icon: MapPin },
  { label: 'Crops', icon: Sprout },
  { label: 'Practices', icon: Leaf },
  { label: 'Done', icon: CheckCircle2 },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-xs mx-auto">
      {stepMeta.map((s, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const Icon = s.icon;

        return (
          <React.Fragment key={s.label}>
            {/* Circle */}
                <div
                  className={[
                    'relative flex flex-col items-center',
                    'transition-all duration-300',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'flex items-center justify-center rounded-full transition-all duration-300',
                      isActive
                        ? 'size-10 gradient-green text-white shadow-md'
                        : isCompleted
                          ? 'size-10 bg-primary text-primary-foreground shadow-sm'
                          : 'size-10 bg-muted text-muted-foreground',
                    ].join(' ')}
                  >
                    {isCompleted ? (
                      <Check className="size-5" strokeWidth={3} />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </div>
                  <span
                    className={[
                      'text-[10px] mt-1.5 font-medium transition-colors duration-300',
                      isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground',
                    ].join(' ')}
                  >
                    {s.label}
                  </span>
                </div>
                {i < stepMeta.length - 1 && (
                  <div className="flex-1 mx-1 mt-[-14px]">
                    <div className="h-0.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-green transition-all duration-500"
                        style={{
                          width: isCompleted || isActive ? '100%' : '0%',
                        }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </div>
    );
}

// ============== CONFETTI ==============

function ConfettiParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-sm"
      style={{
        backgroundColor: color,
        left: `${x}%`,
        top: '-5%',
      }}
      initial={{ opacity: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, 120, 250, 400],
        x: [0, Math.sin(x) * 30, Math.cos(x) * 20, Math.sin(x) * 50],
        rotate: [0, 180, 360, 540],
      }}
      transition={{
        duration: 2.5,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

const confettiColors = ['#16a34a', '#22c55e', '#f59e0b', '#fbbf24', '#ef4444', '#a855f7', '#0ea5e9'];

// ============== ANIMATION VARIANTS ==============

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

// ============== MAIN COMPONENT ==============

export default function OnboardingPage() {
  const { navigate } = useAppStore();
  const { completeOnboarding, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1 state
  const [farmName, setFarmName] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [farmSize, setFarmSize] = useState('');

  // Step 2 state
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  // Step 3 state
  const [soilType, setSoilType] = useState('');
  const [irrigationMethod, setIrrigationMethod] = useState('');
  const [farmingType, setFarmingType] = useState('');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const goNext = () => {
    if (step < totalSteps) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const toggleCrop = (cropId: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId)
        ? prev.filter((c) => c !== cropId)
        : [...prev, cropId],
    );
  };

  const isStep1Valid = farmName.trim() !== '' && district.trim() !== '' && state !== '' && farmSize !== '';
  const isStep2Valid = selectedCrops.length >= 1;
  const isStep3Valid = soilType !== '' && irrigationMethod !== '' && farmingType !== '';

  const handleComplete = () => {
    completeOnboarding({
      state,
      district,
      village: district,
      location: `${district}, ${state}`,
    });
    navigate('farmer/dashboard');
  };

  const handleCompleteLater = () => {
    navigate('farmer/dashboard');
  };

  // Summary data for step 4
  const summaryData = [
    { label: 'Farm Name', value: farmName || '—' },
    { label: 'Location', value: `${district}, ${state}` || '—' },
    { label: 'Farm Size', value: farmSize ? `${farmSize} acres` : '—' },
    { label: 'Crops', value: selectedCrops.map((id) => cropOptions.find((c) => c.id === id)?.name).filter(Boolean).join(', ') || '—' },
    { label: 'Soil Type', value: soilType || '—' },
    { label: 'Irrigation', value: irrigationMethod || '—' },
    { label: 'Farming', value: farmingType || '—' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Thin green gradient progress bar at very top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1">
        <motion.div
          className="h-full gradient-green"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center px-4 pt-8 pb-6">
        <div className="w-full max-w-lg">
          {/* Step Indicator */}
          <div className="mb-6">
            <StepIndicator currentStep={step} />
          </div>

          {/* Card with glass-card styling */}
          <Card className="glass-card rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <AnimatePresence mode="wait" custom={direction}>
                {/* ========== STEP 1: FARM LOCATION ========== */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {/* Header with illustration */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-green-500/20 dark:from-emerald-600/10 dark:to-green-500/10 flex items-center justify-center">
                          <MapPin className="size-10 sm:size-12 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <motion.div
                          className="absolute -top-1 -right-1 size-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        >
                          <span className="text-xs">📍</span>
                        </motion.div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center">
                        Where is your farm?
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1 text-center">
                        We&apos;ll use this for weather and market insights
                      </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="onb-farm-name" className="text-sm font-medium">
                          Farm Name
                        </Label>
                        <Input
                          id="onb-farm-name"
                          placeholder="e.g., Green Fields"
                          value={farmName}
                          onChange={(e) => setFarmName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="onb-district" className="text-sm font-medium">
                          Village / District
                        </Label>
                        <Input
                          id="onb-district"
                          placeholder="e.g., Siddipet"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">State</Label>
                        <Select value={state} onValueChange={setState}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="onb-farm-size" className="text-sm font-medium">
                          Farm Size
                        </Label>
                        <div className="relative">
                          <Input
                            id="onb-farm-size"
                            type="number"
                            min="0.1"
                            step="0.1"
                            placeholder="e.g., 5"
                            value={farmSize}
                            onChange={(e) => setFarmSize(e.target.value)}
                            className="pr-16"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                            acres
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========== STEP 2: CROP SELECTION ========== */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-green-500/20 dark:from-emerald-600/10 dark:to-green-500/10 flex items-center justify-center">
                          <Sprout className="size-10 sm:size-12 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center">
                        What do you grow?
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1 text-center">
                        Select at least 1 crop (you can add more later)
                      </p>
                    </div>

                    {/* Crop grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto scrollbar-thin pr-1">
                      {cropOptions.map((crop) => {
                        const isSelected = selectedCrops.includes(crop.id);
                        return (
                          <motion.button
                            key={crop.id}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleCrop(crop.id)}
                            className={[
                              'relative rounded-xl border-2 p-3 sm:p-4 text-center transition-all duration-200',
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20 shadow-sm'
                                : 'border-border hover:border-emerald-600/30 hover:bg-muted/50',
                            ].join(' ')}
                          >
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5">
                                <div className="size-4 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center">
                                  <Check className="size-2.5 text-white" strokeWidth={3} />
                                </div>
                              </div>
                            )}
                            <span className="text-2xl sm:text-3xl block mb-1.5">{crop.emoji}</span>
                            <span className="text-xs sm:text-sm font-medium leading-tight">{crop.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {selectedCrops.length > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-muted-foreground mt-3 text-center"
                      >
                        {selectedCrops.length} crop{selectedCrops.length > 1 ? 's' : ''} selected
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* ========== STEP 3: FARMING PRACTICES ========== */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-green-500/20 dark:from-emerald-600/10 dark:to-green-500/10 flex items-center justify-center">
                          <Leaf className="size-10 sm:size-12 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center">
                        How do you farm?
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1 text-center">
                        This helps us tailor advice for your practices
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Soil Type */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <span className="size-6 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <span className="text-xs">🪨</span>
                          </span>
                          Soil Type
                        </Label>
                        <RadioGroup value={soilType} onValueChange={setSoilType} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {soilTypes.map((soil) => (
                            <Label
                              key={soil}
                              htmlFor={`soil-${soil}`}
                              className={[
                                'flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 cursor-pointer transition-all duration-200',
                                soilType === soil
                                  ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20'
                                  : 'border-border hover:border-emerald-600/30 hover:bg-muted/50',
                              ].join(' ')}
                            >
                              <RadioGroupItem value={soil} id={`soil-${soil}`} className="sr-only" />
                              <div className={[
                                'size-4 rounded-full border-2 flex items-center justify-center transition-colors',
                                soilType === soil
                                  ? 'border-emerald-600 bg-emerald-600'
                                  : 'border-muted-foreground/30',
                              ].join(' ')}>
                                {soilType === soil && <Check className="size-2.5 text-white" strokeWidth={3} />}
                              </div>
                              <span className="text-xs sm:text-sm font-medium">{soil}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Irrigation Method */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <span className="size-6 rounded-md bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                            <Droplets className="size-3 text-sky-600 dark:text-sky-400" />
                          </span>
                          Irrigation Method
                        </Label>
                        <RadioGroup value={irrigationMethod} onValueChange={setIrrigationMethod} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {irrigationMethods.map((method) => (
                            <Label
                              key={method}
                              htmlFor={`irrigation-${method}`}
                              className={[
                                'flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 cursor-pointer transition-all duration-200',
                                irrigationMethod === method
                                  ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20'
                                  : 'border-border hover:border-emerald-600/30 hover:bg-muted/50',
                              ].join(' ')}
                            >
                              <RadioGroupItem value={method} id={`irrigation-${method}`} className="sr-only" />
                              <div className={[
                                'size-4 rounded-full border-2 flex items-center justify-center transition-colors',
                                irrigationMethod === method
                                  ? 'border-emerald-600 bg-emerald-600'
                                  : 'border-muted-foreground/30',
                              ].join(' ')}>
                                {irrigationMethod === method && <Check className="size-2.5 text-white" strokeWidth={3} />}
                              </div>
                              <span className="text-xs sm:text-sm font-medium">{method}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Farming Type */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <span className="size-6 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Leaf className="size-3 text-emerald-600 dark:text-emerald-400" />
                          </span>
                          Farming Type
                        </Label>
                        <RadioGroup value={farmingType} onValueChange={setFarmingType} className="grid grid-cols-3 gap-2">
                          {farmingTypes.map((type) => (
                            <Label
                              key={type}
                              htmlFor={`farming-${type}`}
                              className={[
                                'flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 cursor-pointer transition-all duration-200',
                                farmingType === type
                                  ? 'border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20'
                                  : 'border-border hover:border-emerald-600/30 hover:bg-muted/50',
                              ].join(' ')}
                            >
                              <RadioGroupItem value={type} id={`farming-${type}`} className="sr-only" />
                              <div className={[
                                'size-4 rounded-full border-2 flex items-center justify-center transition-colors',
                                farmingType === type
                                  ? 'border-emerald-600 bg-emerald-600'
                                  : 'border-muted-foreground/30',
                              ].join(' ')}>
                                {farmingType === type && <Check className="size-2.5 text-white" strokeWidth={3} />}
                              </div>
                              <span className="text-xs sm:text-sm font-medium">{type}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========== STEP 4: ALL DONE! ========== */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {/* Confetti particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                      {confettiColors.map((color, i) => (
                        <ConfettiParticle
                          key={i}
                          delay={0.3 + i * 0.12}
                          x={10 + i * 12}
                          color={color}
                        />
                      ))}
                    </div>

                    {/* Celebration header */}
                    <div className="relative flex flex-col items-center mb-6">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                        className="mb-4"
                      >
                        <div className="size-24 sm:size-28 rounded-full bg-gradient-to-br from-emerald-600/20 to-green-500/20 dark:from-emerald-600/10 dark:to-green-500/10 flex items-center justify-center">
                          <span className="text-5xl sm:text-6xl">🎉</span>
                        </div>
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl sm:text-3xl font-bold tracking-tight gradient-text text-center"
                      >
                        All Done!
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground text-sm mt-2 text-center"
                      >
                        Your farm profile is set up. Here&apos;s a summary:
                      </motion.p>
                    </div>

                    {/* Summary card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card className="bg-muted/50 border-border/50">
                        <CardContent className="p-4 space-y-2.5">
                          {summaryData.map((item) => (
                            <div key={item.label} className="flex items-start justify-between gap-3">
                              <span className="text-xs text-muted-foreground shrink-0 pt-0.5">
                                {item.label}
                              </span>
                              <span className="text-sm font-medium text-right truncate">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Crop badges */}
                    {selectedCrops.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-1.5 mt-4"
                      >
                        {selectedCrops.map((cropId) => {
                          const crop = cropOptions.find((c) => c.id === cropId);
                          if (!crop) return null;
                          return (
                            <Badge
                              key={cropId}
                              variant="secondary"
                              className="text-xs py-1 px-2.5 rounded-full"
                            >
                              {crop.emoji} {crop.name}
                            </Badge>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-6"
                    >
                      <Button
                        className="w-full h-12 font-semibold rounded-xl text-base"
                        size="lg"
                        onClick={handleComplete}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Setting up...
                          </span>
                        ) : (
                          <>
                            Go to Dashboard
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                      <button
                        type="button"
                        onClick={handleCompleteLater}
                        className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                      >
                        Complete Later
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ========== NAVIGATION BUTTONS ========== */}
              {step < totalSteps && (
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/50">
                  {step > 1 ? (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={goBack}
                      className="rounded-xl font-medium"
                    >
                      <ChevronLeft className="size-4" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    size="lg"
                    onClick={goNext}
                    disabled={
                      (step === 1 && !isStep1Valid) ||
                      (step === 2 && !isStep2Valid) ||
                      (step === 3 && !isStep3Valid)
                    }
                    className="flex-1 rounded-xl font-medium"
                  >
                    {step === 3 ? 'Complete' : 'Next'}
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skip for step < 4 */}
          {step < totalSteps && (
            <button
              type="button"
              onClick={handleCompleteLater}
              className="block mx-auto mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
