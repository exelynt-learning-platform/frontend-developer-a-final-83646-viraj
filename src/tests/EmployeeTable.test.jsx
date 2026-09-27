import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeTable from '../features/employees/components/EmployeeTable';

describe('EmployeeTable', () => {
  const mockEmployees = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      mobile: '9876543210',
      country: 'Canada',
      state: 'Ontario',
      district: 'Toronto',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      mobile: '1234567890',
      country: 'United States',
      state: 'California',
      district: 'Los Angeles',
    },
  ];

  it('renders employee rows with correct details including state and district', () => {
    render(
      <EmployeeTable
        employees={mockEmployees}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByRole('columnheader', { name: 'State' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'District' })).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Ontario')).toBeInTheDocument();
    expect(screen.getByText('Toronto')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  });

  it('renders dash fallback when state or district is not provided', () => {
    const employeesWithoutLocation = [
      {
        id: '3',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        mobile: '1122334455',
        country: 'India',
      },
    ];
    render(
      <EmployeeTable
        employees={employeesWithoutLocation}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const cells = screen.getAllByRole('cell');
    const dashes = cells.filter((cell) => cell.textContent === '-');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('renders empty message when no employees are provided', () => {
    render(
      <EmployeeTable
        employees={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('No employees found.')).toBeInTheDocument();
  });

  it('renders custom empty message when provided', () => {
    render(
      <EmployeeTable
        employees={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        emptyMessage={'No employee found with ID "42".'}
      />
    );

    expect(screen.getByText('No employee found with ID "42".')).toBeInTheDocument();
  });

  it('renders loading indicator when loading is true', () => {
    render(
      <EmployeeTable
        employees={[]}
        loading={true}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Loading employees...')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    const handleEdit = vi.fn();
    render(
      <EmployeeTable
        employees={mockEmployees}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('calls onDelete when Delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(
      <EmployeeTable
        employees={mockEmployees}
        onEdit={vi.fn()}
        onDelete={handleDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledWith(mockEmployees[0]);
  });
});
