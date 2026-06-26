import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Accordion, AccordionSummary, AccordionDetails,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGridControl } from '../../components/DataGrid';
import { usePagination } from '../../hooks/usePagination';
import { usePermissions } from '../../hooks/usePermissions';
import { useNotification } from '../../hooks/useNotification';
import { apiClient } from '../../api/apiClient';
import { PANTALLAS } from '../../constants/appConstants';

const EMPTY_CONFIG = { configuracionId: '', descripcion: '' };
const EMPTY_DETALLE = { configuracionId: '', atributo: '', valor: '', descripcion: '' };

const DetalleForm = ({ open, detalle, configuracionId, onClose, onSaved }) => {
  const [form, setForm] = useState(EMPTY_DETALLE);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { notifySuccess, notifyApiError } = useNotification();
  const isNew = !detalle?.atributo;

  useEffect(() => {
    setForm(detalle ? { ...detalle } : { ...EMPTY_DETALLE, configuracionId });
    setErrors({});
  }, [detalle, open, configuracionId]);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.atributo?.trim()) e.atributo = 'Requerido';
    if (!form.valor?.trim()) e.valor = 'Requerido';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const endpoint = isNew ? 'Configuraciones/crear-configuracion-detalle' : 'Configuraciones/editar-configuracion-detalle';
      await apiClient.post(endpoint, { configuracionDetalle: form });
      notifySuccess('Detalle guardado exitosamente');
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
      <DialogTitle>{isNew ? 'Nuevo Detalle' : 'Editar Detalle'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField label="Atributo" fullWidth size="small" value={form.atributo} onChange={set('atributo')}
              error={Boolean(errors.atributo)} helperText={errors.atributo} disabled={!isNew} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Valor" fullWidth size="small" value={form.valor} onChange={set('valor')}
              error={Boolean(errors.valor)} helperText={errors.valor} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Descripción" fullWidth size="small" value={form.descripcion} onChange={set('descripcion')} />
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

const ConfiguracionesManagement = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [configFormOpen, setConfigFormOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [detalleForm, setDetalleForm] = useState({ open: false, detalle: null, configuracionId: '' });
  const [formData, setFormData] = useState(EMPTY_CONFIG);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { canEdit } = usePermissions(PANTALLAS.CONFIGURACIONES);
  const { notifySuccess, notifyApiError } = useNotification();
  const { queryInfo, totalItems, pageIndex, pageSize, applySearchResult, handlePageChange, handlePageSizeChange } =
    usePagination();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.post('Configuraciones/obtener-configuraciones', { queryInfo });
      setRows(applySearchResult(data));
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [queryInfo, applySearchResult]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setFormData(EMPTY_CONFIG); setFormErrors({}); setSelectedConfig(null); setConfigFormOpen(true); };
  const openEdit = (c) => { setFormData({ ...c }); setFormErrors({}); setSelectedConfig(c); setConfigFormOpen(true); };

  const validateConfig = () => {
    const e = {};
    if (!formData.configuracionId?.trim()) e.configuracionId = 'Requerido';
    if (!formData.descripcion?.trim()) e.descripcion = 'Requerido';
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  const handleSaveConfig = async () => {
    if (!validateConfig()) return;
    setSaving(true);
    try {
      const endpoint = !selectedConfig ? 'Configuraciones/crear-configuracion' : 'Configuraciones/editar-configuracion';
      await apiClient.post(endpoint, { configuracion: formData });
      notifySuccess(selectedConfig ? 'Configuración actualizada' : 'Configuración creada');
      setConfigFormOpen(false);
      load();
    } catch (err) {
      notifyApiError(err);
    } finally {
      setSaving(false);
    }
  };

  const openDetalleNew = (configuracionId) =>
    setDetalleForm({ open: true, detalle: null, configuracionId });

  const openDetalleEdit = (detalle) =>
    setDetalleForm({ open: true, detalle, configuracionId: detalle.configuracionId });

  const columns = [
    { field: 'configuracionId', headerName: 'ID', flex: 1 },
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
        <Typography variant="h5" fontWeight={700}>Configuraciones</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Recargar"><IconButton onClick={load}><RefreshIcon /></IconButton></Tooltip>
          {canEdit && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Nueva configuración</Button>
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
        loading={loading}
        getRowId={(r) => r.configuracionId}
      />

      {rows.filter((r) => r.configuracionesDetalle?.length > 0).map((config) => (
        <Accordion key={config.configuracionId} sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{config.configuracionId} — Detalles</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              {canEdit && (
                <Button size="small" startIcon={<AddIcon />} onClick={() => openDetalleNew(config.configuracionId)}>
                  Agregar detalle
                </Button>
              )}
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Atributo</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Descripción</TableCell>
                  {canEdit && <TableCell>Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {config.configuracionesDetalle.map((d) => (
                  <TableRow key={d.atributo} hover>
                    <TableCell>{d.atributo}</TableCell>
                    <TableCell>{d.valor}</TableCell>
                    <TableCell>{d.descripcion}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <IconButton size="small" onClick={() => openDetalleEdit(d)}><EditIcon fontSize="small" /></IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog open={configFormOpen} onClose={() => setConfigFormOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{selectedConfig ? 'Editar Configuración' : 'Nueva Configuración'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="ID Configuración" fullWidth size="small"
                value={formData.configuracionId}
                onChange={(e) => setFormData((p) => ({ ...p, configuracionId: e.target.value }))}
                error={Boolean(formErrors.configuracionId)} helperText={formErrors.configuracionId}
                disabled={Boolean(selectedConfig)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción" fullWidth size="small"
                value={formData.descripcion}
                onChange={(e) => setFormData((p) => ({ ...p, descripcion: e.target.value }))}
                error={Boolean(formErrors.descripcion)} helperText={formErrors.descripcion}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigFormOpen(false)} variant="outlined">Cancelar</Button>
          <Button onClick={handleSaveConfig} variant="contained" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <DetalleForm
        open={detalleForm.open}
        detalle={detalleForm.detalle}
        configuracionId={detalleForm.configuracionId}
        onClose={() => setDetalleForm((p) => ({ ...p, open: false }))}
        onSaved={load}
      />
    </Box>
  );
};

export default ConfiguracionesManagement;
