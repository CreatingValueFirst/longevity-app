'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Settings,
  User,
  Bell,
  Palette,
  Watch,
  Save,
  Moon,
  Sun,
  Check,
  Download,
  Trash2,
  RotateCcw,
  Upload,
  Link,
  AlertTriangle,
  Shield,
  Loader2,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useUserStore, useSettingsStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

// Zod validation schema for profile form
const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  heightCm: z.string().refine((val) => !val || (parseFloat(val) > 0 && parseFloat(val) < 300), {
    message: 'Height must be between 0 and 300 cm',
  }),
  weightKg: z.string().refine((val) => !val || (parseFloat(val) > 0 && parseFloat(val) < 500), {
    message: 'Weight must be between 0 and 500 kg',
  }),
  primaryGoal: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface FormErrors {
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
  heightCm?: string;
  weightKg?: string;
}

// Wearable options - will be synced with store in a real app
const initialWearableOptions = [
  { id: 'oura', name: 'Oura Ring', icon: '💍', connected: true, lastSync: '2 hours ago' },
  { id: 'whoop', name: 'WHOOP', icon: '⌚', connected: false, lastSync: null },
  { id: 'apple', name: 'Apple Health', icon: '🍎', connected: true, lastSync: '30 minutes ago' },
  { id: 'garmin', name: 'Garmin', icon: '🏃', connected: false, lastSync: null },
  { id: 'fitbit', name: 'Fitbit', icon: '💪', connected: false, lastSync: null },
];

// Connected accounts for OAuth integrations
const connectedAccountOptions = [
  { id: 'google', name: 'Google', icon: '🔍', connected: false, description: 'Sign in with Google' },
  { id: 'apple', name: 'Apple', icon: '🍎', connected: true, description: 'Sign in with Apple' },
  { id: 'strava', name: 'Strava', icon: '🏃', connected: false, description: 'Sync workout activities' },
];

