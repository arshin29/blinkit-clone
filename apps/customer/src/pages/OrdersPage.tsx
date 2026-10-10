import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock, RefreshCw } from 'lucide-react';
import type { Order } from '../types';
import { api } from '../lib/api';
import { EmptyState } from '../components/common/EmptyState';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.orders.getAll();
      // Ensure newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError(err.message || 'Failed to load your orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 'status-badge placed';
      case 'ASSIGNED':
        return 'status-badge assigned';
      case 'PICKED_UP':
        return 'status-badge picked_up';
      case 'OUT_FOR_DELIVERY':
        return 'status-badge out_for_delivery';
      case 'DELIVERED':
        return 'status-badge delivered';
      case 'CANCELLED':
        return 'status-badge cancelled';
      default:
        return 'status-badge placed';
    }
  };

  const formatStatusText = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>
            Order History
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            View and track all your previous grocery orders
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            padding: '0.5rem 0.9rem',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
          }}
        >
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="alert-box alert-danger">
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '14px' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={40} />}
          title="You haven't placed any orders yet"
          description="Explore our fresh produce, cold drinks, snacks, and daily essentials with fast 10-minute delivery."
          actionText="Start Shopping"
          actionLink="/"
        />
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="order-card"
                id={`order-card-${order.id}`}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="order-card-header">
                  <div>
                    <span className="order-number">{order.orderNumber}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                      <Clock size={12} /> {formattedDate}
                    </div>
                  </div>

                  <span className={getStatusBadgeClass(order.status)}>
                    {formatStatusText(order.status)}
                  </span>
                </div>

                <div className="order-card-body">
                  <div className="order-items-preview">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.product?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'}
                        alt={item.productName || 'Item'}
                        className="order-preview-thumb"
                        title={item.productName || 'Item'}
                      />
                    ))}
                    {order.items.length > 4 && (
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--color-bg-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--color-text-secondary)',
                          border: '1px solid var(--color-border-subtle)',
                        }}
                      >
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                        ₹{Math.round(order.totalAmount || order.total)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • {order.paymentMethod}
                      </div>
                    </div>

                    <ChevronRight size={20} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
