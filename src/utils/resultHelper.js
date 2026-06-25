export const unwrapResult = (result) => {
  if (!result) throw new Error('No response from server');
  if (!result.isSuccess) {
    const validationMsg = result?.ValidationErrorMessage;
    const errorsMsg = result.errors?.join(', ');
    const warningMsg = result.message;

    const msg = validationMsg || errorsMsg || warningMsg || 'Error desconocido';
    const error = new Error(msg);
    error.errorCode = result.errorCode;
    error.errors = result.errors;
    error.status = result.status;
    error.isWarning = !validationMsg && !errorsMsg && Boolean(warningMsg);
    throw error;
  }
  return result.data;
};

export const isSuccess = (result) => result?.isSuccess === true;

export const getErrorMessage = (result) =>
  result?.message || result?.errors?.join(', ') || result?.ValidationErrorMessage || 'Error desconocido';

export const getResultStatus = (result) => result?.status;
