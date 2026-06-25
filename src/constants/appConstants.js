export const APP_NAME = 'React Template';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USUARIO_ID: 'usuarioId',
  REQUEST_USER_INFO: 'request_user_info',
  USER_PROFILE: 'user',
};

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

export const RESULT_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  APPLICATION_ERROR: 422,
  EXCEPTION: 500,
};

export const NOTIFICATION_SEVERITY = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// pantallas IDs must match backend seed data
export const PANTALLAS = {
  Seguridad: 'Seguridad',
  CONFIGURACIONES: 'Configuraciones',
};
