import { describe, it, expect } from 'vitest';
import countryReducer, { fetchCountries } from '../features/countries/countrySlice';

describe('countrySlice', () => {
  const initialState = {
    data: [],
    loading: false,
    error: null,
  };

  it('should return the initial state when passed an empty action', () => {
    const result = countryReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should set loading to true and clear error on fetchCountries.pending', () => {
    const result = countryReducer(initialState, fetchCountries.pending());
    expect(result.loading).toBe(true);
    expect(result.error).toBe(null);
  });

  const mockCountries = [
    { id: 1, name: 'France' },
    { id: 2, name: 'Brazil' }
  ];

  it('should set data and set loading to false on fetchCountries.fulfilled', () => {
    const result = countryReducer({...initialState, loading: true}, fetchCountries.fulfilled(mockCountries));
    expect(result.loading).toBe(false);
    expect(result.data).toEqual(mockCountries);
    expect(result.error).toBe(null);
  });

  const mockError = "Error fetching countries!";

  it('should set error message and set loading to false on fetchCountries.rejected', () => {
    const action = { type: fetchCountries.rejected.type, payload: mockError };
    const result = countryReducer({...initialState, loading: true}, action)
    expect(result.loading).toBe(false);
    expect(result.data).toEqual([]);
    expect(result.error).toBe(mockError);
  });
});
