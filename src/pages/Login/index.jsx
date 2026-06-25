import { useState } from 'react';
import {
  TextField, Button, Box, Typography, InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';


const Login = () => {
  const { login } = useAuth();
  const { notifyApiError } = useNotification();

  const [form, setForm] = useState({ usuarioId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.usuarioId.trim()) e.usuarioId = 'El usuario es requerido';
    if (!form.password) e.password = 'La contraseña es requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ usuarioId: form.usuarioId.trim(), password: form.password });
    } catch (err) {
      notifyApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Ingresa tus credenciales para continuar
      </Typography>

      <TextField
        fullWidth
        name="usuarioId"
        label="Usuario"
        value={form.usuarioId}
        onChange={handleChange}
        error={Boolean(errors.usuarioId)}
        helperText={errors.usuarioId}
        margin="normal"
        autoFocus
        autoComplete="username"
      />

      <TextField
        fullWidth
        name="password"
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={form.password}
        onChange={handleChange}
        error={Boolean(errors.password)}
        helperText={errors.password}
        margin="normal"
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, mb: 1, py: 1.5 }}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </Box>
  );
};

export default Login;
