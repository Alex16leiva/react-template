const getBaseUrl = () => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return 'https://localhost:7217/api/';
  if (host === '172.17.70.4') return 'https://172.17.70.4:7217/api/'; // QA
  return 'https://172.17.70.2:7217/api/'; // Production
};

export const BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  AUTH: {    
    REFRESH_TOKEN: 'User/refresh-token',
  },
  SEGURIDAD: {
    CREAR_USUARIO: 'User/crear-usuario',
    EDITAR_USUARIO: 'User/editar-usuario',
    OBTENER_USUARIOS: 'User/obtener-usuarios',
    OBTENER_ROLES: 'User/obtener-roles',
    CREAR_ROL: 'User/crear-rol',
    EDITAR_ROL: 'User/editar-rol',
    OBTENER_PANTALLAS: 'User/obtener-pantalla',
    EDICION_PERMISOS: 'User/edicion-permisos',
  },
  CONFIGURACIONES: {
    CREAR: 'Configuraciones/crear-configuracion',
    OBTENER: 'Configuraciones/obtener-configuraciones',
    CREAR_DETALLE: 'Configuraciones/crear-configuracion-detalle',
    EDITAR_DETALLE: 'Configuraciones/editar-configuracion-detalle',
    EDITAR: 'Configuraciones/editar-configuracion',
  },
};
