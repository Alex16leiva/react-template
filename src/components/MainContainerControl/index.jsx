import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSidebarOpen, selectSidebarWidth, SIDEBAR_COLLAPSED_WIDTH } from '../../store/sidebarSlice';

export const MainContainerControl = ({ children }) => {
  const open = useSelector(selectSidebarOpen);
  const width = useSelector(selectSidebarWidth);

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        transition: 'margin-left 0.2s ease',
        ml: `${open ? width : SIDEBAR_COLLAPSED_WIDTH}px`,
      }}
    >
      {children}
    </Box>
  );
};
