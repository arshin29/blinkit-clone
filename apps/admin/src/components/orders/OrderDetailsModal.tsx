import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../common/Badge';
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  Bike,
  Package,
  AlertCircle,
} from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOpenAssignRider?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => Promise<void>;
  isLoadingStatus?: boolean;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenAssignRider,
  onUpdateStatus,
  isLoadingStatus = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [statusError, setStatusError] = useState<string | null>(null);

  if (!order) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const handleStatusSubmit = async () => {
    if (!selectedStatus || !onUpdateStatus) return;
    setStatusError(null);
    try {
      await onUpdateStatus(order.id, selectedStatus as OrderStatus);
      setSelectedStatus('');
    } catch (err: any) {
      setStatusError(err?.message || 'Failed to update order status');
    }
  };

  const isFinalState = order.status === 'DELIVERED' || order.status === 'CANCELLED';

  const getAvailableNextStatuses = (current: OrderStatus): OrderStatus[] => {
    switch (current) {
      case 'PLACED':
        return ['ASSIGNED', 'CANCELLED'];
      case 'ASSIGNED':
        return ['PICKED_UP', 'CANCELLED'];
      case 'PICKED_UP':
        return ['OUT_FOR_DELIVERY', 'CANCELLED'];
      case 'OUT_FOR_DELIVERY':
        return ['DELIVERED', 'CANCELLED'];
      default:
        return [];
    }
  };

  const nextStatuses = getAvailableNextStatuses(order.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order #${order.orderNumber}`}
      size="lg"
    >
      <div className="modal-body" style={{ padding: '20px 24px' }}>
        {statusError && (
          <div className="error-banner" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{statusError}</span>
            </div>
            <button
              onClick={() => setStatusError(null)}
              className="btn-icon"
              style={{ border: 'none', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Status & Date Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '14px 18px',
            backgroundColor: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '20px',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Current Status:
            </span>
            <OrderStatusBadge status={order.status} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Calendar size={14} />
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>

        {/* 2-Column Info Grid: Customer & Delivery / Payment */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          {/* Customer Card */}
          <div
            className="card"
            style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
              <UserIcon size={16} color="var(--color-brand-green)" />
              <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Customer Information
              </span>
            </div>

            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {order.customer?.name || 'Guest User'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <Mail size={14} />
              <span>{order.customer?.email || 'No email available'}</span>
            </div>

            {order.customer?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <Phone size={14} />
                <span>{order.customer.phone}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{order.deliveryAddress || 'Standard Delivery Address'}</span>
            </div>
          </div>

          {/* Rider & Payment Card */}
          <div
            className="card"
            style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
              <Bike size={16} color="var(--color-brand-yellow-hover)" />
              <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Rider & Payment
              </span>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Assigned Delivery Partner
              </div>
              {order.rider ? (
                <div style={{ marginTop: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {order.rider.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {order.rider.phone || order.rider.email}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Not Assigned</span>
                  {!isFinalState && onOpenAssignRider && (
                    <button
                      type="button"
                      onClick={() => onOpenAssignRider(order)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      Assign Rider
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <CreditCard size={14} />
                <span>
                  Method: <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Mock Online Payment'}</strong>
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px', marginLeft: '22px' }}>
                Status: {order.paymentStatus || 'PENDING'}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Package size={16} color="var(--color-brand-green)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Order Items ({order.items?.length || 0})
            </h4>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ textAlign: 'center' }}>Quantity</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.productName || item.product?.name || 'Product Item'}</div>
                      {item.product?.unit && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {item.product.unit}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          backgroundColor: 'var(--color-bg-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      ₹{item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
                  <td colSpan={3} style={{ fontWeight: 700, textAlign: 'right' }}>
                    Total Order Amount:
                  </td>
                  <td style={{ fontWeight: 800, fontSize: '16px', textAlign: 'right', color: 'var(--color-brand-green)', fontFamily: 'var(--font-mono)' }}>
                    ₹{(order.totalAmount || order.total || 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Status Transition Control (Admin action) */}
        {!isFinalState && nextStatuses.length > 0 && onUpdateStatus && (
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'var(--color-brand-yellow-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #fde047',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#713f12' }}>
                Advance Order Status
              </div>
              <div style={{ fontSize: '11px', color: '#854d0e' }}>
                Select a valid forward state or cancel the order.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                className="filter-select"
                style={{ height: '36px', fontSize: '12px' }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                disabled={isLoadingStatus}
              >
                <option value="">-- Change status to --</option>
                {nextStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleStatusSubmit}
                disabled={!selectedStatus || isLoadingStatus}
                className="btn btn-green btn-sm"
              >
                {isLoadingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button type="button" onClick={onClose} className="btn btn-outline">
          Close
        </button>
      </div>
    </Modal>
  );
};
