import React from 'react';
import type { OrderStatus } from '../../types';

interface OrderBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderBadgeProps> = ({ status }) => {
  const getBadgeClass = (s: OrderStatus) => {
    switch (s) {
      case 'PLACED':
        return 'badge-placed';
      case 'ASSIGNED':
        return 'badge-assigned';
      case 'PICKED_UP':
        return 'badge-picked_up';
      case 'OUT_FOR_DELIVERY':
        return 'badge-out_for_delivery';
      case 'DELIVERED':
        return 'badge-delivered';
      case 'CANCELLED':
        return 'badge-cancelled';
      default:
        return 'badge-placed';
    }
  };

  const getLabel = (s: OrderStatus) => {
    switch (s) {
      case 'PLACED':
        return 'Placed';
      case 'ASSIGNED':
        return 'Assigned';
      case 'PICKED_UP':
        return 'Picked Up';
      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return s;
    }
  };

  return <span className={`badge ${getBadgeClass(status)}`}>{getLabel(status)}</span>;
};

interface StockBadgeProps {
  stock: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock }) => {
  if (stock <= 0) {
    return <span className="badge badge-stock-out">Out of stock</span>;
  }
  if (stock <= 5) {
    return <span className="badge badge-stock-low">{stock} in stock (Low)</span>;
  }
  return <span className="badge badge-stock-in">{stock} in stock</span>;
};
