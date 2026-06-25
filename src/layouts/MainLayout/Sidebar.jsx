import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, Toolbar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PANTALLAS } from '../../constants/appConstants';

const NavItem = ({ icon, label, path, matchPrefix = false }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selected = matchPrefix ? pathname.startsWith(path) : pathname === path;

  return (
    <ListItemButton
      selected={selected}
      onClick={() => navigate(path)}
      sx={{ borderRadius: 1, mx: 1, mb: 0.5 }}
    >
      {icon && <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>}
      <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14 }} />
    </ListItemButton>
  );
};

export const Sidebar = ({ open, drawerWidth }) => {
  const { canView: canViewSeguridad } = usePermissions(PANTALLAS.Seguridad);
  const { canView: canViewConfig } = usePermissions(PANTALLAS.CONFIGURACIONES);

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar />
      <List sx={{ pt: 1 }}>
        <NavItem icon={<DashboardIcon fontSize="small" />} label="Inicio" path="/" />
        <Divider sx={{ my: 1 }} />

        {canViewSeguridad && (
          <NavItem
            icon={<AdminPanelSettingsIcon fontSize="small" />}
            label="Seguridad"
            path="/seguridad"
            matchPrefix
          />
        )}

        {canViewConfig && (
          <>
            <Divider sx={{ my: 1 }} />
            <NavItem icon={<SettingsIcon fontSize="small" />} label="Configuraciones" path="/configuraciones" />
          </>
        )}
      </List>
    </Drawer>
  );
};
