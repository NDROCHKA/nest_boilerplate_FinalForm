import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { getDailyPsalm } from '../../utils/psalms';
import { CartDrawer } from '../cart/CartDrawer';
import { MobileBottomNav } from './MobileBottomNav';

import { CrusaderLogo } from '../brand/CrusaderLogo';

export const StoreLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItems, openCart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dailyPsalm = getDailyPsalm();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Daily Psalm Announcement Bar */}
      <div
        className="announcement-bar"
        style={{
          background: '#08080c',
          borderBottom: '1px solid rgba(214, 48, 49, 0.15)',
          padding: '0.45rem 1rem',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          textAlign: 'center',
          zIndex: 101,
          boxShadow: 'inset 0 -10px 15px -10px rgba(214, 48, 49, 0.05)',
        }}
      >
        <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--color-accent)', borderRadius: '50%' }}></span>
          Daily Verse
        </span>
        <span style={{ color: 'var(--color-text-muted)' }}>•</span>
        <span style={{ color: 'var(--color-text-primary)', fontStyle: 'italic' }}>"{dailyPsalm.text}"</span>
        <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>({dailyPsalm.reference})</span>
      </div>

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(8, 8, 12, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          className="store-header-inner"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <CrusaderLogo size={38} showText={true} />
          </Link>

          {/* Desktop Nav */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
            }}
            className="desktop-nav"
          >
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.875rem',
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.875rem',
              })}
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.875rem',
              })}
            >
              Our Story
            </NavLink>
            <NavLink
              to="/faq"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.875rem',
              })}
            >
              FAQ & Delivery
            </NavLink>
            <NavLink
              to="/size-guide"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.875rem',
              })}
            >
              Size Guide
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/my-orders"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                })}
              >
                My Orders
              </NavLink>
            )}
          </nav>

          {/* Action Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="secondary" style={{ padding: '0.5rem 0.8rem', gap: '0.35rem' }}>
                  <ShieldAlert size={16} />
                  Admin
                </Button>
              </Link>
            )}

            {/* Cart Icon Button (opens slide-out drawer) */}
            <button
              onClick={openCart}
              style={{
                position: 'relative',
                color: 'var(--color-text-primary)',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg-glass)',
                border: 'none',
                cursor: 'pointer',
              }}
              title="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--color-accent)',
                    color: 'white',
                    fontSize: '0.675rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-bg-primary)',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Dropdown/Links */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    display: 'none',
                  }}
                  className="desktop-username"
                >
                  {user?.firstName}
                </span>
                <Button
                  variant="text"
                  onClick={handleLogout}
                  style={{ padding: '0.5rem', minWidth: 0 }}
                  title="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="desktop-login-btn">
                <Button variant="primary">Login</Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="text"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              style={{ display: 'none', padding: '0.5rem' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Responsive nav — desktop shows links, mobile shows hamburger */}
        <style>{`
          @media (min-width: 769px) {
            .desktop-nav { display: flex !important; }
            .desktop-username { display: inline !important; }
            .desktop-login-btn { display: block !important; }
            .mobile-toggle { display: none !important; }
          }
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .desktop-username { display: none !important; }
            .desktop-login-btn { display: none !important; }
            .mobile-toggle { display: flex !important; }
          }
        `}</style>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '57px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 5, 7, 0.96)',
            backdropFilter: 'blur(16px)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            zIndex: 999,
            overflowY: 'auto',
          }}
        >
          {!isAuthenticated && (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" style={{ width: '100%', height: '3rem', fontSize: '1rem' }}>
                Login to Account
              </Button>
            </Link>
          )}

          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', textDecoration: 'none', padding: '0.5rem 0' }}>Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', textDecoration: 'none', padding: '0.5rem 0' }}>Shop Catalog</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', textDecoration: 'none', padding: '0.5rem 0' }}>Our Story</Link>
          <Link to="/faq" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', textDecoration: 'none', padding: '0.5rem 0' }}>FAQ & Delivery</Link>
          <Link to="/size-guide" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', textDecoration: 'none', padding: '0.5rem 0' }}>Size Guide</Link>
          {isAuthenticated && (
            <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', textDecoration: 'none', padding: '0.5rem 0' }}>My Orders</Link>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="store-main" style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="store-footer"
        style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg-secondary)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.875rem' }}>
          <Link to="/about" style={{ color: 'var(--color-text-secondary)' }}>Our Story</Link>
          <Link to="/faq" style={{ color: 'var(--color-text-secondary)' }}>FAQ & Lebanon Delivery</Link>
          <Link to="/size-guide" style={{ color: 'var(--color-text-secondary)' }}>Official Size Guide</Link>
          <Link to="/products" style={{ color: 'var(--color-text-secondary)' }}>Catalog</Link>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
          &copy; {new Date().getFullYear()} Crusaders E-Commerce Platform. All rights reserved.
        </p>
      </footer>

      {/* Feature 2: Slide-Out Cart Drawer */}
      <CartDrawer />

      {/* Feature 1: Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};
