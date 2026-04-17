import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: false, // Changed to false - will be set by ProtectedRoute
  user: null,
  token: null,
  role: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { token, user, role } = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.token = token;
      state.user = user;
      state.role = role;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      state.isLoading = false;
    },
    setAuthStatus: (state, action) => {
      const { isAuthenticated, user, token, role } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.user = user;
      state.token = token;
      state.role = role;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // Action to mark hydration complete
    setHydrationComplete: (state) => {
      state.isLoading = false;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  setAuthStatus, 
  setLoading,
  setHydrationComplete
} = authSlice.actions;
export default authSlice.reducer;
