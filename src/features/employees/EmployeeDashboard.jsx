import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box, Typography, Button, Alert } from "@mui/material";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./employeeSlice";
import { fetchCountries } from "../countries/countrySlice";

import SearchBar from "./components/SearchBar";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeFormDialog from "./components/EmployeeFormDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import FeedbackSnackbar from "./components/FeedbackSnackbar";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    data: employees = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.employees);
  const { data: countries = [] } = useSelector((state) => state.countries);

  // Local UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // 'add' | 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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

  const filteredEmployees =
    searchTerm.trim() === ""
      ? employees
      : employees.filter((emp) =>
          emp.id
            .toString()
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()),
        );

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
    setActionLoading(true);
    try {
      if (formMode === "add") {
        await dispatch(createEmployee(formData)).unwrap();
        showSnackbar("Employee created successfully!", "success");
        console.log("Add employee:", formData);
      } else {
        await dispatch(
          updateEmployee({ id: selectedEmployee.id, data: formData }),
        ).unwrap();
        showSnackbar("Employee updated successfully!", "success");
        console.log("Update employee:", formData);
      }
      setFormOpen(false);
    } catch (err) {
      showSnackbar(err || "Action failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    setActionLoading(true);
    try {
      await dispatch(deleteEmployee(selectedEmployee.id)).unwrap();
      showSnackbar("Employee deleted successfully!", "success");
      setDeleteOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      showSnackbar(err || "Failed to delete employee", "error");
    } finally {
      setActionLoading(false);
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
        <Typography variant="h4" component="h1" fontWeight="bold">
          Employee Management
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>
          Add Employee
        </Button>
      </Box>

      {/* Global API error banner */}
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

      {/* Search Bar for ID filtering */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />

      {/* Responsive Employee Table */}
      <EmployeeTable
        employees={filteredEmployees}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Form Modal */}
      <EmployeeFormDialog
        open={formOpen}
        mode={formMode}
        employee={selectedEmployee}
        countries={countries}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={deleteOpen}
        employee={selectedEmployee}
        loading={actionLoading}
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
