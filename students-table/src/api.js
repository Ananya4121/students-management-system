import axios from 'axios';

// Get API base URL from environment variable, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

// Log the API URL in development to help debug
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL);
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
