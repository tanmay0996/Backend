import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState(''); // or email, depending on your backend logic
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
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

      // Log the response to see what data is returned
      console.log('Login successful:', response.data);

      // Store the user data in localStorage
      // Adjust this based on your response structure; here we store response.data.data.user
      localStorage.setItem("currentUser", JSON.stringify(response.data.data.user));
      
      // Optionally, you might also want to store tokens if needed:
      // localStorage.setItem("accessToken", response.data.data.accessToken);
      // localStorage.setItem("refreshToken", response.data.data.refreshToken);
      
      // Navigate to a protected route (update the route as needed)
      navigate('/dashboard'); 
      
    } catch (err) {
      console.error('Login error:', err);
      // Handle errors – adjust based on your backend error structure
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username">Username or Email:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
