import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, X } from 'lucide-react';
import { CrusaderLogo } from '../../components/brand/CrusaderLogo';
import type { ApiError } from '../../types/api.types';

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}' -]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9]{8,15}$/;

const getValidationFields = (error: ApiError): Record<string, string> => {
  const fields = error.details?.fields;
  if (!fields || typeof fields !== 'object') return {};

  return Object.fromEntries(
    Object.entries(fields).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  );
};

export const RegisterPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: typeof errors = {};
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhoneNumber = phoneNumber.replace(/[\s()-]/g, '');

    if (!cleanFirstName) {
      tempErrors.firstName = 'First name is required';
    } else if (cleanFirstName.length < 2) {
      tempErrors.firstName = 'First name must be at least 2 characters';
    } else if (!NAME_PATTERN.test(cleanFirstName)) {
      tempErrors.firstName =
        'Use letters, spaces, apostrophes, or hyphens only';
    }
    if (!cleanLastName) {
      tempErrors.lastName = 'Last name is required';
    } else if (cleanLastName.length < 2) {
      tempErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!NAME_PATTERN.test(cleanLastName)) {
      tempErrors.lastName = 'Use letters, spaces, apostrophes, or hyphens only';
    }
    if (!cleanEmail) {
      tempErrors.email = 'Email is required';
    } else if (!EMAIL_PATTERN.test(cleanEmail)) {
      tempErrors.email = 'Enter a valid email address';
    }
    if (!cleanPhoneNumber) {
      tempErrors.phoneNumber = 'Phone number is required';
    } else if (!PHONE_PATTERN.test(cleanPhoneNumber)) {
      tempErrors.phoneNumber = 'Enter a valid phone number with 8 to 15 digits';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters';
    } else if (password.length > 72) {
      tempErrors.password = 'Password must be at most 72 characters';
    }
    setFirstName(cleanFirstName);
    setLastName(cleanLastName);
    setEmail(cleanEmail);
    setPhoneNumber(cleanPhoneNumber);
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await authApi.register({
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.replace(/[\s()-]/g, ''),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      showToast(
        res.message ||
          'Account created successfully! Please verify your email.',
        'success',
      );
      const normalizedEmail = email.trim().toLowerCase();
      navigate(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`, {
        state: {
          email: normalizedEmail,
          password,
          returnTo: (location.state as { returnTo?: unknown } | null)?.returnTo,
        },
      });
    } catch (err: unknown) {
      console.error(err);
      const apiError = err as ApiError;
      const fieldErrors = getValidationFields(apiError);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }
      showToast(
        apiError.message || 'Registration failed. Please try again.',
        'error',
      );
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
          maxWidth: '450px',
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
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            Create Account
          </h2>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Join Crusaders store today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="register-name-row"
            style={{ display: 'flex', gap: '1rem' }}
          >
            <Input
              label="First Name"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              disabled={isLoading}
              autoComplete="given-name"
              containerClassName="form-col"
              style={{ flex: 1 }}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              disabled={isLoading}
              autoComplete="family-name"
              containerClassName="form-col"
              style={{ flex: 1 }}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
            autoComplete="email"
          />

          <Input
            label="Phone Number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+961 70 123 456"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={errors.phoneNumber}
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
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            className="auth-submit-btn"
            style={{ width: '100%', marginTop: '0.5rem', height: '2.75rem' }}
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        {/* Switch to Login */}
        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
          </span>
          <Link to="/login" state={location.state} style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
