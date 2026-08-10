import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ShieldAlert, Award, Star, Truck, Ruler } from 'lucide-react';
import { productApi } from '../../api/product.api';
import { Product } from '../../types/product.types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { resolveImageUrl } from '../../utils/imageUrl';
import { SizeGuideModal } from '../../components/modals/SizeGuideModal';
import { detectFitCategory } from '../../utils/sizeCharts';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      setErrorMsg('');
      try {
        const prod = await productApi.getById(Number(id));
        
        // Safety check if product isn't active
        if (!prod || !prod.isActive) {
          setErrorMsg('Product is not active or could not be found.');
          return;
        }

        setProduct(prod);

        // Select first image by default
        if (prod.images && prod.images.length > 0) {
          const sorted = [...prod.images].sort((a, b) => a.sortOrder - b.sortOrder);
          setSelectedImage(sorted[0].url);
        }

        // Set default size and color if available
        if (prod.sizes && prod.sizes.length > 0) {
          setSelectedSize(prod.sizes[0]);
        }
        if (prod.colors && prod.colors.length > 0) {
          setSelectedColor(prod.colors[0]);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Product could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }
    if (!selectedColor) {
      showToast('Please select a color', 'error');
      return;
    }

    addItem(product, selectedSize, selectedColor, quantity);
    showToast(`Added ${quantity}x ${product.name} to cart`, 'success');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }} className="animate-fade-in">
        <ShieldAlert size={48} style={{ color: 'var(--color-danger)', marginBottom: '1rem' }} />
        <h2>Product Not Found</h2>
        <p style={{ margin: '0.5rem 0 1.5rem 0' }}>{errorMsg || 'We could not find the product you requested.'}</p>
        <Link to="/products">
          <Button variant="secondary">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const sortedImages = product.images
    ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          <ChevronLeft size={16} />
          Back to catalog
        </Link>
      </div>

      {/* Detail grid */}
      <div
        className="product-detail-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Images column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main preview */}
          <div
            className="product-main-image"
            style={{
              width: '100%',
              height: '420px',
              background: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selectedImage ? (
              <img
                src={resolveImageUrl(selectedImage)}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <ShoppingBag size={64} style={{ color: 'var(--color-text-muted)' }} />
            )}
          </div>

          {/* Thumbnails row */}
          {sortedImages.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {sortedImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className="product-thumbnail-btn"
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: selectedImage === img.url ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    padding: 0,
                    flexShrink: 0,
                    cursor: 'pointer',
                    background: 'var(--color-bg-tertiary)',
                  }}
                >
                  <img src={resolveImageUrl(img.url)} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Title Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase' }}>
              {product.categoryName || 'Catalog'}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                ${product.effectivePrice.toFixed(2)}
              </span>
              {product.discountPercent && product.discountPercent > 0 && (
                <>
                  <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    style={{
                      background: 'var(--color-danger-bg)',
                      color: 'var(--color-danger)',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                    }}
                  >
                    Save {product.discountPercent}%
                  </span>
                </>
              )}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Description */}
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Description</h4>
            <p>{product.description || 'No description provided for this item.'}</p>
          </div>

          {/* Options Selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ margin: 0 }}>Select Size</label>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-accent)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    <Ruler size={15} />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className="btn size-color-btn"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: selectedSize === sz ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                        background: selectedSize === sz ? 'var(--color-accent-glow)' : 'var(--color-bg-secondary)',
                        color: selectedSize === sz ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        minWidth: '40px',
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label style={{ marginBottom: '0.5rem' }}>Select Color</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {product.colors.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setSelectedColor(clr)}
                      className="btn size-color-btn"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: selectedColor === clr ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                        background: selectedColor === clr ? 'var(--color-accent-glow)' : 'var(--color-bg-secondary)',
                        color: selectedColor === clr ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <label style={{ marginBottom: '0.5rem' }}>Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Button
                    variant="secondary"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    style={{ padding: '0.5rem 0.75rem', minWidth: 0 }}
                  >
                    -
                  </Button>
                  <span
                    style={{
                      width: '40px',
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                    disabled={quantity >= product.stock}
                    style={{ padding: '0.5rem 0.75rem', minWidth: 0 }}
                  >
                    +
                  </Button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginLeft: '0.5rem' }}>
                    ({product.stock} items in stock)
                  </span>
                </div>
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Action Trigger */}
          {product.stock > 0 ? (
            <Button
              variant="primary"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              style={{ height: '3rem', width: '100%', gap: '0.5rem', fontSize: '1rem' }}
            >
              <ShoppingBag size={20} />
              Add to Shopping Cart
            </Button>
          ) : (
            <Button variant="danger" disabled style={{ height: '3rem', width: '100%' }}>
              Out of stock
            </Button>
          )}

          {/* Logistics benefits info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <Truck size={16} style={{ color: 'var(--color-accent)' }} />
              <span>Cash on delivery available. Free delivery on all Lebanon orders.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <Award size={16} style={{ color: 'var(--color-success)' }} />
              <span>Official Crusaders Premium Grade Guarantee.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialCategory={detectFitCategory(product?.categoryName || product?.name)}
      />
    </div>
  );
};
