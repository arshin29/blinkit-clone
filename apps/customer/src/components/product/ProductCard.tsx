import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Clock, Plus } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { QuantityStepper } from './QuantityStepper';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getItemQuantity, addItem, updateQuantity } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const quantityInCart = getItemQuantity(product.id);
  const isOutOfStock = product.stock <= 0;

  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleAddClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (isOutOfStock) return;

    try {
      setIsUpdating(true);
      await addItem(product.id, 1);
    } catch (err: any) {
      console.error('Failed to add item to cart:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantityInCart >= product.stock) return;

    try {
      setIsUpdating(true);
      await updateQuantity(product.id, quantityInCart + 1);
    } catch (err: any) {
      console.error('Failed to update quantity:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsUpdating(true);
      await updateQuantity(product.id, quantityInCart - 1);
    } catch (err: any) {
      console.error('Failed to decrease quantity:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      <div className="product-card-top">
        <div className="product-card-badge-row">
          {discountPercent > 0 ? (
            <span className="discount-badge">{discountPercent}% OFF</span>
          ) : <span />}

          <span className="delivery-eta-badge">
            <Clock size={11} strokeWidth={2.5} style={{ color: '#b45309' }} />
            {product.deliveryTime || '27 MINS'}
          </span>
        </div>

        <Link to={`/products/${product.id}`} className="product-card-img-link">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        </Link>

        <span className="product-unit">{product.unit || 'Standard'}</span>

        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h4 className="product-name" title={product.name}>
            {product.name}
          </h4>
        </Link>
      </div>

      <div className="product-card-bottom">
        <div className="price-container">
          <span className="current-price">₹{Math.round(product.price)}</span>
          {product.mrp && product.mrp > product.price ? (
            <span className="mrp-price">₹{Math.round(product.mrp)}</span>
          ) : null}
        </div>

        {isOutOfStock ? (
          <button type="button" className="add-btn" disabled>
            Out of stock
          </button>
        ) : quantityInCart > 0 ? (
          <QuantityStepper
            quantity={quantityInCart}
            maxStock={product.stock}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            disabled={isUpdating}
          />
        ) : (
          <button
            type="button"
            className="add-btn"
            onClick={handleAddClick}
            disabled={isUpdating}
            id={`add-btn-${product.id}`}
          >
            <Plus size={14} strokeWidth={3} />
            ADD
          </button>
        )}
      </div>
    </div>
  );
};
