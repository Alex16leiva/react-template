import {
  AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Divider, Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectUser } from '../../store/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME } from '../../constants/appConstants';

// Mapea el prefijo de la ruta al nombre de la pantalla mostrado en el NavBar
const SCREEN_TITLES = [
  { path: '/seguridad', label: 'Seguridad' },
  { path: '/configuraciones', label: 'Configuraciones' },
];

const getScreenTitle = (pathname) =>
  SCREEN_TITLES.find(({ path }) => pathname.startsWith(path))?.label ?? '';

export const NavBar = ({ drawerWidth, onMenuToggle }) => {
  const user = useSelector(selectUser);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const screenTitle = getScreenTitle(pathname);

  const initials = user
    ? `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase()
    : '';

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, width: '100%' }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuToggle} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          onClick={() => navigate('/')}
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { opacity: 0.85 },
          }}
        >
          {APP_NAME}
          {screenTitle && (
            <Typography component="span" variant="h6" sx={{ fontWeight: 400, opacity: 0.85 }}>
              {' / '}{screenTitle}
            </Typography>
          )}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            {user?.nombre} {user?.apellido}
          </Typography>

          <Tooltip title="Mi cuenta">
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14 }}>
                {initials || <AccountCircleIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                {user?.usuarioId}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); logout(); }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
