import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: { count: 0 },
  reducers: {
    showLoading(state) { state.count += 1; },
    hideLoading(state) { state.count = Math.max(0, state.count - 1); },
    resetLoading(state) { state.count = 0; },
  },
});

export const { showLoading, hideLoading, resetLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

export const selectIsLoading = (state) => state.loading.count > 0;
