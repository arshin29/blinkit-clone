import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api, ApiError } from '../lib/api';
import type { Order, OrderStatus } from '../types';
import { OrderCard } from '../components/OrderCard';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { SkeletonOrderCard, ErrorMessage, EmptyState } from '../components/CommonStates';
import { RotateCw, Search } from 'lucide-react';

type FilterTab = 'ALL' | 'ACTIVE' | 'ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await api.rider.getOrders();
      setOrders(data);
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to fetch assigned orders.';
      setError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Counts for each tab
  const counts = useMemo(() => {
    const active = orders.filter((o) =>
      ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
    ).length;
    const assigned = orders.filter((o) => o.status === 'ASSIGNED').length;
    const picked = orders.filter((o) => o.status === 'PICKED_UP').length;
    const out = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length;
    const delivered = orders.filter((o) => o.status === 'DELIVERED').length;

    return {
      all: orders.length,
      active,
      assigned,
      picked,
      out,
      delivered,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      let matchesTab = true;
      if (activeTab === 'ACTIVE') {
        matchesTab = ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status);
      } else if (activeTab !== 'ALL') {
        matchesTab = order.status === (activeTab as OrderStatus);
      }

      if (!matchesTab) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesOrderNumber = order.orderNumber?.toLowerCase().includes(query);
        const matchesCustomer = order.customer?.name?.toLowerCase().includes(query);
        const matchesAddress = order.deliveryAddress?.toLowerCase().includes(query);
        return matchesOrderNumber || matchesCustomer || matchesAddress;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  return (
    <div className="rider-app-wrapper">
      <div className="rider-app-container pb-24">
        <Header />

        {/* Action Header / Refresh Bar */}
        <div className="p-4 bg-surface border-b border-subtle">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display font-extrabold text-lg text-primary">
                Assigned Orders
              </h2>
              <p className="text-xs text-muted">
                {counts.active} active delivery {counts.active === 1 ? 'task' : 'tasks'}
              </p>
            </div>

            <button
              onClick={() => fetchOrders(true)}
              disabled={isLoading || isRefreshing}
              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              style={{ minHeight: '36px' }}
              title="Refresh assigned orders list"
              aria-label="Refresh orders"
            >
              <RotateCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              className="text-muted"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, customer, address..."
              className="form-input"
              style={{
                paddingLeft: '36px',
                paddingTop: '0.55rem',
                paddingBottom: '0.55rem',
                fontSize: '0.85rem',
              }}
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="filter-tabs-scroll">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`filter-chip ${activeTab === 'ALL' ? 'active' : ''}`}
          >
            <span>All</span>
            <span className="filter-chip-count">{counts.all}</span>
          </button>

          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`filter-chip ${activeTab === 'ACTIVE' ? 'active' : ''}`}
          >
            <span style={{ color: activeTab === 'ACTIVE' ? '#ffffff' : '#d97706' }}>●</span>
            <span>Active</span>
            <span className="filter-chip-count">{counts.active}</span>
          </button>

          <button
            onClick={() => setActiveTab('ASSIGNED')}
            className={`filter-chip ${activeTab === 'ASSIGNED' ? 'active' : ''}`}
          >
            <span>Assigned</span>
            <span className="filter-chip-count">{counts.assigned}</span>
          </button>

          <button
            onClick={() => setActiveTab('PICKED_UP')}
            className={`filter-chip ${activeTab === 'PICKED_UP' ? 'active' : ''}`}
          >
            <span>Picked Up</span>
            <span className="filter-chip-count">{counts.picked}</span>
          </button>

          <button
            onClick={() => setActiveTab('OUT_FOR_DELIVERY')}
            className={`filter-chip ${activeTab === 'OUT_FOR_DELIVERY' ? 'active' : ''}`}
          >
            <span>Out for Delivery</span>
            <span className="filter-chip-count">{counts.out}</span>
          </button>

          <button
            onClick={() => setActiveTab('DELIVERED')}
            className={`filter-chip ${activeTab === 'DELIVERED' ? 'active' : ''}`}
          >
            <span>Delivered</span>
            <span className="filter-chip-count">{counts.delivered}</span>
          </button>
        </div>

        {/* Orders Feed */}
        <main className="p-4 flex flex-col gap-3 flex-1">
          {isLoading && (
            <div className="flex flex-col gap-3">
              <SkeletonOrderCard />
              <SkeletonOrderCard />
              <SkeletonOrderCard />
            </div>
          )}

          {!isLoading && error && (
            <ErrorMessage
              message={error}
              onRetry={() => fetchOrders(false)}
            />
          )}

          {!isLoading && !error && filteredOrders.length === 0 && (
            <EmptyState
              title={
                searchQuery
                  ? 'No matching orders found'
                  : activeTab === 'ALL'
                  ? 'No orders assigned to you'
                  : `No ${activeTab.toLowerCase().replace('_', ' ')} orders`
              }
              description={
                searchQuery
                  ? 'Try searching with a different keyword or clear the search query.'
                  : 'New orders assigned by the admin or store manager will automatically appear here.'
              }
              onRefresh={() => fetchOrders(true)}
            />
          )}

          {!isLoading &&
            !error &&
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </main>

        <BottomNav activeCount={counts.active} />
      </div>
    </div>
  );
};
