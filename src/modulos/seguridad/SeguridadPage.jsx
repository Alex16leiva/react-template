import { useEffect } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SideBarControl } from '../../components/SideBarControl';
import { MainContainerControl } from '../../components/MainContainerControl';

const MENU_ITEMS = [
  { label: 'Usuarios', path: '/seguridad/usuarios', icon: <PeopleIcon fontSize="small" /> },
  { label: 'Roles', path: '/seguridad/roles', icon: <AdminPanelSettingsIcon fontSize="small" /> },
  { label: 'Permisos', path: '/seguridad/permisos', icon: <LockIcon fontSize="small" /> },
];

const SeguridadPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/seguridad') {
      navigate('/seguridad/usuarios', { replace: true });
    }
  }, [pathname, navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBarControl title="Seguridad">
        <List disablePadding sx={{ p: 1 }}>
          {MENU_ITEMS.map((item) => (
            <ListItemButton
              key={item.path}
              selected={pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
            </ListItemButton>
          ))}
        </List>
      </SideBarControl>

      <MainContainerControl>
        <Outlet />
      </MainContainerControl>
    </Box>
  );
};

export default SeguridadPage;
