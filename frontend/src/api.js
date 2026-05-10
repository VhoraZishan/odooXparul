const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
      throw new Error('Unauthorized');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || data.message || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
