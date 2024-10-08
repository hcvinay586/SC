// File: utils/axiosInstance.js
import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json', // Set the default content type to JSON
  },
  withCredentials: true // This allows cookies to be sent with each request
});

// Request Interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('http://localhost:5000/api/token/refresh', {}, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken); // Store the new access token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`; // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
