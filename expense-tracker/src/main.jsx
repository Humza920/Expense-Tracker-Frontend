import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#020617',
            color: '#e5e7eb',
            borderRadius: '9999px',
            border: '1px solid rgba(148, 163, 184, 0.5)',
            padding: '10px 16px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#020617',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#020617',
            },
          },
        }}
      />
    </Provider>
  </StrictMode>,
);
