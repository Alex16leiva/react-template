import { useState } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import { MainContainerControl } from '../../components/MainContainerControl';
import { SideBarPageLayout } from '../../components/SideBarPageLayout';
import UserManagement from './usuarios/UserManagement';
import RoleManagement from './roles/RoleManagement';
import PermisosManagement from './permisos/PermisosManagement';

const MENU_ITEMS = [
  { id: 'usuario', label: 'Usuarios', icon: <PeopleIcon fontSize="small" />,            component: UserManagement },
  { id: 'rol',     label: 'Roles',    icon: <AdminPanelSettingsIcon fontSize="small" />, component: RoleManagement },
  { id: 'permiso', label: 'Permisos', icon: <LockIcon fontSize="small" />,               component: PermisosManagement },
];

const SeguridadPage = () => {
  const [activeId, setActiveId] = useState(MENU_ITEMS[0].id);
  const ActiveComponent = MENU_ITEMS.find((i) => i.id === activeId)?.component;

  return (
    <MainContainerControl>
      <SideBarPageLayout
        title="Seguridad"
        items={MENU_ITEMS}
        activeId={activeId}
        onItemClick={setActiveId}
      >
        {ActiveComponent && <ActiveComponent />}
      </SideBarPageLayout>
    </MainContainerControl>
  );
};

export default SeguridadPage;
