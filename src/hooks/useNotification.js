import { useDispatch } from 'react-redux';
import { addNotification } from '../store/notificationSlice';
import { NOTIFICATION_SEVERITY } from '../constants/appConstants';

export const useNotification = () => {
  const dispatch = useDispatch();

  const notify = (message, severity = NOTIFICATION_SEVERITY.INFO, autoHideDuration = 4000) => {
    dispatch(addNotification({ message, severity, autoHideDuration }));
  };

  const notifyError = (message) => notify(message, NOTIFICATION_SEVERITY.ERROR, 6000);
  const notifyWarning = (message) => notify(message, NOTIFICATION_SEVERITY.WARNING);

  return {
    notifySuccess: (message) => notify(message, NOTIFICATION_SEVERITY.SUCCESS),
    notifyError,
    notifyWarning,
    notifyInfo: (message) => notify(message, NOTIFICATION_SEVERITY.INFO),
    notifyApiError: (err) =>
      err?.isWarning ? notifyWarning(err.message) : notifyError(err.message),
    notify,
  };
};
