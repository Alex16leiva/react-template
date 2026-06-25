import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, MenuItem, TextField, Table, TableHead, TableRow,
  TableCell, TableBody, Checkbox, Button, Paper, CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { usePermissions } from '../../../hooks/usePermissions';
import { useNotification } from '../../../hooks/useNotification';
import { usuariosApi } from '../../../api/usuariosApi';
import { PANTALLAS } from '../../../constants/appConstants';

const PermisosManagement = () => {
  const [roles, setRoles] = useState([]);
  const [pantallas, setPantallas] = useState([]);
  const [selectedRolId, setSelectedRolId] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { canEdit } = usePermissions(PANTALLAS.PERMISOS);
  const { notifySuccess, notifyApiError } = useNotification();

  const loadCatalogs = useCallback(async () => {
    try {
      const [r, p] = await Promise.all([usuariosApi.obtenerRoles(), usuariosApi.obtenerPantallas()]);
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
    // Build full permission matrix from all pantallas
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
        // If disabling "ver", also disable the others
        if (field === 'ver' && !updated.ver) {
          updated.editar = false;
          updated.eliminar = false;
        }
        // If enabling editar/eliminar, ensure ver is also enabled
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
      await usuariosApi.editarPermisos(selectedRolId, permisos);
      notifySuccess('Permisos actualizados exitosamente');
      // Reload roles to reflect new permissions
      await loadCatalogs();
    } catch (err) {
      notifyApiError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Permisos por Rol</Typography>
        {canEdit && selectedRolId && (
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        )}
      </Box>

      <TextField
        select label="Seleccionar Rol" size="small" sx={{ minWidth: 250, mb: 3 }}
        value={selectedRolId} onChange={(e) => setSelectedRolId(e.target.value)}
      >
        <MenuItem value="">-- Seleccionar --</MenuItem>
        {roles.map((r) => <MenuItem key={r.rolId} value={r.rolId}>{r.descripcion}</MenuItem>)}
      </TextField>

      {loading && <CircularProgress />}

      {!loading && selectedRolId && (
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Pantalla</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Ver</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Editar</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pantallas.map((p) => {
                const perm = permisos.find((x) => x.pantallaId === p.pantallaId);
                if (!perm) return null;
                return (
                  <TableRow key={p.pantallaId} hover>
                    <TableCell>{p.descripcion}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        size="small"
                        checked={perm.ver}
                        onChange={() => toggle(p.pantallaId, 'ver')}
                        disabled={!canEdit}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        size="small"
                        checked={perm.editar}
                        onChange={() => toggle(p.pantallaId, 'editar')}
                        disabled={!canEdit}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        size="small"
                        checked={perm.eliminar}
                        onChange={() => toggle(p.pantallaId, 'eliminar')}
                        disabled={!canEdit}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default PermisosManagement;
