import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmDialog from '../features/employees/components/DeleteConfirmDialog';

beforeEach(() => {
  HTMLElement.prototype.focus = vi.fn();
});

describe('DeleteConfirmDialog', () => {
  const mockEmployee = {
    id: '101',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    mobile: '9876543210',
    country: 'Canada',
  };

  it('renders employee name and id in confirmation message when open', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        employee={mockEmployee}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText(/101/)).toBeInTheDocument();
  });

  it('calls onConfirm callback when the Delete button is clicked', () => {
    const handleConfirm = vi.fn();
    render(
      <DeleteConfirmDialog
        open={true}
        employee={mockEmployee}
        onConfirm={handleConfirm}
        onClose={vi.fn()}
      />
    );

    const deleteButton = screen.getByRole('button', {name: /delete/i});
    fireEvent.click(deleteButton);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose callback when the Cancel button is clicked', () => {
    const onClose = vi.fn()
    render(
      <DeleteConfirmDialog
        open={true}
        employee={mockEmployee}
        onConfirm={vi.fn()}
        onClose={onClose}
      />
    );

    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
