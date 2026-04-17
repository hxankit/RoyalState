import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Overview stats
  stats: null,
  userStats: null,
  propertyStats: null,
  recentActivity: [],
  
  // Loading states
  loading: false,
  error: null,
  
  // Caching
  lastUpdated: null,
  cacheExpiryMs: 5 * 60 * 1000, // 5 minutes cache expiry
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    fetchStatsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStatsSuccess: (state, action) => {
      const { stats, userStats, propertyStats, recentActivity } = action.payload;
      state.stats = stats;
      state.userStats = userStats;
      state.propertyStats = propertyStats;
      state.recentActivity = recentActivity;
      state.loading = false;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    fetchStatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearDashboardCache: (state) => {
      state.stats = null;
      state.userStats = null;
      state.propertyStats = null;
      state.recentActivity = [];
      state.lastUpdated = null;
      state.error = null;
    },
    setActivityLogs: (state, action) => {
      state.recentActivity = action.payload;
    },
  },
});

export const { 
  fetchStatsStart, 
  fetchStatsSuccess, 
  fetchStatsFailure, 
  clearDashboardCache,
  setActivityLogs
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;
