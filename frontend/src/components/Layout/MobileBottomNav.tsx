import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { totalItems, openCart } = useCart();
  const location = useLocation();

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: 'rgba(8, 8, 12, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-border)',
        padding: '0.5rem 1rem calc(0.5rem + env(safe-area-inset-bottom, 0px)) 1rem',
        display: 'none', // Controlled by CSS @media (max-width: 768px)
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      {/* 1. Home */}
      <NavLink
        to="/"
        end
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          fontSize: '0.6875rem',
          fontWeight: isActive ? 700 : 500,
          textDecoration: 'none',
          padding: '0.25rem 0.5rem',
        })}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      {/* 2. Shop */}
      <NavLink
        to="/products"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          fontSize: '0.6875rem',
          fontWeight: isActive ? 700 : 500,
          textDecoration: 'none',
          padding: '0.25rem 0.5rem',
        })}
      >
        <LayoutGrid size={20} />
        <span>Shop</span>
      </NavLink>

      {/* 3. Cart Trigger */}
      <button
        onClick={openCart}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: 'var(--color-text-secondary)',
          fontSize: '0.6875rem',
          fontWeight: 500,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem 0.5rem',
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                background: 'var(--color-accent)',
                color: 'white',
                fontSize: '0.625rem',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid var(--color-bg-primary)',
              }}
            >
              {totalItems}
            </span>
          )}
        </div>
        <span>Bag</span>
      </button>

      {/* 4. Account / Orders */}
      <NavLink
        to={isAuthenticated ? '/my-orders' : '/login'}
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          fontSize: '0.6875rem',
          fontWeight: isActive ? 700 : 500,
          textDecoration: 'none',
          padding: '0.25rem 0.5rem',
        })}
      >
        <User size={20} />
        <span>{isAuthenticated ? 'Orders' : 'Account'}</span>
      </NavLink>
    </div>
  );
};
