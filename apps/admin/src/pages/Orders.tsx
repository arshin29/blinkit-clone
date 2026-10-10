import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../lib/api';
import type { Order, OrderStatus, Rider } from '../types';
import { OrderStatusBadge } from '../components/common/Badge';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import { AssignRiderModal } from '../components/orders/AssignRiderModal';
import { useToast } from '../context/ToastContext';
import {
  Search,
  Eye,
  Bike,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [orderToAssignRider, setOrderToAssignRider] = useState<Order | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchOrdersAndRiders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ordersData, ridersData] = await Promise.all([
        api.orders.getAll(),
        api.users.getRiders(),
      ]);
      setOrders(ordersData);
      setRiders(ridersData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load store orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersAndRiders();
  }, [fetchOrdersAndRiders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === 'ALL' || order.status === statusFilter;

      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        order.orderNumber.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term) ||
        order.customer?.email?.toLowerCase().includes(term) ||
        order.rider?.name?.toLowerCase().includes(term);

      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleOpenAssignRider = (order: Order) => {
    setOrderToAssignRider(order);
  };

  const handleAssignRiderSubmit = async (orderId: string, riderId: string) => {
    setIsAssigning(true);
    try {
      const updated = await api.orders.assignRider(orderId, riderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o)),
      );

      // If the details modal is open for this order, update it
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }

      success(`Rider assigned to Order #${updated.orderNumber}. Status is now ASSIGNED.`);
      setOrderToAssignRider(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to assign rider');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUpdateStatusSubmit = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await api.orders.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o)),
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }

      success(`Order #${updated.orderNumber} updated to ${newStatus.replace(/_/g, ' ')}.`);
    } catch (err: any) {
      toastError(err?.message || 'Failed to update order status');
      throw err;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const statusOptions: { label: string; value: string }[] = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Placed', value: 'PLACED' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'Picked Up', value: 'PICKED_UP' },
    { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            Customer Orders ({filteredOrders.length})
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Live fulfillment, rider dispatch, and status transition pipeline
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrdersAndRiders}
          className="btn btn-outline btn-sm"
          title="Refresh orders from backend"
        >
          <RefreshCw size={14} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button type="button" onClick={fetchOrdersAndRiders} className="btn btn-sm btn-outline">
            Retry
          </button>
        </div>
      )}

      {/* Filter Pills */}
      <div className="filter-pills">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`pill-btn ${statusFilter === opt.value ? 'active' : ''}`}
            onClick={() => setStatusFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by order ID, customer name, email or rider..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={7} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title={
            searchTerm || statusFilter !== 'ALL'
              ? 'No orders match this filter'
              : 'No orders recorded yet'
          }
          subtitle={
            searchTerm || statusFilter !== 'ALL'
              ? 'Try changing the status filter or clearing your search.'
              : 'Orders placed by customers will appear here in real time.'
          }
          actionText={
            searchTerm || statusFilter !== 'ALL' ? 'Reset Filters' : undefined
          }
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('ALL');
          }}
          icon={<ShoppingBag size={32} />}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Assigned Rider</th>
                <th>Date / Time</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const canAssign =
                  order.status === 'PLACED' || order.status === 'ASSIGNED';

                return (
                  <tr key={order.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        #{order.orderNumber}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customer?.name || 'Customer'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {order.customer?.email || order.customer?.phone || '—'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      ₹{(order.totalAmount || order.total || 0).toFixed(2)}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: 'var(--color-bg-subtle)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}
                      </span>
                    </td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>
                      {order.rider ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Bike size={14} color="var(--color-brand-green)" />
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>
                            {order.rider.name}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {canAssign && (
                          <button
                            type="button"
                            onClick={() => handleOpenAssignRider(order)}
                            className="btn-icon"
                            title={order.rider ? 'Re-assign Rider' : 'Assign Rider'}
                            style={{ color: 'var(--color-brand-green)' }}
                          >
                            <Bike size={15} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(order)}
                          className="btn-icon"
                          title="View order details"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        order={selectedOrder}
        onOpenAssignRider={(ord) => {
          setIsDetailsOpen(false);
          handleOpenAssignRider(ord);
        }}
        onUpdateStatus={handleUpdateStatusSubmit}
        isLoadingStatus={isUpdatingStatus}
      />

      {/* Assign Rider Modal */}
      <AssignRiderModal
        isOpen={!!orderToAssignRider}
        onClose={() => setOrderToAssignRider(null)}
        order={orderToAssignRider}
        riders={riders}
        onAssign={handleAssignRiderSubmit}
        isLoading={isAssigning}
      />
    </div>
  );
};
