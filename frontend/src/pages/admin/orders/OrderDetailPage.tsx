import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ShieldAlert, Truck, CreditCard, Phone, MapPin, CheckCircle, XCircle, Package } from 'lucide-react';
import { orderAdminApi } from '../../../api/order-admin.api';
import { Order, OrderStatusEnum } from '../../../types/order.types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../context/ToastContext';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await orderAdminApi.getById(Number(id));
      setOrder(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load order details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (nextStatus: OrderStatusEnum) => {
    if (!order) return;
    if (!window.confirm(`Are you sure you want to transition order status to "${nextStatus}"?`)) return;

    setIsUpdating(true);
    try {
      const updated = await orderAdminApi.updateStatus(order.id, nextStatus);
      setOrder(updated);
      showToast(`Order status updated to ${nextStatus}`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to transition order status.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'muted';
    }
  };

  // Define allowed transitions in UI matching backend invariants
  const getAllowedTransitions = (status: OrderStatusEnum): OrderStatusEnum[] => {
    switch (status) {
      case OrderStatusEnum.pending:
        return [OrderStatusEnum.confirmed, OrderStatusEnum.cancelled];
      case OrderStatusEnum.confirmed:
        return [OrderStatusEnum.shipped, OrderStatusEnum.cancelled];
      case OrderStatusEnum.shipped:
        return [OrderStatusEnum.delivered];
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }} className="animate-fade-in">
        <ShieldAlert size={48} style={{ color: 'var(--color-danger)', marginBottom: '1rem' }} />
        <h2>Order Not Found</h2>
        <p style={{ margin: '0.5rem 0 1.5rem 0' }}>{errorMsg || 'We could not find the order details requested.'}</p>
        <Link to="/admin/orders">
          <Button variant="secondary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const nextActions = getAllowedTransitions(order.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          to="/admin/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          <ChevronLeft size={16} />
          Back to orders directory
        </Link>
      </div>

      {/* Header Panel */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Order ID</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>#{order.id}</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Placed on {new Date(order.createdAt).toLocaleString()} (Customer ID: User #{order.userId})
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Current Status</span>
            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
          </div>
        </div>
      </div>

      {/* Status Transition Control Area */}
      {nextActions.length > 0 && (
        <div className="glass-card" style={{ border: '1px solid var(--color-border-focus)', background: 'rgba(108, 92, 231, 0.03)' }}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} style={{ color: 'var(--color-accent)' }} />
            Fulfillment Controls
          </h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {nextActions.map((nextSt) => {
              let btnVariant: 'primary' | 'secondary' | 'danger' = 'secondary';
              let icon = <CheckCircle size={16} />;

              if (nextSt === OrderStatusEnum.confirmed) {
                btnVariant = 'primary';
              } else if (nextSt === OrderStatusEnum.shipped) {
                btnVariant = 'primary';
                icon = <Truck size={16} />;
              } else if (nextSt === OrderStatusEnum.delivered) {
                btnVariant = 'primary';
              } else if (nextSt === OrderStatusEnum.cancelled) {
                btnVariant = 'danger';
                icon = <XCircle size={16} />;
              }

              return (
                <Button
                  key={nextSt}
                  variant={btnVariant}
                  onClick={() => handleStatusUpdate(nextSt)}
                  disabled={isUpdating}
                  icon={icon}
                  style={{ textTransform: 'capitalize' }}
                >
                  Mark as {nextSt}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
            <MapPin size={18} />
            <h4 style={{ margin: 0 }}>Shipping Address</h4>
          </div>
          <p style={{ color: 'var(--color-text-primary)' }}>{order.shippingAddress}</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
            <Phone size={18} />
            <h4 style={{ margin: 0 }}>Contact Phone</h4>
          </div>
          <p style={{ color: 'var(--color-text-primary)' }}>{order.phoneNumber}</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
            <CreditCard size={18} />
            <h4 style={{ margin: 0 }}>Payment Method</h4>
          </div>
          <p style={{ color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>
            {order.paymentMethod.replace(/_/g, ' ')}
          </p>
        </div>
      </div>

      {/* Items list */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3>Order Items</h3>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {order.items?.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem',
              }}
            >
              <div>
                <h4 style={{ margin: 0 }}>{item.productName || `Product #${item.productId}`}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Size: <strong>{item.size}</strong> | Color: <strong>{item.color}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                    Unit Price
                  </span>
                  <span style={{ fontSize: '0.875rem' }}>
                    ${item.effectivePriceAtPurchase.toFixed(2)}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                    Qty
                  </span>
                  <span style={{ fontSize: '0.875rem' }}>{item.quantity}</span>
                </div>
                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                    Subtotal
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                    ${(item.effectivePriceAtPurchase * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing calculations */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
              <span>{order.totalAmount >= 100 ? 'Free' : '$9.99'}</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem' }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--color-accent)' }}>
                ${(order.totalAmount + (order.totalAmount >= 100 ? 0 : 9.99)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
