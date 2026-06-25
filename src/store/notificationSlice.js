import { createSlice } from '@reduxjs/toolkit';

let nextId = 1;

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { items: [] },
  reducers: {
    addNotification(state, { payload }) {
      state.items.push({
        id: nextId++,
        severity: payload.severity ?? 'info',
        message: payload.message,
        autoHideDuration: payload.autoHideDuration ?? 4000,
      });
    },
    removeNotification(state, { payload }) {
      state.items = state.items.filter((n) => n.id !== payload);
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

export const selectNotifications = (state) => state.notification.items;
