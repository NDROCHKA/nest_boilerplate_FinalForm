import React from 'react';

interface CrusaderLogoProps {
  size?: number;
  variant?: 'image' | 'svg';
  showText?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CrusaderLogo: React.FC<CrusaderLogoProps> = ({
  size = 36,
  variant = 'image',
  showText = false,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`crusader-logo-wrap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        ...style,
      }}
    >
      {variant === 'image' ? (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: '1/1',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 15px rgba(214, 48, 49, 0.25)',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/logo.jpg"
            alt="Crusader Collective"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              // Fallback if image fails
              (e.currentTarget as HTMLImageElement).src = '/logo.png';
            }}
          />
        </div>
      ) : (
        /* High-fidelity Vector SVG matching the Crown of Thorns and Cedar Silhouette */
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            flexShrink: 0,
            filter: 'drop-shadow(0 0 12px rgba(214, 48, 49, 0.35))',
          }}
        >
          {/* Inner & Outer Woven Thorns Ring */}
          <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="2.5" strokeDasharray="7 3" />
          <circle cx="50" cy="50" r="38" stroke="white" strokeWidth="1.2" opacity="0.7" />

          {/* Detailed Sharp Thorns inward & outward */}
          <path d="M50 3 L53 12 L47 12 Z" fill="white" />
          <path d="M97 50 L88 53 L88 47 Z" fill="white" />
          <path d="M50 97 L47 88 L53 88 Z" fill="white" />
          <path d="M3 50 L12 47 L12 53 Z" fill="white" />

          <path d="M16 16 L24 23 L20 27 Z" fill="white" />
          <path d="M84 16 L76 23 L80 27 Z" fill="white" />
          <path d="M84 84 L76 77 L80 73 Z" fill="white" />
          <path d="M16 84 L24 77 L20 73 Z" fill="white" />

          <path d="M30 8 L33 16 L27 15 Z" fill="white" />
          <path d="M70 8 L73 15 L67 16 Z" fill="white" />
          <path d="M92 30 L85 33 L84 27 Z" fill="white" />
          <path d="M92 70 L84 73 L85 67 Z" fill="white" />
          <path d="M30 92 L27 84 L33 85 Z" fill="white" />
          <path d="M70 92 L67 85 L73 84 Z" fill="white" />
          <path d="M8 30 L15 27 L16 33 Z" fill="white" />
          <path d="M8 70 L16 67 L15 73 Z" fill="white" />

          {/* Authentic Lebanese Cedar Tree Silhouette (Arz Libnan) */}
          <rect x="47" y="68" width="6" height="12" fill="white" rx="1" />

          {/* Layer 1 - Bottom Tier */}
          <path
            d="M50 48 C32 58, 20 62, 18 68 C30 67, 42 66, 50 64 C58 66, 70 67, 82 68 C80 62, 68 58, 50 48 Z"
            fill="white"
          />
          {/* Layer 2 - Middle Tier */}
          <path
            d="M50 36 C36 46, 26 50, 24 55 C34 54, 44 53, 50 51 C56 53, 66 54, 76 55 C74 50, 64 46, 50 36 Z"
            fill="white"
          />
          {/* Layer 3 - Top Tier */}
          <path
            d="M50 24 C40 33, 32 37, 30 42 C38 41, 44 40, 50 38 C56 40, 62 41, 70 42 C68 37, 60 33, 50 24 Z"
            fill="white"
          />
          {/* Top Peak */}
          <polygon points="50,18 42,28 58,28" fill="white" />
        </svg>
      )}

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--color-text-primary)' }}>
            Crusader
          </span>
          <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            COLLECTIVE
          </span>
        </div>
      )}
    </div>
  );
};
