import { Box, Paper, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '../../constants/appConstants';

export const AuthLayout = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'grey.100',
      p: 2,
    }}
  >
    <Paper elevation={4} sx={{ p: 4, width: '100%', maxWidth: 420, borderRadius: 2 }}>
      <Typography variant="h5" align="center" fontWeight={700} color="primary" gutterBottom>
        {APP_NAME}
      </Typography>
      <Outlet />
    </Paper>
  </Box>
);
