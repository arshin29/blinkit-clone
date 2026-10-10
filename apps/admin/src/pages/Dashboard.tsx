import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Category, Order, Product } from '../types';
import { OrderStatusBadge } from '../components/common/Badge';
import { StatsSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';
import {
  Package,
  Layers,
  ShoppingBag,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prods, cats, ords] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
        api.orders.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard operational metrics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Operational calculations
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'PLACED' || o.status === 'ASSIGNED',
  ).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  if (isLoading) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Store Overview</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Loading operational metrics...
            </p>
          </div>
        </div>
        <StatsSkeleton />
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  return (
    <div>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            Operational Overview
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Real-time warehouse inventory and customer order fulfillment
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="btn btn-outline btn-sm"
          title="Refresh metrics from backend"
        >
          <RefreshCw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button type="button" onClick={fetchDashboardData} className="btn btn-sm btn-outline">
            Retry
          </button>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card yellow">
          <div className="stat-info">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{totalProducts}</span>
          </div>
          <div className="stat-icon-wrapper">
            <Package size={24} />
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-info">
            <span className="stat-label">Total Categories</span>
            <span className="stat-value">{totalCategories}</span>
          </div>
          <div className="stat-icon-wrapper">
            <Layers size={24} />
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{totalOrders}</span>
          </div>
          <div className="stat-icon-wrapper">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-info">
            <span className="stat-label">Pending Orders</span>
            <span className="stat-value">{pendingOrders}</span>
          </div>
          <div className="stat-icon-wrapper">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Operational Highlights Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Recent Orders Card */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Recent Orders</h3>
            <Link
              to="/orders"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-brand-green)',
                textDecoration: 'none',
              }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
              No orders placed yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      #{ord.orderNumber}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {ord.customer?.name} • ₹{(ord.totalAmount || ord.total || 0).toFixed(2)}
                    </div>
                  </div>
                  <OrderStatusBadge status={ord.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Watchlist */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Low Stock Watchlist (&le; 5)</h3>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-brand-green)',
                textDecoration: 'none',
              }}
            >
              <span>Manage Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
              ✓ All inventory items are adequately stocked.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lowStockProducts.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      {p.unit} • ₹{p.price.toFixed(2)}
                    </div>
                  </div>
                  <span
                    className={`badge ${p.stock <= 0 ? 'badge-stock-out' : 'badge-stock-low'}`}
                    style={{ fontSize: '11px' }}
                  >
                    {p.stock <= 0 ? '0 Units' : `${p.stock} Left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
