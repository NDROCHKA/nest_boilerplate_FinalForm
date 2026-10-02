import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { resolveImageUrl } from '../../utils/imageUrl';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, totalAmount, totalItems } = useCart();
  const navigate = useNavigate();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const shippingCost: number = 4.00; // Flat $4 delivery across Lebanon
  const grandTotal = totalAmount + shippingCost;

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
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
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'fadeIn 200ms ease forwards',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: '#0a0a0f',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000,
          animation: 'slideLeft 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-bg-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} style={{ color: 'var(--color-accent)' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
              Shopping Bag ({totalItems})
            </h3>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Delivery Info Banner */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--color-bg-tertiary)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            fontWeight: 600,
          }}
        >
          <Truck size={16} style={{ color: 'var(--color-accent)' }} />
          <span>Flat $4.00 Delivery across Lebanon (4-7 Days)</span>
        </div>

        {/* Cart Items Scroll Container */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                gap: '1rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <div>
                <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Your bag is empty</h4>
                <p style={{ fontSize: '0.875rem' }}>Explore our streetwear catalog and gear up.</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  closeCart();
                  navigate('/products');
                }}
                style={{ marginTop: '0.5rem' }}
              >
                Shop Collection
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                style={{
                  padding: '1rem',
                  background: 'var(--color-bg-glass)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                {/* Product Thumbnail */}
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: 'var(--color-bg-tertiary)',
                    flexShrink: 0,
                  }}
                >
                  {item.imageUrl ? (
                    <img src={resolveImageUrl(item.imageUrl)} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
                      <ShoppingBag size={20} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.productName}
                  </h5>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '0.5rem' }}>
                    <span>Size: <strong style={{ color: 'var(--color-text-primary)' }}>{item.selectedSize}</strong></span>
                    <span>Color: <strong style={{ color: 'var(--color-text-primary)' }}>{item.selectedColor}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-bg-tertiary)',
                          color: 'var(--color-text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, width: '22px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-bg-tertiary)',
                          color: 'var(--color-text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                        }}
                      >
                        +
                      </button>
                    </div>

                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                      ${(item.effectivePrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.productId, item.selectedSize, item.selectedColor)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    borderRadius: '4px',
                  }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--color-border)',
              background: 'var(--color-bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>${totalAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Lebanon Delivery (4-7 Days)</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  ${shippingCost.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  marginTop: '0.25rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <span>Total</span>
                <span style={{ color: 'var(--color-accent)' }}>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleCheckoutClick}
              style={{
                width: '100%',
                height: '3.25rem',
                fontSize: '1rem',
                fontWeight: 700,
                gap: '0.5rem',
              }}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
