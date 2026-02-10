import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

function ThrowingComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test render error');
  }
  return <div data-testid="child">Child rendered</div>;
}

describe('ErrorBoundary component', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Suppress console.error output during error boundary tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child rendered')).toBeInTheDocument();
  });

  it('should render error fallback when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Test render error/)).toBeInTheDocument();
  });

  it('should recover when Try Again is clicked and child stops throwing', () => {
    // ErrorBoundary resets its internal state on "Try Again",
    // but we need to ensure the child no longer throws on next render.
    let shouldThrow = true;
    function ConditionalThrower() {
      if (shouldThrow) throw new Error('Test render error');
      return <div data-testid="child">Child rendered</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Change the condition before clicking Try Again
    shouldThrow = false;
    fireEvent.click(screen.getByText('Try Again'));

    // After reset, the ErrorBoundary re-renders children
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should show Reset App Data & Reload button', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Reset App Data & Reload')).toBeInTheDocument();
  });

  it('should clear localStorage and reload on full reset', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByText('Reset App Data & Reload'));
    expect(removeItemSpy).toHaveBeenCalledWith('hypertrophy_state_v3');
    expect(reloadMock).toHaveBeenCalled();

    removeItemSpy.mockRestore();
  });
});
