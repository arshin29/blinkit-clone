import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { api } from '../lib/api';
import type { Order } from '../types';
import {
  User,
  Mail,
  Phone,
  Shield,
  LogOut,
  PackageCheck,
  Bike,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.rider.getOrders();
        setOrders(data);
      } catch {
        // Quietly fail stats
      } finally {
        setIsLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  const totalAssigned = orders.length;
  const totalDelivered = orders.filter((o) => o.status === 'DELIVERED').length;
  const totalActive = orders.filter((o) =>
    ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="rider-app-wrapper">
      <div className="rider-app-container pb-24">
        <Header />

        <main className="p-4 flex flex-col gap-4" style={{ paddingBottom: '6rem' }}>
          {/* Profile Header Card */}
          <div
            className="rider-card p-6 flex flex-col items-center text-center shadow-md"
            style={{
              background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
              color: '#ffffff',
              borderColor: '#374151',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-yellow)',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                boxShadow: '0 4px 16px rgba(248, 203, 0, 0.35)',
                marginBottom: '0.75rem',
              }}
            >
              {user?.name?.charAt(0) || 'R'}
            </div>

            <h1 className="font-display font-extrabold text-xl text-white">
              {user?.name || 'Delivery Partner'}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="status-dot-active" />
              <span className="text-xs font-semibold text-green-400" style={{ color: '#34d399' }}>
                On Duty & Ready
              </span>
            </div>
            <div className="mt-2">
              <span className="partner-tag">Blinkit Delivery Partner</span>
            </div>
          </div>

          {/* Partner Stats Summary */}
          <div className="grid grid-cols-3 gap-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <div className="rider-card p-3 flex flex-col items-center text-center">
              <PackageCheck size={18} color="#2563eb" className="mb-1" />
              <span className="font-display font-black text-xl text-primary">
                {isLoadingStats ? '-' : totalAssigned}
              </span>
              <span className="text-[11px] text-muted font-semibold">Total Orders</span>
            </div>

            <div className="rider-card p-3 flex flex-col items-center text-center">
              <Bike size={18} color="#d97706" className="mb-1" />
              <span className="font-display font-black text-xl text-primary">
                {isLoadingStats ? '-' : totalActive}
              </span>
              <span className="text-[11px] text-muted font-semibold">Active Tasks</span>
            </div>

            <div className="rider-card p-3 flex flex-col items-center text-center">
              <CheckCircle2 size={18} color="#059669" className="mb-1" />
              <span className="font-display font-black text-xl text-primary">
                {isLoadingStats ? '-' : totalDelivered}
              </span>
              <span className="text-[11px] text-muted font-semibold">Delivered</span>
            </div>
          </div>

          {/* Account Details */}
          <section className="rider-card">
            <h2 className="font-display font-bold text-sm text-secondary uppercase tracking-wider mb-4">
              Partner Profile Information
            </h2>

            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <User size={18} className="text-secondary" />
                </div>
                <div className="flex flex-col" style={{ gap: '2px' }}>
                  <span className="text-xs text-muted block">Full Name</span>
                  <span className="font-bold text-sm text-primary block">
                    {user?.name || '-'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={18} className="text-secondary" />
                </div>
                <div className="flex flex-col" style={{ gap: '2px' }}>
                  <span className="text-xs text-muted block">Email Address</span>
                  <span className="font-mono text-xs font-semibold text-primary block">
                    {user?.email || '-'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={18} className="text-secondary" />
                </div>
                <div className="flex flex-col" style={{ gap: '2px' }}>
                  <span className="text-xs text-muted block">Phone Number</span>
                  <span className="font-mono text-xs font-semibold text-primary block">
                    {user?.phone || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Shield size={18} className="text-secondary" />
                </div>
                <div className="flex flex-col" style={{ gap: '4px' }}>
                  <span className="text-xs text-muted block">System Role</span>
                  <div>
                    <span
                      className="font-bold text-xs text-green px-2 py-0.5 rounded inline-block"
                      style={{
                        backgroundColor: 'var(--color-brand-green-light)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Partner Commitment Card */}
          <div className="rider-card bg-subtle flex items-center gap-3 p-4">
            <Award size={28} color="#d97706" className="shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-primary">10-Minute Promise</h4>
              <p className="text-[11px] text-muted mt-0.5">
                Always prioritize safe riding and timely order handovers.
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="btn btn-danger w-full mt-2"
            style={{ marginBottom: '1.5rem' }}
          >
            <LogOut size={18} />
            <span>Sign Out of Partner App</span>
          </button>
        </main>

        <BottomNav activeCount={totalActive} />
      </div>
    </div>
  );
};
