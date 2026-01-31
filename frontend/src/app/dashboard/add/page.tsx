'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Moon,
  Activity,
  Apple,
  TestTube,
  Timer,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const entryTypes = [
  { id: 'sleep', name: 'Sleep', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'activity', name: 'Activity', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'nutrition', name: 'Nutrition', icon: Apple, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'biomarker', name: 'Biomarker', icon: TestTube, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'fasting', name: 'Fasting', icon: Timer, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

export default function AddEntryPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [sleepForm, setSleepForm] = useState({
    duration: '',
    quality: '',
    deepSleep: '',
    remSleep: '',
    bedtime: '',
    wakeTime: '',
  });

  const [activityForm, setActivityForm] = useState({
    type: '',
    duration: '',
    calories: '',
    steps: '',
    heartRate: '',
  });

  const [nutritionForm, setNutritionForm] = useState({
    protein: '',
    calories: '',
    carbs: '',
    fat: '',
    notes: '',
  });

  const [biomarkerForm, setBiomarkerForm] = useState({
    name: '',
    value: '',
    unit: '',
    testDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast.success('Entry added successfully!');
    router.push('/dashboard');
  };

  if (!selectedType) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Plus className="h-8 w-8 text-primary" />
            Add Entry
          </h1>
          <p className="text-muted-foreground">
            Log your health data manually.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entryTypes.map((type) => (
            <Card
              key={type.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]',
                selectedType === type.id && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedType(type.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn('p-3 rounded-xl', type.bg)}>
                    <type.icon className={cn('h-6 w-6', type.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Log {type.name.toLowerCase()} data
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const selectedTypeInfo = entryTypes.find((t) => t.id === selectedType)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setSelectedType(null)}>
          ← Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <selectedTypeInfo.icon className={cn('h-8 w-8', selectedTypeInfo.color)} />
            Log {selectedTypeInfo.name}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter {selectedTypeInfo.name} Data</CardTitle>
          <CardDescription>
            Fill in the details below to log your {selectedTypeInfo.name.toLowerCase()} metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedType === 'sleep' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Total Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  value={sleepForm.duration}
                  onChange={(e) => setSleepForm({ ...sleepForm, duration: e.target.value })}
                  placeholder="7.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quality">Quality Score (1-100)</Label>
                <Input
                  id="quality"
                  type="number"
                  value={sleepForm.quality}
                  onChange={(e) => setSleepForm({ ...sleepForm, quality: e.target.value })}
                  placeholder="85"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deepSleep">Deep Sleep (hours)</Label>
                <Input
                  id="deepSleep"
                  type="number"
                  step="0.1"
                  value={sleepForm.deepSleep}
                  onChange={(e) => setSleepForm({ ...sleepForm, deepSleep: e.target.value })}
                  placeholder="1.8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remSleep">REM Sleep (hours)</Label>
                <Input
                  id="remSleep"
                  type="number"
                  step="0.1"
                  value={sleepForm.remSleep}
                  onChange={(e) => setSleepForm({ ...sleepForm, remSleep: e.target.value })}
                  placeholder="1.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedtime">Bedtime</Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={sleepForm.bedtime}
                  onChange={(e) => setSleepForm({ ...sleepForm, bedtime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wakeTime">Wake Time</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={sleepForm.wakeTime}
                  onChange={(e) => setSleepForm({ ...sleepForm, wakeTime: e.target.value })}
                />
              </div>
            </div>
          )}

          {selectedType === 'activity' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="actType">Activity Type</Label>
                <Input
                  id="actType"
                  value={activityForm.type}
                  onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                  placeholder="Zone 2 Run, Strength Training, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actDuration">Duration (minutes)</Label>
                <Input
                  id="actDuration"
                  type="number"
                  value={activityForm.duration}
                  onChange={(e) => setActivityForm({ ...activityForm, duration: e.target.value })}
                  placeholder="45"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actCalories">Calories Burned</Label>
                <Input
                  id="actCalories"
                  type="number"
                  value={activityForm.calories}
                  onChange={(e) => setActivityForm({ ...activityForm, calories: e.target.value })}
                  placeholder="350"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="steps">Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  value={activityForm.steps}
                  onChange={(e) => setActivityForm({ ...activityForm, steps: e.target.value })}
                  placeholder="10000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartRate">Avg Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={activityForm.heartRate}
                  onChange={(e) => setActivityForm({ ...activityForm, heartRate: e.target.value })}
                  placeholder="135"
                />
              </div>
            </div>
          )}

          {selectedType === 'nutrition' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={nutritionForm.protein}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, protein: e.target.value })}
                  placeholder="160"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nutCalories">Total Calories</Label>
                <Input
                  id="nutCalories"
                  type="number"
                  value={nutritionForm.calories}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, calories: e.target.value })}
                  placeholder="2000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbohydrates (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={nutritionForm.carbs}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, carbs: e.target.value })}
                  placeholder="150"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={nutritionForm.fat}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, fat: e.target.value })}
                  placeholder="70"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nutNotes">Notes</Label>
                <Input
                  id="nutNotes"
                  value={nutritionForm.notes}
                  onChange={(e) => setNutritionForm({ ...nutritionForm, notes: e.target.value })}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
          )}

          {selectedType === 'biomarker' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bioName">Biomarker Name</Label>
                <Input
                  id="bioName"
                  value={biomarkerForm.name}
                  onChange={(e) => setBiomarkerForm({ ...biomarkerForm, name: e.target.value })}
                  placeholder="HbA1c, Vitamin D, hs-CRP, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bioValue">Value</Label>
                <Input
                  id="bioValue"
                  type="number"
                  step="0.01"
                  value={biomarkerForm.value}
                  onChange={(e) => setBiomarkerForm({ ...biomarkerForm, value: e.target.value })}
                  placeholder="5.2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bioUnit">Unit</Label>
                <Input
                  id="bioUnit"
                  value={biomarkerForm.unit}
                  onChange={(e) => setBiomarkerForm({ ...biomarkerForm, unit: e.target.value })}
                  placeholder="%, ng/mL, mg/dL, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testDate">Test Date</Label>
                <Input
                  id="testDate"
                  type="date"
                  value={biomarkerForm.testDate}
                  onChange={(e) => setBiomarkerForm({ ...biomarkerForm, testDate: e.target.value })}
                />
              </div>

              {/* Quick Biomarker Buttons */}
              <div className="md:col-span-2">
                <Label className="mb-2 block">Quick Select</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'HbA1c', unit: '%' },
                    { name: 'Vitamin D', unit: 'ng/mL' },
                    { name: 'hs-CRP', unit: 'mg/L' },
                    { name: 'LDL-C', unit: 'mg/dL' },
                    { name: 'ApoB', unit: 'mg/dL' },
                    { name: 'Homocysteine', unit: 'μmol/L' },
                  ].map((bio) => (
                    <Button
                      key={bio.name}
                      variant="outline"
                      size="sm"
                      onClick={() => setBiomarkerForm({ ...biomarkerForm, name: bio.name, unit: bio.unit })}
                    >
                      {bio.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedType === 'fasting' && (
            <div className="text-center py-8">
              <Timer className="h-16 w-16 mx-auto mb-4 text-amber-500" />
              <h3 className="text-xl font-semibold mb-2">Start a Fasting Session</h3>
              <p className="text-muted-foreground mb-4">
                Go to the Fasting page to start and track your intermittent fasting.
              </p>
              <Button onClick={() => router.push('/dashboard/fasting')}>
                Go to Fasting Timer
              </Button>
            </div>
          )}

          {selectedType !== 'fasting' && (
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setSelectedType(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  'Saving...'
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
