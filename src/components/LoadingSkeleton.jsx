import React from 'react';

/**
 * Skeleton loader placeholder used during initial app load or data-heavy views.
 * Shows a shimmer animation that mimics the layout of the actual content.
 */
export function WorkoutCardSkeleton() {
  return (
    <div data-testid="workout-card-skeleton" className="bg-white rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton h-4 w-16" />
      </div>
      <div className="skeleton h-4 w-48" />
      <div className="flex gap-2">
        <div className="skeleton h-8 w-20 rounded-full" />
        <div className="skeleton h-8 w-20 rounded-full" />
        <div className="skeleton h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div data-testid="stat-card-skeleton" className="bg-white rounded-xl p-4 shadow-sm text-center space-y-2">
      <div className="skeleton h-4 w-16 mx-auto" />
      <div className="skeleton h-8 w-12 mx-auto" />
      <div className="skeleton h-3 w-20 mx-auto" />
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div data-testid="home-skeleton" className="animate-fade-in space-y-4 p-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Action button */}
      <div className="skeleton h-12 w-full rounded-xl" />

      {/* Workout cards */}
      <div className="space-y-3">
        <div className="skeleton h-5 w-24" />
        <WorkoutCardSkeleton />
        <WorkoutCardSkeleton />
        <WorkoutCardSkeleton />
      </div>
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div data-testid="progress-skeleton" className="animate-fade-in space-y-4 p-4">
      {/* Chart placeholder */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton h-48 w-full" />
      </div>

      {/* Records list */}
      <div className="space-y-2">
        <div className="skeleton h-5 w-28" />
        <div className="skeleton h-16 w-full rounded-xl" />
        <div className="skeleton h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default {
  HomeSkeleton,
  ProgressSkeleton,
  WorkoutCardSkeleton,
  StatCardSkeleton,
};
