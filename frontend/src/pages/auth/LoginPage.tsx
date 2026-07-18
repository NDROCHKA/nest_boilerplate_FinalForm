import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Shield } from 'lucide-react';

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
        className="glass-card animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem 2rem',
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: 'var(--color-accent-gradient)',
              padding: '0.6rem',
              borderRadius: '12px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Shield size={28} />
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
