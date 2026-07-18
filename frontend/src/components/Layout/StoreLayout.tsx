import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { getDailyPsalm } from '../../utils/psalms';

export const StoreLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
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
          Daily Armor
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
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {/* Cedar tree inside crown of thorns SVG */}
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }} className="animate-logo-pulse">
              {/* Thorns circle */}
              <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="2.5" strokeDasharray="6 4" />
              {/* Little thorn spikes */}
              <path d="M50 4 L53 11 L47 11 Z" fill="white" />
              <path d="M96 50 L89 53 L89 47 Z" fill="white" />
              <path d="M50 96 L47 89 L53 89 Z" fill="white" />
              <path d="M4 50 L11 47 L11 53 Z" fill="white" />
              <path d="M18 18 L24 23 L21 26 Z" fill="white" />
              <path d="M82 18 L76 23 L79 26 Z" fill="white" />
              <path d="M82 82 L76 77 L79 74 Z" fill="white" />
              <path d="M18 82 L24 77 L21 74 Z" fill="white" />
              
              {/* Cedar Tree */}
              {/* Trunk */}
              <rect x="47.5" y="66" width="5" height="13" fill="white" />
              {/* Branches */}
              <polygon points="50,20 32,44 68,44" fill="white" />
              <polygon points="50,35 26,58 74,58" fill="white" />
              <polygon points="50,48 20,70 80,70" fill="white" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Crusader</span>
              <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>COLLECTIVE</span>
            </div>
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

            {/* Cart Icon */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                color: 'var(--color-text-primary)',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg-glass)',
              }}
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
            </Link>

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
              <Link to="/login">
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

        {/* CSS workaround for responsive nav display */}
        <style>{`
          .desktop-nav { display: flex !important; }
          .desktop-username { display: inline !important; }
          .mobile-toggle { display: none !important; }
        `}</style>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--color-bg-secondary)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 99,
          }}
          className="animate-slide-up"
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          {isAuthenticated && (
            <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
          )}
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg-secondary)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        <p style={{ fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Crusaders E-Commerce Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
