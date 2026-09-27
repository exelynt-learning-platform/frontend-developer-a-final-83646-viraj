import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import employeeReducer, {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  clearSearch,
  clearError,
} from '../features/employees/employeeSlice';
import {
  fetchEmployeesApi,
  fetchEmployeeByIdApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from '../features/employees/employeeApi';

vi.mock('../features/employees/employeeApi', () => ({
  fetchEmployeesApi: vi.fn(),
  fetchEmployeeByIdApi: vi.fn(),
  createEmployeeApi: vi.fn(),
  updateEmployeeApi: vi.fn(),
  deleteEmployeeApi: vi.fn(),
}));

describe('employeeSlice reducer', () => {
  const initialState = {
    data: [],
    searchResult: null,
    isSearching: false,
    isListLoading: false,
    isActionLoading: false,
    error: null,
  };

  it('should return the initial state when passed an empty action', () => {
    const result = employeeReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should store fetched employees on fetchEmployees.fulfilled', () => {
    const mockEmployees = [{ id: '1', name: 'John Doe', state: 'NY', district: 'Brooklyn' }];
    const result = employeeReducer(initialState, fetchEmployees.fulfilled(mockEmployees));
    expect(result.data).toEqual(mockEmployees);
    expect(result.isListLoading).toBe(false);
  });

  it('should reactively append new employee on createEmployee.fulfilled', () => {
    const mockEmployees = [{ id: '1', name: 'John Doe' }];
    const newEmployee = { id: '2', name: 'Jane Doe' };
    const previousState = { ...initialState, data: [mockEmployees[0]], isActionLoading: true };
    const result = employeeReducer(previousState, createEmployee.fulfilled(newEmployee));
    expect(result.data).toEqual([mockEmployees[0], newEmployee]);
    expect(result.isActionLoading).toBe(false);
  });

  it('should reactively update existing employee on updateEmployee.fulfilled', () => {
    const mockEmployees = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }];
    const previousState = { ...initialState, data: mockEmployees, isActionLoading: true };
    const updatedEmployee = { id: '2', name: 'Mary Jane' };
    const result = employeeReducer(previousState, updateEmployee.fulfilled(updatedEmployee));
    expect(result.data).toEqual([mockEmployees[0], updatedEmployee]);
    expect(result.isActionLoading).toBe(false);
  });

  it('should reactively remove employee by ID on deleteEmployee.fulfilled', () => {
    const mockEmployees = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }];
    const previousState = { ...initialState, data: mockEmployees, isActionLoading: true };
    const result = employeeReducer(previousState, deleteEmployee.fulfilled('1'));
    expect(result.data).toEqual([mockEmployees[1]]);
    expect(result.isActionLoading).toBe(false);
  });

  it('should reactively update employee when payload ID is numeric and state ID is a string', () => {
    const mockEmployees = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }];
    const previousState = { ...initialState, data: mockEmployees, isActionLoading: true };
    const updatedEmployee = { id: 2, name: 'Mary Jane' };
    const result = employeeReducer(previousState, updateEmployee.fulfilled(updatedEmployee));
    expect(result.data[1]).toEqual(updatedEmployee);
  });

  it('should reactively remove employee when deleted ID is numeric and state ID is a string', () => {
    const mockEmployees = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }];
    const previousState = { ...initialState, data: mockEmployees, isActionLoading: true };
    const result = employeeReducer(previousState, deleteEmployee.fulfilled(1));
    expect(result.data).toEqual([mockEmployees[1]]);
  });

  it('should store searchResult and set isSearching on fetchEmployeeById.fulfilled without overwriting data', () => {
    const masterList = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Doe' },
    ];
    const mockEmployee = { id: '1', name: 'John Doe' };
    const previousState = { ...initialState, data: masterList, isListLoading: true };
    const result = employeeReducer(previousState, fetchEmployeeById.fulfilled(mockEmployee));
    expect(result.searchResult).toEqual(mockEmployee);
    expect(result.data).toEqual(masterList);
    expect(result.isSearching).toBe(true);
    expect(result.isListLoading).toBe(false);
  });

  it('should preserve data, set searchResult to null, and set error on fetchEmployeeById.rejected', () => {
    const masterList = [{ id: '1', name: 'John Doe' }];
    const errorMsg = 'Employee with ID "99" not found';
    const previousState = { ...initialState, data: masterList, isListLoading: true };
    const result = employeeReducer(
      previousState,
      fetchEmployeeById.rejected(null, '', '99', errorMsg)
    );
    expect(result.data).toEqual(masterList);
    expect(result.searchResult).toBeNull();
    expect(result.isSearching).toBe(true);
    expect(result.error).toBe(errorMsg);
    expect(result.isListLoading).toBe(false);
  });

  it('should sync searchResult when updateEmployee updates the searched employee', () => {
    const searchedEmployee = { id: '1', name: 'Old Name' };
    const updatedEmployee = { id: '1', name: 'Updated Name' };
    const previousState = {
      ...initialState,
      data: [searchedEmployee],
      searchResult: searchedEmployee,
      isSearching: true,
    };
    const result = employeeReducer(previousState, updateEmployee.fulfilled(updatedEmployee));
    expect(result.data[0]).toEqual(updatedEmployee);
    expect(result.searchResult).toEqual(updatedEmployee);
  });

  it('should clear searchResult when deleteEmployee deletes the searched employee', () => {
    const searchedEmployee = { id: '1', name: 'John Doe' };
    const previousState = {
      ...initialState,
      data: [searchedEmployee],
      searchResult: searchedEmployee,
      isSearching: true,
    };
    const result = employeeReducer(previousState, deleteEmployee.fulfilled('1'));
    expect(result.data).toEqual([]);
    expect(result.searchResult).toBeNull();
  });

  it('should clear searchResult, isSearching, and error on clearSearch action', () => {
    const searchedState = {
      ...initialState,
      searchResult: { id: '1', name: 'John Doe' },
      isSearching: true,
      error: 'Some error',
    };
    const result = employeeReducer(searchedState, clearSearch());
    expect(result.searchResult).toBeNull();
    expect(result.isSearching).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should reset error on clearError action', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const result = employeeReducer(stateWithError, clearError());
    expect(result.error).toBeNull();
  });
});

