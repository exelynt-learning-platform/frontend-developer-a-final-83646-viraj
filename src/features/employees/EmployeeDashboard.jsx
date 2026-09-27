import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box, Typography, Button, Alert } from "@mui/material";
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  clearSearch,
  clearError,
} from "./employeeSlice";
import { fetchCountries } from "../countries/countrySlice";

import SearchBar from "./components/SearchBar";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeFormDialog from "./components/EmployeeFormDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import FeedbackSnackbar from "./components/FeedbackSnackbar";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();

  // Redux state with controlled, fine-grained selectors
  const employees = useSelector((state) => state.employees.data);
  const searchResult = useSelector((state) => state.employees.searchResult);
  const isSearching = useSelector((state) => state.employees.isSearching);
  const isListLoading = useSelector((state) => state.employees.isListLoading);
  const isActionLoading = useSelector((state) => state.employees.isActionLoading);
  const error = useSelector((state) => state.employees.error);
  const countries = useSelector((state) => state.countries.data);

  // Local UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // 'add' | 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Displayed employees computed from search state
  const displayedEmployees = isSearching
    ? (searchResult ? [searchResult] : [])
    : employees;

  // Snackbar feedback state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleSearchSubmit = () => {
    const trimmedId = searchTerm.trim();
    if (!trimmedId) {
      handleClearSearch();
      return;
    }
    dispatch(fetchEmployeeById(trimmedId));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(clearSearch());
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim() === "" && isSearching) {
      dispatch(clearSearch());
    }
  };

  // Dialog open handlers
  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setFormMode("add");
    setFormOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmployee(emp);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleOpenDelete = (emp) => {
    setSelectedEmployee(emp);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === "add") {
        await dispatch(createEmployee(formData)).unwrap();
        showSnackbar("Employee created successfully!", "success");
      } else {
        await dispatch(
          updateEmployee({ id: selectedEmployee.id, data: formData }),
        ).unwrap();
        showSnackbar("Employee updated successfully!", "success");
      }
      setFormOpen(false);
    } catch (err) {
      showSnackbar(err || "Action failed", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await dispatch(deleteEmployee(selectedEmployee.id)).unwrap();
      showSnackbar("Employee deleted successfully!", "success");
      setDeleteOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      showSnackbar(err || "Failed to delete employee", "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Title and Add Employee button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: 'black' }}>
          Employee Management
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>
          Add Employee
        </Button>
      </Box>

      {/* Global API error banner */}
      {error ? (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      ) : null}

      {/* Search Bar for ID lookup */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearch={handleSearchSubmit}
        onClear={handleClearSearch}
        loading={isListLoading}
      />

      {/* Responsive Employee Table */}
      <EmployeeTable
        employees={displayedEmployees}
        loading={isListLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage={
          isSearching && searchTerm.trim()
            ? `No employee found with ID "${searchTerm.trim()}".`
            : "No employees found."
        }
      />

      {/* Add / Edit Form Modal */}
      <EmployeeFormDialog
        open={formOpen}
        mode={formMode}
        employee={selectedEmployee}
        countries={countries}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
        loading={isActionLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={deleteOpen}
        employee={selectedEmployee}
        loading={isActionLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteOpen(false)}
      />

      {/* Status Feedback Snackbar */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
};

export default EmployeeDashboard;
