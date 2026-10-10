import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  maxStock: number;
  onIncrease: (e: React.MouseEvent) => void;
  onDecrease: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  maxStock,
  onIncrease,
  onDecrease,
  disabled = false,
}) => {
  return (
    <div className="stepper-container" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="stepper-btn"
        onClick={onDecrease}
        disabled={disabled}
        aria-label="Decrease quantity"
      >
        <Minus size={15} strokeWidth={3} />
      </button>

      <span className="stepper-qty">{quantity}</span>

      <button
        type="button"
        className="stepper-btn"
        onClick={onIncrease}
        disabled={disabled || quantity >= maxStock}
        aria-label="Increase quantity"
      >
        <Plus size={15} strokeWidth={3} />
      </button>
    </div>
  );
};
