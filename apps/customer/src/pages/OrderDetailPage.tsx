import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Banknote,
  CheckCircle2,
  PackageCheck,
  Bike,
  Home,
  AlertOctagon,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { api } from '../lib/api';

const STATUS_FLOW: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'PLACED', label: 'Order Placed', icon: <ShoppingBag size={18} /> },
  { status: 'ASSIGNED', label: 'Rider Assigned', icon: <PackageCheck size={18} /> },
  { status: 'PICKED_UP', label: 'Order Picked Up', icon: <CheckCircle2 size={18} /> },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <Bike size={18} /> },
  { status: 'DELIVERED', label: 'Delivered', icon: <Home size={18} /> },
];

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (showRefreshIndicator = false) => {
    if (!id) return;
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await api.orders.getById(id);
      setOrder(data);
    } catch (err: any) {
      console.error('Failed to load order:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (isLoading && !order) {
    return (
      <div className="page-wrapper" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-wrapper" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Order Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          {error || "Could not find the requested order."}
        </p>
        <Link to="/orders" className="add-btn" style={{ display: 'inline-flex', padding: '0.65rem 1.5rem' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'CANCELLED';
  const currentStepIndex = STATUS_FLOW.findIndex((s) => s.status === order.status);

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="page-wrapper">
      <Link
        to="/orders"
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
        <ArrowLeft size={16} /> Back to All Orders
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              Order #{order.orderNumber}
            </h1>
            <span
              className={`status-badge ${order.status.toLowerCase()}`}
              id="order-current-status-badge"
            >
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Placed on {formattedDate}
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrder(true)}
          disabled={isRefreshing}
          id="refresh-order-status-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 1rem',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          {isRefreshing ? 'Checking Status...' : 'Refresh Status'}
        </button>
      </div>

      {/* Visual Status Tracker */}
      <div className="checkout-section-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
          Delivery Status
        </h2>

        {isCancelled ? (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-status-cancelled-bg)',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <AlertOctagon size={32} style={{ color: 'var(--color-status-cancelled)' }} />
            <div>
              <h3 style={{ margin: 0, color: 'var(--color-status-cancelled)', fontSize: '1.1rem', fontWeight: 800 }}>
                This Order Has Been CANCELLED
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f1d1d' }}>
                The order was cancelled by the store administrator. Any paid amount will be refunded.
              </p>
            </div>
          </div>
        ) : (
          <div className="status-timeline">
            {STATUS_FLOW.map((step, idx) => {
              const isOrderDelivered = order.status === 'DELIVERED';
              const isCompleted = idx < currentStepIndex || isOrderDelivered;
              const isCurrent = idx === currentStepIndex && !isOrderDelivered;

              let stepClass = 'status-step';
              if (isCompleted) stepClass += ' completed';
              if (isCurrent) stepClass += ' current';

              return (
                <div key={step.status} className={stepClass} id={`status-step-${step.status}`}>
                  <div className="status-step-icon">
                    {isCompleted ? <CheckCircle2 size={18} strokeWidth={2.5} /> : step.icon}
                  </div>
                  <span className="status-step-label">{step.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Assigned Rider Info if available */}
        {order.rider && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.9rem',
            }}
          >
            <Bike size={20} style={{ color: 'var(--color-brand-green)' }} />
            <div>
              <strong>Assigned Rider:</strong> {order.rider.name}
              {order.rider.phone && ` (${order.rider.phone})`}
            </div>
          </div>
        )}
      </div>

      <div className="cart-layout">
        {/* Left: Items list */}
        <div className="cart-items-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
            Items in this Order ({order.items.length})
          </h2>

          <div className="cart-items-list">
            {order.items.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-left">
                  <img
                    src={item.product?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'}
                    alt={item.productName || 'Item'}
                    className="cart-item-thumb"
                  />
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.productName || item.product?.name || 'Item'}</span>
                    <span className="cart-item-unit">Quantity: {item.quantity}</span>
                    <span className="cart-item-unit-price">₹{Math.round(item.price)} each</span>
                  </div>
                </div>

                <div className="cart-item-subtotal">
                  ₹{Math.round(item.subtotal || item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary & Address */}
        <div>
          {/* Delivery Address */}
          <div className="checkout-section-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} style={{ color: 'var(--color-brand-green)' }} /> Delivery Address
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {order.deliveryAddress}
            </p>
          </div>

          {/* Payment & Bill Details */}
          <div className="checkout-section-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Banknote size={16} style={{ color: 'var(--color-brand-green)' }} /> Payment Details
            </h3>

            <div className="bill-row">
              <span>Payment Mode</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>{order.paymentMethod}</strong>
            </div>

            <div className="bill-row">
              <span>Payment Status</span>
              <span style={{ fontWeight: 600, color: order.paymentStatus === 'PAID' ? 'var(--color-brand-green)' : 'var(--color-text-secondary)' }}>
                {order.paymentStatus}
              </span>
            </div>

            <div className="bill-row">
              <span>Item Total</span>
              <span>₹{Math.round(order.totalAmount || order.total)}</span>
            </div>

            <div className="bill-row free-tag">
              <span>Delivery Partner Fee</span>
              <span>FREE</span>
            </div>

            <div className="bill-divider" />

            <div className="bill-total-row">
              <span>Total Paid/Payable</span>
              <span style={{ color: 'var(--color-brand-green)' }}>₹{Math.round(order.totalAmount || order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
