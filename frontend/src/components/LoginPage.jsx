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
import LottieLoader from '../animations/LottieLoader';

// Light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F5F5DC',  // Beige
      paper: '#ffffff'     // White
    },
    text: {
      primary: '#333333',  // Dark text
      secondary: '#666666' // Gray text
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif'
  }
});

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/users/login`,
        { username, password },
        { withCredentials: true }
      );
      const loggedInUser = response.data.data.user;
      setUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
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
              InputProps={{ sx: { bgcolor: '#F5F5DC', color: 'text.primary' } }}
              InputLabelProps={{ sx: { fontFamily: 'Inter, sans-serif' } }}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{ sx: { bgcolor: '#F5F5DC', color: 'text.primary' } }}
              InputLabelProps={{ sx: { fontFamily: 'Inter, sans-serif' } }}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: '#E35336',
                  '&:hover': { bgcolor: '#c94328' },
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Logging In…' : 'Login'}
              </Button>
            </Box>

            {/* New user sign-up link */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Inter, sans-serif' }}>
                New here?{' '}
                <Link component={RouterLink} to="/register" sx={{ fontWeight: 600, color: '#E35336', fontFamily: 'Inter, sans-serif' }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      <LottieLoader open={loading} />
    </ThemeProvider>
  );
};

export default LoginPage;
