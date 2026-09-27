import { describe, it, expect } from 'vitest';
import employeeReducer, {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../features/employees/employeeSlice';

describe('employeeSlice', () => {
  const initialState = {
    data: [],
    loading: false,
    error: null,
  };

  it('should return the initial state when passed an empty action', () => {
    const result = employeeReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should store fetched employees on fetchEmployees.fulfilled', () => {
    let mockEmployees = [{ id: '1', name: 'John Doe' }];
    const result = employeeReducer(initialState, fetchEmployees.fulfilled(mockEmployees));
    expect(result.data).toEqual(mockEmployees);
    expect(result.loading).toBe(false);
  });

  it('should reactively append new employee on createEmployee.fulfilled', () => {
    let mockEmployees = [{ id: '1', name: 'John Doe' }];
    let newEmployee = { id: '2', name: 'Jane Doe' };
    let previousState = { data: [mockEmployees[0]], loading: true, error: null}
    const result = employeeReducer(previousState, createEmployee.fulfilled(newEmployee));
    expect(result.data).toEqual([mockEmployees[0],newEmployee]);
  });

  it('should reactively update existing employee on updateEmployee.fulfilled', () => {
    let mockEmployees = [{ id: '1', name: 'John Doe' },{ id: '2', name: 'Jane Doe' }];
    let previousState = {data: mockEmployees, loading: true, error: null};
    let updatedEmployee = {id: '2', name: 'Mary Jane'};
    const result = employeeReducer(previousState, updateEmployee.fulfilled(updatedEmployee));
    expect(result.data).toEqual([mockEmployees[0], updatedEmployee]);
  });

  it('should reactively remove employee by ID on deleteEmployee.fulfilled', () => {
    let mockEmployees = [{ id: '1', name: 'John Doe' },{ id: '2', name: 'Jane Doe' }];
    let previousState = {data: mockEmployees, loading: true, error: null};
    const result = employeeReducer(previousState, deleteEmployee.fulfilled('1'));
    expect(result.data).toEqual([mockEmployees[1]]);
  });

  it('should reactively update employee when payload ID is numeric and state ID is a string', () => {
    let mockEmployees = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }];
    let previousState = { data: mockEmployees, loading: true, error: null };
    let updatedEmployee = { id: 2, name: 'Mary Jane' };
    const result = employeeReducer(previousState, updateEmployee.fulfilled(updatedEmployee));
    expect(result.data[1]).toEqual(updatedEmployee);
  });

  it('should reactively remove employee when deleted ID is numeric and state ID is a string', () => {
    let mockEmployees = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }];
    let previousState = { data: mockEmployees, loading: true, error: null };
    const result = employeeReducer(previousState, deleteEmployee.fulfilled(1));
    expect(result.data).toEqual([mockEmployees[1]]);
  });
});
