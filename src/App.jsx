import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppRoutes } from './routes/AppRoutes';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Notification } from './components/Notification';
import { logout } from './store/authSlice';

const theme = createTheme({
  palette: {
    primary: { main: '#1565C0' },
    secondary: { main: '#E65100' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
  },
});

// Listens for session expiry events dispatched by apiClient
const SessionWatcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleExpired = () => {
      dispatch(logout());
      navigate('/login', { replace: true });
    };
    window.addEventListener('app:session-expired', handleExpired);
    return () => window.removeEventListener('app:session-expired', handleExpired);
  }, [dispatch, navigate]);

  return null;
};

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <SessionWatcher />
      <LoadingOverlay />
      <Notification />
      <AppRoutes />
    </BrowserRouter>
  </ThemeProvider>
);
