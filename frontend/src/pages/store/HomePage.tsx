import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, FolderOpen, Heart } from 'lucide-react';
import { productApi } from '../../api/product.api';
import { categoryApi } from '../../api/category.api';
import { Product } from '../../types/product.types';
import { Category } from '../../types/category.types';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { getDailyPsalm } from '../../utils/psalms';
import { useToast } from '../../context/ToastContext';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dailyPsalm = getDailyPsalm();
  const { showToast } = useToast();

  const handleShareVerse = () => {
    const shareText = `"${dailyPsalm.text}" — ${dailyPsalm.reference} | Crusaders Collective`;
    navigator.clipboard.writeText(shareText);
    showToast('Scripture copied to clipboard! Share the armor.', 'success');
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryApi.getAll({ limit: 4 }),
          productApi.getAll({ limit: 4 }),
        ]);
        setCategories(catRes.data);
        setFeaturedProducts(prodRes.data);
      } catch (e) {
        console.error('Failed to load home page content:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }} className="animate-fade-in mesh-glow-bg">
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 3rem',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 80% 50%, rgba(214, 48, 49, 0.15) 0%, transparent 60%), var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2.5rem',
          minHeight: '400px',
        }}
      >
        {/* Left Column: Text */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Subtitle Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--color-accent)', borderRadius: '1px' }} />
            <span style={{ color: 'var(--color-accent)' }}>LEBANON</span>
            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>CASH ON DELIVERY</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.05, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            WEAR THE <br />
            <span style={{ color: 'var(--color-accent)' }}>ARMOR</span> <br />
            OF FAITH
          </h1>

          {/* Description */}
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>
            Streetwear cut for the modern believer — built like armor, marked by the crown.
          </p>

          {/* Action Trigger Button */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Link to="/products">
              <Button variant="primary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.975rem', gap: '0.5rem' }}>
                Shop Catalog
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Logo Emblem */}
        <div
          style={{
            flex: '1 1 300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '280px',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(214, 48, 49, 0.12) 0%, transparent 70%)',
            }}
          >
            <svg
              width="220"
              height="220"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(214, 48, 49, 0.35))',
                animation: 'pulse 3s ease-in-out infinite alternate',
              }}
            >
              {/* Thorns circle */}
              <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="2" strokeDasharray="6 4" />
              {/* Little thorn spikes */}
              <path d="M50 4 L53 11 L47 11 Z" fill="white" />
              <path d="M96 50 L89 53 L89 47 Z" fill="white" />
              <path d="M50 96 L47 89 L53 89 Z" fill="white" />
              <path d="M4 50 L11 47 L11 53 Z" fill="white" />
              <path d="M18 18 L24 23 L21 26 Z" fill="white" />
              <path d="M82 18 L76 23 L79 26 Z" fill="white" />
              <path d="M82 82 L76 77 L79 74 Z" fill="white" />
              <path d="M18 82 L24 77 L21 74 Z" fill="white" />
              
              {/* Cedar Tree */}
              <rect x="47.5" y="66" width="5" height="13" fill="white" />
              <polygon points="50,20 32,44 68,44" fill="white" />
              <polygon points="50,35 26,58 74,58" fill="white" />
              <polygon points="50,48 20,70 80,70" fill="white" />
            </svg>
          </div>
        </div>

        {/* Local styling for logo animations */}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(214, 48, 49, 0.25)); }
            100% { transform: scale(1.03); filter: drop-shadow(0 0 35px rgba(214, 48, 49, 0.45)); }
          }
        `}</style>
      </section>

      {/* Daily Scripture Card */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
          padding: '3rem 2rem',
          borderRadius: 'var(--radius-lg)',
          background: 'radial-gradient(circle at 50% 50%, rgba(214, 48, 49, 0.08) 0%, transparent 80%), var(--color-bg-secondary)',
          border: '1px solid rgba(214, 48, 49, 0.15)',
          boxShadow: '0 10px 30px rgba(214, 48, 49, 0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="glow-card-red animate-slide-up"
      >
        {/* Decorative Quote Mark */}
        <span
          style={{
            position: 'absolute',
            top: '-10px',
            left: '20px',
            fontSize: '8rem',
            fontFamily: 'Georgia, serif',
            color: 'rgba(214, 48, 49, 0.08)',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          “
        </span>

        <div style={{ zIndex: 1, maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 800,
              letterSpacing: '0.25rem',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
            }}
          >
            Daily Armor & Bread
          </span>
          <p
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              lineHeight: 1.5,
              color: 'var(--color-text-primary)',
              fontStyle: 'italic',
              margin: '0.5rem 0',
            }}
          >
            "{dailyPsalm.text}"
          </p>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>
            — {dailyPsalm.reference}
          </span>
        </div>

        <Button
          variant="secondary"
          onClick={handleShareVerse}
          style={{
            padding: '0.5rem 1.25rem',
            fontSize: '0.8125rem',
            zIndex: 1,
            border: '1px solid rgba(214, 48, 49, 0.3)',
            background: 'rgba(214, 48, 49, 0.04)',
            color: 'var(--color-text-primary)',
          }}
        >
          Share Armor
        </Button>
      </section>

      {/* Categories Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2>Browse Categories</h2>
            <p>Shop by department or styles</p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="glass-panel glow-card-red"
              style={{
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1rem',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '2px solid var(--color-border)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--color-bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent)',
                  }}
                >
                  <FolderOpen size={36} />
                </div>
              )}
              <div>
                <h4 style={{ margin: 0 }}>{cat.name}</h4>
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {cat.description || 'Browse collection'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2>Featured Products</h2>
            <p>Handpicked style collections for you</p>
          </div>
          <Link to="/products" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {featuredProducts.map((prod) => {
            const thumbnail = prod.images && prod.images.length > 0
              ? prod.images.sort((a, b) => a.sortOrder - b.sortOrder)[0].url
              : null;

            return (
              <div key={prod.id} className="glass-card glow-card-red" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                {/* Product Image */}
                <Link to={`/products/${prod.id}`} style={{ position: 'relative', display: 'block', overflow: 'hidden', borderRadius: 'var(--radius-md)', height: '220px', background: 'var(--color-bg-tertiary)' }}>
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={prod.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
                      <ShoppingBag size={48} />
                    </div>
                  )}

                  {/* Discount Badge */}
                  {prod.discountPercent && prod.discountPercent > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'var(--color-danger)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                      }}
                    >
                      -{prod.discountPercent}%
                    </span>
                  )}
                </Link>

                {/* Product Info */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {prod.categoryName || 'General'}
                  </span>
                  <Link to={`/products/${prod.id}`} style={{ color: 'var(--color-text-primary)' }}>
                    <h4 style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {prod.name}
                    </h4>
                  </Link>
                  <p style={{ fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.5rem' }}>
                    {prod.description}
                  </p>

                  {/* Pricing */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      ${prod.effectivePrice.toFixed(2)}
                    </span>
                    {prod.discountPercent && prod.discountPercent > 0 && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        ${prod.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
