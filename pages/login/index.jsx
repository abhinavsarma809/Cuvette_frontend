import React, { useState } from 'react';
import { login } from '../services';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formError, setFormError] = useState({
    email: null,
    password: null,
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = false;
    const newFormError = {
      email: null,
      password: null,
    };

    // Validate email
    if (!formData.email || !formData.email.includes('@') || !formData.email.includes('.')) {
      newFormError.email = 'Invalid Email';
      errors = true;
    }

    // Validate password
    if (!formData.password) {
      newFormError.password = 'Password is required';
      errors = true;
    }

   
    setFormError(newFormError);

    if (errors) {
      return; 
    }

    try {
      setLoading(true);
      const response = await login(formData);

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('userName', response.name);
        localStorage.setItem('email', response.email);

        navigate('/', { state: { userName: response.name, email: response.email } });
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.MainContainer}>
      <img
        src="https://res.cloudinary.com/dy6uubcd1/image/upload/v1737622494/Screenshot_23-1-2025_141923_www.figma.com_fvjas1.jpg"
        className={styles.image1}
        alt="Background"
      />

      <div className={styles.container}>
        <div className={styles.login}>
          <button className={styles.signup}>
            Signup
          </button>
          <button className={styles.loging}>Login</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Join us Today!</h2>
          <input
            type="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {formError.email && (
            <p style={{ color: 'red' }} className={styles.error}>
              {formError.email}
            </p>
          )}
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {formError.password && (
            <p style={{ color: 'red' }} className={styles.error}>
              {formError.password}
            </p>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
          <p>
            Don't have an account?{' '}
            <span className={styles.signup} onClick={() => navigate('/register')}>
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
