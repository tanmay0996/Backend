import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Tailwind‑inspired dark theme (gray‑900, gray‑800, text-white/gray-400)
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#111827',  // bg-gray-900
      paper: '#1f2937'     // bg-gray-800
    },
    text: {
      primary: '#ffffff',  // text-white
      secondary: '#9ca3af' // text-gray-400
    }
  }
});

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/users/login`,
        { username, password },
        { withCredentials: true }
      );
      const loggedInUser = response.data.data.user;
      setUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
              Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Username or Email"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              InputProps={{ sx: { bgcolor: 'background.default', color: 'text.primary' } }}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{ sx: { bgcolor: 'background.default', color: 'text.primary' } }}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={false}
                sx={{ bgcolor: 'purple.600', '&:hover': { bgcolor: 'purple.700' } }}
              >
                Login
              </Button>
            </Box>

            {/* New user sign-up link */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                New here?{' '}
                <Link component={RouterLink} to="/register" sx={{ fontWeight: 500 }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
