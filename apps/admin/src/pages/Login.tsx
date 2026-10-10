import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@blinkit.com');
  const [password, setPassword] = useState('Admin@123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setFormError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      success('Welcome back, Admin!');
      navigate('/', { replace: true });
    } catch (err: any) {
      setFormError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDevCredentials = () => {
    setEmail('admin@blinkit.com');
    setPassword('Admin@123');
    setFormError(null);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-badge">b</div>
          <h2 className="login-title">Blinkit Admin Portal</h2>
          <p className="login-subtitle">Sign in to manage inventory, categories & live orders</p>
        </div>

        <div className="login-hint-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <strong>Development Credentials:</strong>
            <button
              type="button"
              onClick={fillDevCredentials}
              style={{
                background: 'none',
                border: 'none',
                color: '#854d0e',
                fontSize: '11px',
                fontWeight: 700,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Fill Credentials
            </button>
          </div>
          <div>Email: <code>admin@blinkit.com</code></div>
          <div>Password: <code>Admin@123</code></div>
        </div>

        {(formError || authError) && (
          <div className="error-banner" style={{ fontSize: '13px', padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{formError || authError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                id="email"
                type="email"
                className="form-control"
                style={{ paddingLeft: '38px' }}
                placeholder="admin@blinkit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                id="password"
                type="password"
                className="form-control"
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '44px', fontSize: '15px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Shield size={14} color="var(--color-brand-green)" />
          <span>Secured Admin Session • 10-Minute Dark Store System</span>
        </div>
      </div>
    </div>
  );
};
