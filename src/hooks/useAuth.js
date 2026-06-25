import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, selectUser, selectPermisos, loginSuccess, logout } from '../store/authSlice';
import { authApi } from '../api/authApi';
import { useNotification } from './useNotification';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifyError } = useNotification();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const permisos = useSelector(selectPermisos);

  const login = async ({ usuarioId, password }) => {
    const data = await authApi.login({ usuarioId, password }); // throws on error
    dispatch(loginSuccess(data));
    navigate('/');
    return data;
  };

  const logoutUser = () => {
    authApi.logout();
    dispatch(logout());
    navigate('/login');
  };

  const hasPermission = (pantallaId, accion = 'ver') => {
    const permiso = permisos?.find((p) => p.pantallaId === pantallaId);
    return permiso ? permiso[accion] === true : false;
  };

  return { isAuthenticated, user, permisos, login, logout: logoutUser, hasPermission };

};
