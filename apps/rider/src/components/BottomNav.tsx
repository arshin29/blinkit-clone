import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';

interface BottomNavProps {
  activeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeCount }) => {
  return (
    <nav className="rider-bottom-nav">
      <NavLink
        to="/orders"
        className={({ isActive }) =>
          `nav-tab-item ${isActive ? 'active' : ''}`
        }
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={22} />
          {typeof activeCount === 'number' && activeCount > 0 && (
            <span className="nav-badge-count">{activeCount}</span>
          )}
        </div>
        <span>Assigned Orders</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `nav-tab-item ${isActive ? 'active' : ''}`
        }
      >
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
