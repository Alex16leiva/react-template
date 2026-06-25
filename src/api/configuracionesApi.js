import { apiClient } from './apiClient';
import { ENDPOINTS } from '../constants/apiUrls';
import { unwrapResult } from '../utils/resultHelper';

const { CONFIGURACIONES } = ENDPOINTS;

export const configuracionesApi = {
  obtenerConfiguraciones: async (queryInfo) => {
    const result = await apiClient.post(CONFIGURACIONES.OBTENER, { queryInfo });
    return unwrapResult(result); // SearchResult<ConfiguracionesDTO>
  },

  crearConfiguracion: async (configuracion) => {
    const result = await apiClient.post(CONFIGURACIONES.CREAR, { configuracion });
    return unwrapResult(result);
  },

  editarConfiguracion: async (configuracion) => {
    const result = await apiClient.post(CONFIGURACIONES.EDITAR, { configuracion });
    return unwrapResult(result);
  },

  crearConfiguracionDetalle: async (configuracionDetalle) => {
    const result = await apiClient.post(CONFIGURACIONES.CREAR_DETALLE, { configuracionDetalle });
    return unwrapResult(result);
  },

  editarConfiguracionDetalle: async (configuracionDetalle) => {
    const result = await apiClient.post(CONFIGURACIONES.EDITAR_DETALLE, { configuracionDetalle });
    return unwrapResult(result);
  },
};
