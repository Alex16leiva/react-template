import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, MenuItem, TextField, Checkbox, Button, CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { DataGridControl } from '../../../components/DataGrid';
import { CommandBarControl } from '../../../components/CommandBarControl';
import { SecundayContainerControl } from '../../../components/MainContainerControl/SecundayContainerControl';
import { usePagination } from '../../../hooks/usePagination';
import { useNotification } from '../../../hooks/useNotification';
import { apiClient } from '../../../api/apiClient';

const PermisosManagement = () => {
  const [roles, setRoles] = useState([]);
  const [pantallas, setPantallas] = useState([]);
  const [selectedRolId, setSelectedRolId] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { notifySuccess, notifyApiError } = useNotification();
  const { pageIndex, pageSize, handlePageChange, handlePageSizeChange } = usePagination();

  const loadCatalogs = useCallback(async () => {
    try {
      const [r, p] = await Promise.all([
        apiClient.get('User/obtener-roles'),
        apiClient.get('User/obtener-pantalla'),
      ]);
      setRoles(r ?? []);
      setPantallas(p ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { loadCatalogs(); }, [loadCatalogs]);

  useEffect(() => {
    if (!selectedRolId) { setPermisos([]); return; }
    setLoading(true);
    const rol = roles.find((r) => r.rolId === selectedRolId);
    const existingPermisos = rol?.permisos ?? [];
    const matrix = pantallas.map((p) => {
      const found = existingPermisos.find((e) => e.pantallaId === p.pantallaId);
      return found ?? { rolId: selectedRolId, pantallaId: p.pantallaId, ver: false, editar: false, eliminar: false };
    });
    setPermisos(matrix);
    setLoading(false);
  }, [selectedRolId, roles, pantallas]);

  const toggle = (pantallaId, field) => {
    setPermisos((prev) =>
      prev.map((p) => {
        if (p.pantallaId !== pantallaId) return p;
        const updated = { ...p, [field]: !p[field] };
        if (field === 'ver' && !updated.ver) {
          updated.editar = false;
          updated.eliminar = false;
        }
        if ((field === 'editar' || field === 'eliminar') && updated[field]) {
          updated.ver = true;
        }
        return updated;
      })
    );
  };

  const handleSave = async () => {
    if (!selectedRolId) return;
    setSaving(true);
    try {
      await apiClient.post('User/edicion-permisos', { rolId: selectedRolId, permisos });
      notifySuccess('Permisos actualizados exitosamente');
      await loadCatalogs();
    } catch (err) {
      notifyApiError(err);
    } finally {
      setSaving(false);
    }
  };

  const getPantallaName = (id) => pantallas.find((p) => p.pantallaId === id)?.descripcion ?? id;

  const columns = [
    {
      field: 'pantallaId', headerName: 'Pantalla', flex: 1,
      renderCell: ({ value }) => getPantallaName(value),
    },
    {
      field: 'ver', headerName: 'Ver', width: 80, sortable: false, align: 'center', headerAlign: 'center',
      renderCell: ({ row }) => (
        <Checkbox size="small" checked={row.ver} disabled={false}
          onClick={(e) => { e.stopPropagation(); toggle(row.pantallaId, 'ver'); }} />
      ),
    },
    {
      field: 'editar', headerName: 'Editar', width: 80, sortable: false, align: 'center', headerAlign: 'center',
      renderCell: ({ row }) => (
        <Checkbox size="small" checked={row.editar} disabled={false}
          onClick={(e) => { e.stopPropagation(); toggle(row.pantallaId, 'editar'); }} />
      ),
    },
    {
      field: 'eliminar', headerName: 'Eliminar', width: 90, sortable: false, align: 'center', headerAlign: 'center',
      renderCell: ({ row }) => (
        <Checkbox size="small" checked={row.eliminar} disabled={false}
          onClick={(e) => { e.stopPropagation(); toggle(row.pantallaId, 'eliminar'); }} />
      ),
    },
  ];

  const commandItems = [
    {
      id: 'guardar',
      label: 'Guardar cambios',
      variant: 'text',
      icon: saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon fontSize="small" />,
      onClick: handleSave,
      disabled: !selectedRolId || saving,
      align: 'left',
    },
  ];

  return (
    <SecundayContainerControl sx={{ display: 'flex', flexDirection: 'column' }}>
      <CommandBarControl items={commandItems} />

      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Rol:</Typography>
        <TextField
          select size="small" sx={{ minWidth: 280 }}
          value={selectedRolId}
          onChange={(e) => setSelectedRolId(e.target.value)}
        >
          <MenuItem value="">-- Seleccionar rol --</MenuItem>
          {roles.map((r) => (
            <MenuItem key={r.rolId} value={r.rolId}>{r.descripcion}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, p: 2 }}>
        {!selectedRolId ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 1, color: 'text.disabled' }}>
            <LockOpenIcon sx={{ fontSize: 48 }} />
            <Typography variant="body2">Selecciona un rol para ver y editar sus permisos</Typography>
          </Box>
        ) : (
          <DataGridControl
            rows={permisos}
            columns={columns}
            totalItems={permisos.length}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
            getRowId={(r) => r.pantallaId}
            showToolbar={false}
            disableRowSelectionOnClick
            sx={{ height: '100%' }}
          />
        )}
      </Box>
    </SecundayContainerControl>
  );
};

export default PermisosManagement;
