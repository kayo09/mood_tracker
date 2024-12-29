// LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({onLoginSuccess}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before submission
    setLoading(true); // Set loading state to true while waiting for response

    // Encode the login data as x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', email);  
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:8000/login/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Set the content type to x-www-form-urlencoded
        },
      });

      // If login is successful, handle the response
      const { access_token, user } = response.data;
      localStorage.setItem('access_token', access_token); // Save token to localStorage

      // Display user info or redirect to another page
      alert(`Welcome, ${user.name || user.email}!`);
      console.log('Access Token:', access_token);
      console.log('User:', user);

      onLoginSuccess(user);

      // Reset loading state after successful login
      setLoading(false);

    } catch (err) {
      setLoading(false); // Reset loading state after error

      if (err.response) {
        // Check if the error has a 'detail' field
        if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail); // Display error message from server
        } else {
          setError('An error occurred, please try again.');
        }
      } else {
        // Handle network or unexpected errors
        setError('Network error, please check your connection.');
        console.error('Error:', err); // Log error for debugging
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
