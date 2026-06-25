import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/authSlice';

export const PublicRoute = ({ redirectTo = '/' }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
};
