import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Shield, ArrowLeft, X } from 'lucide-react';

import { CrusaderLogo } from '../../components/brand/CrusaderLogo';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      showToast('Logged in successfully', 'success');
      
      // Determine redirection based on role
      // After login, useAuth state updates. Let's check token and navigate
      // Simple parse JWT to check role directly, or navigate to / and let guards sort it out.
      // Wait, we can fetch user role directly after successful login call
      // Let's redirect to check role or let auth provider load it.
      // Actually, since login sets user state, we can inspect it or redirect to /
      // Admin dashboard can be visited by clicking "Admin panel" if user is admin
      // Let's redirect to / (Home page) or check role.
      // If we parse the token, we can see if it's superAdmin.
      // Better yet: we just redirect to / to let user choose, or redirect to /admin if they are admin.
      // Let's redirect to / first.
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.errorCode === 'AUTH_EMAIL_NOT_VERIFIED') {
        showToast('Please verify your email address first.', 'info');
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        showToast(err.message || 'Login failed. Please check credentials.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: '1.5rem',
      }}
    >
      <div
        className="glass-card animate-slide-up auth-card"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem 2rem',
          position: 'relative',
        }}
      >
        {/* Exit / Back Button Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--color-text-secondary)',
              fontSize: '0.8125rem',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Shop</span>
          </Link>

          <Link
            to="/"
            title="Exit to Storefront"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <X size={18} />
          </Link>
        </div>

        {/* Brand */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div style={{ marginBottom: '0.75rem' }}>
            <CrusaderLogo size={64} variant="image" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Sign in to continue to Crusaders</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            className="auth-submit-btn"
            style={{ width: '100%', marginTop: '0.5rem', height: '2.75rem' }}
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        {/* Switch to Register */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Don't have an account? </span>
          <Link to="/register" style={{ fontWeight: 600 }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
