'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Droplets,
  Sun,
  Bug,
  TrendingUp,
  ShoppingCart,
  Brain,
  Mic,
  BarChart3,
  Tractor,
  MapPin,
  Wheat,
  Package,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  ArrowRight,
  Users,
  MapPinned,
  Building2,
  Stethoscope,
  ShieldCheck,
  Leaf,
  Clock,
  Truck,
  Camera,
  Languages,
  Check,
  Star,
  Zap,
  Target,
  CircleDot,
  CloudSun,
  FlaskConical,
  Eye,
  Scissors,
  Banknote,
  ThumbsUp,
  Quote,
  Heart,
  HelpCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

import { useAuthStore } from '@/store/use-auth-store';
import { useAppStore } from '@/store/use-app-store';
import type { UserRole, RoutePath } from '@/types';

// ==================== SHARED ANIMATIONS ====================

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 },
};

// ==================== LANDING PAGE ====================

export function LandingPage() {
  const { navigate } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  const handleExploreMarketplace = () => {
    if (isAuthenticated) {
      navigate('marketplace/home');
    } else {
      navigate('login');
    }
  };

  const problems = [
    { icon: '🌱', title: 'Poor Soil Knowledge', desc: 'Most farmers don\'t know their soil health, leading to wrong crop choices and wasted inputs.' },
    { icon: '🌦️', title: 'Unpredictable Weather', desc: 'Sudden weather changes destroy crops. Farmers lack timely, localized weather intelligence.' },
    { icon: '🐛', title: 'Crop Diseases', desc: 'Late disease detection causes up to 30% yield loss. Most farmers rely on guesswork.' },
    { icon: '💰', title: 'Unstable Market Prices', desc: 'Farmers sell at distress prices due to lack of real-time market information and predictions.' },
    { icon: '🚰', title: 'Water Management', desc: 'Over or under irrigation wastes resources and reduces crop quality significantly.' },
    { icon: '🛒', title: 'Limited Market Access', desc: 'Farmers depend on middlemen, getting only 30-40% of the final consumer price.' },
  ];

  const features = [
    { icon: <Sprout className="size-6" />, title: 'AI Soil Health', desc: 'Instant soil analysis with personalized recommendations for your land.', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { icon: <Wheat className="size-6" />, title: 'Crop Recommendation', desc: 'AI suggests the best crops based on soil, weather, and market trends.', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    { icon: <Camera className="size-6" />, title: 'Disease Detection', desc: 'Snap a photo to instantly detect and treat crop diseases.', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { icon: <Droplets className="size-6" />, title: 'Smart Irrigation', desc: 'AI-powered irrigation schedules to save water and boost yields.', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
    { icon: <CloudSun className="size-6" />, title: 'Weather Intelligence', desc: 'Hyperlocal weather forecasts with farming-specific alerts.', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
    { icon: <TrendingUp className="size-6" />, title: 'Market Price Prediction', desc: 'AI predicts market prices to help you sell at the best time.', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { icon: <Mic className="size-6" />, title: 'Voice Assistant', desc: 'Ask questions in your language. KisanSetu understands local dialects.', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
    { icon: <ShoppingCart className="size-6" />, title: 'Farm-to-Home Marketplace', desc: 'Sell directly to consumers. No middlemen, better prices for all.', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  ];

  const journeySteps = [
    { icon: <FlaskConical className="size-5" />, label: 'Test Soil', emoji: '🧪' },
    { icon: <Wheat className="size-5" />, label: 'Choose Crop', emoji: '🌾' },
    { icon: <Package className="size-5" />, label: 'Buy Seeds', emoji: '📦' },
    { icon: <Sprout className="size-5" />, label: 'Grow', emoji: '🌱' },
    { icon: <Eye className="size-5" />, label: 'Monitor', emoji: '👁️' },
    { icon: <Scissors className="size-5" />, label: 'Harvest', emoji: '✂️' },
    { icon: <Banknote className="size-5" />, label: 'Sell', emoji: '💵' },
    { icon: <Truck className="size-5" />, label: 'Deliver', emoji: '🚚' },
  ];

  const stats = [
    { value: '10,000+', label: 'Farmers', icon: <Users className="size-5" /> },
    { value: '5,000+', label: 'Farms', icon: <MapPinned className="size-5" /> },
    { value: '50+', label: 'Districts', icon: <Building2 className="size-5" /> },
  ];

  const enhancedStats = [
    { value: '10,000+', label: 'Farmers', icon: <Users className="size-6" /> },
    { value: '5,000+', label: 'Farms', icon: <Sprout className="size-6" /> },
    { value: '50+', label: 'Districts', icon: <MapPin className="size-6" /> },
    { value: '98%', label: 'Satisfaction', icon: <ThumbsUp className="size-6" /> },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Warangal, Telangana',
      role: 'Paddy Farmer',
      quote: 'KisanSetu ne meri fasal ki bimari ka pata lagaya aur meri padaai bachai. Ab main har mahine ₹15,000 zyada kama raha hoon.',
      rating: 5,
      initials: 'RK',
    },
    {
      name: 'Sunita Devi',
      location: 'Guntur, Andhra Pradesh',
      role: 'Chilli Farmer',
      quote: 'Market price prediction ne mujhe sahi time pe sell karne mein madad ki. Pehle middlemen sab kha jaate the, ab direct customers se milta hai.',
      rating: 5,
      initials: 'SD',
    },
    {
      name: 'Venkatesh Reddy',
      location: 'Kurnool, Andhra Pradesh',
      role: 'Cotton Farmer',
      quote: 'Soil health test ke baad maine apna fertilizer plan badla aur production 40% badh gayi. Yeh app sahi mein game changer hai.',
      rating: 4,
      initials: 'VR',
    },
  ];

  const faqs = [
    {
      question: 'What is KisanSetu?',
      answer: 'KisanSetu is an AI-powered agriculture platform designed specifically for Indian farmers. It provides soil health analysis, crop disease detection, market price predictions, and a direct farm-to-consumer marketplace — all accessible through your smartphone.',
    },
    {
      question: 'How does crop disease detection work?',
      answer: 'Simply take a photo of the affected leaf or crop using your phone camera. Our AI model analyzes the image in seconds and identifies the disease along with recommended treatments and preventive measures.',
    },
    {
      question: 'Is KisanSetu free to use?',
      answer: 'Yes! KisanSetu offers a free tier with essential features like basic soil analysis, disease detection, and weather alerts. Premium features such as advanced market analytics and expert consultations are available on affordable subscription plans.',
    },
    {
      question: 'Which languages does KisanSetu support?',
      answer: 'KisanSetu currently supports Hindi, Telugu, Tamil, and English. We are actively adding more regional languages including Marathi, Kannada, and Bengali to serve farmers across India.',
    },
    {
      question: 'How can I sell my produce on KisanSetu?',
      answer: 'After registering as a farmer, you can list your produce on the marketplace with photos and details. Consumers and collection centers can browse and place orders directly. We handle quality checks and logistics support.',
    },
    {
      question: 'How is my data protected?',
      answer: 'We take data privacy seriously. All your farm data, personal information, and financial details are encrypted and stored securely. We never share your data with third parties without your explicit consent.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ===== HERO SECTION ===== */}
      <section className="gradient-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-32 rounded-full bg-white/20 animate-float" />
          <div className="absolute bottom-20 right-20 size-48 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 size-24 rounded-full bg-white/15 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm px-4 py-1.5">
              <Zap className="size-3.5 mr-1.5" />
              AI-Powered Agriculture Platform
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Smart Farming.<br className="hidden sm:block" />
              Better Decisions.<br className="hidden sm:block" />
              Better Income.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              AI-powered insights for every stage of your farming journey.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-white/90 font-semibold text-base px-8 h-12 rounded-xl shadow-lg"
                onClick={() => navigate('login')}
              >
                Start Farming
                <ArrowRight className="size-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/15 font-semibold text-base px-8 h-12 rounded-xl bg-transparent"
                onClick={handleExploreMarketplace}
              >
                <ShoppingCart className="size-4 mr-1.5" />
                Explore Marketplace
              </Button>
            </div>
          </motion.div>

          {/* Mini Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <Card
                key={i}
                className="bg-white/15 border-white/20 backdrop-blur-sm text-white"
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex-shrink-0 size-10 rounded-lg bg-white/20 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Target className="size-3.5 mr-1" />
              The Problem
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Challenges Farmers Face Every Day
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Indian agriculture contributes 18% to GDP but farmers still struggle with basic challenges that technology can solve.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {problems.map((problem, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full border-dashed hover:border-solid hover:shadow-md transition-all duration-300 group">
                  <CardContent className="p-5 sm:p-6">
                    <div className="text-3xl mb-3">{problem.icon}</div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {problem.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== AI FEATURES SECTION ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              <Brain className="size-3.5 mr-1" />
              AI-Powered Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Everything Your Farm Needs, Powered by AI
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              From soil testing to selling — KisanSetu covers your entire farming journey with intelligent tools.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={scaleIn}>
                <Card className="h-full hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-5 sm:p-6">
                    <div className={`inline-flex size-12 rounded-xl items-center justify-center mb-4 ${feature.color} transition-transform group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-base mb-1.5">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FARMING JOURNEY SECTION ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <CircleDot className="size-3.5 mr-1" />
              Your Farming Journey
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              From Soil to Sale, We Guide You
            </h2>
          </motion.div>

          <div className="relative">
            {/* Desktop timeline line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-border" />

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 md:gap-2"
            >
              {journeySteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative z-10 size-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-3 hover:bg-primary hover:text-primary-foreground transition-colors group">
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      {step.emoji}
                    </span>
                    {/* Arrow for mobile */}
                    {i < journeySteps.length - 1 && (
                      <ChevronRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 size-4 text-primary/40" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS COUNTER SECTION ===== */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 bg-emerald-50 dark:bg-emerald-950/30 border-y border-emerald-100 dark:border-emerald-900/40">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4"
          >
            {enhancedStats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex flex-col items-center text-center"
              >
                <div className="size-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                  {stat.value}
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400/70 mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Heart className="size-3.5 mr-1" />
              Farmer Stories
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Trusted by 10,000+ Farmers Across India
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Hear from real farmers who have transformed their livelihoods with KisanSetu.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full border hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <Quote className="size-8 text-primary/20 mb-3" />
                    <p className="text-sm sm:text-base leading-relaxed text-foreground/80 mb-5">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={
                            si < t.rating
                              ? 'size-4 fill-amber-400 text-amber-400'
                              : 'size-4 text-muted-foreground/30'
                          }
                        />
                      ))}
                    </div>
                    <Separator className="mb-4" />
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {t.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role} · {t.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/40">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10 sm:mb-14">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <HelpCircle className="size-3.5 mr-1" />
              Got Questions?
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Find answers to the most common questions about KisanSetu.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 gradient-green">
        <motion.div
          {...fadeInUp}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Ready to Transform Your Farming?
          </h2>
          <p className="mt-4 text-white/80 text-base sm:text-lg">
            Join thousands of farmers already using KisanSetu to make smarter decisions and earn more.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-white text-green-700 hover:bg-white/90 font-semibold text-base px-8 h-12 rounded-xl shadow-lg"
            onClick={() => navigate('login')}
          >
            Get Started Free
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-foreground text-background mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {/* About Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="size-9 rounded-lg gradient-green flex items-center justify-center text-white font-bold text-sm">
                  K
                </div>
                <span className="font-bold text-lg">KisanSetu</span>
              </div>
              <p className="text-sm text-background/60 leading-relaxed">
                AI-powered agriculture platform empowering Indian farmers with smart tools for better yields and fair prices.
              </p>
              {/* Social Media Icons */}
              <div className="flex items-center gap-3 mt-5">
                <a href="#" aria-label="Instagram" className="size-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="size-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" className="size-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" aria-label="Facebook" className="size-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background/80">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                <li><button onClick={() => navigate('login')} className="text-sm text-background/60 hover:text-background transition-colors">Login</button></li>
                <li><button onClick={() => navigate('register')} className="text-sm text-background/60 hover:text-background transition-colors">Register</button></li>
                <li><button onClick={() => navigate('marketplace/home')} className="text-sm text-background/60 hover:text-background transition-colors">Marketplace</button></li>
                <li><button onClick={() => navigate('login')} className="text-sm text-background/60 hover:text-background transition-colors">Features</button></li>
              </ul>
            </div>

            {/* For Farmers Column */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background/80">
                For Farmers
              </h3>
              <ul className="space-y-2.5">
                <li><span className="text-sm text-background/60">Soil Health</span></li>
                <li><span className="text-sm text-background/60">Disease Detection</span></li>
                <li><span className="text-sm text-background/60">Market Prices</span></li>
                <li><span className="text-sm text-background/60">Sell Produce</span></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background/80">
                Contact
              </h3>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-sm text-background/60">
                  <Mail className="size-3.5" />
                  hello@kisansetu.com
                </li>
                <li className="flex items-center gap-2 text-sm text-background/60">
                  <Phone className="size-3.5" />
                  +91 98765 43210
                </li>
                <li className="flex items-start gap-2 text-sm text-background/60">
                  <MapPin className="size-3.5 mt-0.5" />
                  Hyderabad, Telangana, India
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-background/50">
              © 2025 KisanSetu. Made with ❤️ for Indian Farmers.
            </p>
            <div className="flex items-center gap-4">
              <button className="text-xs text-background/50 hover:text-background/80 transition-colors">
                Privacy Policy
              </button>
              <button className="text-xs text-background/50 hover:text-background/80 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==================== LOGIN PAGE ====================

const roleDashboardMap: Record<string, RoutePath> = {
  farmer: 'farmer/dashboard',
  consumer: 'consumer/dashboard',
  collection_center: 'collection-center/dashboard',
  expert: 'expert/dashboard',
  admin: 'admin/dashboard',
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  farmer: <Tractor className="size-5" />,
  consumer: <ShoppingCart className="size-5" />,
  collection_center: <Building2 className="size-5" />,
  expert: <Stethoscope className="size-5" />,
  admin: <ShieldCheck className="size-5" />,
};

const roleLabels: Record<UserRole, string> = {
  farmer: 'Farmer',
  consumer: 'Consumer',
  collection_center: 'Collection Center',
  expert: 'Expert',
  admin: 'Admin',
};

const roleColors: Record<UserRole, string> = {
  farmer: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/30',
  consumer: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/30',
  collection_center: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800 dark:hover:bg-sky-900/30',
  expert: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800 dark:hover:bg-violet-900/30',
  admin: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30',
};

export function LoginPage() {
  const { navigate } = useAppStore();
  const { login, loginWithPhone, loginWithEmail, isLoading } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleDemoLogin = async (role: UserRole) => {
    setLoginError('');
    try {
      await login(role);
      navigate(roleDashboardMap[role]);
    } catch (e) {
      setLoginError('Backend unavailable. Using offline mode.');
    }
  };

  const handlePhoneLogin = async () => {
    setLoginError('');
    if (phone.length >= 10 && password.length > 0) {
      try {
        await loginWithPhone(`+91 ${phone}`, password);
        const user = useAuthStore.getState().user;
        const route = user?.role === 'consumer' ? 'consumer/dashboard' : 'farmer/dashboard';
        navigate(route);
      } catch {
        setLoginError('Invalid phone or password');
      }
    }
  };

  const handleEmailLogin = async () => {
    setLoginError('');
    if (email.includes('@') && password.length > 0) {
      try {
        await loginWithEmail(email, password);
        const user = useAuthStore.getState().user;
        const route = user?.role === 'consumer' ? 'consumer/dashboard' : 'farmer/dashboard';
        navigate(route);
      } catch {
        setLoginError('Invalid email or password');
      }
    }
  };

  const demoRoles: UserRole[] = ['farmer', 'consumer', 'collection_center', 'expert', 'admin'];

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.08 } },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 16, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  const logoBounce = {
    initial: { opacity: 0, scale: 0.3, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.1 } },
  };

  const cardSlideUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Animated floating background blobs (visible on mobile too) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-500/10 animate-login-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/4 -right-16 w-56 h-56 rounded-full bg-green-400/8 animate-login-blob" style={{ animationDelay: '-3s' }} />
        <div className="absolute -bottom-16 left-1/3 w-64 h-64 rounded-full bg-emerald-600/6 animate-login-blob" style={{ animationDelay: '-6s' }} />
        <div className="absolute top-2/3 -left-10 w-48 h-48 rounded-full bg-green-500/10 animate-login-blob" style={{ animationDelay: '-9s' }} />
      </div>

      {/* Left Decorative Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.35 0.1 150) 0%, oklch(0.42 0.14 140) 40%, oklch(0.48 0.12 130) 100%)' }}>
        {/* Wheat/plant pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, oklch(1 0 0 / 0.5) 60px, oklch(1 0 0 / 0.5) 61px), repeating-linear-gradient(0deg, transparent, transparent 60px, oklch(1 0 0 / 0.5) 60px, oklch(1 0 0 / 0.5) 61px)' }} />

        {/* Floating emojis */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute text-4xl animate-login-emoji" style={{ top: '12%', left: '15%', animationDelay: '0s' }}>🌾</span>
          <span className="absolute text-3xl animate-login-emoji" style={{ top: '28%', right: '20%', animationDelay: '-1.5s' }}>🚜</span>
          <span className="absolute text-5xl animate-login-emoji" style={{ top: '55%', left: '25%', animationDelay: '-3s' }}>🌧️</span>
          <span className="absolute text-3xl animate-login-emoji" style={{ top: '72%', right: '15%', animationDelay: '-4.5s' }}>🌱</span>
          <span className="absolute text-4xl animate-login-emoji" style={{ top: '40%', left: '60%', animationDelay: '-2s' }}>🌻</span>
          <span className="absolute text-3xl animate-login-emoji" style={{ bottom: '18%', left: '45%', animationDelay: '-5s' }}>🍃</span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <Sprout className="size-5 text-green-300" />
                <span className="text-green-100 text-sm font-medium">KisanSetu Platform</span>
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
                Empowering India&apos;s{' '}
                <span className="text-green-300">Farmers</span>
              </h2>
              <p className="text-lg text-green-100/80 max-w-md leading-relaxed">
                AI-powered agriculture assistant for smarter farming, better yields, and a sustainable future.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-green-100/90">
                <div className="size-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <ShieldCheck className="size-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Secure & Private</p>
                  <p className="text-xs text-green-100/60">End-to-end encrypted data</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-green-100/90">
                <div className="size-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Users className="size-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">10,000+ Farmers</p>
                  <p className="text-xs text-green-100/60">Trusted across rural India</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-green-100/90">
                <div className="size-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Star className="size-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">4.8 Rating</p>
                  <p className="text-xs text-green-100/60">Highly rated on app stores</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-900/30 to-transparent" />
      </div>

      {/* Right Side - Login Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          {...cardSlideUp}
          className="w-full max-w-md"
        >
          {/* Logo with bounce */}
          <motion.div {...logoBounce} className="flex flex-col items-center mb-8">
            <div className="size-16 rounded-2xl gradient-green flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg animate-pulse-green">
              K
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
              Sign in to your KisanSetu account
            </p>
          </motion.div>

          {/* Login Card with glow border */}
          <div className="login-card-glow-border animate-login-card-glow rounded-xl">
            <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-md">
              <CardContent className="p-6 sm:p-8 space-y-5">
                {/* Phone Input */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 rounded-md border border-input bg-muted/50 text-sm text-muted-foreground whitespace-nowrap h-9">
                      🇮🇳 +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handlePhoneLogin()}
                    />
                  </div>
                  <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePhoneLogin()} className="mt-2" />
                </div>

                {/* OR Divider */}
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium uppercase">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                  />
                  <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailLogin()} className="mt-2" />
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate('login')}
                    className="text-xs text-primary/70 hover:text-primary font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <Button
                  className="w-full h-11 font-semibold rounded-xl"
                  disabled={isLoading || (phone.length < 10 && !email.includes('@'))}
                  onClick={phone.length >= 10 ? handlePhoneLogin : handleEmailLogin}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
                {loginError && <p className="text-sm text-destructive text-center -mt-2">{loginError}</p>}

                {/* Demo Login Section */}
                <motion.div className="pt-2" {...staggerContainer} animate="animate">
                  <div className="relative flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground font-medium">
                      Demo Login
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {demoRoles.map((role) => (
                      <motion.div key={role} {...staggerItem}>
                        <Button
                          variant="outline"
                          className={`login-demo-btn h-auto py-3 px-3 flex flex-col items-center gap-2 text-xs font-medium rounded-xl transition-all duration-200 hover:scale-[1.05] hover:shadow-md active:scale-[0.98] ${roleColors[role]}`}
                          onClick={() => handleDemoLogin(role)}
                          disabled={isLoading}
                        >
                          {roleIcons[role]}
                          <span>{roleLabels[role]}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Register Link - More Prominent */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="text-center mt-8 space-y-3"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">New to KisanSetu?</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <button
              onClick={() => navigate('register')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/15 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
              <ArrowRight className="size-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ==================== REGISTER PAGE ====================

const registerRoles: { role: UserRole; icon: React.ReactNode; label: string; desc: string; color: string }[] = [
  { role: 'farmer', icon: <Tractor className="size-7" />, label: 'Farmer', desc: 'Grow crops, manage your farm, and sell produce', color: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' },
  { role: 'consumer', icon: <ShoppingCart className="size-7" />, label: 'Consumer', desc: 'Buy fresh farm produce directly from farmers', color: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' },
  { role: 'collection_center', icon: <Building2 className="size-7" />, label: 'Collection Center', desc: 'Collect, quality-check, and distribute produce', color: 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-400' },
  { role: 'expert', icon: <Stethoscope className="size-7" />, label: 'Expert', desc: 'Advise farmers and review disease cases', color: 'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/20 dark:border-violet-800 dark:text-violet-400' },
];

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
];

export function RegisterPage() {
  const { navigate } = useAppStore();
  const { register, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [regError, setRegError] = useState('');

  const totalSteps = 4;

  const handleComplete = async () => {
    setRegError('');
    if (selectedRole) {
      try {
        await register({ name, email, phone: '+91 ' + phone, password, role: selectedRole });
        if (selectedRole === 'farmer') {
          navigate('onboarding');
        } else {
          navigate(roleDashboardMap[selectedRole]);
        }
      } catch (e: any) {
        setRegError(e.message || 'Registration failed');
      }
    }
  };

  const canProceedStep2 = name.trim().length > 0 && phone.length >= 10 && password.length >= 4;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('login')}
          className="size-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg gradient-green flex items-center justify-center text-white font-bold text-sm">
            K
          </div>
          <span className="font-bold">KisanSetu</span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="px-6 pt-2 pb-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <React.Fragment key={i}>
              <div
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  i < step ? 'bg-primary' : 'bg-border'
                }`}
              />
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Step {step} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Role */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Who are you?
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Select your role to get started
                </p>
              </div>

              <div className="space-y-3">
                {registerRoles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => setSelectedRole(r.role)}
                    className={`w-full text-left rounded-xl border-2 p-4 sm:p-5 transition-all duration-200 ${
                      selectedRole === r.role
                        ? `${r.color} border-current shadow-sm scale-[1.01]`
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 size-12 rounded-xl flex items-center justify-center ${
                        selectedRole === r.role ? 'bg-white/60 dark:bg-black/20' : 'bg-muted'
                      }`}>
                        {r.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base">{r.label}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {r.desc}
                        </div>
                      </div>
                      {selectedRole === r.role && (
                        <CheckCircle2 className="size-5 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <Button
                className="w-full mt-6 h-11 font-semibold rounded-xl"
                disabled={!selectedRole}
                onClick={() => setStep(2)}
              >
                Continue
                <ChevronRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Basic Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Basic Details
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Tell us a little about yourself
                </p>
              </div>

              <Card className="shadow-sm">
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="reg-name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-3 rounded-md border border-input bg-muted/50 text-sm text-muted-foreground whitespace-nowrap h-9">
                        🇮🇳 +91
                      </div>
                      <Input
                        id="reg-phone"
                        type="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-sm font-medium">
                      Email Address
                      <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Create a password (min 4 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {regError && <p className="text-sm text-destructive text-center">{regError}</p>}

              <Button
                className="w-full mt-6 h-11 font-semibold rounded-xl"
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
              >
                Continue
                <ChevronRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Language */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Choose Your Language
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  KisanSetu works best in your language
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                      selectedLang === lang.code
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`text-2xl mb-1.5 ${selectedLang === lang.code ? 'scale-110' : ''} transition-transform`}>
                      {lang.native.charAt(0)}
                    </div>
                    <div className="font-semibold text-sm">{lang.native}</div>
                    <div className="text-xs text-muted-foreground">{lang.label}</div>
                    {selectedLang === lang.code && (
                      <CheckCircle2 className="size-4 mx-auto mt-1.5 text-primary" />
                    )}
                  </button>
                ))}
              </div>

              <Button
                className="w-full mt-6 h-11 font-semibold rounded-xl"
                onClick={() => setStep(4)}
              >
                Continue
                <ChevronRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="mx-auto mb-6"
              >
                <div className="relative inline-flex">
                  <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
                    >
                      <CheckCircle2 className="size-14 text-primary" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                  />
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold tracking-tight">
                Welcome, {name || 'Farmer'}! 🎉
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Your account is ready. Let&apos;s set up your profile and get you started on your farming journey.
              </p>

              <Button
                className="w-full mt-8 h-11 font-semibold rounded-xl"
                onClick={handleComplete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up...
                  </span>
                ) : selectedRole === 'farmer' ? (
                  <>
                    Continue to Setup
                    <ChevronRight className="size-4" />
                  </>
                ) : (
                  <>
                    Go to Dashboard
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}