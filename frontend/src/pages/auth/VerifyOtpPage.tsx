import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Shield, KeyRound, Mail, ArrowRight } from 'lucide-react';

export const VerifyOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // If no email in URL, redirect back to login
  useEffect(() => {
    if (!email) {
      showToast('No email address provided for verification.', 'error');
      navigate('/login');
    }
  }, [email, navigate, showToast]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, ''); // only allow digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // take the last entered char
    setOtp(newOtp);

    // Focus next input
    if (index < 5 && element.value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      // If current input is empty, clear the previous one and focus it
      if (!otp[index] && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').substring(0, 6);
    if (pastedData.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus last filled input or the next empty one
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      showToast('Please enter the full 6-digit verification code.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, otpCode });
      showToast(res.message || 'Email verified successfully! You can now log in.', 'success');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Verification failed. Please check the code and try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return;

    setResendLoading(true);
    try {
      const res = await authApi.resendOtp({ email });
      showToast(res.message || 'A new verification code has been sent to your email.', 'success');
      setResendCooldown(60); // 60s cooldown
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to resend verification code.', 'error');
    } finally {
      setResendLoading(false);
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
          maxWidth: '450px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
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
            <KeyRound size={28} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Verify Your Email
          </h2>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.825rem',
              marginTop: '0.5rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Mail size={14} style={{ color: 'var(--color-accent)' }} />
            <span>{email}</span>
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              marginTop: '1.25rem',
              maxWidth: '320px',
              lineHeight: '1.4',
            }}
          >
            Please check your inbox. If you don't see the code, make sure to check your <strong>spam or junk folder</strong>.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '2rem',
            }}
          >
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                style={{
                  width: '3.25rem',
                  height: '3.75rem',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  color: 'var(--color-text-primary)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-accent)';
                  e.target.style.boxShadow = '0 0 8px var(--color-accent-glow)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255, 255, 255, 0.02)';
                }}
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%', height: '2.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            isLoading={isLoading}
          >
            <span>Verify Email</span>
            <ArrowRight size={18} />
          </Button>
        </form>

        {/* Resend Action */}
        <div style={{ marginTop: '2rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Didn't receive the code? </span>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || resendLoading}
            style={{
              fontWeight: 600,
              color: resendCooldown > 0 ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
              textDecoration: resendCooldown > 0 ? 'none' : 'underline',
              transition: 'color 0.2s',
            }}
          >
            {resendLoading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
          </button>
        </div>

        {/* Back to login */}
        <div style={{ marginTop: '1.25rem', fontSize: '0.875rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
          <Link to="/login" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
