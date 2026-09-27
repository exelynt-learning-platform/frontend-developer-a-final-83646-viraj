const BASE_URL = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1';

export const fetchEmployeesApi = async () => {
  const response = await fetch(BASE_URL + '/employee');

  if (!response.ok) {
    throw new Error('Missing Employee Data');
  }

  const data = await response.json();
  return data;
};

export const fetchEmployeeByIdApi = async (id) => {
  const response = await fetch(`${BASE_URL}/employee/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Employee with ID "${id}" not found`);
    }
    throw new Error('Failed to fetch employee');
  }

  const data = await response.json();
  return data;
};

export const createEmployeeApi = async (employeeData) => {
  const response = await fetch(BASE_URL + '/employee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    throw new Error('Employee Data could not be uploaded');
  }

  const data = await response.json();
  return data;
};

export const updateEmployeeApi = async (id, employeeData) => {
  const response = await fetch(BASE_URL + '/employee/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    throw new Error('Employee Data could not be updated');
  }

  const data = await response.json();
  return data;
};

export const deleteEmployeeApi = async (id) => {
  const response = await fetch(BASE_URL + '/employee/' + id, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Employee Data could not be deleted');
  }

  const data = await response.json();
  return data;
};
