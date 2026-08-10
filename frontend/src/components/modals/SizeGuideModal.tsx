import React, { useState, useEffect } from 'react';
import { X, Ruler, Sparkles, Info, Check } from 'lucide-react';
import { SIZE_CHARTS, FitCategoryKey, cmToInches } from '../../utils/sizeCharts';
import { Button } from '../ui/Button';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: FitCategoryKey;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'oversized',
}) => {
  const [activeCategory, setActiveCategory] = useState<FitCategoryKey>(initialCategory);
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [isOpen, initialCategory]);

  if (!isOpen) return null;

  const currentChart = SIZE_CHARTS[activeCategory];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem 2.25rem',
          position: 'relative',
          border: '1px solid rgba(214, 48, 49, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(214, 48, 49, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
              <Ruler size={22} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Garment Fit & Measurements
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0 0' }}>
              Size Guide
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs & Unit Switcher Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.3rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              gap: '0.35rem',
              maxWidth: '100%',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {(Object.keys(SIZE_CHARTS) as FitCategoryKey[]).map((catKey) => {
              const cat = SIZE_CHARTS[catKey];
              const isActive = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategory(catKey)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: isActive ? 'var(--color-accent-gradient)' : 'transparent',
                    color: isActive ? 'white' : 'var(--color-text-secondary)',
                    boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>

          {/* Unit Toggle (cm / in) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Unit:</span>
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.2rem',
                borderRadius: '9999px',
                border: '1px solid var(--color-border)',
              }}
            >
              <button
                onClick={() => setUnit('cm')}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: unit === 'cm' ? 'white' : 'transparent',
                  color: unit === 'cm' ? '#000' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('in')}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: unit === 'in' ? 'white' : 'transparent',
                  color: unit === 'in' ? '#000' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                INCHES
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Garment Diagram & Measurement Table */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          {/* Visual Garment Diagram */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'radial-gradient(circle, rgba(214, 48, 49, 0.08) 0%, transparent 80%), rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--color-border)',
              position: 'relative',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-accent)',
                marginBottom: '1rem',
              }}
            >
              {currentChart.badge} Measurement Key
            </span>

            {/* SVG Garment Outline with Labeled Lines A, B, C, D */}
            {currentChart.garmentType === 'tshirt' ? (
              <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* T-Shirt Outline */}
                <path
                  d="M70 30 C80 40, 140 40, 150 30 L195 55 L175 90 L160 80 L160 180 L60 180 L60 80 L45 90 L25 55 Z"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  fill="rgba(255, 255, 255, 0.03)"
                />
                <path d="M80 30 C90 45, 130 45, 140 30" stroke="white" strokeWidth="2" />

                {/* Line A: Length */}
                <line x1="110" y1="35" x2="110" y2="180" stroke="#d63031" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="110,35 106,42 114,42" fill="#d63031" />
                <polygon points="110,180 106,173 114,173" fill="#d63031" />
                <rect x="100" y="100" width="20" height="18" fill="#d63031" rx="4" />
                <text x="110" y="113" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>

                {/* Line B: Chest */}
                <line x1="60" y1="95" x2="160" y2="95" stroke="#00cec9" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="60,95 67,91 67,99" fill="#00cec9" />
                <polygon points="160,95 153,91 153,99" fill="#00cec9" />
                <rect x="75" y="86" width="20" height="18" fill="#00cec9" rx="4" />
                <text x="85" y="99" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>

                {/* Line C: Sleeve */}
                <line x1="150" y1="30" x2="185" y2="72" stroke="#fdcb6e" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="185,72 178,67 183,61" fill="#fdcb6e" />
                <rect x="170" y="40" width="20" height="18" fill="#fdcb6e" rx="4" />
                <text x="180" y="53" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>

                {/* Line D: Shoulder */}
                <line x1="70" y1="30" x2="150" y2="30" stroke="#a29bfe" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="70,30 77,26 77,34" fill="#a29bfe" />
                <polygon points="150,30 143,26 143,34" fill="#a29bfe" />
                <rect x="100" y="21" width="20" height="18" fill="#a29bfe" rx="4" />
                <text x="110" y="34" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">D</text>
              </svg>
            ) : (
              <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Hoodie Outline */}
                <path
                  d="M80 40 C85 20, 135 20, 140 40 L200 80 L175 110 L160 95 L160 180 L60 180 L60 95 L45 110 L20 80 Z"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  fill="rgba(255, 255, 255, 0.03)"
                />
                {/* Hoodie Pocket */}
                <path d="M75 140 L145 140 L155 175 L65 175 Z" stroke="white" strokeWidth="1.8" />

                {/* Line A: Length */}
                <line x1="110" y1="35" x2="110" y2="180" stroke="#d63031" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="110,35 106,42 114,42" fill="#d63031" />
                <polygon points="110,180 106,173 114,173" fill="#d63031" />
                <rect x="100" y="100" width="20" height="18" fill="#d63031" rx="4" />
                <text x="110" y="113" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>

                {/* Line B: Chest */}
                <line x1="60" y1="105" x2="160" y2="105" stroke="#00cec9" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="60,105 67,101 67,109" fill="#00cec9" />
                <polygon points="160,105 153,101 153,109" fill="#00cec9" />
                <rect x="75" y="96" width="20" height="18" fill="#00cec9" rx="4" />
                <text x="85" y="109" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>

                {/* Line C: Sleeve */}
                <line x1="140" y1="40" x2="188" y2="95" stroke="#fdcb6e" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="188,95 181,90 186,84" fill="#fdcb6e" />
                <rect x="172" y="55" width="20" height="18" fill="#fdcb6e" rx="4" />
                <text x="182" y="68" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>

                {/* Line D: Shoulder */}
                <line x1="80" y1="40" x2="140" y2="40" stroke="#a29bfe" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="80,40 87,36 87,44" fill="#a29bfe" />
                <polygon points="140,40 133,36 133,44" fill="#a29bfe" />
                <rect x="100" y="31" width="20" height="18" fill="#a29bfe" rx="4" />
                <text x="110" y="44" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">D</text>
              </svg>
            )}

            <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              <span>A = Length | B = Chest | C = Sleeve | D = Shoulder</span>
            </div>
          </div>

          {/* Measurement Table */}
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
              }}
            >
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800 }}>Point</th>
                  {currentChart.sizes.map((size) => (
                    <th key={size} style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentChart.measurements.map((row) => {
                  const isHovered = hoveredRow === row.key;
                  return (
                    <tr
                      key={row.key}
                      onMouseEnter={() => setHoveredRow(row.key)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        background: isHovered ? 'rgba(214, 48, 49, 0.12)' : 'transparent',
                        transition: 'background 0.2s ease',
                        borderBottom: '1px solid var(--color-border)',
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '22px',
                              height: '22px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              background: row.key === 'A' ? '#d63031' : row.key === 'B' ? '#00cec9' : row.key === 'C' ? '#fdcb6e' : '#a29bfe',
                              color: row.key === 'C' || row.key === 'D' ? '#000' : '#fff',
                            }}
                          >
                            {row.key}
                          </span>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{row.label}</div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--color-text-secondary)' }}>{row.description}</div>
                          </div>
                        </div>
                      </td>
                      {currentChart.sizes.map((size) => {
                        const valCm = row.valuesCm[size];
                        const displayVal = unit === 'cm' ? `${valCm} cm` : `${cmToInches(valCm)} in`;

                        return (
                          <td key={size} style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fit Recommendation Note */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}
        >
          <Info size={20} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '0.2rem' }} />
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 800 }}>Fit Advice</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {currentChart.fitDescription}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose} style={{ padding: '0.6rem 1.5rem' }}>
            Close Guide
          </Button>
        </div>
      </div>
    </div>
  );
};