describe('employeeSlice async thunks with mocked APIs', () => {
  let store;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: {
        employees: employeeReducer,
      },
    });
  });

  it('fetchEmployees dispatches fulfilled and populates state.data', async () => {
    const mockList = [
      { id: '1', name: 'Alice', state: 'Ontario', district: 'Toronto' },
      { id: '2', name: 'Bob', state: 'California', district: 'LA' },
    ];
    fetchEmployeesApi.mockResolvedValueOnce(mockList);

    await store.dispatch(fetchEmployees());

    const state = store.getState().employees;
    expect(fetchEmployeesApi).toHaveBeenCalledTimes(1);
    expect(state.data).toEqual(mockList);
    expect(state.isListLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchEmployeeById success stores searchResult and preserves master data', async () => {
    const masterList = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ];
    fetchEmployeesApi.mockResolvedValueOnce(masterList);
    await store.dispatch(fetchEmployees());

    const singleEmployee = { id: '1', name: 'Alice', state: 'Ontario', district: 'Toronto' };
    fetchEmployeeByIdApi.mockResolvedValueOnce(singleEmployee);

    await store.dispatch(fetchEmployeeById('1'));

    const state = store.getState().employees;
    expect(fetchEmployeeByIdApi).toHaveBeenCalledWith('1');
    expect(state.searchResult).toEqual(singleEmployee);
    expect(state.isSearching).toBe(true);
    expect(state.data).toEqual(masterList);
    expect(state.isListLoading).toBe(false);
  });

  it('fetchEmployeeById rejection stores error, sets searchResult to null, and preserves master data', async () => {
    const masterList = [{ id: '1', name: 'Alice' }];
    fetchEmployeesApi.mockResolvedValueOnce(masterList);
    await store.dispatch(fetchEmployees());

    fetchEmployeeByIdApi.mockRejectedValueOnce(new Error('Employee with ID "99" not found'));

    await store.dispatch(fetchEmployeeById('99'));

    const state = store.getState().employees;
    expect(state.searchResult).toBeNull();
    expect(state.isSearching).toBe(true);
    expect(state.data).toEqual(masterList);
    expect(state.error).toBe('Employee with ID "99" not found');
    expect(state.isListLoading).toBe(false);
  });

  it('createEmployee appends created employee to state.data', async () => {
    const newEmpData = { name: 'Charlie', country: 'India', state: 'Gujarat', district: 'Surat' };
    const createdEmp = { id: '3', ...newEmpData };
    createEmployeeApi.mockResolvedValueOnce(createdEmp);

    await store.dispatch(createEmployee(newEmpData));

    const state = store.getState().employees;
    expect(createEmployeeApi).toHaveBeenCalledWith(newEmpData);
    expect(state.data).toContainEqual(createdEmp);
    expect(state.isActionLoading).toBe(false);
  });

  it('updateEmployee updates state.data and searchResult when matching', async () => {
    const initialEmployee = { id: '1', name: 'Alice', state: 'Old State', district: 'Old District' };
    fetchEmployeesApi.mockResolvedValueOnce([initialEmployee]);
    await store.dispatch(fetchEmployees());

    fetchEmployeeByIdApi.mockResolvedValueOnce(initialEmployee);
    await store.dispatch(fetchEmployeeById('1'));

    const updatedData = { name: 'Alice M', state: 'New State', district: 'New District' };
    const updatedResponse = { id: '1', ...updatedData };
    updateEmployeeApi.mockResolvedValueOnce(updatedResponse);

    await store.dispatch(updateEmployee({ id: '1', data: updatedData }));

    const state = store.getState().employees;
    expect(updateEmployeeApi).toHaveBeenCalledWith('1', updatedData);
    expect(state.data[0]).toEqual(updatedResponse);
    expect(state.searchResult).toEqual(updatedResponse);
    expect(state.isActionLoading).toBe(false);
  });

  it('deleteEmployee removes employee from state.data and resets searchResult', async () => {
    const emp1 = { id: '1', name: 'Alice' };
    const emp2 = { id: '2', name: 'Bob' };
    fetchEmployeesApi.mockResolvedValueOnce([emp1, emp2]);
    await store.dispatch(fetchEmployees());

    fetchEmployeeByIdApi.mockResolvedValueOnce(emp1);
    await store.dispatch(fetchEmployeeById('1'));

    deleteEmployeeApi.mockResolvedValueOnce({});

    await store.dispatch(deleteEmployee('1'));

    const state = store.getState().employees;
    expect(deleteEmployeeApi).toHaveBeenCalledWith('1');
    expect(state.data).toEqual([emp2]);
    expect(state.searchResult).toBeNull();
    expect(state.isActionLoading).toBe(false);
  });
});
