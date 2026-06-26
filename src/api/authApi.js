import { apiClient } from './apiClient';
import { authStorage } from '../utils/authStorage';

export const authApi = {
  login: async ({ usuarioId, password }) => {
    const data = await apiClient.postPublic('User/login', { usuarioId, password });
    authStorage.saveTokens({ token: data.token, refreshToken: data.refreshToken, usuarioId: data.usuarioId });
    authStorage.saveUserProfile(data);
    return data;
  },

  logout: () => {
    authStorage.clearAll();
  },
};
