import { Box, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', pt: 8 }}>
      <LockIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
      <Typography variant="h4" fontWeight={700} gutterBottom>Acceso denegado</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        No tienes permisos para acceder a esta pantalla.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Volver al inicio</Button>
    </Box>
  );
};

export default Unauthorized;
