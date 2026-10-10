import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingBag,
  MapPin,
} from 'lucide-react';
import type { Order } from '../types';
import { api } from '../lib/api';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await api.orders.getById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="page-wrapper">
      <div className="success-card">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>

        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-subtitle">
          Your groceries are being packed at the nearest store and will reach your doorstep shortly.
        </p>

        {isLoading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Fetching order details...</p>
        ) : order ? (
          <>
            <div className="order-info-pill-box">
              <div className="info-box-item">
                <div className="label">Order Number</div>
                <div className="val" style={{ fontSize: '0.95rem' }}>{order.orderNumber}</div>
              </div>
              <div className="info-box-item">
                <div className="label">Total Amount</div>
                <div className="val" style={{ color: 'var(--color-brand-green)' }}>₹{Math.round(order.totalAmount || order.total)}</div>
              </div>
              <div className="info-box-item">
                <div className="label">Payment</div>
                <div className="val" style={{ fontSize: '0.9rem' }}>{order.paymentMethod}</div>
              </div>
            </div>

            {/* Delivery address & ETA */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'left',
                fontSize: '0.88rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-brand-green)', fontWeight: 700 }}>
                <Clock size={16} /> Estimated Delivery: 10 Minutes
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{order.deliveryAddress}</span>
              </div>
            </div>

            {/* Items Ordered preview */}
            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Items Ordered ({order.items.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.88rem',
                      padding: '0.4rem 0',
                      borderBottom: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <span>
                      <strong style={{ color: 'var(--color-brand-green)', marginRight: '6px' }}>{item.quantity}x</strong>
                      {item.productName || item.product?.name || 'Item'}
                    </span>
                    <span style={{ fontWeight: 700 }}>₹{Math.round(item.subtotal || item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={`/orders/${id}`}
            className="add-btn"
            id="view-order-tracking-btn"
            style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}
          >
            Track Order Live <ArrowRight size={16} />
          </Link>

          <Link
            to="/"
            style={{
              padding: '0.8rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
