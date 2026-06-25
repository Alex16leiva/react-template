import { apiClient } from './apiClient';
import { ENDPOINTS } from '../constants/apiUrls';
import { unwrapResult } from '../utils/resultHelper';
import { authStorage } from '../utils/authStorage';

export const authApi = {
  login: async ({ usuarioId, password }) => {
    const result = await apiClient.postPublic('User/login', { usuarioId, password });
    const data = unwrapResult(result); // throws on error
    authStorage.saveTokens({ token: data.token, refreshToken: data.refreshToken, usuarioId: data.usuarioId });
    authStorage.saveUserProfile(data);
    return data;
  },

  logout: () => {
    authStorage.clearAll();
  },
};
