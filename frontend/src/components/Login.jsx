import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './UI/Button';
import Input from './UI/Input';
import Message from './UI/Message';
import Card from './UI/Card';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [errors, setErrors] = useState({});

  const { dispatch } = useAppContext();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env}http://backend:4000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        setMessageType('success');
        
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update context
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: data.user, 
            token: data.token 
          } 
        });
      } else {
        setMessage(data.error || 'Login failed');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" padding="large">
        <div className="login-header">
          <h1 className="login-title">Item Manager</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {message && (
          <Message 
            type={messageType} 
            onClose={() => setMessage('')}
          >
            {message}
          </Message>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            error={errors.username}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            error={errors.password}
            required
          />

          <Button 
            type="submit" 
            variant="primary" 
            size="large"
            loading={loading}
            className="login-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="login-footer">
          <p>Demo credentials: <strong>test</strong> / <strong>test</strong></p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
