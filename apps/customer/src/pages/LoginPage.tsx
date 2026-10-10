import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from || '/';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('customer@blinkit.com');
    setPassword('Customer@123');
    setError(null);
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
            India's Last Minute App • 10-Minute Delivery
          </p>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Customer Login
        </h2>

        {error && (
          <div className="alert-box alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="customer-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="customer-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-password">Password</label>
            <input
              id="customer-password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            id="customer-login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In to Continue'}
          </button>
        </form>

        {/* Demo Account Quick Fill Button */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.85rem',
            backgroundColor: 'var(--color-brand-yellow-light)',
            border: '1px dashed var(--color-brand-yellow)',
            borderRadius: '10px',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-brand-yellow)' }}>
              ⚡ Quick Demo Account
            </span>
            <button
              type="button"
              onClick={fillDemoCustomer}
              style={{
                color: 'var(--color-brand-green)',
                fontWeight: 700,
                fontSize: '0.8rem',
                textDecoration: 'underline',
              }}
            >
              Fill Credentials
            </button>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            customer@blinkit.com / Customer@123
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            id="register-link"
            style={{ color: 'var(--color-brand-green)', fontWeight: 700 }}
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
