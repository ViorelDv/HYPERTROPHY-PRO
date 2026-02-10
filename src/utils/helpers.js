/**
 * Core utility/helper functions extracted for testability and reuse.
 */

/**
 * Creates the initial application state.
 * @returns {object} Default state structure
 */
export const createInitialState = () => ({
  profile: { name: '', experience: 'intermediate', gender: 'male' },
  mesocycle: null,
  history: [],
  activeWorkout: null,
  settings: { restTimer: 120, autoProgress: true, weightIncrement: 2.5 },
  customExercises: {},
  customTemplates: {},
  exerciseHistory: {},
});

/**
 * Calculates the suggested weight for the next set based on exercise history and target RIR.
 * @param {Array} exerciseHistory - Array of previous performance records
 * @param {number} targetReps - Target repetitions
 * @param {number} targetRIR - Target Reps In Reserve
 * @param {object} settings - App settings containing weightIncrement
 * @returns {number|null} Suggested weight in kg, or null if no history
 */
export const calculateSuggestedWeight = (exerciseHistory, targetReps, targetRIR, settings) => {
  if (!exerciseHistory || exerciseHistory.length === 0) return null;
  const lastPerformance = exerciseHistory[exerciseHistory.length - 1];
  if (!lastPerformance || !lastPerformance.weight) return null;
  const { weight, rir } = lastPerformance;
  const increment = settings?.weightIncrement || 2.5;
  let suggestedWeight = weight;
  if (rir !== null && rir !== undefined) {
    const rirDiff = rir - targetRIR;
    if (rirDiff >= 2) suggestedWeight = weight + increment * 2;
    else if (rirDiff >= 1) suggestedWeight = weight + increment;
    else if (rirDiff <= -2) suggestedWeight = weight - increment;
  }
  return Math.max(0, suggestedWeight);
};

/**
 * Finds the best performance (by estimated 1RM) from exercise history.
 * @param {Array} exerciseHistory - Array of performance records
 * @returns {object|null} Best performance entry with e1rm field, or null
 */
export const getBestPerformance = (exerciseHistory) => {
  if (!exerciseHistory || exerciseHistory.length === 0) return null;
  let best = null;
  let bestE1RM = 0;
  exerciseHistory.forEach(entry => {
    if (entry.weight && entry.reps) {
      const e1rm = entry.weight * (36 / (37 - Math.min(entry.reps, 36)));
      if (e1rm > bestE1RM) {
        bestE1RM = e1rm;
        best = entry;
      }
    }
  });
  return best ? { ...best, e1rm: Math.round(bestE1RM * 10) / 10 } : null;
};

/**
 * Formats seconds into a human-readable duration string (HH:MM:SS or MM:SS).
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (seconds == null || seconds < 0) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formats seconds into a short duration string (e.g. "45m").
 * @param {number} seconds - Total seconds
 * @returns {string} Short formatted duration or empty string
 */
export const formatShortDuration = (seconds) => {
  if (!seconds) return '';
  return `${Math.floor(seconds / 60)}m`;
};

/**
 * Calculates the estimated 1 rep max using the Brzycki formula.
 * @param {number} weight - Weight lifted
 * @param {number} reps - Reps performed
 * @returns {number} Estimated 1RM rounded to 1 decimal
 */
export const calculateE1RM = (weight, reps) => {
  if (!weight || !reps || reps <= 0) return 0;
  return Math.round(weight * (36 / (37 - Math.min(reps, 36))) * 10) / 10;
};

/**
 * Calculates progression data from exercise history for charting.
 * @param {Array} history - Exercise history array
 * @returns {Array} Formatted data points for charts
 */
export const getProgressionData = (history) => {
  if (!history) return [];
  return history.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight,
    reps: entry.reps,
    e1rm: calculateE1RM(entry.weight, entry.reps),
    volume: entry.weight * entry.reps,
  }));
};

/**
 * Calculates the overall volume data grouped by date from workout history.
 * @param {Array} workoutHistory - Array of completed workouts
 * @returns {Array} Array of { date, volume } objects
 */
export const getOverallVolumeData = (workoutHistory) => {
  if (!workoutHistory || workoutHistory.length === 0) return [];
  const volumeByDate = {};
  workoutHistory.forEach(workout => {
    const date = new Date(workout.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const volume = workout.exercises.reduce((sum, ex) =>
      sum + ex.sets.filter(s => s.completed).reduce((setSum, s) => setSum + (s.weight || 0) * (s.reps || 0), 0), 0);
    volumeByDate[date] = (volumeByDate[date] || 0) + volume;
  });
  return Object.entries(volumeByDate).map(([date, volume]) => ({ date, volume: Math.round(volume) }));
};

/**
 * Validates imported backup data has required shape.
 * @param {*} data - Parsed JSON data
 * @returns {boolean} Whether data is valid for import
 */
export const validateImportData = (data) => {
  if (!data || typeof data !== 'object') return false;
  // Must have at least some known keys
  const knownKeys = ['profile', 'mesocycle', 'history', 'activeWorkout', 'settings', 'customExercises', 'customTemplates', 'exerciseHistory'];
  return knownKeys.some(key => key in data);
};

/**
 * Computes the total completed sets from workout history.
 * @param {Array} history - Workout history array
 * @returns {number} Total number of completed sets
 */
export const getTotalCompletedSets = (history) => {
  if (!history) return 0;
  return history.reduce((acc, w) => acc + w.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0), 0);
};

/**
 * Computes the average workout duration in minutes.
 * @param {Array} history - Workout history array
 * @returns {number} Average duration in minutes, or 0
 */
export const getAverageWorkoutDuration = (history) => {
  if (!history || history.length === 0) return 0;
  const withDuration = history.filter(w => w.durationSeconds);
  if (withDuration.length === 0) return 0;
  const total = withDuration.reduce((acc, w) => acc + w.durationSeconds, 0);
  return Math.round(total / withDuration.length / 60);
};
