import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeFormDialog from "../features/employees/components/EmployeeFormDialog";

beforeEach(() => {
  HTMLElement.prototype.focus = vi.fn();
});

describe("EmployeeFormDialog", () => {
  const mockCountries = [
    { id: "1", country: "United States" },
    { id: "2", country: "India" },
    { id: "3", country: "Canada" },
  ];

  it("renders all six input fields and action buttons when open", () => {
    render(
      <EmployeeFormDialog
        open={true}
        mode="add"
        countries={mockCountries}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /add employee/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^state$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^district$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^add$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("displays validation errors when submitting an empty form", async () => {
    render(
      <EmployeeFormDialog
        open={true}
        mode="add"
        countries={mockCountries}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /^add$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Mobile number is required")).toBeInTheDocument();
      expect(screen.getByText("Country is required")).toBeInTheDocument();
      expect(screen.getByText("State is required")).toBeInTheDocument();
      expect(screen.getByText("District is required")).toBeInTheDocument();
    });
  });

  it("displays format error when an invalid email is entered", async () => {
    render(
      <EmployeeFormDialog
        open={true}
        mode="add"
        countries={mockCountries}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "not-an-email" } });

    const submitButton = screen.getByRole("button", { name: /^add$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("displays format error when mobile number is not 10 digits", async () => {
    render(
      <EmployeeFormDialog
        open={true}
        mode="add"
        countries={mockCountries}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const mobileInput = screen.getByLabelText(/mobile number/i);
    fireEvent.change(mobileInput, { target: { value: "12345" } });

    const submitButton = screen.getByRole("button", { name: /^add$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Mobile number must be exactly 10 digits"),
      ).toBeInTheDocument();
    });
  });

  it("displays validation errors when state or district is less than 2 characters", async () => {
    render(
      <EmployeeFormDialog
        open={true}
        mode="add"
        countries={mockCountries}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const stateInput = screen.getByLabelText(/^state$/i);
    const districtInput = screen.getByLabelText(/^district$/i);
    fireEvent.change(stateInput, { target: { value: "A" } });
    fireEvent.change(districtInput, { target: { value: "B" } });

    const submitButton = screen.getByRole("button", { name: /^add$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("State must be at least 2 characters"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("District must be at least 2 characters"),
      ).toBeInTheDocument();
    });
  });

  it("pre-populates input fields when opened in edit mode", () => {
    const existingEmployee = {
      id: "42",
      name: "Bob Smith",
      email: "bob@example.com",
      mobile: "1234567890",
      country: "India",
      state: "Maharashtra",
      district: "Pune",
    };

    render(
      <EmployeeFormDialog
        open={true}
        mode="edit"
        employee={existingEmployee}
        countries={mockCountries}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Edit Employee")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue("Bob Smith");
    expect(screen.getByLabelText(/email/i)).toHaveValue("bob@example.com");
    expect(screen.getByLabelText(/mobile number/i)).toHaveValue("1234567890");
    expect(screen.getByLabelText(/^state$/i)).toHaveValue("Maharashtra");
    expect(screen.getByLabelText(/^district$/i)).toHaveValue("Pune");
  });
});
