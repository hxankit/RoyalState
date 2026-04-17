import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authSlice';
import uiReducer from './uiSlice';
import adminDashboardReducer from './adminDashboardSlice';
import builderDashboardReducer from './builderDashboardSlice';

// Persist configuration for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user', 'role', 'isAuthenticated'],
};

// Persist configuration for UI
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['sidebarCollapsed'],
};

// Persist configuration for dashboards (cache strategy)
const dashboardPersistConfig = {
  key: 'adminDashboard',
  storage,
  whitelist: ['stats', 'userStats', 'propertyStats', 'recentActivity', 'lastUpdated'],
};

const builderDashboardPersistConfig = {
  key: 'builderDashboard',
  storage,
  whitelist: ['stats', 'enquiries', 'lastUpdated'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUiReducer = persistReducer(uiPersistConfig, uiReducer);
const persistedAdminDashboardReducer = persistReducer(dashboardPersistConfig, adminDashboardReducer);
const persistedBuilderDashboardReducer = persistReducer(builderDashboardPersistConfig, builderDashboardReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    ui: persistedUiReducer,
    adminDashboard: persistedAdminDashboardReducer,
    builderDashboard: persistedBuilderDashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
