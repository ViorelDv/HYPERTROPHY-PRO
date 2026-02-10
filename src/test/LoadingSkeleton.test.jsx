import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeSkeleton, ProgressSkeleton, WorkoutCardSkeleton, StatCardSkeleton } from '../components/LoadingSkeleton';

describe('WorkoutCardSkeleton', () => {
  it('should render with the correct test id', () => {
    render(<WorkoutCardSkeleton />);
    expect(screen.getByTestId('workout-card-skeleton')).toBeInTheDocument();
  });

  it('should contain skeleton shimmer elements', () => {
    const { container } = render(<WorkoutCardSkeleton />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe('StatCardSkeleton', () => {
  it('should render with the correct test id', () => {
    render(<StatCardSkeleton />);
    expect(screen.getByTestId('stat-card-skeleton')).toBeInTheDocument();
  });
});

describe('HomeSkeleton', () => {
  it('should render with the correct test id', () => {
    render(<HomeSkeleton />);
    expect(screen.getByTestId('home-skeleton')).toBeInTheDocument();
  });

  it('should contain multiple stat card skeletons', () => {
    render(<HomeSkeleton />);
    const statCards = screen.getAllByTestId('stat-card-skeleton');
    expect(statCards.length).toBe(3);
  });

  it('should contain workout card skeletons', () => {
    render(<HomeSkeleton />);
    const workoutCards = screen.getAllByTestId('workout-card-skeleton');
    expect(workoutCards.length).toBe(3);
  });
});

describe('ProgressSkeleton', () => {
  it('should render with the correct test id', () => {
    render(<ProgressSkeleton />);
    expect(screen.getByTestId('progress-skeleton')).toBeInTheDocument();
  });

  it('should contain skeleton shimmer elements', () => {
    const { container } = render(<ProgressSkeleton />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
