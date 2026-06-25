export const required = (value, label = 'Campo') =>
  !value || String(value).trim() === '' ? `${label} es requerido` : null;

export const minLength = (value, min, label = 'Campo') =>
  value && value.length < min ? `${label} debe tener al menos ${min} caracteres` : null;

export const maxLength = (value, max, label = 'Campo') =>
  value && value.length > max ? `${label} no puede exceder ${max} caracteres` : null;

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Correo electrónico inválido';

export const validateForm = (rules) => {
  const errors = {};
  for (const [field, checks] of Object.entries(rules)) {
    for (const check of checks) {
      if (check) { errors[field] = check; break; }
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
