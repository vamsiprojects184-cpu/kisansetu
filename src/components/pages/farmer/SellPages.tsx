'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ChevronLeft, ChevronRight, Camera, Upload,
  Package, Scale, MapPin, IndianRupee, ImagePlus,
  CheckCircle2, ArrowRight, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/use-app-store';
import { mockCollectionCenters } from '@/data/mock-data';
import {
  PageHeader, fadeIn, fadeInUp,
} from '@/components/shared/SharedComponents';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Select Product' },
  { id: 2, label: 'Quantity' },
  { id: 3, label: 'Photos' },
  { id: 4, label: 'Collection Center' },
  { id: 5, label: 'Review' },
];

const PRODUCT_OPTIONS = [
  { id: 'tomato', name: 'Tomato', icon: '🍅', color: 'from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/30' },
  { id: 'chilli', name: 'Chilli', icon: '🌶️', color: 'from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-900/30' },
  { id: 'rice', name: 'Rice', icon: '🌾', color: 'from-yellow-50 to-amber-100 dark:from-yellow-950/40 dark:to-amber-900/30' },
  { id: 'cotton', name: 'Cotton', icon: '🧵', color: 'from-sky-50 to-blue-100 dark:from-sky-950/40 dark:to-blue-900/30' },
  { id: 'onion', name: 'Onion', icon: '🧅', color: 'from-purple-50 to-violet-100 dark:from-purple-950/40 dark:to-violet-900/30' },
  { id: 'brinjal', name: 'Brinjal', icon: '🍆', color: 'from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-900/30' },
];

