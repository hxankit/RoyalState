import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { setStore } from './services/apiClient';
import App from './App';
import './index.css';

// Provide store reference to apiClient
setStore(store);

// Mark hydration complete after persist rehydrates
persistor.subscribe(() => {
  const state = store.getState();
  // Hydration is complete when auth slice has data from storage
  if (state.auth && state.auth.token) {
    // Redux has hydrated with persisted data
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
