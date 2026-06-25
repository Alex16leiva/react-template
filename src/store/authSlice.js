import { createSlice } from '@reduxjs/toolkit';
import { authStorage } from '../utils/authStorage';

const storedProfile = authStorage.getUserProfile();

const initialState = {
  isAuthenticated: authStorage.isAuthenticated(),
  user: storedProfile ?? null,
  permisos: storedProfile?.permisos ?? [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, { payload }) {
      state.isAuthenticated = true;
      state.user = payload;
      state.permisos = payload.permisos ?? [];
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.permisos = [];
      authStorage.clearAll();
    },
    updatePermisos(state, { payload }) {
      state.permisos = payload;
    },
  },
});

export const { loginSuccess, logout, updatePermisos } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectPermisos = (state) => state.auth.permisos;
export const selectPermiso = (pantallaId) => (state) =>
  state.auth.permisos?.find((p) => p.pantallaId === pantallaId);
