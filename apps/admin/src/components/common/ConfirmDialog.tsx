import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="modal-body" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: isDangerous ? 'var(--color-danger-light)' : 'var(--color-brand-yellow-light)',
            color: isDangerous ? 'var(--color-danger)' : '#947600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={22} />
        </div>
        <div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline"
          disabled={isLoading}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};
