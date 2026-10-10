import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import type { Order, OrderStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { StatusConfirmModal } from '../components/StatusConfirmModal';
import { Header } from '../components/Header';
import { ErrorMessage } from '../components/CommonStates';
import {
  ArrowLeft,
  RotateCw,
  Phone,
  Mail,
  MapPin,
  User,
  CreditCard,
  Calendar,
  CheckCircle2,
  PackageCheck,
  Bike,
  Check,
  IndianRupee,
  Package,
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const fetchOrder = useCallback(
    async (isManualRefresh = false) => {
      if (!id) return;
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      setStatusError(null);

      try {
        const data = await api.rider.getOrder(id);
        setOrder(data);
      } catch (err: any) {
        const msg = err instanceof ApiError ? err.message : 'Failed to load order details.';
        setError(msg);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Determine the next valid status action based on strict state machine
  const getNextAction = (currentStatus: OrderStatus): { target: OrderStatus; label: string; btnClass: string } | null => {
    switch (currentStatus) {
      case 'ASSIGNED':
        return {
          target: 'PICKED_UP',
          label: 'Mark as Picked Up',
          btnClass: 'btn-status-picked',
        };
      case 'PICKED_UP':
        return {
          target: 'OUT_FOR_DELIVERY',
          label: 'Start Delivery',
          btnClass: 'btn-status-delivery',
        };
      case 'OUT_FOR_DELIVERY':
        return {
          target: 'DELIVERED',
          label: 'Mark as Delivered',
          btnClass: 'btn-status-delivered',
        };
      case 'DELIVERED':
      case 'CANCELLED':
      default:
        return null;
    }
  };

  const nextAction = order ? getNextAction(order.status) : null;

  const handleStatusChangeConfirmed = async () => {
    if (!order || !nextAction) return;

    setIsUpdatingStatus(true);
    setStatusError(null);

    try {
      // 1. Send update status request
      await api.rider.updateStatus(order.id, nextAction.target);
      setConfirmModalOpen(false);

      // 2. Re-fetch fresh order data from backend
      await fetchOrder(true);
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update order status.';
      setStatusError(msg);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rider-app-wrapper">
        <div className="rider-app-container">
          <Header />
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
            <div className="spinner" />
            <p className="text-secondary font-medium text-sm">
              Loading order information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rider-app-wrapper">
        <div className="rider-app-container">
          <Header />
          <div className="p-4 flex-1">
            <button
              onClick={() => navigate('/orders')}
              className="btn btn-secondary text-xs py-1.5 px-3 mb-4 flex items-center gap-1.5"
              style={{ minHeight: '36px' }}
            >
              <ArrowLeft size={14} />
              <span>Back to Assigned Orders</span>
            </button>
            <ErrorMessage
              message={error || 'Order not found or not assigned to your account.'}
              onRetry={() => fetchOrder(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalAmount = order.total || order.totalAmount || 0;
  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Stepper calculations
  const steps: { key: OrderStatus; label: string }[] = [
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'PICKED_UP', label: 'Picked Up' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="rider-app-wrapper">
      <div className="rider-app-container pb-28">
        <Header />

        {/* Top Navigation & Order Title */}
        <div className="p-4 bg-surface border-b border-subtle">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/orders')}
              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              style={{ minHeight: '36px' }}
            >
              <ArrowLeft size={14} />
              <span>Assigned Orders</span>
            </button>

            <button
              onClick={() => fetchOrder(true)}
              disabled={isRefreshing}
              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              style={{ minHeight: '36px' }}
              title="Refresh order details"
            >
              <RotateCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Refreshing' : 'Refresh'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-muted uppercase tracking-wider block">
                Order Number
              </span>
              <h1 className="font-display font-black text-xl text-primary">
                #{order.orderNumber}
              </h1>
            </div>
            <StatusBadge status={order.status} size="lg" />
          </div>

          {/* Status Stepper */}
          <div className="order-stepper">
            {steps.map((step, idx) => {
              const isCompleted = currentStepIndex > idx || order.status === 'DELIVERED';
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.key}
                  className={`step-item ${isCurrent ? 'active' : ''}`}
                >
                  <div
                    className={`step-node ${
                      isCompleted ? 'completed' : isCurrent ? 'current' : ''
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : idx + 1}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="p-4 flex flex-col gap-4">
          {statusError && (
            <div className="alert-error">
              <span className="text-xs font-semibold">{statusError}</span>
            </div>
          )}

          {/* Customer Details Card */}
          <section className="rider-card">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-subtle">
              <User size={18} className="text-muted" />
              <h2 className="font-display font-bold text-base text-primary">
                Customer Details
              </h2>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Customer Name</span>
                <span className="font-bold text-sm text-primary">
                  {order.customer?.name || 'Customer'}
                </span>
              </div>

              {order.customer?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Phone Number</span>
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="font-mono text-xs font-bold text-green flex items-center gap-1.5 hover:underline"
                  >
                    <Phone size={13} />
                    <span>{order.customer.phone}</span>
                  </a>
                </div>
              )}

              {order.customer?.email && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Email</span>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="text-xs text-secondary flex items-center gap-1.5 hover:underline"
                  >
                    <Mail size={13} />
                    <span className="truncate max-w-[200px]">{order.customer.email}</span>
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Delivery Details Card (NO Maps / GPS / Routing) */}
          <section className="rider-card">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-subtle">
              <MapPin size={18} className="text-muted" />
              <h2 className="font-display font-bold text-base text-primary">
                Delivery Address
              </h2>
            </div>

            <div className="p-3 bg-subtle rounded-xl border border-default">
              <p className="text-sm font-semibold text-primary leading-relaxed">
                {order.deliveryAddress || 'No delivery address specified'}
              </p>
            </div>
          </section>

          {/* Order Summary Card */}
          <section className="rider-card">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-subtle">
              <CreditCard size={18} className="text-muted" />
              <h2 className="font-display font-bold text-base text-primary">
                Order & Payment Info
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted flex items-center gap-1">
                  <Calendar size={13} /> Date Placed
                </span>
                <span className="text-xs text-secondary font-medium">
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Payment Method</span>
                <span className="text-xs font-bold text-primary">
                  {order.paymentMethod === 'COD'
                    ? 'Cash on Delivery (COD)'
                    : order.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Payment Status</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor:
                      order.paymentStatus === 'COMPLETED' ? '#ecfdf5' : '#fffbeb',
                    color:
                      order.paymentStatus === 'COMPLETED' ? '#059669' : '#d97706',
                  }}
                >
                  {order.paymentStatus}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-subtle mt-1">
                <span className="font-bold text-sm text-primary">Total Amount</span>
                <span className="font-extrabold text-lg text-primary flex items-center">
                  <IndianRupee size={16} />
                  {totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </section>

          {/* Items Card */}
          <section className="rider-card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-subtle">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-muted" />
                <h2 className="font-display font-bold text-base text-primary">
                  Order Items
                </h2>
              </div>
              <span className="text-xs font-bold text-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="flex flex-col divide-y divide-subtle">
              {order.items?.map((item) => {
                const name = item.productName || item.product?.name || 'Product';
                const unit = item.product?.unit;
                return (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex-1 pr-3">
                      <div className="font-semibold text-sm text-primary">
                        {name}
                      </div>
                      <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
                        {unit && <span>{unit}</span>}
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>₹{item.price} each</span>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-primary flex items-center shrink-0">
                      <IndianRupee size={13} />
                      {item.subtotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        {/* Sticky Action Footer */}
        <div className="sticky-action-bar">
          {nextAction ? (
            <button
              onClick={() => setConfirmModalOpen(true)}
              disabled={isUpdatingStatus}
              className={`btn btn-status-action ${nextAction.btnClass}`}
            >
              {nextAction.target === 'PICKED_UP' && <PackageCheck size={20} />}
              {nextAction.target === 'OUT_FOR_DELIVERY' && <Bike size={20} />}
              {nextAction.target === 'DELIVERED' && <CheckCircle2 size={20} />}
              <span>{nextAction.label}</span>
            </button>
          ) : order.status === 'DELIVERED' ? (
            <div className="alert-success justify-center font-bold text-sm py-3">
              <CheckCircle2 size={20} />
              <span>Order Successfully Delivered</span>
            </div>
          ) : order.status === 'CANCELLED' ? (
            <div className="alert-error justify-center font-bold text-sm py-3">
              <span>This order was cancelled</span>
            </div>
          ) : null}
        </div>

        {/* Confirmation Modal */}
        <StatusConfirmModal
          isOpen={confirmModalOpen}
          targetStatus={nextAction ? nextAction.target : null}
          orderNumber={order.orderNumber}
          isLoading={isUpdatingStatus}
          onConfirm={handleStatusChangeConfirmed}
          onCancel={() => setConfirmModalOpen(false)}
        />
      </div>
    </div>
  );
};
