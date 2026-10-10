import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
} from 'lucide-react';
import type { Product } from '../types';
import { api } from '../lib/api';
import { STATIC_PRODUCTS } from '../lib/catalogData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { QuantityStepper } from '../components/product/QuantityStepper';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getItemQuantity, addItem, updateQuantity } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.products.getById(id);
      setProduct(data);
    } catch (err: any) {
      const staticMatch = STATIC_PRODUCTS.find((p) => p.id === id);
      if (staticMatch) {
        setProduct(staticMatch);
      } else {
        console.error('Failed to load product:', err);
        setError(err.message || 'Product not found');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div style={{ padding: '2rem 0' }}>
          <div className="skeleton" style={{ width: '120px', height: '24px', marginBottom: '1.5rem' }} />
          <div className="product-detail-container">
            <div className="skeleton" style={{ width: '100%', aspectRatio: '1', borderRadius: '14px' }} />
            <div>
              <div className="skeleton" style={{ width: '80%', height: '36px', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ width: '100px', height: '20px', marginBottom: '1.5rem' }} />
              <div className="skeleton" style={{ width: '150px', height: '40px', marginBottom: '2rem' }} />
              <div className="skeleton" style={{ width: '100%', height: '100px', borderRadius: '10px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-wrapper" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          {error || "The product you're looking for does not exist or may have been removed."}
        </p>
        <Link to="/products" className="add-btn" style={{ display: 'inline-flex', padding: '0.65rem 1.5rem' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  const quantityInCart = getItemQuantity(product.id);
  const isOutOfStock = product.stock <= 0;
  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleAddClick = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (isOutOfStock) return;

    try {
      setIsUpdating(true);
      await addItem(product.id, 1);
    } catch (err: any) {
      console.error('Failed to add item:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantityInCart >= product.stock) return;

    try {
      setIsUpdating(true);
      await updateQuantity(product.id, quantityInCart + 1);
    } catch (err: any) {
      console.error('Failed to increase quantity:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async (e: React.MouseEvent) => {
    e.preventDefault();
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
    <div className="page-wrapper">
      <Link
        to="/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          marginBottom: '1rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="product-detail-container">
        {/* Left: Image Box */}
        <div className="detail-img-box">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="detail-img"
          />
          {discountPercent > 0 && (
            <span
              className="discount-badge"
              style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
            >
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Right: Info & CTA */}
        <div className="detail-info">
          {product.category && (
            <div className="detail-breadcrumbs">
              <Link to="/products" style={{ color: 'var(--color-text-muted)' }}>Products</Link>
              <span>/</span>
              <Link to={`/products?category=${product.category.id}`} style={{ color: 'var(--color-brand-green)', fontWeight: 600 }}>
                {product.category.name}
              </Link>
            </div>
          )}

          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-unit">{product.unit || 'Standard Pack'}</p>

          <div className="detail-price-box">
            <span className="detail-price">₹{Math.round(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="detail-mrp">MRP ₹{Math.round(product.mrp)}</span>
                <span className="detail-discount-tag">Save ₹{Math.round(product.mrp - product.price)}</span>
              </>
            )}
          </div>

          {/* Delivery & Stock indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
              <Clock size={18} style={{ color: 'var(--color-brand-green)' }} />
              <strong>10 MINS</strong> delivery to your doorstep
            </div>

            <div className="detail-stock-row" style={{ margin: 0 }}>
              {isOutOfStock ? (
                <span className="stock-pill stock-out">
                  <AlertTriangle size={14} /> Out of Stock
                </span>
              ) : (
                <span className="stock-pill stock-in">
                  <CheckCircle2 size={14} /> In Stock ({product.stock} units available)
                </span>
              )}
            </div>
          </div>

          {/* CTA Row */}
          <div className="detail-cta-row">
            {isOutOfStock ? (
              <button type="button" className="add-btn" disabled style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
                Currently Unavailable
              </button>
            ) : quantityInCart > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <QuantityStepper
                  quantity={quantityInCart}
                  maxStock={product.stock}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  disabled={isUpdating}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  In your cart (Max {product.stock})
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="add-btn"
                onClick={handleAddClick}
                disabled={isUpdating}
                id="detail-add-btn"
                style={{ padding: '0.85rem 2.25rem', fontSize: '1rem', gap: '0.5rem' }}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            )}
          </div>

          {/* Description Section */}
          <div className="detail-description-box">
            <h3 className="detail-desc-title">Product Details</h3>
            <p className="detail-desc-text">
              {product.description || 'No detailed description provided for this product.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
