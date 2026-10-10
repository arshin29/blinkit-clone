import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { QuantityStepper } from '../components/product/QuantityStepper';
import { EmptyState } from '../components/common/EmptyState';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, items, totalItems, subtotal, updateQuantity, removeItem, clearCart, isLoading, isMutating } = useCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdate = async (productId: string, newQty: number) => {
    setErrorMessage(null);
    try {
      await updateQuantity(productId, newQty);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (productId: string) => {
    setErrorMessage(null);
    try {
      await removeItem(productId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove item');
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      setErrorMessage(null);
      try {
        await clearCart();
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to clear cart');
      }
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="page-wrapper" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading your fresh cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <EmptyState
          icon={<ShoppingBag size={42} />}
          title="Your Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Explore thousands of grocery items delivered in 10 minutes!"
          actionText="Browse Groceries"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>
          My Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-brand-green)', fontSize: '0.85rem', fontWeight: 600 }}>
          <Clock size={15} /> Delivery in 10 minutes to your address
        </div>
      </div>

      {errorMessage && (
        <div className="alert-box alert-danger">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="cart-layout">
        {/* Left: Cart Items */}
        <div className="cart-items-card">
          <div className="cart-header-row">
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
              Items in Cart
            </span>
            <button
              type="button"
              className="cart-clear-btn"
              onClick={handleClear}
              disabled={isMutating}
            >
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>

          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item-row" id={`cart-item-${item.product.id}`}>
                <div className="cart-item-left">
                  <img
                    src={item.product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'}
                    alt={item.product.name}
                    className="cart-item-thumb"
                  />
                  <div className="cart-item-info">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="cart-item-name"
                    >
                      {item.product.name}
                    </Link>
                    <span className="cart-item-unit">{item.product.unit || 'Standard'}</span>
                    <span className="cart-item-unit-price">₹{Math.round(item.product.price)} each</span>
                  </div>
                </div>

                <div className="cart-item-right">
                  <QuantityStepper
                    quantity={item.quantity}
                    maxStock={item.product.stock}
                    onIncrease={() => handleUpdate(item.product.id, item.quantity + 1)}
                    onDecrease={() => handleUpdate(item.product.id, item.quantity - 1)}
                    disabled={isMutating}
                  />

                  <span className="cart-item-subtotal">₹{Math.round(item.subtotal)}</span>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.product.id)}
                    style={{ color: 'var(--color-text-muted)', padding: '4px' }}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bill Details Card */}
        <div className="cart-summary-card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Bill Details
          </h2>

          <div className="bill-row">
            <span>Items Subtotal</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>₹{Math.round(subtotal)}</span>
          </div>

          <div className="bill-row free-tag">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={14} /> Delivery Fee
            </span>
            <span>
              <s style={{ color: 'var(--color-text-muted)', marginRight: '4px' }}>₹25</s> FREE
            </span>
          </div>

          <div className="bill-row">
            <span>Handling Fee</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>₹0</span>
          </div>

          <div className="bill-divider" />

          <div className="bill-total-row">
            <span>Grand Total</span>
            <span style={{ color: 'var(--color-brand-green)' }}>₹{Math.round(subtotal)}</span>
          </div>

          <button
            type="button"
            className="checkout-cta-btn"
            id="proceed-to-checkout-btn"
            onClick={() => navigate('/checkout')}
            disabled={isMutating || items.length === 0}
          >
            <span>Proceed to Checkout</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>₹{Math.round(subtotal)}</span>
              <ArrowRight size={18} />
            </div>
          </button>

          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--color-brand-green)', flexShrink: 0 }} />
            <span>100% Safe and Secure Checkout with Cash on Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
