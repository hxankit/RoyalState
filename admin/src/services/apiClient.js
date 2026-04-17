import axios from 'axios';
import { APP_CONSTANTS, backendurl } from '../config/constants';

const apiClient = axios.create({
  baseURL: backendurl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store reference to get store state (injected from main.jsx)
let storeRef = null;
export const setStore = (store) => {
  storeRef = store;
};

apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage first (most reliable)
    let token = localStorage.getItem('token');
    
    // If not in localStorage, try Redux store
    if (!token && storeRef) {
      try {
        const state = storeRef.getState();
        token = state?.auth?.token;
      } catch (error) {
        console.warn('Error accessing Redux store for token:', error);
      }
    }
    
    // Add token to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage or Redux. Request may fail with 401.');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid or expired
      localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
      localStorage.removeItem('role');
      localStorage.removeItem(APP_CONSTANTS.IS_ADMIN_KEY);
      
      // Optionally redirect to login
      if (window.location.pathname !== '/login') {
        console.error('Unauthorized: Token invalid or expired');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
