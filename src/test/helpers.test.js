import { describe, it, expect, vi } from 'vitest';
import {
  createInitialState,
  calculateSuggestedWeight,
  getBestPerformance,
  formatDuration,
  formatShortDuration,
  calculateE1RM,
  getProgressionData,
  getOverallVolumeData,
  validateImportData,
  getTotalCompletedSets,
  getAverageWorkoutDuration,
  debounce,
  generateId,
} from '../utils/helpers';

describe('createInitialState', () => {
  it('should return an object with all required keys', () => {
    const state = createInitialState();
    expect(state).toHaveProperty('profile');
    expect(state).toHaveProperty('mesocycle', null);
    expect(state).toHaveProperty('history');
    expect(state).toHaveProperty('activeWorkout', null);
    expect(state).toHaveProperty('settings');
    expect(state).toHaveProperty('customExercises');
    expect(state).toHaveProperty('customTemplates');
    expect(state).toHaveProperty('exerciseHistory');
  });

  it('should return default settings values', () => {
    const state = createInitialState();
    expect(state.settings.restTimer).toBe(120);
    expect(state.settings.autoProgress).toBe(true);
    expect(state.settings.weightIncrement).toBe(2.5);
  });

  it('should return empty arrays and objects for collections', () => {
    const state = createInitialState();
    expect(state.history).toEqual([]);
    expect(state.customExercises).toEqual({});
    expect(state.customTemplates).toEqual({});
    expect(state.exerciseHistory).toEqual({});
  });

  it('should return a new object each call (no shared references)', () => {
    const state1 = createInitialState();
    const state2 = createInitialState();
    expect(state1).not.toBe(state2);
    expect(state1.history).not.toBe(state2.history);
  });
});

describe('calculateSuggestedWeight', () => {
  const defaultSettings = { weightIncrement: 2.5 };

  it('should return null when exerciseHistory is empty', () => {
    expect(calculateSuggestedWeight([], 10, 2, defaultSettings)).toBeNull();
  });

  it('should return null when exerciseHistory is null', () => {
    expect(calculateSuggestedWeight(null, 10, 2, defaultSettings)).toBeNull();
  });

  it('should return null when exerciseHistory is undefined', () => {
    expect(calculateSuggestedWeight(undefined, 10, 2, defaultSettings)).toBeNull();
  });

  it('should return null when last entry has no weight', () => {
    expect(calculateSuggestedWeight([{ reps: 10, rir: 2 }], 10, 2, defaultSettings)).toBeNull();
  });

  it('should return same weight when RIR matches target', () => {
    const history = [{ weight: 60, reps: 10, rir: 2 }];
    expect(calculateSuggestedWeight(history, 10, 2, defaultSettings)).toBe(60);
  });

  it('should increase weight by increment when RIR is 1 above target', () => {
    const history = [{ weight: 60, reps: 10, rir: 3 }];
    expect(calculateSuggestedWeight(history, 10, 2, defaultSettings)).toBe(62.5);
  });

  it('should increase weight by 2x increment when RIR is 2+ above target', () => {
    const history = [{ weight: 60, reps: 10, rir: 4 }];
    expect(calculateSuggestedWeight(history, 10, 2, defaultSettings)).toBe(65);
  });

  it('should decrease weight when RIR is 2+ below target', () => {
    const history = [{ weight: 60, reps: 10, rir: 0 }];
    expect(calculateSuggestedWeight(history, 10, 2, defaultSettings)).toBe(57.5);
  });

  it('should never return negative weight', () => {
    const history = [{ weight: 2, reps: 10, rir: 0 }];
    expect(calculateSuggestedWeight(history, 10, 2, defaultSettings)).toBe(0);
  });

  it('should use last entry from history only', () => {
    const history = [
      { weight: 40, reps: 10, rir: 4 },
      { weight: 60, reps: 10, rir: 2 },
    ];
    expect(calculateSuggestedWeight(history, 10, 2, defaultSettings)).toBe(60);
  });

  it('should default to 2.5 increment when settings is null', () => {
    const history = [{ weight: 60, reps: 10, rir: 3 }];
    expect(calculateSuggestedWeight(history, 10, 2, null)).toBe(62.5);
  });

  it('should handle RIR of null (no decrease or increase)', () => {
    const history = [{ weight: 60, reps: 10, rir: null }];
    expect(calculateSuggestedWeight(history, 10, 2, defaultSettings)).toBe(60);
  });

  it('should handle RIR of undefined (no decrease or increase)', () => {
    const history = [{ weight: 60, reps: 10 }];
    expect(calculateSuggestedWeight(history, 10, 2, defaultSettings)).toBe(60);
  });
});

