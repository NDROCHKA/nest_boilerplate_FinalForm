import React, { useState } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { getDailyPsalm } from '../../utils/psalms';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';

interface ShareArmorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareArmorModal: React.FC<ShareArmorModalProps> = ({ isOpen, onClose }) => {
  const dailyPsalm = getDailyPsalm();
  const { showToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quoteText = `"${dailyPsalm.text}"`;
  const quoteRef = `— ${dailyPsalm.reference}`;
  const fullShareMessage = `${quoteText} ${quoteRef} | Crusaders Collective`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullShareMessage);
    setCopied(true);
    showToast('Scripture copied to clipboard! Share the armor.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Crusaders Daily Armor',
          text: fullShareMessage,
          url: window.location.origin,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyText();
    }
  };

  const handleDownloadImage = () => {
    setIsGenerating(true);

    try {
      // High resolution 1080x1920 canvas (9:16 Instagram/TikTok story format)
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        showToast('Could not initialize image renderer', 'error');
        setIsGenerating(false);
        return;
      }

      // Background gradient
      const bgGrad = ctx.createRadialGradient(540, 960, 100, 540, 960, 1100);
      bgGrad.addColorStop(0, '#130507');
      bgGrad.addColorStop(0.5, '#0b0b10');
      bgGrad.addColorStop(1, '#050507');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Red Glow Effect Ring at center
      const glowGrad = ctx.createRadialGradient(540, 960, 50, 540, 960, 500);
      glowGrad.addColorStop(0, 'rgba(214, 48, 49, 0.18)');
      glowGrad.addColorStop(1, 'rgba(214, 48, 49, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Outer Card Frame Border
      ctx.strokeStyle = 'rgba(214, 48, 49, 0.35)';
      ctx.lineWidth = 6;
      ctx.strokeRect(60, 60, 960, 1800);

      // Inner subtle border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 80, 920, 1760);

      // Top Tagline Badge
      ctx.fillStyle = '#d63031';
      ctx.font = 'bold 30px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CRUSADERS COLLECTIVE', 540, 240);

      ctx.fillStyle = '#9494a8';
      ctx.font = '600 24px "Inter", sans-serif';
      ctx.fillText('DAILY ARMOR & BREAD', 540, 285);

      // Decorative Line
      ctx.strokeStyle = 'rgba(214, 48, 49, 0.4)';
      ctx.beginPath();
      ctx.moveTo(440, 320);
      ctx.lineTo(640, 320);
      ctx.stroke();

      // Draw Crown / Tree Symbol (Simple vector representation)
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(540, 480, 90, 0, Math.PI * 2);
      ctx.stroke();

      // Tree trunk
      ctx.fillStyle = 'white';
      ctx.fillRect(533, 505, 14, 40);
      // Tree triangles
      ctx.beginPath();
      ctx.moveTo(540, 410); ctx.lineTo(480, 460); ctx.lineTo(600, 460); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(540, 440); ctx.lineTo(465, 490); ctx.lineTo(615, 490); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(540, 470); ctx.lineTo(450, 520); ctx.lineTo(630, 520); ctx.closePath(); ctx.fill();

      // Quote Text (Wrap multi-line)
      ctx.fillStyle = '#f5f5fa';
      ctx.font = 'italic 500 52px "Outfit", serif';
      ctx.textAlign = 'center';

      const words = quoteText.split(' ');
      let line = '';
      const lines: string[] = [];
      const maxWidth = 800;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      let startY = 860 - (lines.length * 35);
      lines.forEach((l) => {
        ctx.fillText(l.trim(), 540, startY);
        startY += 75;
      });

      // Reference
      ctx.fillStyle = '#d63031';
      ctx.font = 'bold 42px "Outfit", sans-serif';
      ctx.fillText(quoteRef, 540, startY + 50);

      // Bottom Footer Branding
      ctx.fillStyle = '#9494a8';
      ctx.font = '600 24px "Inter", sans-serif';
      ctx.fillText('BE STRONG & COURAGEOUS', 540, 1680);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '20px "Inter", sans-serif';
      ctx.fillText('CRUSADERS-COLLECTIVE.COM', 540, 1725);

      // Convert to image and trigger download
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `crusaders-daily-armor-${dailyPsalm.reference.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = imageUri;
      link.click();

      showToast('Story card downloaded! Ready for Instagram/TikTok.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to generate story card image.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          animation: 'fadeIn 200ms ease forwards',
        }}
      />

      {/* Modal Card */}
      <div
        className="glass-card animate-slide-up"
        style={{
          position: 'relative',
          zIndex: 10000,
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          border: '1px solid rgba(214, 48, 49, 0.3)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '50%',
          }}
        >
          <X size={22} />
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--color-accent)', fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            <Sparkles size={16} />
            Share Daily Verse
          </div>
          <h3 style={{ margin: '0.25rem 0 0 0', fontWeight: 800 }}>Story & Scripture Card</h3>
        </div>

        {/* Live 9:16 Instagram Story Preview */}
        <div
          style={{
            width: '240px',
            height: '426px', // 9:16 aspect ratio
            borderRadius: '16px',
            background: 'radial-gradient(circle at 50% 30%, rgba(214, 48, 49, 0.2) 0%, transparent 70%), #0a0a10',
            border: '1px solid rgba(214, 48, 49, 0.4)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(214, 48, 49, 0.2)',
            padding: '1.25rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header Branding */}
          <div>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              CRUSADERS COLLECTIVE
            </span>
            <span style={{ display: 'block', fontSize: '0.55rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
              DAILY VERSE
            </span>
          </div>

          {/* Quote Body */}
          <div style={{ padding: '0 0.5rem' }}>
            <p style={{ fontSize: '0.9375rem', fontStyle: 'italic', fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', lineHeight: 1.45, margin: '0 0 0.5rem 0' }}>
              "{dailyPsalm.text}"
            </p>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)' }}>
              — {dailyPsalm.reference}
            </span>
          </div>

          {/* Footer Branding */}
          <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            BE STRONG & COURAGEOUS
          </span>
        </div>

        {/* Actions Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button
            variant="primary"
            onClick={handleDownloadImage}
            isLoading={isGenerating}
            style={{ width: '100%', gap: '0.5rem', height: '2.75rem' }}
          >
            <Download size={18} />
            Download Story Card (PNG)
          </Button>

          <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
            {typeof navigator.share === 'function' && (
              <Button
                variant="secondary"
                onClick={handleNativeShare}
                style={{ flex: 1, gap: '0.4rem', height: '2.5rem' }}
              >
                <Share2 size={16} />
                Share
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={handleCopyText}
              style={{ flex: 1, gap: '0.4rem', height: '2.5rem' }}
            >
              {copied ? <Check size={16} style={{ color: 'var(--color-success)' }} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Text'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
