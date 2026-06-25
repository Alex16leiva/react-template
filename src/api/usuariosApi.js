import { apiClient } from './apiClient';
import { ENDPOINTS } from '../constants/apiUrls';
import { unwrapResult } from '../utils/resultHelper';

const { SEGURIDAD } = ENDPOINTS;

export const usuariosApi = {
  // --- Usuarios ---
  obtenerUsuarios: async (queryInfo) => {
    const result = await apiClient.post(SEGURIDAD.OBTENER_USUARIOS, { queryInfo });
    return unwrapResult(result); // SearchResult<UsuarioDTO>
  },

  crearUsuario: async (usuario) => {
    const result = await apiClient.post(SEGURIDAD.CREAR_USUARIO, { usuario });
    return unwrapResult(result);
  },

  editarUsuario: async (usuario) => {
    const result = await apiClient.post(SEGURIDAD.EDITAR_USUARIO, { usuario });
    return unwrapResult(result);
  },

  // --- Roles ---
  obtenerRoles: async () => {
    const result = await apiClient.get(SEGURIDAD.OBTENER_ROLES);
    return unwrapResult(result);
  },

  crearRol: async (rol) => {
    const result = await apiClient.post(SEGURIDAD.CREAR_ROL, { rol });
    return unwrapResult(result);
  },

  editarRol: async (rol) => {
    const result = await apiClient.post(SEGURIDAD.EDITAR_ROL, { rol });
    return unwrapResult(result);
  },

  // --- Pantallas ---
  obtenerPantallas: async () => {
    const result = await apiClient.get(SEGURIDAD.OBTENER_PANTALLAS);
    return unwrapResult(result);
  },

  // --- Permisos ---
  editarPermisos: async (rolId, permisos) => {
    const result = await apiClient.post(SEGURIDAD.EDICION_PERMISOS, { rolId, permisos });
    return unwrapResult(result);
  },
};
