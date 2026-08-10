import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Heart, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';

import { CrusaderLogo } from '../../components/brand/CrusaderLogo';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }} className="animate-fade-in about-page">
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 2.5rem',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 30%, rgba(214, 48, 49, 0.18) 0%, transparent 70%), var(--color-bg-secondary)',
          border: '1px solid rgba(214, 48, 49, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
        }}
        className="mesh-glow-bg"
      >
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 800,
            letterSpacing: '0.25rem',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
          }}
        >
          OUR MANIFESTO & IDENTITY
        </span>

        <h1
          style={{
            fontSize: '3.25rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            maxWidth: '800px',
          }}
        >
          CLOTHED IN <span style={{ color: 'var(--color-accent)' }}>FAITH</span> & STRENGTH
        </h1>

        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '640px',
            lineHeight: 1.6,
          }}
        >
          Crusader Collective was founded in Lebanon to create streetwear that represents courage, conviction, and modern design. Every piece is constructed like armor for everyday endurance.
        </p>

        <Link to="/products" style={{ marginTop: '0.5rem' }}>
          <Button variant="primary" style={{ padding: '0.75rem 1.75rem', gap: '0.5rem' }}>
            Explore Catalog
            <ArrowRight size={18} />
          </Button>
        </Link>
      </section>

      {/* Emblem Story Breakdown */}
      <section
        className="glass-card"
        style={{
          padding: '3rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Emblem SVG Presentation */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'radial-gradient(circle, rgba(214, 48, 49, 0.1) 0%, transparent 80%), var(--color-bg-tertiary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <CrusaderLogo size={180} variant="image" />
          <span style={{ fontSize: '0.875rem', fontWeight: 800, marginTop: '1rem', letterSpacing: '0.1em', color: 'var(--color-accent)' }}>
            THE CROWN & THE CEDAR
          </span>
        </div>

        {/* Narrative text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2>The Meaning Behind Our Seal</h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            Our emblem brings together two powerful symbols of endurance and identity:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(214, 48, 49, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--color-accent)' }}>
                <Shield size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>The Crown of Thorns</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  Symbolizes sacrifice, victorious strength over hardship, and standing firm in conviction.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(214, 48, 49, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--color-accent)' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>The Cedar of Lebanon</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  Roots grounded in heritage, majesty, and unyielding longevity through all seasons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Pillars */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Built Without Compromise</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>How we design and manufacture every garment</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card glow-card-red" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
              <Award size={24} />
            </div>
            <h4 style={{ margin: 0 }}>Heavyweight Fabrics</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              We source ultra-soft 280-450 GSM french terry cotton and reinforced nylon for structure and comfort.
            </p>
          </div>

          <div className="glass-card glow-card-red" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
              <CheckCircle2 size={24} />
            </div>
            <h4 style={{ margin: 0 }}>Precision Tailoring</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Every stitch, seam, and custom metal hardware zipper is designed for longevity and a relaxed fit.
            </p>
          </div>

          <div className="glass-card glow-card-red" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
              <Heart size={24} />
            </div>
            <h4 style={{ margin: 0 }}>Lebanese Craft & COD</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Designed locally in Lebanon with nationwide Cash on Delivery service and 24/48-hour delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
