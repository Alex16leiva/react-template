import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { NavBar } from './NavBar';
import { Sidebar } from './Sidebar';

const DRAWER_WIDTH = 240;

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <NavBar
        drawerWidth={DRAWER_WIDTH}
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <Sidebar open={sidebarOpen} drawerWidth={DRAWER_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : 0}px)` },
          transition: 'width 0.2s',
          bgcolor: 'grey.50',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
