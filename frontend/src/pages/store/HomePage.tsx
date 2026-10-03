import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, FolderOpen } from 'lucide-react';
import { productApi } from '../../api/product.api';
import { categoryApi } from '../../api/category.api';
import { Product } from '../../types/product.types';
import { Category } from '../../types/category.types';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { getDailyPsalm } from '../../utils/psalms';
import { ShareArmorModal } from '../../components/modals/ShareArmorModal';
import { CrusaderLogo } from '../../components/brand/CrusaderLogo';
import { resolveImageUrl } from '../../utils/imageUrl';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const dailyPsalm = getDailyPsalm();

  const handleShareVerse = () => {
    setShareModalOpen(true);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }} className="animate-fade-in mesh-glow-bg home-page">
      {/* Hero Section */}
      <section
        className="hero-section"
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
        <div className="hero-text-col" style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Subtitle Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--color-accent)', borderRadius: '1px' }} />
            <span style={{ color: 'var(--color-accent)' }}>LEBANON</span>
            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>CASH ON DELIVERY</span>
          </div>

          {/* Heading */}
          <h1 className="hero-heading" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.05, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            WEAR THE <br />
            <span style={{ color: 'var(--color-accent)' }}>ARMOR</span> <br />
            OF FAITH
          </h1>

          {/* Description */}
          <p className="hero-description" style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>
            Streetwear cut for the modern believer — built like armor, marked by the crown.
          </p>

          {/* Action Trigger Buttons */}
          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              to="/products"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.975rem', gap: '0.5rem' }}
            >
              Shop Catalog
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/size-guide"
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', gap: '0.4rem' }}
            >
              Size Guide 📏
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Logo Emblem */}
        <div
          className="hero-emblem-col"
          style={{
            flex: '1 1 300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '240px',
          }}
        >
          <div
            className="hero-emblem-ring"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(214, 48, 49, 0.15) 0%, transparent 70%)',
            }}
          >
            <CrusaderLogo size={230} variant="image" />
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
        className="glow-card-red animate-slide-up scripture-card"
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
            Daily Verse
          </span>
          <p
            className="scripture-text"
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
          Share Daily Verse
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

        {/* Categories Horizontal Scroll Bar */}
        <div
          className="category-scroll-container"
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            paddingTop: '0.25rem',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                color: 'inherit',
                flexShrink: 0,
                width: '100px',
              }}
            >
              {cat.imageUrl ? (
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(214, 48, 49, 0.4)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    background: 'var(--color-bg-tertiary)',
                  }}
                >
                  <img
                    src={resolveImageUrl(cat.imageUrl)}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'var(--color-bg-tertiary)',
                    border: '2px solid rgba(214, 48, 49, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent)',
                  }}
                >
                  <FolderOpen size={30} />
                </div>
              )}
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.25,
                }}
              >
                {cat.name}
              </span>
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
          className="product-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {featuredProducts.map((prod) => {
            const thumbnail = prod.images && prod.images.length > 0
              ? resolveImageUrl(prod.images.sort((a, b) => a.sortOrder - b.sortOrder)[0].url)
              : null;

            return (
              <div
                key={prod.id}
                className="glass-card product-item-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  height: '100%',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {/* Product Image */}
                <Link
                  to={`/products/${prod.id}`}
                  className="product-image-link"
                  style={{
                    position: 'relative',
                    display: 'block',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-md)',
                    height: '200px',
                    width: '100%',
                    background: 'var(--color-bg-tertiary)',
                  }}
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={prod.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform var(--transition-normal)',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
                      <ShoppingBag size={44} />
                    </div>
                  )}

                  {/* Discount Badge */}
                  {prod.discountPercent && prod.discountPercent > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'var(--color-accent)',
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        borderRadius: '4px',
                      }}
                    >
                      -{prod.discountPercent}%
                    </span>
                  )}
                </Link>

                {/* Product Info */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {prod.categoryName || 'Collection'}
                  </span>
                  <Link to={`/products/${prod.id}`} style={{ color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                    <h4
                      className="product-card-title"
                      style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '2.4rem',
                      }}
                    >
                      {prod.name}
                    </h4>
                  </Link>

                  {/* Pricing */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.35rem' }}>
                    <span className="product-card-price" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                      ${prod.effectivePrice.toFixed(2)}
                    </span>
                    {prod.discountPercent && prod.discountPercent > 0 && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
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

      {/* Feature 5: Share Armor Instagram/TikTok Story Modal */}
      <ShareArmorModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </div>
  );
};
