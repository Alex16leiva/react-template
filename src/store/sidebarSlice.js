import { createSlice } from '@reduxjs/toolkit';

export const SIDEBAR_COLLAPSED_WIDTH = 44;

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    open: true,
    width: 220,
  },
  reducers: {
    toggleSidebar(state) {
      state.open = !state.open;
    },
    setSidebarOpen(state, { payload }) {
      state.open = payload;
    },
    setSidebarWidth(state, { payload }) {
      state.width = payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setSidebarWidth } = sidebarSlice.actions;
export default sidebarSlice.reducer;

export const selectSidebarOpen = (state) => state.sidebar.open;
export const selectSidebarWidth = (state) => state.sidebar.width;
