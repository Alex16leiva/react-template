import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { selectNotifications, removeNotification } from '../../store/notificationSlice';

export const Notification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const current = notifications[0] ?? null;

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    if (current) dispatch(removeNotification(current.id));
  };

  if (!current) return null;

  return (
    <Snackbar
      key={current.id}
      open
      autoHideDuration={current.autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity={current.severity}
        variant="filled"
        onClose={handleClose}
        sx={{ width: '100%', minWidth: 300 }}
      >
        {current.message}
      </Alert>
    </Snackbar>
  );
};
