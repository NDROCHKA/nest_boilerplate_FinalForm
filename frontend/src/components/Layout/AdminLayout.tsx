import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  ShoppingBag,
  ShoppingBagIcon,
  Users,
  Home,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

import { CrusaderLogo } from '../brand/CrusaderLogo';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
    { to: '/admin/categories', icon: <FolderTree size={18} />, label: 'Categories' },
    { to: '/admin/products', icon: <ShoppingBag size={18} />, label: 'Products' },
    { to: '/admin/orders', icon: <ShoppingBagIcon size={18} />, label: 'Orders' },
    { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
  ];

  return (
    <div className="admin-container">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="admin-sidebar">
        {/* Admin Header Title */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <CrusaderLogo size={32} variant="image" />
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Crusaders</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>Admin Panel</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-bg-glass-hover)' : 'transparent',
                border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom User Profile Section */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                border: '1px solid var(--color-border)',
              }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/" style={{ flex: 1 }}>
              <Button variant="secondary" style={{ width: '100%', gap: '0.35rem', padding: '0.5rem' }}>
                <Home size={14} />
                Store
              </Button>
            </Link>
            <Button
              variant="text"
              onClick={handleLogout}
              style={{ padding: '0.5rem', minWidth: '40px' }}
              title="Logout"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header (Shown only on mobile screens <= 768px) */}
      <header className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              background: 'var(--color-accent-gradient)',
              padding: '0.35rem',
              borderRadius: '6px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, lineHeight: 1 }}>Crusaders</h4>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-accent)', fontWeight: 600 }}>Admin Panel</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/">
            <Button variant="secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.25rem' }}>
              <Home size={14} />
              Store
            </Button>
          </Link>
          <Button
            variant="text"
            onClick={handleLogout}
            style={{ padding: '0.35rem', minWidth: 0 }}
            title="Logout"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </header>

      {/* Mobile Horizontal Pill Navigation Bar (Shown only on mobile screens <= 768px) */}
      <div className="admin-mobile-pills">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-pill-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Main Content Pane */}
      <main className="admin-main">
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
