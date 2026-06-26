import { Drawer, Box, Typography, Divider, IconButton, Tooltip, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSelector, useDispatch } from 'react-redux';
import { selectSidebarOpen, selectSidebarWidth, toggleSidebar, SIDEBAR_COLLAPSED_WIDTH } from '../../store/sidebarSlice';

export const SideBarControl = ({ title, items = [], activeId, onItemClick }) => {
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
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'space-between' : 'center',
        px: open ? 1.5 : 0,
        py: 0.5,
        minHeight: 36,
      }}>
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

      <List disablePadding sx={{ p: 1 }}>
        {items.map((item) => (
          <Tooltip key={item.id} title={open ? '' : item.label} placement="right">
            <ListItemButton
              selected={activeId === item.id}
              onClick={() => onItemClick?.(item.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                justifyContent: open ? 'flex-start' : 'center',
                px: open ? 1 : 0,
                minHeight: 40,
              }}
            >
              <ListItemIcon sx={{ minWidth: open ? 32 : 0, justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};
