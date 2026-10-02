import React, { useState } from 'react';
import { Ruler, Sparkles, Info } from 'lucide-react';
import { SIZE_CHARTS, FitCategoryKey, cmToInches } from '../../utils/sizeCharts';

export const SizeGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FitCategoryKey>('oversized');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }} className="animate-fade-in size-guide-page">
      {/* Hero Banner */}
      <section
        className="glass-card glow-card-red"
        style={{
          padding: '3.5rem 2.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'var(--color-accent-gradient)',
            padding: '0.75rem',
            borderRadius: '16px',
            color: 'white',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <Ruler size={36} />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 0.75rem 0',
          }}
        >
          Official Sizing & Fit Guide
        </h1>

        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '640px',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Engineered to fit precisely. Explore detailed garment measurements across our 3 signature silhouettes: <strong>Oversized T-Shirts</strong>, <strong>Regular Fit T-Shirts</strong>, and <strong>Hoodies & Outerwear</strong>.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
          <span>All measurements taken flat in centimeters (cm) with inch conversion</span>
        </div>
      </section>

      {/* Main Sizing Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Navigation & Unit Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* Fit Category Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              gap: '0.5rem',
            }}
          >
            {(Object.keys(SIZE_CHARTS) as FitCategoryKey[]).map((catKey) => {
              const cat = SIZE_CHARTS[catKey];
              const isActive = activeTab === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveTab(catKey)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: '0.9rem',
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

          {/* Unit Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Measurement Unit:</span>
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.25rem',
                borderRadius: '9999px',
                border: '1px solid var(--color-border)',
              }}
            >
              <button
                onClick={() => setUnit('cm')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: unit === 'cm' ? 'white' : 'transparent',
                  color: unit === 'cm' ? '#000' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                Centimeters (cm)
              </button>
              <button
                onClick={() => setUnit('in')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: unit === 'in' ? 'white' : 'transparent',
                  color: unit === 'in' ? '#000' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                Inches (in)
              </button>
            </div>
          </div>
        </div>

        {/* Selected Category Detail Card */}
        {(() => {
          const cat = SIZE_CHARTS[activeTab];
          return (
            <div
              className="glass-card"
              style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--color-accent)',
                      background: 'rgba(214, 48, 49, 0.12)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      border: '1px solid rgba(214, 48, 49, 0.3)',
                    }}
                  >
                    {cat.badge}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: '0.75rem 0 0.25rem 0' }}>
                    {cat.title}
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              {/* Garment Diagram & Measurement Table */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '2.5rem',
                  alignItems: 'center',
                }}
              >
                {/* SVG Garment Diagram */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'radial-gradient(circle, rgba(214, 48, 49, 0.08) 0%, transparent 80%), rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {cat.garmentType === 'tshirt' ? (
                    <svg width="240" height="220" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M70 30 C80 40, 140 40, 150 30 L195 55 L175 90 L160 80 L160 180 L60 180 L60 80 L45 90 L25 55 Z" stroke="white" strokeWidth="2.5" fill="rgba(255, 255, 255, 0.03)" />
                      <path d="M80 30 C90 45, 130 45, 140 30" stroke="white" strokeWidth="2" />

                      <line x1="110" y1="35" x2="110" y2="180" stroke="#d63031" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="110,35 106,42 114,42" fill="#d63031" />
                      <polygon points="110,180 106,173 114,173" fill="#d63031" />
                      <rect x="100" y="100" width="20" height="18" fill="#d63031" rx="4" />
                      <text x="110" y="113" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>

                      <line x1="60" y1="95" x2="160" y2="95" stroke="#00cec9" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="60,95 67,91 67,99" fill="#00cec9" />
                      <polygon points="160,95 153,91 153,99" fill="#00cec9" />
                      <rect x="75" y="86" width="20" height="18" fill="#00cec9" rx="4" />
                      <text x="85" y="99" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>

                      <line x1="150" y1="30" x2="185" y2="72" stroke="#fdcb6e" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="185,72 178,67 183,61" fill="#fdcb6e" />
                      <rect x="170" y="40" width="20" height="18" fill="#fdcb6e" rx="4" />
                      <text x="180" y="53" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>

                      <line x1="70" y1="30" x2="150" y2="30" stroke="#a29bfe" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="70,30 77,26 77,34" fill="#a29bfe" />
                      <polygon points="150,30 143,26 143,34" fill="#a29bfe" />
                      <rect x="100" y="21" width="20" height="18" fill="#a29bfe" rx="4" />
                      <text x="110" y="34" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">D</text>
                    </svg>
                  ) : (
                    <svg width="240" height="220" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M80 40 C85 20, 135 20, 140 40 L200 80 L175 110 L160 95 L160 180 L60 180 L60 95 L45 110 L20 80 Z" stroke="white" strokeWidth="2.5" fill="rgba(255, 255, 255, 0.03)" />
                      <path d="M75 140 L145 140 L155 175 L65 175 Z" stroke="white" strokeWidth="1.8" />

                      <line x1="110" y1="35" x2="110" y2="180" stroke="#d63031" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="110,35 106,42 114,42" fill="#d63031" />
                      <polygon points="110,180 106,173 114,173" fill="#d63031" />
                      <rect x="100" y="100" width="20" height="18" fill="#d63031" rx="4" />
                      <text x="110" y="113" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>

                      <line x1="60" y1="105" x2="160" y2="105" stroke="#00cec9" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="60,105 67,101 67,109" fill="#00cec9" />
                      <polygon points="160,105 153,101 153,109" fill="#00cec9" />
                      <rect x="75" y="96" width="20" height="18" fill="#00cec9" rx="4" />
                      <text x="85" y="109" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>

                      <line x1="140" y1="40" x2="188" y2="95" stroke="#fdcb6e" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="188,95 181,90 186,84" fill="#fdcb6e" />
                      <rect x="172" y="55" width="20" height="18" fill="#fdcb6e" rx="4" />
                      <text x="182" y="68" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>

                      <line x1="80" y1="40" x2="140" y2="40" stroke="#a29bfe" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="80,40 87,36 87,44" fill="#a29bfe" />
                      <polygon points="140,40 133,36 133,44" fill="#a29bfe" />
                      <rect x="100" y="31" width="20" height="18" fill="#a29bfe" rx="4" />
                      <text x="110" y="44" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">D</text>
                    </svg>
                  )}
                  <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    A = Garment Length | B = Chest Width | C = Sleeve Length | D = Shoulder Width
                  </div>
                </div>

                {/* Measurement Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'separate',
                      borderSpacing: 0,
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                        <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: 800 }}>
                          Measurement
                        </th>
                        {cat.sizes.map((s) => (
                          <th key={s} style={{ padding: '0.85rem 1.25rem', textAlign: 'center', fontSize: '1rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cat.measurements.map((row) => (
                        <tr key={row.key} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '0.85rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  fontWeight: 800,
                                  background: row.key === 'A' ? '#d63031' : row.key === 'B' ? '#00cec9' : row.key === 'C' ? '#fdcb6e' : '#a29bfe',
                                  color: row.key === 'C' || row.key === 'D' ? '#000' : '#fff',
                                }}
                              >
                                {row.key}
                              </span>
                              <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{row.label}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{row.description}</div>
                              </div>
                            </div>
                          </td>
                          {cat.sizes.map((s) => {
                            const valCm = row.valuesCm[s];
                            const val = unit === 'cm' ? `${valCm} cm` : `${cmToInches(valCm)} in`;
                            return (
                              <td key={s} style={{ padding: '0.85rem 1.25rem', textAlign: 'center', fontSize: '0.95rem', fontWeight: 700 }}>
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fit Guidance */}
              <div
                style={{
                  padding: '1.5rem 1.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <Info size={22} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 800 }}>Fit Advice for {cat.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {cat.fitDescription}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* How to Measure Instructions */}
      <section className="glass-card" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          How to Measure Your Favorite Shirt
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '0.5rem' }}>01. Length (A)</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Lay shirt flat. Measure from the highest point of the shoulder seam straight down to the bottom hem.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00cec9', marginBottom: '0.5rem' }}>02. Chest (B)</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Measure straight across the chest from armpit seam to armpit seam (pit to pit).
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fdcb6e', marginBottom: '0.5rem' }}>03. Sleeve (C)</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Measure from top shoulder seam straight down to the edge of the sleeve cuff.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a29bfe', marginBottom: '0.5rem' }}>04. Shoulder (D)</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Measure across the top of the shirt from left shoulder seam to right shoulder seam.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
