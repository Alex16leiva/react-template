import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import loadingReducer from './loadingSlice';
import notificationReducer from './notificationSlice';
import sidebarReducer from './sidebarSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    notification: notificationReducer,
    sidebar: sidebarReducer,
  },
});
