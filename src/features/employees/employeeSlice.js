import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchEmployeesApi,
  fetchEmployeeByIdApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from './employeeApi';

const initialState = {
  data: [],
  searchResult: null,
  isSearching: false,
  isListLoading: false,
  isActionLoading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchEmployeesApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch employees');
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchEmployeeByIdApi(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch employee');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const data = await createEmployeeApi(employeeData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await updateEmployeeApi(id, data);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployeeApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchResult = null;
      state.isSearching = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.isListLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isListLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isListLoading = false;
        state.error = action.payload;
      })

      // Fetch Employee by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.isListLoading = true;
        state.isSearching = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.isListLoading = false;
        state.isSearching = true;
        state.searchResult = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.isListLoading = false;
        state.isSearching = true;
        state.searchResult = null;
        state.error = action.payload;
      })

      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.data.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      })

      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const index = state.data.findIndex(
          (emp) => String(emp.id) === String(action.payload?.id)
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (
          state.searchResult &&
          String(state.searchResult.id) === String(action.payload?.id)
        ) {
          state.searchResult = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      })

      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.data = state.data.filter(
          (emp) => String(emp.id) !== String(action.payload)
        );
        if (
          state.searchResult &&
          String(state.searchResult.id) === String(action.payload)
        ) {
          state.searchResult = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch, clearError } = employeeSlice.actions;

export default employeeSlice.reducer;
