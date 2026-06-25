import { STORAGE_KEYS } from '../constants/appConstants';

const { ACCESS_TOKEN, REFRESH_TOKEN, USUARIO_ID, REQUEST_USER_INFO, USER_PROFILE } = STORAGE_KEYS;

export const authStorage = {
  getAccessToken: () => sessionStorage.getItem(ACCESS_TOKEN) || '',
  getRefreshToken: () => sessionStorage.getItem(REFRESH_TOKEN) || '',
  getUsuarioId: () => sessionStorage.getItem(USUARIO_ID) || '',

  getRequestUserInfo: () => {
    try {
      const raw = sessionStorage.getItem(REQUEST_USER_INFO);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveTokens: ({ token, refreshToken, usuarioId }) => {
    if (token) sessionStorage.setItem(ACCESS_TOKEN, token);
    if (refreshToken) sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
    if (usuarioId) {
      sessionStorage.setItem(USUARIO_ID, usuarioId);
      sessionStorage.setItem(REQUEST_USER_INFO, JSON.stringify({ usuarioId }));
    }
  },

  saveUserProfile: (user) => localStorage.setItem(USER_PROFILE, JSON.stringify(user)),

  getUserProfile: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_PROFILE));
    } catch {
      return null;
    }
  },

  clearAll: () => {
    [ACCESS_TOKEN, REFRESH_TOKEN, USUARIO_ID, REQUEST_USER_INFO].forEach((k) =>
      sessionStorage.removeItem(k)
    );
    localStorage.removeItem(USER_PROFILE);
  },

  isAuthenticated: () => Boolean(sessionStorage.getItem(ACCESS_TOKEN)),
};
