import { createContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthStatus, logout as logoutAction } from '../store/authSlice';
import { clearDashboardCache } from '../store/adminDashboardSlice';
import { clearBuilderCache } from '../store/builderDashboardSlice';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const logout = useCallback(() => {
    // Clear Redux state
    dispatch(logoutAction());
    dispatch(clearDashboardCache());
    dispatch(clearBuilderCache());
    
    // Clear API client headers
    delete apiClient.defaults.headers.common['Authorization'];
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isAdmin');
  }, [dispatch]);

  const checkAuthStatus = useCallback(() => {
    try {
      const token = localStorage.getItem('token') || auth.token;
      const role = localStorage.getItem('role') || auth.role;
      
      if (token) {
        // Verify token expiration
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const isExpired = tokenData.exp * 1000 < Date.now();
        
        if (!isExpired) {
          const userData = {
            email: tokenData.email || 'User',
            name: tokenData.name || 'User',
            role: role || tokenData.role || 'superadmin',
            id: tokenData.id,
          };
          
          // Only dispatch if Redux auth is not already set
          if (!auth.isAuthenticated || !auth.user) {
            dispatch(setAuthStatus({
              isAuthenticated: true,
              token,
              user: userData,
              role: userData.role,
            }));
          }
          
          // Ensure token is in API headers
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Token expired
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    }
  }, [dispatch, logout, auth.token, auth.role, auth.isAuthenticated, auth.user]);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    token: auth.token,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
