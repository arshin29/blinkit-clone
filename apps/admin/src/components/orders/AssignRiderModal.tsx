import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Order, Rider } from '../../types';
import { Bike, ShieldAlert } from 'lucide-react';

interface AssignRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  riders: Rider[];
  onAssign: (orderId: string, riderId: string) => Promise<void>;
  isLoading?: boolean;
}

export const AssignRiderModal: React.FC<AssignRiderModalProps> = ({
  isOpen,
  onClose,
  order,
  riders,
  onAssign,
  isLoading = false,
}) => {
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRiderId) {
      setError('Please select a rider to assign.');
      return;
    }
    setError(null);
    await onAssign(order.id, selectedRiderId);
  };

  // Only allow users with role RIDER
  const validRiders = riders.filter((r) => r.role === 'RIDER');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Delivery Rider">
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Order #{order.orderNumber}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Customer: {order.customer?.name} • Address: {order.deliveryAddress}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Available Rider *</label>
            {validRiders.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: 'var(--color-warning-bg)',
                  color: 'var(--color-warning)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                }}
              >
                <ShieldAlert size={18} />
                <span>No active delivery riders available in the system.</span>
              </div>
            ) : (
              <select
                className="form-control filter-select"
                style={{ width: '100%' }}
                value={selectedRiderId}
                onChange={(e) => {
                  setSelectedRiderId(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
              >
                <option value="">-- Choose Rider --</option>
                {validRiders.map((rider) => (
                  <option key={rider.id} value={rider.id}>
                    {rider.name} ({rider.phone || rider.email})
                  </option>
                ))}
              </select>
            )}
            {error && <span className="form-error">{error}</span>}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              marginTop: '8px',
            }}
          >
            <Bike size={15} />
            <span>Assigning a rider transitions this order's status to <strong>ASSIGNED</strong>.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-green"
            disabled={isLoading || validRiders.length === 0}
          >
            {isLoading ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
