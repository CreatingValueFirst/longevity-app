// Health score and biological age calculations

import { HealthMetrics, MetricStatus, METABOLIC_STATES, type FastingState } from '@/types/health';

/**
 * Calculate sleep score from metrics
 */
export function calculateSleepScore(metrics: Partial<HealthMetrics>): number | null {
  if (!metrics.sleepDurationMinutes) return null;

  let score = 0;
  const duration = metrics.sleepDurationMinutes;

  // Duration score (7-9 hours optimal = 420-540 minutes)
  if (duration >= 420 && duration <= 540) {
    score += 40;
  } else if (duration >= 360 && duration < 420) {
    score += 30;
  } else if (duration > 540 && duration <= 600) {
    score += 30;
  } else {
    score += 15;
  }

  // Deep sleep score (20-25% optimal)
  if (metrics.deepSleepMinutes && duration > 0) {
    const deepPercent = (metrics.deepSleepMinutes / duration) * 100;
    if (deepPercent >= 20 && deepPercent <= 25) {
      score += 30;
    } else if (deepPercent >= 15 && deepPercent < 20) {
      score += 20;
    } else if (deepPercent > 25 && deepPercent <= 30) {
      score += 20;
    } else {
      score += 10;
    }
  }

  // REM score (20-25% optimal)
  if (metrics.remSleepMinutes && duration > 0) {
    const remPercent = (metrics.remSleepMinutes / duration) * 100;
    if (remPercent >= 20 && remPercent <= 25) {
      score += 30;
    } else if (remPercent >= 15 && remPercent < 20) {
      score += 20;
    } else if (remPercent > 25 && remPercent <= 30) {
      score += 20;
    } else {
      score += 10;
    }
  }

  return Math.round(Math.min(100, score));
}

/**
 * Calculate activity score from metrics
 */
export function calculateActivityScore(metrics: Partial<HealthMetrics>): number | null {
  if (!metrics.steps && !metrics.activeCalories && !metrics.workoutMinutes) return null;

  let score = 0;

  // Steps score (10,000 optimal)
  if (metrics.steps) {
    if (metrics.steps >= 10000) {
      score += 35;
    } else if (metrics.steps >= 7500) {
      score += 28;
    } else if (metrics.steps >= 5000) {
      score += 20;
    } else {
      score += Math.round((metrics.steps / 5000) * 15);
    }
  }

  // Active calories score (500+ optimal)
  if (metrics.activeCalories) {
    if (metrics.activeCalories >= 500) {
      score += 35;
    } else if (metrics.activeCalories >= 300) {
      score += 28;
    } else if (metrics.activeCalories >= 150) {
      score += 20;
    } else {
      score += Math.round((metrics.activeCalories / 150) * 15);
    }
  }

  // Workout minutes score (30-60 optimal)
  if (metrics.workoutMinutes) {
    if (metrics.workoutMinutes >= 30 && metrics.workoutMinutes <= 90) {
      score += 30;
    } else if (metrics.workoutMinutes >= 15) {
      score += 20;
    } else if (metrics.workoutMinutes > 90) {
      score += 25; // Good but potentially overtraining
    } else {
      score += 10;
    }
  }

  return Math.round(Math.min(100, score));
}

/**
 * Calculate recovery score from HRV and resting HR
 */
export function calculateRecoveryScore(metrics: Partial<HealthMetrics>): number | null {
  if (!metrics.hrvAvg && !metrics.restingHr) return null;

  let score = 0;
  let factors = 0;

  // HRV score (higher is generally better, but depends on baseline)
  if (metrics.hrvAvg) {
    if (metrics.hrvAvg >= 65) {
      score += 40;
    } else if (metrics.hrvAvg >= 50) {
      score += 32;
    } else if (metrics.hrvAvg >= 35) {
      score += 24;
    } else {
      score += 15;
    }
    factors++;
  }

  // Resting HR score (50-60 optimal for fit adults)
  if (metrics.restingHr) {
    if (metrics.restingHr >= 50 && metrics.restingHr <= 60) {
      score += 40;
    } else if (metrics.restingHr >= 45 && metrics.restingHr <= 70) {
      score += 32;
    } else if (metrics.restingHr <= 75) {
      score += 24;
    } else {
      score += 15;
    }
    factors++;
  }

  // Respiratory rate (12-20 breaths/min normal)
  if (metrics.respiratoryRate) {
    if (metrics.respiratoryRate >= 12 && metrics.respiratoryRate <= 16) {
      score += 20;
    } else if (metrics.respiratoryRate <= 20) {
      score += 15;
    } else {
      score += 8;
    }
    factors++;
  }

  if (factors === 0) return null;
  return Math.round(Math.min(100, (score / factors) * (100 / 40)));
}

