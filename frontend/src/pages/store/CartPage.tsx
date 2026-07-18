import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          title="Your Cart is Empty"
          description="Looks like you haven't added any products to your shopping cart yet."
          icon={<ShoppingBag size={48} />}
          action={
            <Link to="/products">
              <Button variant="primary">
                <ArrowLeft size={16} />
                Continue Shopping
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const shipping = totalAmount >= 100 ? 0 : 9.99;
  const orderTotal = parseFloat((totalAmount + shipping).toFixed(2));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Shopping Cart</h1>
        <p>Review items before placing your order</p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1.6 }}>
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {/* Product Thumbnail */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--color-bg-tertiary)',
                  flexShrink: 0,
                }}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div style={{ flex: 1, minWidth: '150px' }}>
                <h4 style={{ margin: 0 }}>{item.productName}</h4>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  <span>Size: <strong>{item.selectedSize}</strong></span>
                  <span>Color: <strong>{item.selectedColor}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>${item.effectivePrice.toFixed(2)}</span>
                  {item.discountPercent && item.discountPercent > 0 && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Changer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Button
                  variant="secondary"
                  onClick={() => updateQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  style={{ padding: '0.25rem 0.5rem', minWidth: 0 }}
                >
                  -
                </Button>
                <span style={{ width: '30px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                <Button
                  variant="secondary"
                  onClick={() => updateQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity + 1)}
                  disabled={item.quantity >= item.maxStock}
                  style={{ padding: '0.25rem 0.5rem', minWidth: 0 }}
                >
                  +
                </Button>
              </div>

              {/* Total Item Price & Delete */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', justifyContent: 'space-between', minWidth: '120px' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                  ${(item.effectivePrice * item.quantity).toFixed(2)}
                </span>
                <Button
                  variant="text"
                  onClick={() => removeItem(item.productId, item.selectedSize, item.selectedColor)}
                  style={{ padding: '0.5rem', color: 'var(--color-danger)' }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="glass-card" style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3>Order Summary</h3>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                Add ${(100 - totalAmount).toFixed(2)} more to unlock free shipping!
              </span>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-accent)' }}>${orderTotal.toFixed(2)}</span>
          </div>

          <Link to="/checkout" style={{ width: '100%', marginTop: '0.5rem' }}>
            <Button variant="primary" style={{ width: '100%', height: '3rem', gap: '0.5rem' }}>
              Proceed to Checkout
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
