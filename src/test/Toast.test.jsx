import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { useToast, ToastContainer } from '../components/Toast';

function ToastTestHarness() {
  const { toasts, showToast, dismissToast } = useToast();
  return (
    <div>
      <button data-testid="show-success" onClick={() => showToast('Success msg', 'success', 0)}>Show Success</button>
      <button data-testid="show-error" onClick={() => showToast('Error msg', 'error', 0)}>Show Error</button>
      <button data-testid="show-info" onClick={() => showToast('Info msg', 'info', 0)}>Show Info</button>
      <button data-testid="show-warning" onClick={() => showToast('Warning msg', 'warning', 0)}>Show Warning</button>
      <button data-testid="show-auto" onClick={() => showToast('Auto dismiss', 'info', 100)}>Show Auto</button>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

describe('Toast component', () => {
  it('should render nothing when no toasts', () => {
    const { container } = render(<ToastContainer toasts={[]} onDismiss={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('should render nothing when toasts is null', () => {
    const { container } = render(<ToastContainer toasts={null} onDismiss={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('should show a success toast when triggered', () => {
    render(<ToastTestHarness />);
    fireEvent.click(screen.getByTestId('show-success'));
    expect(screen.getByText('Success msg')).toBeInTheDocument();
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
  });

  it('should show an error toast when triggered', () => {
    render(<ToastTestHarness />);
    fireEvent.click(screen.getByTestId('show-error'));
    expect(screen.getByText('Error msg')).toBeInTheDocument();
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
  });

  it('should show multiple toasts simultaneously', () => {
    render(<ToastTestHarness />);
    fireEvent.click(screen.getByTestId('show-success'));
    fireEvent.click(screen.getByTestId('show-error'));
    expect(screen.getByText('Success msg')).toBeInTheDocument();
    expect(screen.getByText('Error msg')).toBeInTheDocument();
  });

  it('should dismiss a toast when dismiss button is clicked', () => {
    render(<ToastTestHarness />);
    fireEvent.click(screen.getByTestId('show-success'));
    expect(screen.getByText('Success msg')).toBeInTheDocument();
    const dismissBtn = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissBtn);
    expect(screen.queryByText('Success msg')).not.toBeInTheDocument();
  });

  it('should auto-dismiss toast after specified duration', async () => {
    vi.useFakeTimers();
    render(<ToastTestHarness />);
    fireEvent.click(screen.getByTestId('show-auto'));
    expect(screen.getByText('Auto dismiss')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should have correct role=alert for accessibility', () => {
    render(<ToastTestHarness />);
    fireEvent.click(screen.getByTestId('show-info'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
