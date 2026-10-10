import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="page-wrapper" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>
          My Account
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Manage your personal details and quick grocery orders
        </p>
      </div>

      <div className="checkout-section-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-green)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {user.name}
            </h2>
            <span
              style={{
                display: 'inline-block',
                marginTop: '4px',
                padding: '2px 8px',
                backgroundColor: 'var(--color-brand-green-light)',
                color: 'var(--color-brand-green-dark)',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '4px',
              }}
            >
              {user.role}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
            <Mail size={18} style={{ color: 'var(--color-text-muted)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Email Address</div>
              <strong style={{ color: 'var(--color-text-primary)' }}>{user.email}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
            <Phone size={18} style={{ color: 'var(--color-text-muted)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Phone Number</div>
              <strong style={{ color: 'var(--color-text-primary)' }}>{user.phone || 'Not provided'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
        <Link
          to="/orders"
          className="checkout-section-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            padding: '1.25rem',
            margin: 0,
            transition: 'all var(--transition-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-brand-green-light)',
                color: 'var(--color-brand-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={20} />
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', fontSize: '1rem' }}>
                Your Orders
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Track active orders, view past invoices and deliveries
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-brand-green)' }}>
            View &rarr;
          </span>
        </Link>
      </div>

      {/* Logout Action */}
      <div>
        <button
          type="button"
          onClick={handleLogout}
          id="logout-btn"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.85rem',
            backgroundColor: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          <LogOut size={18} /> Log Out from Account
        </button>
      </div>
    </div>
  );
};
