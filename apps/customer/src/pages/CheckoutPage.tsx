import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Banknote,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  User as UserIcon,
  CreditCard,
  Smartphone,
  Circle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { PaymentMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, items, totalItems, subtotal, fetchCart } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState(
    'Flat 402, Sea Breeze Apartments, Bandra West, Mumbai, Maharashtra - 400050'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If cart is empty and not loading, redirect back to cart
  useEffect(() => {
    if (cart && items.length === 0 && !isPlacingOrder) {
      navigate('/cart');
    }
  }, [cart, items.length, navigate, isPlacingOrder]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setErrorMessage('Please enter a delivery address');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);
    setErrorMessage(null);

    try {
      const order = await api.orders.create({
        paymentMethod: paymentMethod,
        deliveryAddress: deliveryAddress.trim(),
      });

      // Clear or refresh cart after order creation
      await fetchCart();

      // Redirect to order success page
      navigate(`/order-success/${order.id}`);
    } catch (err: any) {
      console.error('Failed to place order:', err);
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Link
        to="/cart"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          marginBottom: '1rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Checkout & Payment
      </h1>

      {errorMessage && (
        <div className="alert-box alert-danger">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="checkout-grid">
          {/* Left Column: Delivery & Payment Details */}
          <div>
            {/* Delivery Contact Info */}
            <div className="checkout-section-card">
              <h2 className="checkout-section-title">
                <UserIcon size={18} style={{ color: 'var(--color-brand-green)' }} />
                Customer Contact Details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={user?.name || ''}
                    readOnly
                    style={{ backgroundColor: 'var(--color-bg-subtle)' }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={user?.phone || 'Not provided'}
                    readOnly
                    style={{ backgroundColor: 'var(--color-bg-subtle)' }}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="checkout-section-card">
              <h2 className="checkout-section-title">
                <MapPin size={18} style={{ color: 'var(--color-brand-green)' }} />
                Delivery Address
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                Our delivery partner will bring your order directly to this address.
              </p>
              <div className="form-group" style={{ margin: 0 }}>
                <textarea
                  id="checkout-delivery-address"
                  className="form-textarea"
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House / Flat No., Apartment Name, Street, Landmark, City, Pincode"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section-card">
              <h2 className="checkout-section-title">
                <Banknote size={18} style={{ color: 'var(--color-brand-green)' }} />
                Payment Method
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  className={`payment-method-tile ${paymentMethod === 'COD' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '1rem',
                    border: paymentMethod === 'COD' ? '2px solid var(--color-brand-green)' : '1px solid var(--color-border-subtle)',
                    borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--color-bg-base)'
                  }}
                >
                  <div style={{ marginRight: '1rem', color: paymentMethod === 'COD' ? 'var(--color-brand-green)' : 'var(--color-text-muted)' }}>
                    <Banknote size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>Cash on Delivery (COD)</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Pay with cash or UPI directly to the rider.</p>
                  </div>
                  {paymentMethod === 'COD' ? <CheckCircle size={22} style={{ color: 'var(--color-brand-green)' }} /> : <Circle size={22} style={{ color: 'var(--color-border-subtle)' }} />}
                </div>

                <div
                  className={`payment-method-tile ${paymentMethod === 'UPI' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '1rem',
                    border: paymentMethod === 'UPI' ? '2px solid var(--color-brand-green)' : '1px solid var(--color-border-subtle)',
                    borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--color-bg-base)'
                  }}
                >
                  <div style={{ marginRight: '1rem', color: paymentMethod === 'UPI' ? 'var(--color-brand-green)' : 'var(--color-text-muted)' }}>
                    <Smartphone size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>UPI (GPay, PhonePe, Paytm)</strong>
                      <span style={{ backgroundColor: 'var(--color-brand-green)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>RECOMMENDED</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Fast & secure payment directly from your bank.</p>
                  </div>
                  {paymentMethod === 'UPI' ? <CheckCircle size={22} style={{ color: 'var(--color-brand-green)' }} /> : <Circle size={22} style={{ color: 'var(--color-border-subtle)' }} />}
                </div>

                <div
                  className={`payment-method-tile ${paymentMethod === 'CREDIT_CARD' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '1rem',
                    border: paymentMethod === 'CREDIT_CARD' ? '2px solid var(--color-brand-green)' : '1px solid var(--color-border-subtle)',
                    borderRadius: '8px', cursor: 'pointer', backgroundColor: 'var(--color-bg-base)'
                  }}
                >
                  <div style={{ marginRight: '1rem', color: paymentMethod === 'CREDIT_CARD' ? 'var(--color-brand-green)' : 'var(--color-text-muted)' }}>
                    <CreditCard size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--color-text-primary)', display: 'block', marginBottom: '0.2rem' }}>Credit / Debit Card</strong>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Visa, MasterCard, RuPay, and more.</p>
                  </div>
                  {paymentMethod === 'CREDIT_CARD' ? <CheckCircle size={22} style={{ color: 'var(--color-brand-green)' }} /> : <Circle size={22} style={{ color: 'var(--color-border-subtle)' }} />}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Confirmation */}
          <div>
            <div className="cart-summary-card">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                Order Summary ({totalItems} items)
              </h2>

              <div
                style={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  marginBottom: '1.25rem',
                  paddingRight: '4px',
                }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0',
                      borderBottom: '1px dashed var(--color-border-subtle)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', paddingRight: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-brand-green)', minWidth: '18px' }}>
                        {item.quantity}x
                      </span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product.name}
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>₹{Math.round(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="bill-row">
                <span>Items Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹{Math.round(subtotal)}</span>
              </div>

              <div className="bill-row free-tag">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sparkles size={14} /> Delivery Partner Fee
                </span>
                <span>FREE</span>
              </div>

              <div className="bill-divider" />

              <div className="bill-total-row">
                <span>To Pay</span>
                <span style={{ color: 'var(--color-brand-green)' }}>₹{Math.round(subtotal)}</span>
              </div>

              <button
                type="submit"
                className="checkout-cta-btn"
                id="place-order-btn"
                disabled={isPlacingOrder || items.length === 0}
              >
                <span>{isPlacingOrder ? 'Placing Order...' : `Place Order (${paymentMethod.replace('_', ' ')})`}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>₹{Math.round(subtotal)}</span>
                </div>
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                By placing this order, you agree to Blinkit's Terms of Service and Cancellation Policy.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
