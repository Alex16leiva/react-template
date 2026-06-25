import { useSelector } from 'react-redux';
import { selectPermiso } from '../store/authSlice';

export const usePermissions = (pantallaId) => {
  const permiso = useSelector(selectPermiso(pantallaId));

  return {
    canView: permiso?.ver === true,
    canEdit: permiso?.editar === true,
    canDelete: permiso?.eliminar === true,
    permiso,
  };
};
