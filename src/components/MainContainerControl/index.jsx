import { Box } from '@mui/material';

export const MainContainerControl = ({ children, sx }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      ...sx,
    }}
  >
    {children}
  </Box>
);