describe('getBestPerformance', () => {
  it('should return null for empty history', () => {
    expect(getBestPerformance([])).toBeNull();
  });

  it('should return null for null/undefined input', () => {
    expect(getBestPerformance(null)).toBeNull();
    expect(getBestPerformance(undefined)).toBeNull();
  });

  it('should return the entry with highest estimated 1RM', () => {
    const history = [
      { weight: 60, reps: 10, date: '2025-01-01' },
      { weight: 80, reps: 5, date: '2025-01-02' },
      { weight: 70, reps: 8, date: '2025-01-03' },
    ];
    const best = getBestPerformance(history);
    expect(best).toBeDefined();
    expect(best.weight).toBe(80);
    expect(best.reps).toBe(5);
    expect(best).toHaveProperty('e1rm');
  });

  it('should compute e1rm rounded to 1 decimal', () => {
    const history = [{ weight: 100, reps: 1 }];
    const best = getBestPerformance(history);
    // e1rm for 1 rep = weight * (36/36) = 100
    expect(best.e1rm).toBe(100);
  });

  it('should skip entries with no weight or reps', () => {
    const history = [
      { weight: 0, reps: 10 },
      { weight: 60, reps: 0 },
      { weight: 50, reps: 5 },
    ];
    const best = getBestPerformance(history);
    expect(best.weight).toBe(50);
  });

  it('should cap reps at 36 for e1rm formula to avoid division by zero', () => {
    const history = [{ weight: 20, reps: 50 }];
    const best = getBestPerformance(history);
    // With reps capped to 36: 20 * (36 / (37 - 36)) = 20 * 36 = 720
    expect(best.e1rm).toBe(720);
  });
});

