import { Box } from '@mui/material';

export const MainContainerControl = ({ children, sx }) => (
  <Box
    sx={{
      height:'calc(100% - 70px)',
      overflow: 'hidden',
      ...sx,
    }}
  >
    {children}
  </Box>
);
