import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import apiService from '../services/api';
import './Login.css';

const Login = () => {
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_AUTH_LOADING', payload: true });

    try {
      const response = await apiService.login(formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: { username: response.username },
          token: response.token
        }
      });
      setFormData({ username: '', password: '' });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              disabled={state.authLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={state.authLoading}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={state.authLoading}
          >
            {state.authLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {state.authError && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {state.authError}
          </div>
        )}

        {state.authSuccess && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {state.authSuccess}
          </div>
        )}

        <div className="login-footer">
          <p>Test credentials: <strong>test / password</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
