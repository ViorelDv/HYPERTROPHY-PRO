import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ConfirmModal from '../components/ConfirmModal';

describe('ConfirmModal component', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal isOpen={false} onConfirm={() => {}} onCancel={() => {}} />
    );
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <ConfirmModal isOpen={true} title="Test Title" message="Test Message" onConfirm={() => {}} onCancel={() => {}} />
    );
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should display custom confirm and cancel labels', () => {
    render(
      <ConfirmModal isOpen={true} confirmLabel="Yes, Delete" cancelLabel="No, Keep" onConfirm={() => {}} onCancel={() => {}} />
    );
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
    expect(screen.getByText('No, Keep')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal isOpen={true} onConfirm={onConfirm} onCancel={() => {}} />
    );
    fireEvent.click(screen.getByTestId('confirm-ok'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmModal isOpen={true} onConfirm={() => {}} onCancel={onCancel} />
    );
    fireEvent.click(screen.getByTestId('confirm-cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should use default title and message when not provided', () => {
    render(
      <ConfirmModal isOpen={true} onConfirm={() => {}} onCancel={() => {}} />
    );
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    // 'Confirm' appears both as title and button label
    const confirmTexts = screen.getAllByText('Confirm');
    expect(confirmTexts).toHaveLength(2);
  });

  it('should have proper accessibility attributes', () => {
    render(
      <ConfirmModal isOpen={true} title="Title" message="Msg" onConfirm={() => {}} onCancel={() => {}} />
    );
    const dialog = screen.getByTestId('confirm-modal');
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should apply danger variant styles by default', () => {
    render(
      <ConfirmModal isOpen={true} onConfirm={() => {}} onCancel={() => {}} />
    );
    const confirmBtn = screen.getByTestId('confirm-ok');
    expect(confirmBtn.className).toContain('bg-red-500');
  });

  it('should apply warning variant styles when specified', () => {
    render(
      <ConfirmModal isOpen={true} variant="warning" onConfirm={() => {}} onCancel={() => {}} />
    );
    const confirmBtn = screen.getByTestId('confirm-ok');
    expect(confirmBtn.className).toContain('bg-yellow-500');
  });

  it('should apply info variant styles when specified', () => {
    render(
      <ConfirmModal isOpen={true} variant="info" onConfirm={() => {}} onCancel={() => {}} />
    );
    const confirmBtn = screen.getByTestId('confirm-ok');
    expect(confirmBtn.className).toContain('bg-blue-500');
  });
});
