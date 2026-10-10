import React from 'react';
import type { Order } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, User, ChevronRight, ShoppingCart, IndianRupee, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || order.items?.length || 0;
  const totalAmount = order.total || order.totalAmount || 0;

  const getActionPrompt = () => {
    switch (order.status) {
      case 'ASSIGNED':
        return { text: 'Next: Pick up order', color: '#2563eb' };
      case 'PICKED_UP':
        return { text: 'Next: Start delivery', color: '#7c3aed' };
      case 'OUT_FOR_DELIVERY':
        return { text: 'Next: Mark delivered', color: '#d97706' };
      case 'DELIVERED':
        return { text: 'Completed', color: '#059669' };
      default:
        return null;
    }
  };

  const actionPrompt = getActionPrompt();

  return (
    <div
      onClick={() => navigate(`/orders/${order.id}`)}
      className="rider-card rider-card-interactive"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/orders/${order.id}`);
        }
      }}
      aria-label={`View order ${order.orderNumber}`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-primary">
            #{order.orderNumber}
          </span>
          <span className="text-xs text-muted flex items-center gap-1">
            <Calendar size={12} />
            {formattedDate}
          </span>
        </div>
        <StatusBadge status={order.status} size="sm" />
      </div>

      {/* Customer & Address Details */}
      <div className="flex flex-col gap-2 py-2 border-t border-b border-subtle my-2">
        <div className="flex items-center gap-2">
          <User size={15} className="text-muted shrink-0" />
          <span className="font-semibold text-sm text-primary truncate">
            {order.customer?.name || 'Customer'}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin size={15} className="text-muted shrink-0 mt-0.5" />
          <span className="text-xs text-secondary leading-snug line-clamp-2">
            {order.deliveryAddress || 'No address provided'}
          </span>
        </div>
      </div>

      {/* Footer Info: Items count, Total price, Next step */}
      <div className="flex items-center justify-between mt-2 pt-1">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted flex items-center gap-1 font-medium">
            <ShoppingCart size={13} />
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
          <span className="font-extrabold text-sm text-primary flex items-center">
            <IndianRupee size={13} />
            {totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {actionPrompt && (
            <span
              className="text-xs font-bold"
              style={{ color: actionPrompt.color }}
            >
              {actionPrompt.text}
            </span>
          )}
          <ChevronRight size={16} className="text-muted" />
        </div>
      </div>
    </div>
  );
};