export default function SettingsPage() {
  const profile = useUserStore((state) => state.profile);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const {
    notifications,
    setNotifications,
    units,
    setUnits,
    fastingDefaults,
    setFastingDefaults
  } = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wearables state
  const [wearables, setWearables] = useState(initialWearableOptions);
  const [connectingWearable, setConnectingWearable] = useState<string | null>(null);

  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState(connectedAccountOptions);
  const [connectingAccount, setConnectingAccount] = useState<string | null>(null);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    dateOfBirth: profile?.dateOfBirth || '',
    heightCm: profile?.heightCm?.toString() || '',
    weightKg: profile?.weightKg?.toString() || '',
    primaryGoal: profile?.primaryGoal || '',
  });

  // Track form changes
  const updateFormData = useCallback((field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    // Clear error for this field when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  // Validate form
  const validateForm = (): boolean => {
    try {
      profileSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: FormErrors = {};
        (error as z.ZodError).issues.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          errors[field] = err.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failure for demonstration
          if (Math.random() > 0.95) {
            reject(new Error('Network error'));
          } else {
            resolve(true);
          }
        }, 1000);
      });

      updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        heightCm: parseFloat(formData.heightCm) || 0,
        weightKg: parseFloat(formData.weightKg) || 0,
        primaryGoal: formData.primaryGoal,
      });

      setHasChanges(false);
      toast.success('Profile saved successfully', {
        description: 'Your changes have been saved.',
      });
    } catch {
      toast.error('Failed to save profile', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset profile to defaults
  const handleResetProfile = () => {
    setFormData({
      fullName: '',
      email: '',
      dateOfBirth: '',
      heightCm: '',
      weightKg: '',
      primaryGoal: '',
    });
    setFormErrors({});
    setHasChanges(true);
    toast.info('Form reset to defaults');
  };

  // Reset settings to defaults
  const handleResetSettings = () => {
    setUnits({ weight: 'kg', height: 'cm', temperature: 'celsius' });
    setNotifications({
      morningReminder: true,
      protocolReminders: true,
      milestones: true,
      weeklyReport: true,
    });
    setFastingDefaults({ targetHours: 16, reminderEnabled: true });
    toast.success('Settings reset to defaults');
  };

  // Export user data
  const handleExportData = async () => {
    try {
      const userData = {
        profile,
        settings: {
          notifications,
          units,
          fastingDefaults,
        },
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `longevity-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully', {
        description: 'Your data has been downloaded.',
      });
    } catch {
      toast.error('Failed to export data');
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      // Simulate API call for account deletion
      await new Promise((resolve) => setTimeout(resolve, 1500));
      clearProfile();
      toast.success('Account deleted', {
        description: 'Your account and all data have been permanently deleted.',
      });
      // In a real app, redirect to landing page
    } catch {
      toast.error('Failed to delete account', {
        description: 'Please try again or contact support.',
      });
    }
  };

  // Handle wearable connection/disconnection
  const handleWearableToggle = async (wearableId: string) => {
    setConnectingWearable(wearableId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setWearables(prev => prev.map(w => {
        if (w.id === wearableId) {
          const newConnected = !w.connected;
          return {
            ...w,
            connected: newConnected,
            lastSync: newConnected ? 'Just now' : null,
          };
        }
        return w;
      }));
      const wearable = wearables.find(w => w.id === wearableId);
      if (wearable?.connected) {
        toast.success(`Disconnected from ${wearable.name}`);
      } else {
        toast.success(`Connected to ${wearable?.name}`, {
          description: 'Data sync will begin shortly.',
        });
      }
    } catch {
      toast.error('Connection failed', {
        description: 'Please try again.',
      });
    } finally {
      setConnectingWearable(null);
    }
  };

  // Handle connected account toggle
  const handleAccountToggle = async (accountId: string) => {
    setConnectingAccount(accountId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setConnectedAccounts(prev => prev.map(a => {
        if (a.id === accountId) {
          return { ...a, connected: !a.connected };
        }
        return a;
      }));
      const account = connectedAccounts.find(a => a.id === accountId);
      if (account?.connected) {
        toast.success(`Disconnected from ${account.name}`);
      } else {
        toast.success(`Connected to ${account?.name}`);
      }
    } catch {
      toast.error('Connection failed');
    } finally {
      setConnectingAccount(null);
    }
  };

  // Handle profile picture upload (placeholder)
  const handlePhotoUpload = () => {
    // In a real app, this would open a file picker and upload the image
    toast.info('Photo upload coming soon', {
      description: 'This feature will be available in a future update.',
    });
  };

  const initials = profile?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account, preferences, and connected devices.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetSettings}
          className="w-fit touch-manipulation"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 sm:grid sm:grid-cols-5 h-auto p-1 gap-1">
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2.5 px-3 whitespace-nowrap">Profile</TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs sm:text-sm py-2.5 px-3 whitespace-nowrap">Prefs</TabsTrigger>
            <TabsTrigger value="wearables" className="text-xs sm:text-sm py-2.5 px-3 whitespace-nowrap">Devices</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm py-2.5 px-3 whitespace-nowrap">Alerts</TabsTrigger>
            <TabsTrigger value="data" className="text-xs sm:text-sm py-2.5 px-3 whitespace-nowrap">Privacy</TabsTrigger>
          </TabsList>
        </div>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and health details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" onClick={handlePhotoUpload}>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      className={cn(formErrors.fullName && 'border-destructive')}
                    />
                    {formErrors.fullName && (
                      <p className="text-xs text-destructive">{formErrors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={cn(formErrors.email && 'border-destructive')}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-destructive">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">
                      Date of Birth <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                      className={cn(formErrors.dateOfBirth && 'border-destructive')}
                    />
                    {formErrors.dateOfBirth && (
                      <p className="text-xs text-destructive">{formErrors.dateOfBirth}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Primary Health Goal</Label>
                    <Input
                      id="goal"
                      value={formData.primaryGoal}
                      onChange={(e) => updateFormData('primaryGoal', e.target.value)}
                      placeholder="e.g., Optimize healthspan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height ({units.height})</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.heightCm}
                      onChange={(e) => updateFormData('heightCm', e.target.value)}
                      className={cn(formErrors.heightCm && 'border-destructive')}
                      placeholder={units.height === 'cm' ? 'e.g., 175' : 'e.g., 5.9'}
                    />
                    {formErrors.heightCm && (
                      <p className="text-xs text-destructive">{formErrors.heightCm}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight ({units.weight})</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weightKg}
                      onChange={(e) => updateFormData('weightKg', e.target.value)}
                      className={cn(formErrors.weightKg && 'border-destructive')}
                      placeholder={units.weight === 'kg' ? 'e.g., 70' : 'e.g., 154'}
                    />
                    {formErrors.weightKg && (
                      <p className="text-xs text-destructive">{formErrors.weightKg}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleResetProfile}
                    disabled={isSaving}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Form
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving || !hasChanges}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Connected Accounts
                </CardTitle>
                <CardDescription>
                  Manage your linked accounts for easy sign-in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedAccounts.map((account) => (
                    <div
                      key={account.id}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-lg border',
                        account.connected && 'border-green-500/50 bg-green-500/5'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{account.icon}</span>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.connected && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
                            <Check className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                        <Button
                          variant={account.connected ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => handleAccountToggle(account.id)}
                          disabled={connectingAccount === account.id}
                        >
                          {connectingAccount === account.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : account.connected ? (
                            'Disconnect'
                          ) : (
                            'Connect'
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="grid gap-6">
            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how the app looks and feels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {mounted && (['light', 'dark', 'system'] as const).map((t) => (
                      <Button
                        key={t}
                        variant={theme === t ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme(t)}
                        className="capitalize"
                      >
                        {t === 'light' && <Sun className="h-4 w-4 mr-1" />}
                        {t === 'dark' && <Moon className="h-4 w-4 mr-1" />}
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Units */}
            <Card>
              <CardHeader>
                <CardTitle>Units</CardTitle>
                <CardDescription>
                  Set your preferred measurement units. These will be used throughout the app.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weight</Label>
                    <p className="text-sm text-muted-foreground">
                      Used for body weight and food measurements
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(['kg', 'lbs'] as const).map((u) => (
                      <Button
                        key={u}
                        variant={units.weight === u ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setUnits({ weight: u });
                          toast.success(`Weight unit changed to ${u}`);
                        }}
                      >
                        {u}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Height</Label>
                    <p className="text-sm text-muted-foreground">
                      Used for height measurements
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(['cm', 'ft'] as const).map((u) => (
                      <Button
                        key={u}
                        variant={units.height === u ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setUnits({ height: u });
                          toast.success(`Height unit changed to ${u}`);
                        }}
                      >
                        {u}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Temperature</Label>
                    <p className="text-sm text-muted-foreground">
                      Used for body temperature readings
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(['celsius', 'fahrenheit'] as const).map((u) => (
                      <Button
                        key={u}
                        variant={units.temperature === u ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setUnits({ temperature: u });
                          toast.success(`Temperature unit changed to ${u === 'celsius' ? 'Celsius' : 'Fahrenheit'}`);
                        }}
                      >
                        {u === 'celsius' ? '°C' : '°F'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fasting Defaults */}
            <Card>
              <CardHeader>
                <CardTitle>Fasting Defaults</CardTitle>
                <CardDescription>
                  Set your default fasting preferences for quick access.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Default Target Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Default fasting target when starting a new fast.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {[16, 18, 20, 24].map((h) => (
                      <Button
                        key={h}
                        variant={fastingDefaults.targetHours === h ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setFastingDefaults({ targetHours: h });
                          toast.success(`Default fasting target set to ${h} hours`);
                        }}
                      >
                        {h}h
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Fasting Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when approaching your fasting goal.
                    </p>
                  </div>
                  <Switch
                    checked={fastingDefaults.reminderEnabled}
                    onCheckedChange={(checked) => {
                      setFastingDefaults({ reminderEnabled: checked });
                      toast.success(checked ? 'Fasting reminders enabled' : 'Fasting reminders disabled');
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Wearables Tab */}
        <TabsContent value="wearables">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Watch className="h-5 w-5" />
                Connected Wearables
              </CardTitle>
              <CardDescription>
                Connect your wearable devices to automatically sync health data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wearables.map((wearable) => (
                  <div
                    key={wearable.id}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-lg border transition-colors',
                      wearable.connected && 'border-green-500/50 bg-green-500/5'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{wearable.icon}</span>
                      <div>
                        <p className="font-medium">{wearable.name}</p>
                        {wearable.connected && wearable.lastSync && (
                          <p className="text-sm text-muted-foreground">
                            Last synced: {wearable.lastSync}
                          </p>
                        )}
                        {!wearable.connected && (
                          <p className="text-sm text-muted-foreground">
                            Not connected
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {wearable.connected && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                      <Button
                        variant={wearable.connected ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => handleWearableToggle(wearable.id)}
                        disabled={connectingWearable === wearable.id}
                      >
                        {connectingWearable === wearable.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {wearable.connected ? 'Disconnecting...' : 'Connecting...'}
                          </>
                        ) : wearable.connected ? (
                          'Disconnect'
                        ) : (
                          'Connect'
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="text-center text-muted-foreground">
                <p className="text-sm">
                  Don&apos;t see your device? More integrations coming soon.
                </p>
                <Button variant="link" className="text-primary">
                  Request an integration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    key: 'morningReminder' as const,
                    label: 'Morning Summary',
                    desc: 'Daily summary of your health metrics and action items',
                    icon: Sun,
                  },
                  {
                    key: 'protocolReminders' as const,
                    label: 'Protocol Reminders',
                    desc: 'Reminders for supplements and protocol items',
                    icon: Bell,
                  },
                  {
                    key: 'milestones' as const,
                    label: 'Milestone Celebrations',
                    desc: 'Notifications for streaks and achievements',
                    icon: Check,
                  },
                  {
                    key: 'weeklyReport' as const,
                    label: 'Weekly Report',
                    desc: 'Comprehensive weekly health insights',
                    icon: Shield,
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <Label>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={Boolean(notifications[item.key])}
                      onCheckedChange={(checked) => {
                        setNotifications({ [item.key]: checked });
                        toast.success(
                          checked
                            ? `${item.label} enabled`
                            : `${item.label} disabled`
                        );
                      }}
                    />
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Disable All Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn off all notifications at once
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNotifications({
                      morningReminder: false,
                      protocolReminders: false,
                      milestones: false,
                      weeklyReport: false,
                    });
                    toast.success('All notifications disabled');
                  }}
                >
                  Disable All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy Tab */}
        <TabsContent value="data">
          <div className="grid gap-6">
            {/* Export Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Your Data
                </CardTitle>
                <CardDescription>
                  Download a copy of all your data in JSON format.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your export will include your profile, settings, health metrics, and all tracked data.
                    </p>
                  </div>
                  <Button onClick={handleExportData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control how your data is used and shared.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the app by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Personalized Recommendations</Label>
                    <p className="text-sm text-muted-foreground">
                      Use your health data to provide tailored insights
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that affect your account and data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="h-5 w-5" />
                          Delete Account
                        </DialogTitle>
                        <DialogDescription>
                          This action is permanent and cannot be undone. All your data will be permanently deleted, including:
                        </DialogDescription>
                      </DialogHeader>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 my-4">
                        <li>Your profile and personal information</li>
                        <li>All health metrics and tracked data</li>
                        <li>Connected wearable integrations</li>
                        <li>Fasting and protocol history</li>
                        <li>All settings and preferences</li>
                      </ul>
                      <DialogFooter className="gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Forever
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
