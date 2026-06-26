import { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, InputAdornment, Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { DataGridControl } from '../DataGrid';
import { apiClient } from '../../api/apiClient';

/**
 * SearchModalControl
 *
 * Props:
 *   value          string mostrado en el campo de solo lectura
 *   onChange       (value, row) => void  — obligatorio
 *   columns        array de columnas del DataGrid  — obligatorio
 *   valueField     nombre del campo que actúa como ID y predicate  — obligatorio
 *   apiUrl         endpoint del backend
 *   title          título del modal (default "Buscar")
 *   placeholder    placeholder del campo de búsqueda
 *   pageSizeOptions array de opciones de tamaño de página
 *   isReadOnly     deshabilita la interacción
 */
export const SearchModalControl = ({
  value,
  onChange,
  columns,
  valueField,
  apiUrl,
  title = 'Buscar',
  placeholder = 'Buscar...',
  label,
  error = false,
  helperText,
  pageSizeOptions,
  isReadOnly = false,
}) => {
  const [open, setOpen]               = useState(false);
  const [rows, setRows]               = useState([]);
  const [totalItems, setTotalItems]   = useState(0);
  const [pageIndex, setPageIndex]     = useState(0);
  const [pageSize, setPageSize]       = useState(10);
  const [searchText, setSearchText]   = useState('');
  const [appliedSearch, setApplied]   = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading]         = useState(false);

  // Resetear cuando cambia la fuente de datos
  useEffect(() => {
    setRows([]);
    setTotalItems(0);
    setPageIndex(0);
    setSearchText('');
    setApplied('');
    setSelectedRow(null);
  }, [apiUrl, valueField]);

  const load = useCallback(async () => {
    if (!apiUrl || !open) return;
    setLoading(true);
    try {
      const data = await apiClient.post(apiUrl, {
        pageIndex,
        pageSize,
        sortFields: [],
        ascending: true,
        predicate: appliedSearch ? `${valueField}.Contains(@0)` : '',
        paramValues: appliedSearch ? [appliedSearch] : [],
      });
      setRows(data?.items ?? []);
      setTotalItems(data?.totalItems ?? 0);
    } catch {
      setRows([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, open, valueField, pageIndex, pageSize, appliedSearch]);

  useEffect(() => { load(); }, [load]);

  const handleOpen = () => {
    if (isReadOnly) return;
    setSelectedRow(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchText('');
    setApplied('');
    setPageIndex(0);
    setSelectedRow(null);
  };

  const handleSearch = () => {
    setPageIndex(0);
    setApplied(searchText);
  };

  const handleConfirm = (row) => {
    const target = row ?? selectedRow;
    if (!target) return;
    onChange?.(target[valueField], target);
    handleClose();
  };

  const selectionModel = selectedRow ? [selectedRow[valueField]] : [];

  return (
    <>
      <TextField
        value={value ?? ''}
        size="small"
        fullWidth
        label={label}
        error={error}
        helperText={helperText}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleOpen} disabled={isReadOnly} edge="end">
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        onClick={handleOpen}
        sx={{ cursor: isReadOnly ? 'default' : 'pointer' }}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          {title}
          <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            size="small"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ mb: 2 }}
            autoFocus
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleSearch}>
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ height: 400 }}>
            <DataGridControl
              rows={rows}
              columns={columns}
              totalItems={totalItems}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageChange={(page) => setPageIndex(page)}
              onPageSizeChange={(size) => { setPageSize(size); setPageIndex(0); }}
              loading={loading}
              getRowId={(r) => r[valueField]}
              rowSelectionModel={selectionModel}
              onRowClick={({ row }) => setSelectedRow(row)}
              onRowDoubleClick={({ row }) => handleConfirm(row)}
              disableRowSelectionOnClick={false}
              showToolbar={false}
              {...(pageSizeOptions ? { pageSizeOptions } : {})}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined">Cancelar</Button>
          <Button onClick={() => handleConfirm()} variant="contained" disabled={!selectedRow}>
            Seleccionar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
