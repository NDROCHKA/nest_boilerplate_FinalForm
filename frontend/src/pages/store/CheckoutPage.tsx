import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { orderApi } from '../../api/order.api';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const CheckoutPage: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Your cart is empty</h3>
        <p style={{ margin: '0.5rem 0 1.5rem 0' }}>Add items to your cart before checking out.</p>
        <Link to="/products">
          <Button variant="primary">Shop Products</Button>
        </Link>
      </div>
    );
  }

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!shippingAddress) tempErrors.shippingAddress = 'Shipping address is required';
    if (!phoneNumber) tempErrors.phoneNumber = 'Phone number is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
        })),
        shippingAddress,
        phoneNumber,
      };

      const result = await orderApi.create(orderPayload);
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/my-orders/${result.id}`);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to place order. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shipping = totalAmount >= 100 ? 0 : 9.99;
  const grandTotal = totalAmount + shipping;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Checkout</h1>
        <p>Complete your delivery and payment details</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="glass-card" style={{ flex: 1.5 }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Delivery Information</h3>

          <Input
            label="Shipping Address"
            placeholder="123 Main St, Apt 4B, New York, NY 10001"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            error={errors.shippingAddress}
            disabled={isSubmitting}
          />

          <Input
            label="Contact Phone Number"
            type="text"
            placeholder="+11234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={errors.phoneNumber}
            disabled={isSubmitting}
          />

          {/* Payment Method - Fixed to COD */}
          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <label>Payment Method</label>
            <div
              className="glass-panel"
              style={{
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid var(--color-accent)',
                background: 'var(--color-accent-glow)',
                borderRadius: '8px',
              }}
            >
              <CreditCard size={20} style={{ color: 'var(--color-accent)' }} />
              <div>
                <h5 style={{ margin: 0 }}>Cash On Delivery (COD)</h5>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Pay cash at your doorstep upon receiving the shipment.
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/cart">
              <Button variant="secondary" disabled={isSubmitting}>
                <ArrowLeft size={16} />
                Back to Cart
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={isSubmitting} style={{ minWidth: '150px' }}>
              Place COD Order
            </Button>
          </div>
        </form>

        {/* Order Summary Summary Panel */}
        <div className="glass-card" style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3>Your Order</h3>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Items Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.productName}
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Size: {item.selectedSize} | Color: {item.selectedColor}
                  </span>
                </div>
                <span>${(item.effectivePrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

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
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-accent)' }}>${grandTotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--color-success)' }} />
            <span>Secure checkout driven by Crusaders Storefront API.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
