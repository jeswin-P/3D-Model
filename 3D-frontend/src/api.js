import axios from 'axios';

// Determine API base URL with fallback
const getBaseURL = () => {
  // Use environment variable if available
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In production (Vercel/Render), use same origin or relative path
  if (process.env.NODE_ENV === 'production') {
    return '';  // Empty string uses current domain
  }
  
  // Development fallback
  return 'http://localhost:5000';
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Add request interceptor for debugging
API.interceptors.request.use(
  config => {
    console.log('API Request:', config.baseURL + config.url);
    // Don't overwrite FormData headers - let browser set them
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for error handling
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.status, error.message);
    if (error.response?.status === 0) {
      console.error('CORS or Network error - check server is running and CORS is configured');
    }
    return Promise.reject(error);
  }
);

export const uploadModel = (formData) => API.post('/addModel', formData);
export const getModels = () => API.get('/getAllModels');
export const deleteModel = (id) => API.delete(`/deleteModel/${id}`);

