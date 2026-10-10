import React from 'react';
import type { OrderStatus } from '../types';
import { AlertCircle, CheckCircle2, Bike, PackageCheck } from 'lucide-react';

interface StatusConfirmModalProps {
  isOpen: boolean;
  targetStatus: OrderStatus | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  orderNumber?: string;
}

export const StatusConfirmModal: React.FC<StatusConfirmModalProps> = ({
  isOpen,
  targetStatus,
  onConfirm,
  onCancel,
  isLoading,
  orderNumber,
}) => {
  if (!isOpen || !targetStatus) return null;

  const getContent = () => {
    switch (targetStatus) {
      case 'PICKED_UP':
        return {
          title: 'Confirm Order Pickup',
          prompt: 'Confirm that you have picked up this order from the dark store?',
          confirmText: 'Yes, Confirm Pickup',
          buttonClass: 'btn-status-picked',
          icon: <PackageCheck size={28} className="text-status-picked" color="#7c3aed" />,
        };
      case 'OUT_FOR_DELIVERY':
        return {
          title: 'Start Customer Delivery',
          prompt: 'Start delivery for this order and head towards customer address?',
          confirmText: 'Yes, Start Delivery',
          buttonClass: 'btn-status-delivery',
          icon: <Bike size={28} className="text-status-delivery" color="#d97706" />,
        };
      case 'DELIVERED':
        return {
          title: 'Confirm Order Delivered',
          prompt: 'Confirm that this order has been handed over and delivered to the customer?',
          confirmText: 'Yes, Mark Delivered',
          buttonClass: 'btn-status-delivered',
          icon: <CheckCircle2 size={28} className="text-status-delivered" color="#059669" />,
        };
      default:
        return {
          title: 'Confirm Status Change',
          prompt: `Proceed with changing status to ${targetStatus}?`,
          confirmText: 'Confirm',
          buttonClass: 'btn-primary',
          icon: <AlertCircle size={28} color="#2563eb" />,
        };
    }
  };

  const content = getContent();

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-3">
          <div
            style={{
              padding: '0.65rem',
              borderRadius: '12px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-default)',
            }}
          >
            {content.icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-primary">
              {content.title}
            </h3>
            {orderNumber && (
              <span className="font-mono text-xs text-muted">
                Order #{orderNumber}
              </span>
            )}
          </div>
        </div>

        <p className="text-secondary text-sm mb-6 leading-relaxed">
          {content.prompt}
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn ${content.buttonClass} w-full`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="spinner spinner-sm spinner-white" />
                <span>Updating Status...</span>
              </div>
            ) : (
              content.confirmText
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="btn btn-secondary w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
