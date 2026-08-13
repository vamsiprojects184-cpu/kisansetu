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
    { icon: <Mic className="size-6" />, title: 'Voice Assistant', desc: 'Ask questions in your language. KrishiAI understands local dialects.', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
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
              From soil testing to selling — KrishiAI covers your entire farming journey with intelligent tools.
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
            Join thousands of farmers already using KrishiAI to make smarter decisions and earn more.
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
      <footer className="bg-foreground text-background py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg gradient-green flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <span className="font-bold text-lg">KrishiAI</span>
          </div>
          <p className="text-sm text-background/60">
            © 2025 KrishiAI. Empowering Indian Farmers with AI.
          </p>
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

  const handleDemoLogin = async (role: UserRole) => {
    await login(role);
    navigate(roleDashboardMap[role]);
  };

  const handlePhoneLogin = async () => {
    if (phone.length >= 10) {
      await loginWithPhone(`+91 ${phone}`);
      navigate('farmer/dashboard');
    }
  };

  const handleEmailLogin = async () => {
    if (email.includes('@')) {
      await loginWithEmail(email);
      navigate('farmer/dashboard');
    }
  };

  const demoRoles: UserRole[] = ['farmer', 'consumer', 'collection_center', 'expert', 'admin'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-14 rounded-2xl gradient-green flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg animate-pulse-green">
            K
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Sign in to your KrishiAI account
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
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

            {/* Demo Login Section */}
            <div className="pt-2">
              <div className="relative flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">
                  Demo Login
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {demoRoles.map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    className={`h-auto py-3 px-3 flex flex-col items-center gap-2 text-xs font-medium rounded-xl transition-all ${roleColors[role]}`}
                    onClick={() => handleDemoLogin(role)}
                    disabled={isLoading}
                  >
                    {roleIcons[role]}
                    <span>{roleLabels[role]}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Register Link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => navigate('register')}
            className="text-primary font-semibold hover:underline"
          >
            Create Account
          </button>
        </p>
      </motion.div>
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
  const { login, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');

  const totalSteps = 4;

  const handleComplete = async () => {
    if (selectedRole) {
      await login(selectedRole);
      if (selectedRole === 'farmer') {
        navigate('onboarding');
      } else {
        navigate(roleDashboardMap[selectedRole]);
      }
    }
  };

  const canProceedStep2 = name.trim().length > 0 && phone.length >= 10;

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
          <span className="font-bold">KrishiAI</span>
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
                </CardContent>
              </Card>

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
                  KrishiAI works best in your language
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

// ==================== ONBOARDING PAGE ====================

const indianStates = [
  'Andhra Pradesh', 'Telangana', 'Karnataka', 'Maharashtra', 'Tamil Nadu',
  'Kerala', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh',
  'Punjab', 'Haryana', 'West Bengal', 'Bihar', 'Odisha',
  'Chhattisgarh', 'Jharkhand', 'Assam', 'Other',
];

const cropOptions = [
  { id: 'tomato', name: 'Tomato', emoji: '🍅' },
  { id: 'rice', name: 'Rice', emoji: '🌾' },
  { id: 'cotton', name: 'Cotton', emoji: '🧵' },
  { id: 'chilli', name: 'Chilli', emoji: '🌶️' },
  { id: 'maize', name: 'Maize', emoji: '🌽' },
  { id: 'onion', name: 'Onion', emoji: '🧅' },
];

export function OnboardingPage() {
  const { navigate } = useAppStore();
  const { completeOnboarding, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [language, setLanguage] = useState('en');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [irrigation, setIrrigation] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const toggleCrop = (cropId: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId) ? prev.filter((c) => c !== cropId) : [...prev, cropId]
    );
  };

  const handleComplete = async () => {
    completeOnboarding({
      language,
      state,
      district,
      village,
      location: `${village}, ${district}, ${state}`,
    });
    navigate('farmer/dashboard');
  };

  const stepLabels = ['Welcome', 'Language', 'Location', 'Farm', 'Crops', 'Done'];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate('login')}
              className="size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            <span className="text-sm font-medium text-muted-foreground">
              {stepLabels[step - 1]}
            </span>
            <span className="text-xs text-muted-foreground">
              {step}/{totalSteps}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <motion.div
              key="ob-step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                className="mx-auto mb-6"
              >
                <div className="relative inline-block">
                  <div className="size-32 sm:size-40 rounded-full bg-gradient-to-br from-primary/20 to-emerald-100 dark:from-primary/10 dark:to-emerald-900/20 flex items-center justify-center">
                    <motion.span
                      className="text-6xl sm:text-7xl"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    >
                      🌾
                    </motion.span>
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl"
                    animate={{ y: [0, -5, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  >
                    ☀️
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-1 -left-1 size-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-lg"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: 'easeInOut' }}
                  >
                    💧
                  </motion.div>
                </div>
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Let&apos;s Understand Your Farm
              </h1>
              <p className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                We&apos;ll ask a few quick questions to personalize KrishiAI for your farm. This takes less than 2 minutes.
              </p>

              <Button
                className="w-full mt-8 h-11 font-semibold rounded-xl max-w-xs mx-auto"
                onClick={() => setStep(2)}
              >
                Let&apos;s Go
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Language Selection */}
          {step === 2 && (
            <motion.div
              key="ob-step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="inline-flex size-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                  <Languages className="size-7 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Select Your Language
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Get AI advice in your preferred language
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`rounded-xl border-2 p-5 text-center transition-all duration-200 ${
                      language === lang.code
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-3xl mb-2 font-bold">
                      {lang.native}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lang.label}
                    </div>
                    {language === lang.code && (
                      <Check className="size-5 mx-auto mt-2 text-primary" strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>

              <Button
                className="w-full mt-6 h-11 font-semibold rounded-xl"
                onClick={() => setStep(3)}
              >
                Continue
                <ChevronRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Farm Location */}
          {step === 3 && (
            <motion.div
              key="ob-step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="inline-flex size-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                  <MapPin className="size-7 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Where is Your Farm?
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  We use this for weather and market data
                </p>
              </div>

              <Card className="shadow-sm">
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">State</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ob-district" className="text-sm font-medium">
                      District
                    </Label>
                    <Input
                      id="ob-district"
                      placeholder="e.g., Siddipet"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ob-village" className="text-sm font-medium">
                      Village
                    </Label>
                    <Input
                      id="ob-village"
                      placeholder="e.g., Gajwel"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full mt-6 h-11 font-semibold rounded-xl"
                disabled={!state || !district}
                onClick={() => setStep(4)}
              >
                Continue
                <ChevronRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 4: Farm Details */}
          {step === 4 && (
            <motion.div
              key="ob-step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="inline-flex size-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                  <Tractor className="size-7 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  About Your Farm
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Help us understand your farming setup
                </p>
              </div>

              <Card className="shadow-sm">
                <CardContent className="p-5 sm:p-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="ob-farm-name" className="text-sm font-medium">
                      Farm Name
                    </Label>
                    <Input
                      id="ob-farm-name"
                      placeholder="e.g., My Farm, Green Fields"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ob-farm-size" className="text-sm font-medium">
                      Farm Size
                    </Label>
                    <div className="relative">
                      <Input
                        id="ob-farm-size"
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

                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div className="flex items-center gap-3">
                      <Droplets className={`size-5 ${irrigation ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="font-medium text-sm">Irrigation Available</div>
                        <div className="text-xs text-muted-foreground">
                          Do you have irrigation facilities?
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={irrigation}
                      onCheckedChange={setIrrigation}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full mt-6 h-11 font-semibold rounded-xl"
                disabled={!farmName || !farmSize}
                onClick={() => setStep(5)}
              >
                Continue
                <ChevronRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 5: Primary Crops */}
          {step === 5 && (
            <motion.div
              key="ob-step5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="inline-flex size-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                  <Wheat className="size-7 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  What Do You Grow?
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Select your primary crops (can add more later)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {cropOptions.map((crop) => {
                  const isSelected = selectedCrops.includes(crop.id);
                  return (
                    <motion.button
                      key={crop.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleCrop(crop.id)}
                      className={`rounded-xl border-2 p-5 text-center transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/30 hover:bg-muted/50'
                      }`}
                    >
                      <motion.span
                        className="text-4xl block mb-2"
                        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {crop.emoji}
                      </motion.span>
                      <div className="font-semibold text-sm">{crop.name}</div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-1.5"
                        >
                          <Check className="size-5 mx-auto text-primary" strokeWidth={3} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <Button
                className="w-full mt-6 h-11 font-semibold rounded-xl"
                onClick={() => setStep(6)}
              >
                Continue
                <ChevronRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 6: Complete */}
          {step === 6 && (
            <motion.div
              key="ob-step6"
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
                  <div className="size-28 rounded-full bg-primary/10 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
                    >
                      <Star className="size-14 text-primary fill-primary" />
                    </motion.div>
                  </div>
                  {/* Celebration particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute size-3 rounded-full bg-primary/60"
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((i * 60 * Math.PI) / 180) * 50,
                        y: Math.sin((i * 60 * Math.PI) / 180) * 50,
                      }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: '-6px',
                        marginTop: '-6px',
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl sm:text-3xl font-bold tracking-tight"
              >
                Your Farm is Ready! 🎉
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-muted-foreground mt-3 text-sm leading-relaxed"
              >
                {farmName
                  ? `${farmName} has been set up with all your details. Start exploring AI-powered farming insights!`
                  : 'Your farm has been set up. Start exploring AI-powered farming insights!'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-4"
              >
                {selectedCrops.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {selectedCrops.map((cropId) => {
                      const crop = cropOptions.find((c) => c.id === cropId);
                      if (!crop) return null;
                      return (
                        <Badge
                          key={cropId}
                          variant="secondary"
                          className="text-sm py-1.5 px-3 rounded-full"
                        >
                          {crop.emoji} {crop.name}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8"
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
                      Setting up your farm...
                    </span>
                  ) : (
                    <>
                      Go to My Farm
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== EXTRA ICONS (for timeline) ====================
// These are simple placeholder components using Lucide
function FlaskConical({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 3h6" />
      <path d="M10 9V3h4v6l5 8.5a2 2 0 0 1-1.7 3H6.7a2 2 0 0 1-1.7-3L10 9Z" />
    </svg>
  );
}

function CloudSun({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="M20 12h2" />
      <path d="m19.07 4.93-1.41 1.41" />
      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
    </svg>
  );
}

function Eye({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Scissors({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="6" cy="6" r="3" />
      <path d="M8.12 8.12 12 12" />
      <path d="M20 4 8.12 15.88" />
      <circle cx="6" cy="18" r="3" />
      <path d="M14.8 14.8 20 20" />
    </svg>
  );
}

function Banknote({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}
