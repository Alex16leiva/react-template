import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { initApiClient } from './api/apiClient';
import { App } from './App';
import './styles/global.css';

// Wire the Redux store into the API client (avoids circular imports)
initApiClient(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
