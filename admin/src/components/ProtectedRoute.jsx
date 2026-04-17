import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthStatus } from '../store/authSlice';

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector(state => state.auth);

  // Initialize auth from localStorage on mount if Redux is empty
  useEffect(() => {
    // If Redux doesn't have auth data but localStorage does, restore it
    if (!user && !token) {
      const storedToken = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');

      if (storedToken) {
        try {
          // Verify token expiration
          const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
          const isExpired = tokenData.exp * 1000 < Date.now();

          if (!isExpired) {
            dispatch(setAuthStatus({
              isAuthenticated: true,
              token: storedToken,
              user: {
                email: tokenData.email || 'User',
                name: tokenData.name || 'User',
                role: storedRole || tokenData.role || 'superadmin',
                id: tokenData.id,
              },
              role: storedRole || tokenData.role || 'superadmin',
            }));
          } else {
            // Token expired - clean up
            localStorage.removeItem('token');
            localStorage.removeItem('role');
          }
        } catch (error) {
          console.error('Error initializing auth from localStorage:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      }
    }
  }, [dispatch, user, token]);

  // Check token validity
  const isTokenExpired = () => {
    if (!token) return true;
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return tokenData.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error verifying token:', error);
      return true;
    }
  };

  // Not authenticated or token expired
  if (!isAuthenticated || !user || isTokenExpired()) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isAdmin');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;