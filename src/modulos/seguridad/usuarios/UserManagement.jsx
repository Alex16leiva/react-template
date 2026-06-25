import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, IconButton, Tooltip, Chip, Switch,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGridControl } from '../../../components/DataGrid';
import { usePagination } from '../../../hooks/usePagination';
import { usePermissions } from '../../../hooks/usePermissions';
import { useNotification } from '../../../hooks/useNotification';
import { usuariosApi } from '../../../api/usuariosApi';
import { PANTALLAS } from '../../../constants/appConstants';

const EMPTY_USER = {
  usuarioId: '', nombre: '', apellido: '', contrasena: '',
  rolId: '', activo: true, editarContrasena: false,
};

const UserForm = ({ open, user, roles, onClose, onSaved }) => {
  const [form, setForm] = useState(EMPTY_USER);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { notifySuccess, notifyApiError } = useNotification();
  const isNew = !user?.usuarioId;

  useEffect(() => {
    setForm(user ? { ...EMPTY_USER, ...user, contrasena: '' } : EMPTY_USER);
    setErrors({});
  }, [user, open]);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const setCheck = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.checked }));

  const validate = () => {
    const e = {};
    if (!form.usuarioId?.trim()) e.usuarioId = 'Requerido';
    if (!form.nombre?.trim()) e.nombre = 'Requerido';
    if (!form.apellido?.trim()) e.apellido = 'Requerido';
    if (isNew && !form.contrasena) e.contrasena = 'Requerido para nuevo usuario';
    if (!form.rolId) e.rolId = 'Requerido';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fn = isNew ? usuariosApi.crearUsuario : usuariosApi.editarUsuario;
      await fn(form);
      notifySuccess(isNew ? 'Usuario creado exitosamente' : 'Usuario actualizado');
      onSaved();
      onClose();
    } catch (err) {
      notifyApiError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isNew ? 'Nuevo Usuario' : 'Editar Usuario'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Usuario ID" fullWidth size="small"
              value={form.usuarioId} onChange={set('usuarioId')}
              error={Boolean(errors.usuarioId)} helperText={errors.usuarioId}
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select label="Rol" fullWidth size="small"
              value={form.rolId} onChange={set('rolId')}
              error={Boolean(errors.rolId)} helperText={errors.rolId}
            >
              {roles.map((r) => <MenuItem key={r.rolId} value={r.rolId}>{r.descripcion}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Nombre" fullWidth size="small" value={form.nombre} onChange={set('nombre')}
              error={Boolean(errors.nombre)} helperText={errors.nombre} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Apellido" fullWidth size="small" value={form.apellido} onChange={set('apellido')}
              error={Boolean(errors.apellido)} helperText={errors.apellido} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={isNew ? 'Contraseña' : 'Nueva contraseña (dejar vacío para no cambiar)'}
              fullWidth size="small" type="password"
              value={form.contrasena} onChange={set('contrasena')}
              error={Boolean(errors.contrasena)} helperText={errors.contrasena}
            />
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch checked={form.activo} onChange={setCheck('activo')} />
            <Typography variant="body2">Activo</Typography>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch checked={form.editarContrasena} onChange={setCheck('editarContrasena')} />
            <Typography variant="body2">Forzar cambio contraseña</Typography>
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

const UserManagement = () => {
  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { canEdit } = usePermissions(PANTALLAS.USUARIOS);

  const {
    queryInfo, totalItems, pageIndex, pageSize,
    applySearchResult, handlePageChange, handlePageSizeChange, handleSortChange,
  } = usePagination();

  const loadRoles = useCallback(async () => {
    try {
      const data = await usuariosApi.obtenerRoles();
      setRoles(data ?? []);
    } catch { /* ignore */ }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await usuariosApi.obtenerUsuarios(queryInfo);
      setRows(applySearchResult(result));
    } catch (err) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [queryInfo, applySearchResult]);

  useEffect(() => { loadRoles(); }, [loadRoles]);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setSelectedUser(null); setFormOpen(true); };
  const openEdit = (user) => { setSelectedUser(user); setFormOpen(true); };
  const getRoleName = (rolId) => roles.find((r) => r.rolId === rolId)?.descripcion ?? rolId;

  const columns = [
    { field: 'usuarioId', headerName: 'Usuario', flex: 1 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { field: 'rolId', headerName: 'Rol', flex: 1, renderCell: ({ value }) => getRoleName(value) },
    {
      field: 'activo', headerName: 'Activo', width: 90,
      renderCell: ({ value }) => (
        <Chip label={value ? 'Activo' : 'Inactivo'} size="small" color={value ? 'success' : 'default'} />
      ),
    },
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
        <Typography variant="h5" fontWeight={700}>Usuarios</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Recargar">
            <IconButton onClick={load}><RefreshIcon /></IconButton>
          </Tooltip>
          {canEdit && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
              Nuevo usuario
            </Button>
          )}
        </Box>
      </Box>

      <DataGridControl
        rows={rows}
        columns={columns}
        totalItems={totalItems}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        loading={loading}
        getRowId={(r) => r.usuarioId}
      />

      <UserForm
        open={formOpen}
        user={selectedUser}
        roles={roles}
        onClose={() => setFormOpen(false)}
        onSaved={load}
      />
    </Box>
  );
};

export default UserManagement;
