import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { PANTALLAS } from '../constants/appConstants';

import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const SeguridadPage = lazy(() => import('../modulos/seguridad/SeguridadPage'));
const ConfiguracionesManagement = lazy(() => import('../modulos/configuraciones/ConfiguracionesManagement'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
    <CircularProgress />
  </Box>
);

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Seguridad — layout con menú lateral, redirige a /usuarios por defecto */}
          <Route element={<PrivateRoute pantallaId={PANTALLAS.Seguridad} />}>
            <Route path="/seguridad" element={<SeguridadPage />} />
          </Route>

          {/* Configuraciones */}
          <Route element={<PrivateRoute pantallaId={PANTALLAS.CONFIGURACIONES} />}>
            <Route path="/configuraciones" element={<ConfiguracionesManagement />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);
