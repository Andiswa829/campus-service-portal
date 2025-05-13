import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    try {
      await login(email, password);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      setError('Invalid email or password'); // Set error message
    }
  };

  const handleResetPassword = async () => {
    setResetMessage(''); // Clear any previous message
    setError(''); // Clear any previous error

    try {
      const apiUrl = 'https://localhost:7158/api/User/reset-password';
      const payload = {
        email: email,
        newPassword: 'testreset', // Default reset password
      };

      await axios.post(apiUrl, payload);
      setResetMessage('Password reset successfully. Please check your email.');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("/assets/campus-background.jpg")', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography
                color="error"
                variant="body2"
                align="center"
                sx={{ marginTop: 1 }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Login
            </Button>
            <Button
              variant="text"
              color="secondary"
              fullWidth
              sx={{ marginTop: 2 }}
              // onClick={handleResetPassword}
            >
              Reset Password
            </Button>
            {resetMessage && (
              <Typography
                color="success"
                variant="body2"
                align="center"
                sx={{ marginTop: 1 }}
              >
                {resetMessage}
              </Typography>
            )}
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;