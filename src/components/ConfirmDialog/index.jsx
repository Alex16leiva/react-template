import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas continuar?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmColor = 'error',
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <WarningAmberIcon color="warning" />
      {title}
    </DialogTitle>
    <DialogContent>
      <Typography>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined">{cancelLabel}</Button>
      <Button onClick={() => { onConfirm(); onClose(); }} variant="contained" color={confirmColor}>
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);
