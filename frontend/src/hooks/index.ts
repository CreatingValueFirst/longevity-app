// Central hook exports for cleaner imports

// Fasting hooks
export {
  useFasting,
  useFastingHistory,
  useFastingReminder,
  type FastingSession,
  type FastingHistoryEntry,
  type FastingStats,
} from './useFasting';

// Protocol hooks
export {
  useProtocol,
  useProtocolHistory,
  useProtocolStreaks,
  type StreakData,
  type ProtocolHistoryEntry,
  type ProtocolStats,
} from './useProtocol';

// Health metrics hooks
export {
  useCurrentScores,
  useHealthMetrics,
  useRecordMetrics,
  useMetricHistory,
  useLatestMetrics,
  usePrefetchHealthData,
  healthQueryKeys,
} from './useHealthMetrics';

// Toast hook (for notifications)
export { useToast, toast } from './use-toast';
