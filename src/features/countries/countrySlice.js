import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCountriesApi } from './countryApi';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCountriesApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default countrySlice.reducer;
