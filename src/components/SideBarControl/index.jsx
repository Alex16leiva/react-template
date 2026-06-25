import { Drawer, Box, Typography, Divider, IconButton, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSelector, useDispatch } from 'react-redux';
import { selectSidebarOpen, selectSidebarWidth, toggleSidebar, SIDEBAR_COLLAPSED_WIDTH } from '../../store/sidebarSlice';

export const SideBarControl = ({ title, children }) => {
  const dispatch = useDispatch();
  const open = useSelector(selectSidebarOpen);
  const width = useSelector(selectSidebarWidth);

  const currentWidth = open ? width : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        '& .MuiDrawer-paper': {
          position: 'relative',
          width: currentWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          transition: 'width 0.2s ease',
        },
      }}
    >
      {/* Header: título + botón toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 1.5 : 0,
          py: 0.5,
          minHeight: 36,
        }}
      >
        {open && title && (
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color="text.secondary"
            sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.8, whiteSpace: 'nowrap' }}
          >
            {title}
          </Typography>
        )}
        <Tooltip title={open ? 'Ocultar panel' : 'Mostrar panel'} placement="right">
          <IconButton size="small" onClick={() => dispatch(toggleSidebar())}>
            {open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Contenido visible solo cuando está abierto */}
      <Box sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.15s ease', overflow: 'hidden' }}>
        {children}
      </Box>
    </Drawer>
  );
};
