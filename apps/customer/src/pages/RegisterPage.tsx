import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });

      // Automatically logged in and token stored
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-logo-header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="brand-name" style={{ fontSize: '2.5rem' }}>
              blink<span className="brand-name-it">it</span>
            </span>
          </Link>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Create your Blinkit customer account
          </p>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Register as New Customer
        </h2>

        {error && (
          <div className="alert-box alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name *</label>
            <input
              id="register-name"
              type="text"
              className="form-input"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address *</label>
            <input
              id="register-email"
              type="email"
              className="form-input"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-phone">Phone Number (Optional)</label>
            <input
              id="register-phone"
              type="tel"
              className="form-input"
              placeholder="e.g. +91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password (Minimum 6 characters) *</label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            id="customer-register-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register & Start Shopping'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            id="login-link"
            style={{ color: 'var(--color-brand-green)', fontWeight: 700 }}
          >
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