/**
 * Calculate biological age from health scores
 */
export function calculateBiologicalAge(
  chronologicalAge: number,
  scores: {
    sleepScore?: number | null;
    activityScore?: number | null;
    recoveryScore?: number | null;
    nutritionScore?: number | null;
    biomarkerScore?: number | null;
  }
): { biologicalAge: number; ageDifference: number } {
  const scoreBaseline = 75; // Baseline score representing chronological age

  // Calculate impact of each score on biological age
  const sleepImpact = scores.sleepScore
    ? ((scoreBaseline - scores.sleepScore) * 0.08)
    : 0;

  const activityImpact = scores.activityScore
    ? ((scoreBaseline - scores.activityScore) * 0.10)
    : 0;

  const recoveryImpact = scores.recoveryScore
    ? ((scoreBaseline - scores.recoveryScore) * 0.06)
    : 0;

  const nutritionImpact = scores.nutritionScore
    ? ((scoreBaseline - scores.nutritionScore) * 0.06)
    : 0;

  const biomarkerImpact = scores.biomarkerScore
    ? ((scoreBaseline - scores.biomarkerScore) * 0.12)
    : 0;

  // Calculate biological age
  const biologicalAge = chronologicalAge + sleepImpact + activityImpact + recoveryImpact + nutritionImpact + biomarkerImpact;

  return {
    biologicalAge: Math.round(biologicalAge * 10) / 10,
    ageDifference: Math.round((biologicalAge - chronologicalAge) * 10) / 10,
  };
}

/**
 * Determine metric status based on value and optimal range
 */
export function getMetricStatus(value: number, optimalRange: [number, number], normalRange?: [number, number]): MetricStatus {
  if (value >= optimalRange[0] && value <= optimalRange[1]) {
    return 'optimal';
  }

  if (normalRange) {
    if (value >= normalRange[0] && value <= normalRange[1]) {
      return 'moderate';
    }
  }

  return 'attention';
}

/**
 * Get metabolic state based on fasting hours
 */
export function getMetabolicState(hoursElapsed: number): FastingState['metabolicState'] {
  if (hoursElapsed < 4) return 'fed';
  if (hoursElapsed < 12) return 'early_fasting';
  if (hoursElapsed < 16) return 'fat_burning';
  if (hoursElapsed < 24) return 'ketosis';
  if (hoursElapsed < 48) return 'deep_ketosis';
  return 'autophagy';
}

/**
 * Format hours to display string
 */
export function formatFastingTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

/**
 * Get metabolic state info
 */
export function getMetabolicStateInfo(state: FastingState['metabolicState']) {
  return METABOLIC_STATES[state];
}

/**
 * Calculate score trend from historical data
 */
export function calculateTrend(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 3) return 'stable';

  const recent = scores.slice(-7);
  const older = scores.slice(-14, -7);

  if (older.length === 0) return 'stable';

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  const change = recentAvg - olderAvg;

  if (change > 3) return 'improving';
  if (change < -3) return 'declining';
  return 'stable';
}

/**
 * Get status color classes
 */
export function getStatusColors(status: MetricStatus): {
  text: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case 'optimal':
      return { text: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500' };
    case 'moderate':
      return { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500' };
    case 'attention':
      return { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500' };
  }
}

/**
 * Calculate overall health score from component scores
 */
export function calculateOverallScore(scores: {
  sleepScore?: number | null;
  activityScore?: number | null;
  recoveryScore?: number | null;
  nutritionScore?: number | null;
  adherenceScore?: number | null;
}): number {
  const weights = {
    sleep: 0.25,
    activity: 0.25,
    recovery: 0.20,
    nutrition: 0.15,
    adherence: 0.15,
  };

  let totalWeight = 0;
  let weightedSum = 0;

  if (scores.sleepScore != null) {
    weightedSum += scores.sleepScore * weights.sleep;
    totalWeight += weights.sleep;
  }
  if (scores.activityScore != null) {
    weightedSum += scores.activityScore * weights.activity;
    totalWeight += weights.activity;
  }
  if (scores.recoveryScore != null) {
    weightedSum += scores.recoveryScore * weights.recovery;
    totalWeight += weights.recovery;
  }
  if (scores.nutritionScore != null) {
    weightedSum += scores.nutritionScore * weights.nutrition;
    totalWeight += weights.nutrition;
  }
  if (scores.adherenceScore != null) {
    weightedSum += scores.adherenceScore * weights.adherence;
    totalWeight += weights.adherence;
  }

  if (totalWeight === 0) return 0;
  return Math.round(weightedSum / totalWeight);
}
