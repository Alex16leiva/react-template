import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import { usePermissions } from '../../hooks/usePermissions';
import { PANTALLAS } from '../../constants/appConstants';

const QuickAccessCard = ({ icon, label, path, visible }) => {
  const navigate = useNavigate();
  if (!visible) return null;
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card elevation={2}>
        <CardActionArea onClick={() => navigate(path)} sx={{ p: 2 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
            <Typography variant="subtitle1" fontWeight={600}>{label}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

const Home = () => {
  const user = useSelector(selectUser);
  const { canView: canViewUsuarios } = usePermissions(PANTALLAS.Seguridad);
  const { canView: canViewConfig } = usePermissions(PANTALLAS.CONFIGURACIONES);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Bienvenido, {user?.nombre}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Selecciona una opción del menú o accede rápidamente desde aquí.
      </Typography>

      <Grid container spacing={3}>
        <QuickAccessCard
          icon={<SecurityIcon sx={{ fontSize: 48 }} />}
          label="Usuarios"
          path="/seguridad"
          visible={canViewUsuarios}
        />
        <QuickAccessCard
          icon={<SettingsIcon sx={{ fontSize: 48 }} />}
          label="Configuraciones"
          path="/configuraciones"
          visible={canViewConfig}
        />
      </Grid>
    </Box>
  );
};

export default Home;
