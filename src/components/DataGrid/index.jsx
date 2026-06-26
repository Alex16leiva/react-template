import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { Box } from '@mui/material';
import { PAGE_SIZE_OPTIONS } from '../../constants/appConstants';

export const DataGridControl = ({
  rows = [],
  columns = [],
  totalItems = 0,
  pageIndex = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  loading = false,
  getRowId,
  showToolbar = true,
  fileExcelName = 'excelFile',
  sx = {},
  ...props
}) => {
  const handleSortChange = (model) => {
    if (!onSortChange) return;
    if (model.length === 0) {
      onSortChange(null, true);
    } else {
      onSortChange(model[0].field, model[0].sort === 'asc');
    }
  };

  const CustomToolbar = () => (
        <GridToolbarContainer>
            <GridToolbarExport
                printOptions={{ disableToolbarButton: true }}
                csvOptions={{ fileName: fileExcelName, utf8WithBom: true, delimiter: ';' }}
            />
        </GridToolbarContainer>
    );

  return (
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={totalItems}
        paginationMode="server"
        sortingMode="server"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        paginationModel={{ page: pageIndex, pageSize }}
        onPaginationModelChange={(model) => {
          if (model.page !== pageIndex && onPageChange) onPageChange(model.page);
          if (model.pageSize !== pageSize && onPageSizeChange) onPageSizeChange(model.pageSize);
        }}
        slots={showToolbar ? { toolbar: CustomToolbar } : {}}
        onSortModelChange={handleSortChange}
        getRowId={getRowId}
        disableRowSelectionOnClick
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          '& .MuiDataGrid-columnHeader': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
          '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
          '& .MuiDataGrid-row:hover': { backgroundColor: 'action.hover' },
          ...sx,
        }}
        {...props}
      />
  );
};
