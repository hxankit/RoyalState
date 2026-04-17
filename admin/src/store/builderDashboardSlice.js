import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  enquiries: [],
  loading: false,
  error: null,
  lastUpdated: null,
  cacheExpiryMs: 3 * 60 * 1000, // 3 minutes cache expiry
};

const builderDashboardSlice = createSlice({
  name: 'builderDashboard',
  initialState,
  reducers: {
    fetchBuilderStatsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBuilderStatsSuccess: (state, action) => {
      const { stats, enquiries } = action.payload;
      state.stats = stats;
      state.enquiries = enquiries;
      state.loading = false;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    fetchBuilderStatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateEnquiries: (state, action) => {
      state.enquiries = action.payload;
    },
    clearBuilderCache: (state) => {
      state.stats = null;
      state.enquiries = [];
      state.lastUpdated = null;
      state.error = null;
    },
  },
});

export const { 
  fetchBuilderStatsStart, 
  fetchBuilderStatsSuccess, 
  fetchBuilderStatsFailure,
  updateEnquiries,
  clearBuilderCache
} = builderDashboardSlice.actions;

export default builderDashboardSlice.reducer;
