// Protocol and tracking type definitions

export interface ProtocolItem {
  id: string;
  name: string;
  category: 'supplement' | 'exercise' | 'nutrition' | 'sleep' | 'mindfulness' | 'therapy';
  frequency: 'daily' | 'weekly' | 'monthly';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  dosage?: string;
  notes?: string;
  isActive: boolean;
}

export interface UserProtocol {
  id: string;
  userId: string;
  name: string;
  items: ProtocolItem[];
  isActive: boolean;
  createdAt: string;
}

export interface ProtocolLog {
  id: string;
  userId: string;
  protocolItemId: string;
  loggedAt: string;
  notes?: string;
}

export interface Streak {
  id: string;
  userId: string;
  streakType: 'protocol' | 'fasting' | 'exercise' | 'sleep';
  currentCount: number;
  longestCount: number;
  lastLoggedDate: string;
  updatedAt: string;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  generatedAt: string;
  recommendations: RecommendationItem[];
  contextSnapshot?: Record<string, unknown>;
  isRead: boolean;
}

export interface RecommendationItem {
  id: string;
  category: 'sleep' | 'exercise' | 'nutrition' | 'supplement' | 'lifestyle' | 'biomarker';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  evidenceLevel: 'strong' | 'moderate' | 'emerging';
  expectedImpact?: string;
}

// Default protocol templates based on longevity research
export const DEFAULT_PROTOCOL_TEMPLATES: Partial<UserProtocol>[] = [
  {
    name: 'Bryan Johnson Blueprint',
    items: [
      { id: '1', name: 'Wake at same time', category: 'sleep', frequency: 'daily', timeOfDay: 'morning', isActive: true },
      { id: '2', name: 'Morning light exposure (10-30 min)', category: 'sleep', frequency: 'daily', timeOfDay: 'morning', isActive: true },
      { id: '3', name: 'Exercise', category: 'exercise', frequency: 'daily', timeOfDay: 'morning', isActive: true },
      { id: '4', name: 'Olive oil (30ml)', category: 'nutrition', frequency: 'daily', timeOfDay: 'morning', dosage: '30ml', isActive: true },
      { id: '5', name: 'Last meal by 11am', category: 'nutrition', frequency: 'daily', timeOfDay: 'morning', isActive: true },
      { id: '6', name: 'Vitamin D3', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '2000 IU', isActive: true },
      { id: '7', name: 'Omega-3', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '1g EPA + DHA', isActive: true },
      { id: '8', name: 'Creatine', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '5g', isActive: true },
      { id: '9', name: 'Wind down routine', category: 'sleep', frequency: 'daily', timeOfDay: 'evening', isActive: true },
      { id: '10', name: 'Bed by 8:30pm', category: 'sleep', frequency: 'daily', timeOfDay: 'evening', isActive: true },
    ],
  },
  {
    name: 'Peter Attia Framework',
    items: [
      { id: '1', name: 'Zone 2 cardio (45-60 min)', category: 'exercise', frequency: 'daily', timeOfDay: 'morning', notes: '4x per week', isActive: true },
      { id: '2', name: 'Strength training', category: 'exercise', frequency: 'daily', timeOfDay: 'anytime', notes: '3x per week', isActive: true },
      { id: '3', name: 'VO2 max training (4x4)', category: 'exercise', frequency: 'weekly', timeOfDay: 'anytime', notes: '1x per week', isActive: true },
      { id: '4', name: 'Stability/mobility work', category: 'exercise', frequency: 'daily', timeOfDay: 'morning', isActive: true },
      { id: '5', name: 'Protein target (1.6-2.2g/kg)', category: 'nutrition', frequency: 'daily', timeOfDay: 'anytime', isActive: true },
      { id: '6', name: '7-9 hours sleep', category: 'sleep', frequency: 'daily', timeOfDay: 'evening', isActive: true },
      { id: '7', name: 'CGM glucose monitoring', category: 'nutrition', frequency: 'daily', timeOfDay: 'anytime', isActive: true },
    ],
  },
  {
    name: 'Longevity Essentials',
    items: [
      { id: '1', name: 'Vitamin D3', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '4000-6000 IU', isActive: true },
      { id: '2', name: 'Omega-3 (EPA+DHA)', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '2-4g', isActive: true },
      { id: '3', name: 'Magnesium', category: 'supplement', frequency: 'daily', timeOfDay: 'evening', dosage: '300-400mg', isActive: true },
      { id: '4', name: 'Creatine', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '5g', isActive: true },
      { id: '5', name: 'Time-restricted eating (16:8)', category: 'nutrition', frequency: 'daily', timeOfDay: 'anytime', isActive: true },
      { id: '6', name: 'Zone 2 cardio', category: 'exercise', frequency: 'daily', timeOfDay: 'anytime', notes: '3-4 hours/week total', isActive: true },
      { id: '7', name: 'Resistance training', category: 'exercise', frequency: 'daily', timeOfDay: 'anytime', notes: '2-3x per week', isActive: true },
      { id: '8', name: 'Sleep 7-9 hours', category: 'sleep', frequency: 'daily', timeOfDay: 'evening', isActive: true },
    ],
  },
];

export const PROTOCOL_CATEGORIES = {
  supplement: { icon: 'Pill', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  exercise: { icon: 'Dumbbell', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  nutrition: { icon: 'Apple', color: 'text-green-500', bg: 'bg-green-500/10' },
  sleep: { icon: 'Moon', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  mindfulness: { icon: 'Brain', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  therapy: { icon: 'Thermometer', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
} as const;
