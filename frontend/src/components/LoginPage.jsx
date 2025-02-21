// src/components/LoginPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';

const LoginPage = () => {
  const [username, setUsername] = useState(''); // or email, depending on your backend logic
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // clear previous errors

    try {
      // Make a POST request to your backend login endpoint.
      const response = await axios.post(
        'http://localhost:8000/api/v1/users/login',
        { username, password },
        {
          withCredentials: true, // ensures cookies (like tokens) are sent and received
        }
      );

      console.log('Login successful:', response.data);
      
      // Update the auth context with the logged-in user's details.
      const loggedInUser = response.data.data.user;
      setUser(loggedInUser);
      
      // Persist user data in localStorage so that the user remains logged in after a page refresh.
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      
      // Navigate to a protected route (update the route as needed)
      navigate('/'); 
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Username or Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