export function FarmerSellPage() {
  const { navigate } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    expectedPrice: '',
    collectionCenter: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!formData.product;
      case 2: return !!formData.quantity && Number(formData.quantity) > 0;
      case 3: return true; // Photos are optional mock
      case 4: return !!formData.collectionCenter;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('Product listed for sale!');
    setTimeout(() => {
      navigate('farmer/orders');
    }, 2000);
  };

  const selectedProduct = PRODUCT_OPTIONS.find(p => p.id === formData.product);
  const selectedCenter = mockCollectionCenters.find(c => c.id === formData.collectionCenter);

  // Success Animation
  if (isSuccess) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className='text-center space-y-4'
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className='w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto'
          >
            <CheckCircle2 className='size-12 text-emerald-600' />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className='text-2xl font-bold text-emerald-700 dark:text-emerald-400'>Successfully Listed!</h2>
            <p className='text-muted-foreground mt-1'>Your product has been submitted for sale</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Loader2 className='size-5 animate-spin text-muted-foreground mx-auto' />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-2xl mx-auto'>
      <PageHeader title='Sell Your Produce' subtitle='List your products for sale' onBack={() => navigate('farmer/dashboard')} />

      {/* Progress Stepper */}
      <motion.div {...fadeInUp}>
        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              {STEPS.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div className='flex flex-col items-center gap-1.5 flex-1'>
                    <div
                      className={cn(
                        'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300',
                        currentStep > step.id
                          ? 'bg-emerald-500 text-white'
                          : currentStep === step.id
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500'
                            : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {currentStep > step.id ? (
                        <Check className='size-4 sm:size-5' />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className={cn(
                      'text-[10px] sm:text-xs text-center leading-tight',
                      currentStep >= step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className='w-6 sm:w-10 lg:w-16 shrink-0'>
                      <Progress
                        value={currentStep > step.id ? 100 : 0}
                        className='h-0.5 mt-[-16px] sm:mt-[-20px]'
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Select Product Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.product}
                  onValueChange={(val) => updateField('product', val)}
                  className='grid grid-cols-2 sm:grid-cols-3 gap-3'
                >
                  {PRODUCT_OPTIONS.map((p) => (
                    <motion.div key={p.id} {...fadeIn} transition={{ delay: 0.03 }}>
                      <Label
                        htmlFor={p.id}
                        className={cn(
                          'flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm',
                          formData.product === p.id
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
                            : 'border-transparent hover:border-muted-foreground/20'
                        )}
                      >
                        <div className={cn('w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl mb-2', p.color)}>
                          {p.icon}
                        </div>
                        <span className='text-sm font-medium'>{p.name}</span>
                        <RadioGroupItem value={p.id} id={p.id} className='sr-only' />
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Enter Quantity & Price</CardTitle>
              </CardHeader>
              <CardContent className='space-y-5'>
                <div className='space-y-2'>
                  <Label htmlFor='quantity' className='flex items-center gap-2'>
                    <Scale className='size-4 text-muted-foreground' /> Quantity (kg)
                  </Label>
                  <Input
                    id='quantity'
                    type='number'
                    placeholder='Enter quantity in kilograms'
                    value={formData.quantity}
                    onChange={(e) => updateField('quantity', e.target.value)}
                    min='1'
                  />
                  <p className='text-xs text-muted-foreground'>Minimum 1 kg</p>
                </div>
                <Separator />
                <div className='space-y-2'>
                  <Label htmlFor='price' className='flex items-center gap-2'>
                    <IndianRupee className='size-4 text-muted-foreground' /> Expected Price per kg (₹)
                  </Label>
                  <Input
                    id='price'
                    type='number'
                    placeholder='Enter expected price per kg'
                    value={formData.expectedPrice}
                    onChange={(e) => updateField('expectedPrice', e.target.value)}
                    min='1'
                  />
                  <p className='text-xs text-muted-foreground'>This helps buyers see your expected rate</p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Upload Photos</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  Take photos of your produce to help buyers assess quality.
                </p>
                <div className='border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center gap-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer'>
                  <div className='w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center'>
                    <Camera className='size-8 text-emerald-600' />
                  </div>
                  <div className='text-center'>
                    <p className='text-sm font-medium'>Take Photo or Upload</p>
                    <p className='text-xs text-muted-foreground mt-1'>Supports JPG, PNG up to 5MB</p>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={() => toast.info('Camera not available in demo')}>
                      <Camera className='size-4 mr-1' /> Take Photo
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => toast.info('Upload not available in demo')}>
                      <Upload className='size-4 mr-1' /> Upload
                    </Button>
                  </div>
                </div>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <ImagePlus className='size-4' />
                  <span>Photos will help you get better prices and faster sales</span>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Select Collection Center</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p className='text-sm text-muted-foreground'>
                  Choose where to deliver your produce
                </p>
                {mockCollectionCenters.map((center, idx) => (
                  <motion.div key={center.id} {...fadeIn} transition={{ delay: idx * 0.05 }}>
                    <div
                      onClick={() => updateField('collectionCenter', center.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm',
                        formData.collectionCenter === center.id
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
                          : 'border-transparent hover:border-muted-foreground/20'
                      )}
                    >
                      <div className='flex items-start gap-3'>
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                          formData.collectionCenter === center.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {formData.collectionCenter === center.id ? (
                            <Check className='size-5' />
                          ) : (
                            <MapPin className='size-5' />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-medium text-sm'>{center.name}</h3>
                          <p className='text-xs text-muted-foreground mt-0.5'>{center.address}</p>
                          <div className='flex items-center gap-3 mt-2'>
                            <Badge variant='outline' className='text-xs'>
                              📏 {center.distance} km
                            </Badge>
                            <Badge variant='outline' className='text-xs'>
                              🕐 {center.operatingHours}
                            </Badge>
                          </div>
                          <div className='flex flex-wrap gap-1 mt-2'>
                            {center.acceptedCrops.slice(0, 3).map(crop => (
                              <Badge key={crop} variant='secondary' className='text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'>
                                {crop}
                              </Badge>
                            ))}
                            {center.acceptedCrops.length > 3 && (
                              <Badge variant='secondary' className='text-xs'>
                                +{center.acceptedCrops.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          )}

          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Review & Submit</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  Please review the details before submitting.
                </p>

                <div className='space-y-3'>
                  {[
                    { label: 'Product', value: selectedProduct ? `${selectedProduct.icon} ${selectedProduct.name}` : '-' },
                    { label: 'Quantity', value: formData.quantity ? `${formData.quantity} kg` : '-' },
                    { label: 'Expected Price', value: formData.expectedPrice ? `₹${Number(formData.expectedPrice).toLocaleString('en-IN')}/kg` : 'Not specified' },
                    { label: 'Collection Center', value: selectedCenter?.name || '-' },
                    { label: 'Delivery Address', value: selectedCenter?.address || '-' },
                  ].map((item) => (
                    <div key={item.label} className='flex items-start gap-3 p-3 rounded-lg bg-muted/50'>
                      <span className='text-xs text-muted-foreground min-w-[120px] pt-0.5'>{item.label}</span>
                      <span className='text-sm font-medium'>{item.value}</span>
                    </div>
                  ))}
                </div>

                {formData.quantity && formData.expectedPrice && (
                  <div className='p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'>
                    <p className='text-sm text-emerald-700 dark:text-emerald-300'>
                      💰 Estimated Total: <span className='font-bold text-lg'>
                        ₹{(Number(formData.quantity) * Number(formData.expectedPrice)).toLocaleString('en-IN')}
                      </span>
                    </p>
                  </div>
                )}

                <Button
                  className='w-full'
                  size='lg'
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='size-4 mr-2 animate-spin' /> Submitting...
                    </>
                  ) : (
                    <>
                      <Package className='size-4 mr-2' /> List for Sale
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <div className='flex items-center justify-between'>
          <Button variant='outline' onClick={handleBack} disabled={currentStep === 1}>
            <ChevronLeft className='size-4 mr-1' /> Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next <ChevronRight className='size-4 ml-1' />
          </Button>
        </div>
      )}
      {currentStep > 1 && currentStep < 5 && (
        <div className='flex justify-start'>
          <Button variant='ghost' size='sm' onClick={handleBack}>
            <ChevronLeft className='size-4 mr-1' /> Back to Step {currentStep - 1}
          </Button>
        </div>
      )}
    </div>
  );
}
