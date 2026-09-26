# Employee Management Dashboard

Hi! 👋 This is an Employee Management application built as an assessment project for the Entry-Level Frontend Developer position.

The application allows users to view, search, add, edit, and delete employee records with instant feedback and client-side form validation.

---

## 🛠️ Tech Stack

- **React 19** (Vite)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **UI Components:** Material-UI (MUI v6) & Emotion
- **Form Handling:** React Hook Form
- **Testing:** Vitest + React Testing Library + `@testing-library/jest-dom` + `jsdom`
- **Linting:** ESLint

---

## ✨ Features

- **Employee List & Table:** Displays employee records (ID, Name, Email, Mobile, Country) with actions to edit or delete.
- **Search by ID:** Filter employees in real-time by their ID, showing a clear "No employees found" message if there is no match.
- **Add & Edit Modal:** Reusable dialog with validation using React Hook Form:
  - Name is required (2–50 characters)
  - Valid email format required
  - 10-digit mobile number required
  - Country dropdown populated from the countries API
  - Automatically pre-populates existing data when editing
- **Delete Confirmation:** Modal dialog to prevent accidental deletions.
- **Instant (Reactive) Updates:** When creating, updating, or deleting an employee, the Redux store updates immediately without needing to re-fetch the entire list from the server.
- **User Feedback:** Clear loading spinners, API error alerts, and snackbar toasts for success and failure actions.

---

## 📁 Project Structure

The project is organized by feature domains with a clean separation between **smart (container)** and **dumb (presentational)** components:

```
src/
├── app/
│   └── store.js                 # Redux store setup
├── features/
│   ├── countries/
│   │   ├── countryApi.js        # API call for countries
│   │   └── countrySlice.js      # Slice for country list
│   └── employees/
│       ├── employeeApi.js       # CRUD API calls for employees
│       ├── employeeSlice.js     # Redux slice with async thunks & reducers
│       ├── EmployeeDashboard.jsx# Smart container (connects to Redux & coordinates UI)
│       └── components/          # Presentational (dumb) components
│           ├── DeleteConfirmDialog.jsx
│           ├── EmployeeFormDialog.jsx
│           ├── EmployeeTable.jsx
│           ├── FeedbackSnackbar.jsx
│           └── SearchBar.jsx
└── tests/                       # Unit & integration tests
    ├── countrySlice.test.js
    ├── employeeSlice.test.js
    ├── DeleteConfirmDialog.test.jsx
    ├── EmployeeForm.test.jsx
    ├── EmployeeTable.test.jsx
    └── setup.js
```

### Smart vs. Dumb Component Separation:
- **`EmployeeDashboard.jsx` (Smart):** Holds Redux state, dispatches actions, handles API side effects, and manages dialog states.
- **`components/` (Dumb):** Pure UI components that only take props and pass events back through callbacks. No Redux logic lives here.

---

## 🌐 API Endpoints Used

MockAPI endpoints used in this project:
- **Employees:** `https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee` (GET, POST, PUT, DELETE)
- **Countries:** `https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/country` (GET)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/frontend-developer-a-final-81729-viraj.git
cd frontend-developer-a-final-81729-viraj
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Testing & Linting

### Run unit tests
```bash
npm run test
```
Or run once:
```bash
npm run test -- --run
```
All 5 test suites (22 tests) test initial slice states, thunk/reducer updates, form validation rules, table rendering, and dialog interactions.

### Run linter
```bash
npm run lint
```

### Build for production
```bash
npm run build
```

---

## 💡 Notes on Design Decisions

- **Reactive State Updates:** Instead of calling `fetchEmployees()` after every create, edit, or delete, the reducers directly modify the local array (`push`, `findIndex/replace`, and `filter`). This keeps the UI fast and avoids unnecessary network calls.
- **React Hook Form:** Chosen for simple and performant input validation without causing re-renders on every keystroke.