import React, { useEffect, useState } from 'react';
import { ArrowLeft, KeyRound, Mail, ShieldCheck, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { authApi } from '../../api/auth.api';
import { CrusaderLogo } from '../../components/brand/CrusaderLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

type ResetStep = 'email' | 'otp' | 'password';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return fallback;
};

export const ForgotPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const returnTo = (
    location.state as {
      returnTo?: { pathname?: string; search?: string; hash?: string };
    } | null
  )?.returnTo;

  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errors, setErrors] = useState<{
    email?: string;
    otpCode?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(
      () => setResendCooldown((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const validateEmail = (): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setErrors({ email: 'Enter a valid email address' });
      return false;
    }
    setEmail(normalizedEmail);
    setErrors({});
    return true;
  };

  const requestCode = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!validateEmail() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword({
        email: email.trim().toLowerCase(),
      });
      setStep('otp');
      setOtpCode('');
      setResendCooldown(60);
      showToast(response.message, 'success');
    } catch (error: unknown) {
      showToast(
        getErrorMessage(error, 'Unable to request a reset code. Please try again.'),
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otpCode)) {
      setErrors({ otpCode: 'Enter the complete 6-digit code' });
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      const response = await authApi.verifyPasswordResetOtp({ email, otpCode });
      setResetToken(response.resetToken);
      setOtpCode('');
      setStep('password');
      showToast('Code verified. Choose your new password.', 'success');
    } catch (error: unknown) {
      showToast(
        getErrorMessage(error, 'The code could not be verified.'),
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitNewPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (newPassword.length < 8 || newPassword.length > 72) {
      nextErrors.newPassword = 'Password must be between 8 and 72 characters';
    }
    if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      const response = await authApi.resetPassword({
        email,
        resetToken,
        newPassword,
      });
      showToast(response.message, 'success');
      navigate('/login', {
        replace: true,
        state: { returnTo, email },
      });
    } catch (error: unknown) {
      showToast(
        getErrorMessage(error, 'Unable to reset your password. Request a new code.'),
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const heading =
    step === 'email'
      ? 'Forgot Your Password?'
      : step === 'otp'
        ? 'Enter Reset Code'
        : 'Choose New Password';
  const description =
    step === 'email'
      ? 'Enter your account email and we will send you a secure reset code.'
      : step === 'otp'
        ? `Enter the 6-digit code sent to ${email}. Check your spam folder too.`
        : 'Use a password between 8 and 72 characters that you do not reuse elsewhere.';

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
        style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <Link
            to="/login"
            state={{ returnTo }}
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
            Back to Sign In
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
            }}
          >
            <X size={18} />
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <CrusaderLogo size={64} variant="image" />
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              margin: '0 auto 0.75rem',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: 'var(--color-accent-glow)',
              color: 'var(--color-accent)',
            }}
          >
            {step === 'email' ? (
              <Mail size={21} />
            ) : step === 'otp' ? (
              <ShieldCheck size={21} />
            ) : (
              <KeyRound size={21} />
            )}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            {heading}
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              marginTop: '0.5rem',
            }}
          >
            {description}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={requestCode}>
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={errors.email}
              disabled={isLoading}
              autoFocus
            />
            <Button
              type="submit"
              variant="primary"
              style={{ width: '100%', height: '2.75rem' }}
              isLoading={isLoading}
            >
              Send Reset Code
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={verifyCode}>
            <Input
              label="6-Digit Code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              value={otpCode}
              onChange={(event) =>
                setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))
              }
              error={errors.otpCode}
              disabled={isLoading}
              autoFocus
              style={{ textAlign: 'center', letterSpacing: '0.4em', fontSize: '1.25rem' }}
            />
            <Button
              type="submit"
              variant="primary"
              style={{ width: '100%', height: '2.75rem' }}
              isLoading={isLoading}
            >
              Verify Code
            </Button>
            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem' }}>
              <button
                type="button"
                onClick={() => void requestCode()}
                disabled={isLoading || resendCooldown > 0}
                style={{
                  border: 0,
                  background: 'none',
                  color:
                    resendCooldown > 0
                      ? 'var(--color-text-muted)'
                      : 'var(--color-text-primary)',
                  cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend code'}
              </button>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={submitNewPassword}>
            <Input
              label="New Password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              error={errors.newPassword}
              disabled={isLoading}
              autoFocus
            />
            <Input
              label="Confirm New Password"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={errors.confirmPassword}
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="primary"
              style={{ width: '100%', height: '2.75rem' }}
              isLoading={isLoading}
            >
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
