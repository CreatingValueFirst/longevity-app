'use client';

import { TestTube, TrendingUp, TrendingDown, Plus, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Demo biomarker data
const biomarkerResults = {
  metabolic: [
    { name: 'HbA1c', value: 5.1, unit: '%', normalRange: [4.0, 5.7] as [number, number], optimalRange: [4.8, 5.2] as [number, number], lastTest: '2024-01-15', change: -0.2 },
    { name: 'Fasting Glucose', value: 82, unit: 'mg/dL', normalRange: [70, 100] as [number, number], optimalRange: [70, 85] as [number, number], lastTest: '2024-01-15', change: -5 },
    { name: 'Fasting Insulin', value: 5.2, unit: 'µIU/mL', normalRange: [2, 25] as [number, number], optimalRange: [2, 6] as [number, number], lastTest: '2024-01-15', change: -1.5 },
  ],
  lipids: [
    { name: 'Total Cholesterol', value: 185, unit: 'mg/dL', normalRange: [0, 200] as [number, number], optimalRange: [0, 180] as [number, number], lastTest: '2024-01-15', change: -10 },
    { name: 'LDL-C', value: 85, unit: 'mg/dL', normalRange: [0, 100] as [number, number], optimalRange: [0, 70] as [number, number], lastTest: '2024-01-15', change: -8 },
    { name: 'HDL-C', value: 62, unit: 'mg/dL', normalRange: [40, 100] as [number, number], optimalRange: [60, 100] as [number, number], lastTest: '2024-01-15', change: 5 },
    { name: 'Triglycerides', value: 78, unit: 'mg/dL', normalRange: [0, 150] as [number, number], optimalRange: [0, 100] as [number, number], lastTest: '2024-01-15', change: -12 },
    { name: 'ApoB', value: 82, unit: 'mg/dL', normalRange: [0, 130] as [number, number], optimalRange: [0, 90] as [number, number], lastTest: '2024-01-15', change: -5 },
  ],
  inflammation: [
    { name: 'hs-CRP', value: 0.8, unit: 'mg/L', normalRange: [0, 3] as [number, number], optimalRange: [0, 1] as [number, number], lastTest: '2024-01-15', change: -0.3 },
    { name: 'Homocysteine', value: 8.5, unit: 'µmol/L', normalRange: [0, 15] as [number, number], optimalRange: [0, 10] as [number, number], lastTest: '2024-01-15', change: -1.2 },
  ],
  nutrients: [
    { name: 'Vitamin D', value: 58, unit: 'ng/mL', normalRange: [30, 100] as [number, number], optimalRange: [50, 80] as [number, number], lastTest: '2024-01-15', change: 12 },
    { name: 'Vitamin B12', value: 650, unit: 'pg/mL', normalRange: [200, 900] as [number, number], optimalRange: [500, 800] as [number, number], lastTest: '2024-01-15', change: 50 },
    { name: 'Ferritin', value: 85, unit: 'ng/mL', normalRange: [20, 250] as [number, number], optimalRange: [50, 150] as [number, number], lastTest: '2024-01-15', change: 10 },
  ],
};

function getStatus(value: number, normalRange: [number, number], optimalRange: [number, number]) {
  if (value >= optimalRange[0] && value <= optimalRange[1]) return 'optimal';
  if (value >= normalRange[0] && value <= normalRange[1]) return 'normal';
  return 'attention';
}

export default function BiomarkersPage() {

  const allBiomarkers = [
    ...biomarkerResults.metabolic,
    ...biomarkerResults.lipids,
    ...biomarkerResults.inflammation,
    ...biomarkerResults.nutrients,
  ];

  const optimalCount = allBiomarkers.filter(b => getStatus(b.value, b.normalRange, b.optimalRange) === 'optimal').length;
  const normalCount = allBiomarkers.filter(b => getStatus(b.value, b.normalRange, b.optimalRange) === 'normal').length;
  const attentionCount = allBiomarkers.filter(b => getStatus(b.value, b.normalRange, b.optimalRange) === 'attention').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TestTube className="h-8 w-8 text-purple-500" />
            Biomarkers
          </h1>
          <p className="text-muted-foreground">
            Track your blood biomarkers for longevity optimization.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Results
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{optimalCount}</p>
                <p className="text-sm text-muted-foreground">Optimal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-500/10">
                <Info className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-500">{normalCount}</p>
                <p className="text-sm text-muted-foreground">Normal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{attentionCount}</p>
                <p className="text-sm text-muted-foreground">Needs Attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/10">
                <TestTube className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allBiomarkers.length}</p>
                <p className="text-sm text-muted-foreground">Total Markers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biomarker Categories */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Markers</TabsTrigger>
          <TabsTrigger value="metabolic">Metabolic</TabsTrigger>
          <TabsTrigger value="lipids">Lipids</TabsTrigger>
          <TabsTrigger value="inflammation">Inflammation</TabsTrigger>
          <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6">
            {Object.entries(biomarkerResults).map(([category, markers]) => (
              <BiomarkerSection key={category} title={category} markers={markers} />
            ))}
          </div>
        </TabsContent>

        {Object.entries(biomarkerResults).map(([category, markers]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <BiomarkerSection title={category} markers={markers} expanded />
          </TabsContent>
        ))}
      </Tabs>

      {/* Longevity Biomarker Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Longevity Biomarker Guide
          </CardTitle>
          <CardDescription>
            Optimal ranges for longevity differ from standard &quot;normal&quot; ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'HbA1c', standard: '< 5.7%', optimal: '4.8-5.2%', why: 'Lower glycation, reduced aging' },
              { name: 'hs-CRP', standard: '< 3 mg/L', optimal: '< 1 mg/L', why: 'Minimal inflammation' },
              { name: 'ApoB', standard: '< 130 mg/dL', optimal: '< 90 mg/dL', why: 'Lower CVD risk' },
              { name: 'Vitamin D', standard: '> 30 ng/mL', optimal: '50-80 ng/mL', why: 'Optimal immune function' },
              { name: 'Homocysteine', standard: '< 15 µmol/L', optimal: '< 10 µmol/L', why: 'Cardiovascular protection' },
              { name: 'Fasting Glucose', standard: '< 100 mg/dL', optimal: '70-85 mg/dL', why: 'Metabolic flexibility' },
            ].map((marker) => (
              <div key={marker.name} className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">{marker.name}</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Standard:</span>
                    <span>{marker.standard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Optimal:</span>
                    <span className="text-green-500 font-medium">{marker.optimal}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{marker.why}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface BiomarkerSectionProps {
  title: string;
  markers: Array<{
    name: string;
    value: number;
    unit: string;
    normalRange: [number, number];
    optimalRange: [number, number];
    lastTest: string;
    change: number;
  }>;
  expanded?: boolean;
}

function BiomarkerSection({ title, markers }: BiomarkerSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="capitalize text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {markers.map((marker) => {
            const status = getStatus(marker.value, marker.normalRange, marker.optimalRange);
            const statusColors = {
              optimal: { bg: 'bg-green-500/10', text: 'text-green-500', bar: 'bg-green-500' },
              normal: { bg: 'bg-amber-500/10', text: 'text-amber-500', bar: 'bg-amber-500' },
              attention: { bg: 'bg-red-500/10', text: 'text-red-500', bar: 'bg-red-500' },
            }[status];

            // Calculate position on the range bar
            const rangeMin = Math.min(marker.normalRange[0], marker.optimalRange[0], marker.value * 0.8);
            const rangeMax = Math.max(marker.normalRange[1], marker.optimalRange[1], marker.value * 1.2);
            const position = ((marker.value - rangeMin) / (rangeMax - rangeMin)) * 100;
            const optimalStart = ((marker.optimalRange[0] - rangeMin) / (rangeMax - rangeMin)) * 100;
            const optimalEnd = ((marker.optimalRange[1] - rangeMin) / (rangeMax - rangeMin)) * 100;

            return (
              <div key={marker.name} className={cn('p-4 rounded-lg', statusColors.bg)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{marker.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Normal: {marker.normalRange[0]}-{marker.normalRange[1]} {marker.unit}</p>
                          <p>Optimal: {marker.optimalRange[0]}-{marker.optimalRange[1]} {marker.unit}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2">
                    {marker.change !== 0 && (
                      <span className={cn(
                        'text-sm flex items-center gap-1',
                        marker.change < 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {marker.change < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                        {Math.abs(marker.change)}
                      </span>
                    )}
                    <Badge variant="outline" className={statusColors.text}>
                      {status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold">{marker.value}</span>
                  <span className="text-muted-foreground">{marker.unit}</span>
                </div>

                {/* Range visualization */}
                <div className="relative h-3 rounded-full bg-muted">
                  {/* Optimal range highlight */}
                  <div
                    className="absolute h-full bg-green-500/30 rounded-full"
                    style={{
                      left: `${optimalStart}%`,
                      width: `${optimalEnd - optimalStart}%`,
                    }}
                  />
                  {/* Current value marker */}
                  <div
                    className={cn('absolute w-3 h-3 rounded-full top-0', statusColors.bar)}
                    style={{ left: `calc(${Math.min(100, Math.max(0, position))}% - 6px)` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{rangeMin}</span>
                  <span className="text-green-500">Optimal: {marker.optimalRange[0]}-{marker.optimalRange[1]}</span>
                  <span>{rangeMax}</span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Last tested: {new Date(marker.lastTest).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
