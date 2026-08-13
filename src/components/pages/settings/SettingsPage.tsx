'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/use-auth-store';
import {
  Settings,
  Camera,
  Sun,
  Moon,
  Monitor,
  Bell,
  CloudLightning,
  Shield,
  Smartphone,
  Globe,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Eye,
  EyeOff,
  MapPin,
  Wheat,
  Droplets,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// ============== NOTIFICATION TOGGLES ==============
interface NotificationToggle {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

const notificationToggles: NotificationToggle[] = [
  { id: 'order_updates', label: 'Order Updates', description: 'Get notified about your order status changes', defaultEnabled: true },
  { id: 'price_alerts', label: 'Price Alerts', description: 'Receive alerts when crop prices change significantly', defaultEnabled: true },
  { id: 'weather_warnings', label: 'Weather Warnings', description: 'Severe weather alerts for your farm location', defaultEnabled: true },
  { id: 'disease_alerts', label: 'Disease Alerts', description: 'Notifications about detected crop diseases in your area', defaultEnabled: false },
  { id: 'marketing_emails', label: 'Marketing Emails', description: 'Promotional offers and product recommendations', defaultEnabled: false },
  { id: 'sms_notifications', label: 'SMS Notifications', description: 'Important updates delivered via SMS', defaultEnabled: false },
];

// ============== CROPS ==============
const cropOptions = [
  { id: 'rice', label: 'Rice' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'tomato', label: 'Tomato' },
  { id: 'chilli', label: 'Chilli' },
  { id: 'cotton', label: 'Cotton' },
  { id: 'brinjal', label: 'Brinjal' },
  { id: 'onion', label: 'Onion' },
];

// ============== MOCK SESSIONS ==============
const mockSessions = [
  { id: '1', device: 'Chrome on Windows', location: 'Hyderabad, India', lastActive: 'Active now', isCurrent: true },
  { id: '2', device: 'Safari on iPhone', location: 'Warangal, India', lastActive: '2 hours ago', isCurrent: false },
  { id: '3', device: 'Firefox on Linux', location: 'Vijayawada, India', lastActive: '1 day ago', isCurrent: false },
];

// ============== PROFILE TAB ==============
function ProfileTab() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [language, setLanguage] = useState(user?.language || 'en');

  const handleSave = () => {
    updateUser({ name, email, phone, language });
    toast.success('Profile updated successfully');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
          <CardDescription>Update your personal details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => toast.info('Avatar upload coming soon')}
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info('Avatar upload coming soon')}>
                <Camera className="h-3.5 w-3.5 mr-1.5" />
                Change Photo
              </Button>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============== NOTIFICATIONS TAB ==============
function NotificationsTab() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationToggles.map((t) => [t.id, t.defaultEnabled]))
  );

  const handleToggle = (id: string, checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSave = () => {
    toast.success('Notification preferences saved');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
          <CardDescription>Choose which notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationToggles.map((toggle, idx) => (
            <React.Fragment key={toggle.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{toggle.label}</p>
                  <p className="text-xs text-muted-foreground">{toggle.description}</p>
                </div>
                <Switch
                  checked={preferences[toggle.id]}
                  onCheckedChange={(checked) => handleToggle(toggle.id, checked)}
                />
              </div>
              {idx < notificationToggles.length - 1 && <Separator className="mt-4" />}
            </React.Fragment>
          ))}

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============== FARM SETTINGS TAB ==============
function FarmSettingsTab() {
  const { user } = useAuthStore();
  const isFarmer = user?.role === 'farmer';

  const [farmName, setFarmName] = useState('Green Fields Farm');
  const [location, setLocation] = useState('Warangal, Telangana');
  const [size, setSize] = useState('12');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['rice', 'chilli']);
  const [soilType, setSoilType] = useState('red');
  const [irrigation, setIrrigation] = useState('drip');

  const handleCropToggle = (cropId: string, checked: boolean) => {
    setSelectedCrops((prev) =>
      checked ? [...prev, cropId] : prev.filter((id) => id !== cropId)
    );
  };

  const handleSave = () => {
    toast.success('Farm settings updated successfully');
  };

  if (!isFarmer) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Wheat className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Farm Settings</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              This section is available for farmer accounts only. Farm management settings including
              farm details, crop selections, soil type, and irrigation preferences are configured here.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Farm Details</CardTitle>
          <CardDescription>Manage your farm information and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmName">Farm Name</Label>
              <Input id="farmName" value={farmName} onChange={(e) => setFarmName(e.target.value)} placeholder="Enter farm name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmLocation">Location</Label>
              <Input id="farmLocation" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Farm location" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmSize">Size (acres)</Label>
              <Input id="farmSize" type="number" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Farm size in acres" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Primary Crops</CardTitle>
          <CardDescription>Select the main crops you cultivate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {cropOptions.map((crop) => (
              <label
                key={crop.id}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all',
                  selectedCrops.includes(crop.id)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <Checkbox
                  checked={selectedCrops.includes(crop.id)}
                  onCheckedChange={(checked) => handleCropToggle(crop.id, !!checked)}
                />
                <span className="text-sm font-medium">{crop.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Soil & Irrigation</CardTitle>
          <CardDescription>Configure your soil type and irrigation method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger id="soilType">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red Soil</SelectItem>
                  <SelectItem value="black">Black Soil</SelectItem>
                  <SelectItem value="alluvial">Alluvial Soil</SelectItem>
                  <SelectItem value="sandy">Sandy Soil</SelectItem>
                  <SelectItem value="clay">Clay Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="irrigation">Irrigation Method</Label>
              <Select value={irrigation} onValueChange={setIrrigation}>
                <SelectTrigger id="irrigation">
                  <Droplets className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select irrigation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drip">Drip Irrigation</SelectItem>
                  <SelectItem value="sprinkler">Sprinkler</SelectItem>
                  <SelectItem value="flood">Flood Irrigation</SelectItem>
                  <SelectItem value="rainfed">Rainfed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Farm Settings</Button>
      </div>
    </motion.div>
  );
}

// ============== APPEARANCE TAB ==============
function AppearanceTab() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Clean light background' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' },
  ] as const;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Theme</CardTitle>
          <CardDescription>Choose your preferred appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    'flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer',
                    isActive
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  )}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============== SECURITY TAB ==============
function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleToggle2FA = (enabled: boolean) => {
    setTwoFactor(enabled);
    if (enabled) {
      toast.success('Two-Factor Authentication enabled (demo mode)');
    } else {
      toast.info('Two-Factor Authentication disabled');
    }
  };

  const handleSignOutAll = () => {
    toast.success('All other devices have been signed out');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword}>Change Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Enable 2FA</p>
                <p className="text-xs text-muted-foreground">Use an authenticator app for verification</p>
              </div>
            </div>
            <Switch checked={twoFactor} onCheckedChange={handleToggle2FA} />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Sessions</CardTitle>
              <CardDescription>Devices currently logged into your account</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOutAll} className="text-destructive hover:text-destructive">
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign out all others
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3 p-3 rounded-lg border"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{session.device}</p>
                  {session.isCurrent && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {session.location} &middot; {session.lastActive}
                </p>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => toast.success('Device signed out')}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============== MAIN SETTINGS PAGE ==============
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account preferences and configuration</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 bg-muted">
          <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
            <Settings className="h-4 w-4 hidden sm:block" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs sm:text-sm">
            <Bell className="h-4 w-4 hidden sm:block" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="farm" className="gap-1.5 text-xs sm:text-sm">
            <Wheat className="h-4 w-4 hidden sm:block" />
            Farm Settings
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-xs sm:text-sm">
            <Sun className="h-4 w-4 hidden sm:block" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm">
            <Shield className="h-4 w-4 hidden sm:block" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="farm">
          <FarmSettingsTab />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
