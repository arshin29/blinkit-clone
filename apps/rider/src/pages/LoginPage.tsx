import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bike, Lock, Mail, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('rider@blinkit.com');
  const [password, setPassword] = useState('Rider@123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // If already authenticated, redirect to /
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/orders';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      navigate('/orders', { replace: true });
    } catch (err: any) {
      setFormError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (role: 'rider' | 'customer' | 'admin') => {
    clearError();
    setFormError(null);
    if (role === 'rider') {
      setEmail('rider@blinkit.com');
      setPassword('Rider@123');
    } else if (role === 'customer') {
      setEmail('customer@blinkit.com');
      setPassword('Customer@123');
    } else if (role === 'admin') {
      setEmail('admin@blinkit.com');
      setPassword('Admin@123');
    }
  };

  const displayedError = formError || authError;

  return (
    <div className="rider-app-wrapper">
      <div className="rider-app-container justify-center p-6 bg-page">
        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center mb-8">
          <div
            style={{
              width: '72px',
              height: '72px',
              backgroundColor: 'var(--color-brand-yellow)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(248, 203, 0, 0.4)',
              marginBottom: '1rem',
            }}
          >
            <Bike size={40} color="#111827" />
          </div>

          <h1 className="font-display font-extrabold text-2xl text-primary flex items-center gap-1.5 justify-center">
            blink<span style={{ color: 'var(--color-brand-green)' }}>it</span>
            <span className="partner-tag ml-1">Delivery Partner</span>
          </h1>
          <p className="text-sm text-secondary mt-1">
            Deliver happiness in 10 minutes
          </p>
        </div>

        {/* Login Card */}
        <div className="rider-card p-6 shadow-lg">
          <h2 className="font-display font-bold text-lg text-primary mb-1">
            Partner Sign In
          </h2>
          <p className="text-xs text-muted mb-4">
            Only authorized delivery partners (RIDER role) can access.
          </p>

          {displayedError && (
            <div className="alert-error mb-4">
              <ShieldAlert size={18} className="shrink-0" />
              <span className="text-xs font-medium leading-relaxed">{displayedError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-secondary mb-1.5 block">
                Partner Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  className="text-muted"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rider@blinkit.com"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-secondary mb-1.5 block">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  className="text-muted"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-brand w-full mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="spinner spinner-sm" style={{ borderTopColor: '#111827' }} />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In as Partner</span>
                  <ArrowRight size={18} />
                </div>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-4 border-t border-subtle">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-2 text-center">
              Quick Test Credentials
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fillDemo('rider')}
                className="btn btn-secondary text-xs py-1.5 px-3 w-full justify-between"
                style={{ minHeight: '36px' }}
              >
                <span>Rider (Allowed)</span>
                <span className="font-mono text-[11px] text-muted">rider@blinkit.com</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('customer')}
                  className="btn btn-secondary text-[11px] py-1 px-2 flex-1 justify-center"
                  style={{ minHeight: '32px', borderColor: '#fed7aa', color: '#9a3412' }}
                  title="Test security: customer should be denied access"
                >
                  Fill Customer (Deny)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="btn btn-secondary text-[11px] py-1 px-2 flex-1 justify-center"
                  style={{ minHeight: '32px', borderColor: '#fed7aa', color: '#9a3412' }}
                  title="Test security: admin should be denied access"
                >
                  Fill Admin (Deny)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted mt-6 text-center">
          <AlertCircle size={14} />
          <span>Access strictly restricted to authenticated Blinkit riders.</span>
        </div>
      </div>
    </div>
  );
};
