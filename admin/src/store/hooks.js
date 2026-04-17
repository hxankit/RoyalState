import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import apiClient from '../services/apiClient';
import { 
  loginSuccess, 
  loginFailure, 
  logout, 
  setAuthStatus,
  setLoading 
} from './authSlice';
import {
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
  clearDashboardCache
} from './adminDashboardSlice';
import {
  fetchBuilderStatsStart,
  fetchBuilderStatsSuccess,
  fetchBuilderStatsFailure,
  clearBuilderCache
} from './builderDashboardSlice';
import { toggleSidebar, setSidebarCollapsed } from './uiSlice';

// Auth Hook
export const useAuthRedux = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const handleLogin = useCallback((token, userData, role) => {
    try {
      dispatch(loginSuccess({ token, user: userData, role }));
      // Set token in API client headers
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    // Clear dashboard caches on logout
    dispatch(clearDashboardCache());
    dispatch(clearBuilderCache());
    // Remove token from headers
    delete apiClient.defaults.headers.common['Authorization'];
  }, [dispatch]);

  const checkAuthStatus = useCallback((token, user, role) => {
    if (token) {
      dispatch(setAuthStatus({ isAuthenticated: true, token, user, role }));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      dispatch(setAuthStatus({ isAuthenticated: false, token: null, user: null, role: null }));
    }
  }, [dispatch]);

  return {
    ...auth,
    handleLogin,
    handleLogout,
    checkAuthStatus,
  };
};

// Admin Dashboard Hook
export const useAdminDashboard = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector(state => state.adminDashboard);

  const fetchStats = useCallback(async (forceRefresh = false) => {
    // Check cache validity
    if (!forceRefresh && dashboard.lastUpdated) {
      const cacheAge = Date.now() - dashboard.lastUpdated;
      if (cacheAge < dashboard.cacheExpiryMs) {
        // Cache is still valid
        return dashboard;
      }
    }

    dispatch(fetchStatsStart());
    try {
      const [overviewRes, userRes, propertyRes, activityRes] = await Promise.all([
        apiClient.get('/api/admin/stats/overview'),
        apiClient.get('/api/admin/stats/users'),
        apiClient.get('/api/admin/stats/properties'),
        apiClient.get('/api/admin/activity-logs?limit=10'),
      ]);

      dispatch(fetchStatsSuccess({
        stats: overviewRes.data.data,
        userStats: userRes.data.data,
        propertyStats: propertyRes.data.data,
        recentActivity: activityRes.data.data || [],
      }));
    } catch (error) {
      dispatch(fetchStatsFailure(error.response?.data?.message || 'Failed to fetch stats'));
    }
  }, [dispatch, dashboard]);

  return {
    ...dashboard,
    fetchStats,
  };
};

// Builder Dashboard Hook
export const useBuilderDashboard = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector(state => state.builderDashboard);

  const fetchStats = useCallback(async (forceRefresh = false) => {
    // Check cache validity
    if (!forceRefresh && dashboard.lastUpdated) {
      const cacheAge = Date.now() - dashboard.lastUpdated;
      if (cacheAge < dashboard.cacheExpiryMs) {
        return dashboard;
      }
    }

    dispatch(fetchBuilderStatsStart());
    try {
      const [statsRes, enquiriesRes] = await Promise.all([
        apiClient.get('/api/appointments/builder/stats'),
        apiClient.get('/api/appointments/builder/enquiries'),
      ]);

      // Parse correct API response structure
      const stats = statsRes.data?.stats || statsRes.data?.data || null;
      const enquiries = enquiriesRes.data?.appointments || enquiriesRes.data?.data || [];

      dispatch(fetchBuilderStatsSuccess({
        stats,
        enquiries,
      }));
    } catch (error) {
      dispatch(fetchBuilderStatsFailure(error.response?.data?.message || 'Failed to fetch builder stats'));
    }
  }, [dispatch, dashboard]);

  return {
    ...dashboard,
    fetchStats,
  };
};

// UI Hook
export const useUIRedux = () => {
  const dispatch = useDispatch();
  const ui = useSelector(state => state.ui);

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  return {
    ...ui,
    toggleSidebar: handleToggleSidebar,
  };
};
