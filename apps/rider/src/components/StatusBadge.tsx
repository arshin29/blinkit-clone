import React from 'react';
import type { OrderStatus } from '../types';
import { Clock, PackageCheck, Bike, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'ASSIGNED':
        return {
          label: 'Assigned',
          className: 'status-pill-assigned',
          icon: <Clock size={size === 'sm' ? 12 : 14} />,
        };
      case 'PICKED_UP':
        return {
          label: 'Picked Up',
          className: 'status-pill-picked_up',
          icon: <PackageCheck size={size === 'sm' ? 12 : 14} />,
        };
      case 'OUT_FOR_DELIVERY':
        return {
          label: 'Out for Delivery',
          className: 'status-pill-out_for_delivery',
          icon: <Bike size={size === 'sm' ? 12 : 14} />,
        };
      case 'DELIVERED':
        return {
          label: 'Delivered',
          className: 'status-pill-delivered',
          icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: 'status-pill-cancelled',
          icon: <XCircle size={size === 'sm' ? 12 : 14} />,
        };
      case 'PLACED':
      default:
        return {
          label: status,
          className: 'status-pill-placed',
          icon: <Clock size={size === 'sm' ? 12 : 14} />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`status-pill ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
