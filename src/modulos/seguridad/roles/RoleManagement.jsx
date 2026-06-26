import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGridControl } from '../../../components/DataGrid';
import { usePagination } from '../../../hooks/usePagination';
import { usePermissions } from '../../../hooks/usePermissions';
import { useNotification } from '../../../hooks/useNotification';
import { apiClient } from '../../../api/apiClient';
import { PANTALLAS } from '../../../constants/appConstants';

const EMPTY_ROL = { rolId: '', descripcion: '' };

const RolForm = ({ open, rol, onClose, onSaved }) => {
  const [form, setForm] = useState(EMPTY_ROL);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { notifySuccess, notifyApiError } = useNotification();
  const isNew = !rol?.rolId;

  useEffect(() => {
    setForm(rol ? { ...rol } : EMPTY_ROL);
    setErrors({});
  }, [rol, open]);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.rolId?.trim()) e.rolId = 'Requerido';
    if (!form.descripcion?.trim()) e.descripcion = 'Requerido';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const endpoint = isNew ? 'User/crear-rol' : 'User/editar-rol';
      await apiClient.post(endpoint, { rol: form });
      notifySuccess(isNew ? 'Rol creado exitosamente' : 'Rol actualizado');
      onSaved();
      onClose();
    } catch (err) {
      notifyApiError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isNew ? 'Nuevo Rol' : 'Editar Rol'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="ID del Rol" fullWidth size="small"
              value={form.rolId} onChange={set('rolId')}
              error={Boolean(errors.rolId)} helperText={errors.rolId}
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción" fullWidth size="small"
              value={form.descripcion} onChange={set('descripcion')}
              error={Boolean(errors.descripcion)} helperText={errors.descripcion}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RoleManagement = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);
  const { canEdit } = usePermissions(PANTALLAS.ROLES);

  const {
    queryInfo, totalItems, pageIndex, pageSize,
    applySearchResult, handlePageChange, handlePageSizeChange, handleSortChange,
  } = usePagination();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('User/obtener-roles');
      setRows(data ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setSelectedRol(null); setFormOpen(true); };
  const openEdit = (rol) => { setSelectedRol(rol); setFormOpen(true); };

  const columns = [
    { field: 'rolId', headerName: 'ID', flex: 1 },
    { field: 'descripcion', headerName: 'Descripción', flex: 2 },
    {
      field: 'acciones', headerName: 'Acciones', width: 80, sortable: false,
      renderCell: ({ row }) => canEdit && (
        <Tooltip title="Editar">
          <IconButton size="small" onClick={() => openEdit(row)}><EditIcon fontSize="small" /></IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Roles</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Recargar"><IconButton onClick={load}><RefreshIcon /></IconButton></Tooltip>
          {canEdit && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Nuevo rol</Button>
          )}
        </Box>
      </Box>

      <DataGridControl
        rows={rows}
        columns={columns}
        totalItems={rows.length}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        loading={loading}
        getRowId={(r) => r.rolId}
      />

      <RolForm
        open={formOpen}
        rol={selectedRol}
        onClose={() => setFormOpen(false)}
        onSaved={load}
      />
    </Box>
  );
};

export default RoleManagement;
