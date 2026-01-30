// Health-related type definitions

export interface HealthMetrics {
  id: string;
  userId: string;
  date: string;
  source: 'oura' | 'whoop' | 'apple_health' | 'manual';

  // Sleep
  sleepScore?: number;
  sleepDurationMinutes?: number;
  deepSleepMinutes?: number;
  remSleepMinutes?: number;
  sleepEfficiency?: number;

  // Recovery
  hrvAvg?: number;
  hrvRmssd?: number;
  restingHr?: number;
  respiratoryRate?: number;
  bodyTemperatureDeviation?: number;
  recoveryScore?: number;

  // Activity
  steps?: number;
  activeCalories?: number;
  activityScore?: number;
  vo2Max?: number;

  // Strain
  strainScore?: number;
  workoutMinutes?: number;

  createdAt: string;
}

export interface HealthScores {
  id: string;
  userId: string;
  date: string;

  overallScore: number;
  biologicalAge: number;
  ageDifference: number;

  sleepScore: number;
  activityScore: number;
  nutritionScore: number;
  biomarkerScore: number;
  adherenceScore: number;

  createdAt: string;
}

export interface Biomarker {
  id: string;
  userId: string;
  testDate: string;
  source?: string;

  // Metabolic
  hba1c?: number;
  fastingGlucose?: number;
  fastingInsulin?: number;

  // Lipids
  totalCholesterol?: number;
  ldlC?: number;
  hdlC?: number;
  triglycerides?: number;
  apoB?: number;

  // Inflammation
  hsCrp?: number;
  homocysteine?: number;

  // Hormones
  testosterone?: number;
  cortisol?: number;
  igf1?: number;

  // Nutrients
  vitaminD?: number;
  vitaminB12?: number;
  ferritin?: number;

  createdAt: string;
}

export interface BiomarkerDefinition {
  key: keyof Omit<Biomarker, 'id' | 'userId' | 'testDate' | 'source' | 'createdAt'>;
  name: string;
  unit: string;
  normalRange: [number, number];
  optimalRange: [number, number];
  description: string;
  category: 'metabolic' | 'lipids' | 'inflammation' | 'hormones' | 'nutrients';
}

export const BIOMARKER_DEFINITIONS: BiomarkerDefinition[] = [
  { key: 'hba1c', name: 'HbA1c', unit: '%', normalRange: [4.0, 5.7], optimalRange: [4.8, 5.2], description: 'Glucose control, glycation', category: 'metabolic' },
  { key: 'fastingGlucose', name: 'Fasting Glucose', unit: 'mg/dL', normalRange: [70, 100], optimalRange: [70, 85], description: 'Metabolic health', category: 'metabolic' },
  { key: 'hsCrp', name: 'hs-CRP', unit: 'mg/L', normalRange: [0, 3], optimalRange: [0, 1], description: 'Inflammation marker', category: 'inflammation' },
  { key: 'homocysteine', name: 'Homocysteine', unit: 'μmol/L', normalRange: [0, 15], optimalRange: [0, 10], description: 'Cardiovascular risk', category: 'inflammation' },
  { key: 'apoB', name: 'ApoB', unit: 'mg/dL', normalRange: [0, 130], optimalRange: [0, 90], description: 'Atherosclerosis risk', category: 'lipids' },
  { key: 'vitaminD', name: 'Vitamin D', unit: 'ng/mL', normalRange: [30, 100], optimalRange: [50, 80], description: 'Immune, bone, mood', category: 'nutrients' },
  { key: 'triglycerides', name: 'Triglycerides', unit: 'mg/dL', normalRange: [0, 150], optimalRange: [0, 100], description: 'Metabolic health', category: 'lipids' },
  { key: 'ldlC', name: 'LDL-C', unit: 'mg/dL', normalRange: [0, 100], optimalRange: [0, 70], description: 'Cardiovascular risk', category: 'lipids' },
];

export type MetricStatus = 'optimal' | 'moderate' | 'attention';

export interface MetricCardData {
  title: string;
  value: number;
  unit: string;
  change?: number;
  changeLabel?: string;
  optimalRange?: [number, number];
  sparklineData?: number[];
  status: MetricStatus;
  icon?: string;
}

export type TrendDirection = 'improving' | 'stable' | 'declining';

export interface FastingLog {
  id: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  targetHours: number;
  actualHours?: number;
  notes?: string;
}

export interface FastingState {
  isActive: boolean;
  currentFast?: FastingLog;
  elapsedHours: number;
  metabolicState: 'fed' | 'early_fasting' | 'fat_burning' | 'ketosis' | 'deep_ketosis' | 'autophagy';
}

export const METABOLIC_STATES = {
  fed: { name: 'Fed State', minHours: 0, maxHours: 4, color: 'bg-blue-500' },
  early_fasting: { name: 'Early Fasting', minHours: 4, maxHours: 12, color: 'bg-amber-500' },
  fat_burning: { name: 'Fat Burning', minHours: 12, maxHours: 16, color: 'bg-orange-500' },
  ketosis: { name: 'Ketosis', minHours: 16, maxHours: 24, color: 'bg-green-500' },
  deep_ketosis: { name: 'Deep Ketosis', minHours: 24, maxHours: 48, color: 'bg-emerald-500' },
  autophagy: { name: 'Autophagy', minHours: 48, maxHours: Infinity, color: 'bg-purple-500' },
};