describe('formatDuration', () => {
  it('should format 0 seconds as 0:00', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('should format null as 0:00', () => {
    expect(formatDuration(null)).toBe('0:00');
  });

  it('should format negative as 0:00', () => {
    expect(formatDuration(-5)).toBe('0:00');
  });

  it('should format seconds under a minute correctly', () => {
    expect(formatDuration(45)).toBe('0:45');
  });

  it('should format simple minutes correctly', () => {
    expect(formatDuration(120)).toBe('2:00');
  });

  it('should format minutes and seconds correctly', () => {
    expect(formatDuration(90)).toBe('1:30');
  });

  it('should format hours correctly', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('should pad single-digit values when hours present', () => {
    expect(formatDuration(3605)).toBe('1:00:05');
  });
});

describe('formatShortDuration', () => {
  it('should return empty string for 0/null/undefined', () => {
    expect(formatShortDuration(0)).toBe('');
    expect(formatShortDuration(null)).toBe('');
    expect(formatShortDuration(undefined)).toBe('');
  });

  it('should format seconds to minutes', () => {
    expect(formatShortDuration(3600)).toBe('60m');
    expect(formatShortDuration(2700)).toBe('45m');
  });
});

describe('calculateE1RM', () => {
  it('should return 0 for missing weight or reps', () => {
    expect(calculateE1RM(0, 10)).toBe(0);
    expect(calculateE1RM(100, 0)).toBe(0);
    expect(calculateE1RM(null, 10)).toBe(0);
    expect(calculateE1RM(100, null)).toBe(0);
  });

  it('should return weight itself for 1 rep', () => {
    expect(calculateE1RM(100, 1)).toBe(100);
  });

  it('should return higher e1rm for more reps at same weight', () => {
    const e1rm5 = calculateE1RM(100, 5);
    const e1rm10 = calculateE1RM(100, 10);
    expect(e1rm10).toBeGreaterThan(e1rm5);
  });

  it('should cap reps at 36 to prevent division by zero', () => {
    const result = calculateE1RM(20, 50);
    expect(result).toBeGreaterThan(0);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getProgressionData', () => {
  it('should return empty array for empty history', () => {
    expect(getProgressionData([])).toEqual([]);
  });

  it('should return empty array for null', () => {
    expect(getProgressionData(null)).toEqual([]);
  });

  it('should transform history entries into chart data', () => {
    const history = [{ date: '2025-06-15T10:00:00Z', weight: 60, reps: 10 }];
    const result = getProgressionData(history);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('weight', 60);
    expect(result[0]).toHaveProperty('reps', 10);
    expect(result[0]).toHaveProperty('e1rm');
    expect(result[0]).toHaveProperty('volume', 600);
  });
});

describe('getOverallVolumeData', () => {
  it('should return empty array for empty/null history', () => {
    expect(getOverallVolumeData([])).toEqual([]);
    expect(getOverallVolumeData(null)).toEqual([]);
  });

  it('should aggregate volume by date', () => {
    const workouts = [
      {
        startTime: '2025-06-15T10:00:00Z',
        exercises: [{ sets: [{ completed: true, weight: 60, reps: 10 }, { completed: true, weight: 60, reps: 8 }] }],
      },
    ];
    const result = getOverallVolumeData(workouts);
    expect(result).toHaveLength(1);
    expect(result[0].volume).toBe(Math.round(60 * 10 + 60 * 8));
  });

  it('should only count completed sets', () => {
    const workouts = [
      {
        startTime: '2025-06-15T10:00:00Z',
        exercises: [{ sets: [{ completed: true, weight: 60, reps: 10 }, { completed: false, weight: 60, reps: 8 }] }],
      },
    ];
    const result = getOverallVolumeData(workouts);
    expect(result[0].volume).toBe(600);
  });
});

describe('validateImportData', () => {
  it('should return false for null/undefined/non-object', () => {
    expect(validateImportData(null)).toBe(false);
    expect(validateImportData(undefined)).toBe(false);
    expect(validateImportData('string')).toBe(false);
    expect(validateImportData(42)).toBe(false);
  });

  it('should return false for object with no known keys', () => {
    expect(validateImportData({ foo: 'bar' })).toBe(false);
  });

  it('should return true for object with at least one known key', () => {
    expect(validateImportData({ profile: {} })).toBe(true);
    expect(validateImportData({ history: [] })).toBe(true);
    expect(validateImportData({ settings: {} })).toBe(true);
  });

  it('should return true for a full state object', () => {
    expect(validateImportData(createInitialState())).toBe(true);
  });
});

describe('getTotalCompletedSets', () => {
  it('should return 0 for null/undefined/empty', () => {
    expect(getTotalCompletedSets(null)).toBe(0);
    expect(getTotalCompletedSets(undefined)).toBe(0);
    expect(getTotalCompletedSets([])).toBe(0);
  });

  it('should count completed sets across workouts', () => {
    const history = [
      { exercises: [{ sets: [{ completed: true }, { completed: false }, { completed: true }] }] },
      { exercises: [{ sets: [{ completed: true }] }] },
    ];
    expect(getTotalCompletedSets(history)).toBe(3);
  });
});

describe('getAverageWorkoutDuration', () => {
  it('should return 0 for empty/null history', () => {
    expect(getAverageWorkoutDuration([])).toBe(0);
    expect(getAverageWorkoutDuration(null)).toBe(0);
  });

  it('should return 0 when no workouts have durationSeconds', () => {
    expect(getAverageWorkoutDuration([{ exercises: [] }])).toBe(0);
  });

  it('should compute average duration in minutes', () => {
    const history = [
      { durationSeconds: 3600 }, // 60min
      { durationSeconds: 1800 }, // 30min
    ];
    expect(getAverageWorkoutDuration(history)).toBe(45);
  });

  it('should ignore workouts without durationSeconds', () => {
    const history = [
      { durationSeconds: 3600 },
      { exercises: [] },
    ];
    expect(getAverageWorkoutDuration(history)).toBe(60);
  });
});

describe('debounce', () => {
  it('should delay function execution', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced('a');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledWith('a');
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('should reset the timer on subsequent calls', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced('a');
    vi.advanceTimersByTime(100);
    debounced('b');
    vi.advanceTimersByTime(100);
    // Only 100ms since second call – should not have fired yet
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('b');
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('should support cancel()', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(300);
    expect(fn).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should pass all arguments through to the original function', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 50);

    debounced(1, 'two', { three: 3 });
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledWith(1, 'two', { three: 3 });
    vi.useRealTimers();
  });

  it('cancel should be safe to call when no timer is pending', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    expect(() => debounced.cancel()).not.toThrow();
  });
});

describe('generateId', () => {
  it('should return a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should include the prefix when provided', () => {
    const id = generateId('exercise_');
    expect(id.startsWith('exercise_')).toBe(true);
  });

  it('should generate unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateId()));
    expect(ids.size).toBe(50);
  });

  it('should work with an empty prefix', () => {
    const id = generateId('');
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should contain a timestamp component', () => {
    const before = Date.now();
    const id = generateId('');
    const after = Date.now();
    const numericPart = parseInt(id.split('_')[0], 10);
    expect(numericPart).toBeGreaterThanOrEqual(before);
    expect(numericPart).toBeLessThanOrEqual(after);
  });
});
