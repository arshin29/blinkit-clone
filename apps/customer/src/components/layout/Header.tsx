import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  MapPin,
  ChevronDown,
  X,
  Clock,
  LogOut,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, subtotal } = useCart();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Sync search input with URL search param
  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchTerm(q);
  }, [searchParams]);

  // Debounce live typing on /products page
  useEffect(() => {
    if (location.pathname !== '/products') return;
    const urlQ = searchParams.get('search') || '';
    if (searchTerm === urlQ) return;

    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (searchTerm.trim()) {
        nextParams.set('search', searchTerm.trim());
      } else {
        nextParams.delete('search');
      }
      navigate(`/products?${nextParams.toString()}`, { replace: true });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, location.pathname, searchParams, navigate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (location.pathname === '/products') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('search');
      const qs = nextParams.toString();
      navigate(qs ? `/products?${qs}` : '/products');
    }
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    } else {
      navigate('/cart');
    }
  };

  return (
    <header className="header-sticky" id="customer-header">
      <div className="header-inner">
        {/* Left: Brand and Location */}
        <div className="header-left">
          <Link to="/" className="brand-logo" id="header-brand-logo">
            <span className="brand-name">
              blink<span className="brand-name-it">it</span>
            </span>
          </Link>

          <div className="delivery-badge-pill" title="Instant Grocery Delivery">
            <span className="delivery-time">
              <Clock size={16} strokeWidth={2.5} style={{ color: 'var(--color-brand-green)' }} />
              Delivery in 10 minutes
            </span>
            <span className="delivery-location">
              <MapPin size={12} style={{ color: 'var(--color-text-muted)' }} />
              Mumbai, Maharashtra, India
              <ChevronDown size={12} style={{ color: 'var(--color-text-muted)' }} />
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                id="header-search-input"
                className="search-input"
                placeholder="Search for products, brands and more"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="search-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Auth & Cart */}
        <div className="header-right">
          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="header-user-btn"
                id="header-user-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="user-avatar-badge">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '200px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: '0.5rem',
                    zIndex: 200,
                  }}
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                      {user.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/orders"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      borderRadius: '6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <ShoppingBag size={16} style={{ color: 'var(--color-brand-green)' }} />
                    My Orders
                  </Link>

                  <Link
                    to="/account"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      borderRadius: '6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <UserIcon size={16} style={{ color: 'var(--color-brand-green)' }} />
                    Account Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-danger)',
                      borderRadius: '6px',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-danger-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="header-login-btn" id="header-login-link">
              Login
            </Link>
          )}

          {/* Cart CTA Button */}
          <button
            type="button"
            className="header-cart-btn"
            id="header-cart-btn"
            onClick={handleCartClick}
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
            {totalItems > 0 ? (
              <div className="cart-btn-details">
                <span className="cart-btn-items">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                <span className="cart-btn-price">₹{Math.round(subtotal)}</span>
              </div>
            ) : (
              <span>My Cart</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
