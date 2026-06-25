import { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { DataGridControl } from '../DataGrid';
import { usePagination } from '../../hooks/usePagination';

export const SearchModal = ({
  open,
  onClose,
  onSelect,
  title = 'Buscar',
  columns = [],
  fetchData, // async (queryInfo) => SearchResult<T>
  getRowId,
  searchPlaceholder = 'Buscar...',
}) => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { queryInfo, totalItems, applySearchResult, handlePageChange, handlePageSizeChange, pageIndex, pageSize } =
    usePagination(10);

  const load = useCallback(async () => {
    if (!fetchData) return;
    setLoading(true);
    try {
      const qi = { ...queryInfo, predicate: search || null };
      const result = await fetchData(qi);
      setRows(applySearchResult(result));
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [fetchData, queryInfo, search, applySearchResult]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') load();
  };

  const handleRowDoubleClick = ({ row }) => {
    onSelect(row);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          size="small"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={load}><SearchIcon /></IconButton>
              </InputAdornment>
            ),
          }}
        />
        <DataGridControl
          rows={rows}
          columns={columns}
          totalItems={totalItems}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={loading}
          getRowId={getRowId}
          onRowDoubleClick={handleRowDoubleClick}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};
