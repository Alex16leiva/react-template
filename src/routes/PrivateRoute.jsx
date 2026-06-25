import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectPermiso } from '../store/authSlice';

export const PrivateRoute = ({ pantallaId, accion = 'ver', redirectTo = '/login' }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const permiso = useSelector(pantallaId ? selectPermiso(pantallaId) : () => null);

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  if (pantallaId && (!permiso || !permiso[accion])) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
