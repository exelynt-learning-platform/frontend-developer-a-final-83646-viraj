const BASE_URL = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1';

export const fetchCountriesApi = async () => {
  const response = await fetch(BASE_URL + '/country');

  if (!response.ok) {
    throw new Error('Missing Country Data');
  }

  const data = await response.json();
  return data;
};
