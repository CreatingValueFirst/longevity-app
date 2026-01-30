'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore, useSettingsStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

const wearableOptions = [
  { id: 'oura', name: 'Oura Ring', icon: '💍', connected: true, lastSync: '2 hours ago' },
  { id: 'whoop', name: 'WHOOP', icon: '⌚', connected: false, lastSync: null },
  { id: 'apple', name: 'Apple Health', icon: '🍎', connected: true, lastSync: '30 minutes ago' },
  { id: 'garmin', name: 'Garmin', icon: '🏃', connected: false, lastSync: null },
];

export default function SettingsPage() {
  const profile = useUserStore((state) => state.profile);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const { theme, setTheme, notifications, setNotifications, units, setUnits, fastingDefaults, setFastingDefaults } = useSettingsStore();

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    dateOfBirth: profile?.dateOfBirth || '',
    heightCm: profile?.heightCm?.toString() || '',
    weightKg: profile?.weightKg?.toString() || '',
    primaryGoal: profile?.primaryGoal || '',
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateProfile({
      fullName: formData.fullName,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      heightCm: parseFloat(formData.heightCm),
      weightKg: parseFloat(formData.weightKg),
      primaryGoal: formData.primaryGoal,
    });
    setIsSaving(false);
  };

  const initials = profile?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and connected devices.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="wearables">Wearables</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
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
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Primary Health Goal</Label>
                  <Input
                    id="goal"
                    value={formData.primaryGoal}
                    onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                    placeholder="e.g., Optimize healthspan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height ({units.height})</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight ({units.weight})</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    'Saving...'
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
                    {(['light', 'dark', 'system'] as const).map((t) => (
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Weight</Label>
                  <div className="flex gap-2">
                    {(['kg', 'lbs'] as const).map((u) => (
                      <Button
                        key={u}
                        variant={units.weight === u ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setUnits({ weight: u })}
                      >
                        {u}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Height</Label>
                  <div className="flex gap-2">
                    {(['cm', 'ft'] as const).map((u) => (
                      <Button
                        key={u}
                        variant={units.height === u ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setUnits({ height: u })}
                      >
                        {u}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Temperature</Label>
                  <div className="flex gap-2">
                    {(['celsius', 'fahrenheit'] as const).map((u) => (
                      <Button
                        key={u}
                        variant={units.temperature === u ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setUnits({ temperature: u })}
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
                        onClick={() => setFastingDefaults({ targetHours: h })}
                      >
                        {h}h
                      </Button>
                    ))}
                  </div>
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
                {wearableOptions.map((wearable) => (
                  <div
                    key={wearable.id}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-lg border',
                      wearable.connected && 'border-green-500/50 bg-green-500/5'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{wearable.icon}</span>
                      <div>
                        <p className="font-medium">{wearable.name}</p>
                        {wearable.connected && (
                          <p className="text-sm text-muted-foreground">
                            Last synced: {wearable.lastSync}
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
                      <Button variant={wearable.connected ? 'outline' : 'default'} size="sm">
                        {wearable.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
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
                  { key: 'morningReminder', label: 'Morning Summary', desc: 'Daily summary of your health metrics and action items' },
                  { key: 'protocolReminders', label: 'Protocol Reminders', desc: 'Reminders for supplements and protocol items' },
                  { key: 'milestones', label: 'Milestone Celebrations', desc: 'Notifications for streaks and achievements' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Comprehensive weekly health insights' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <Label>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
