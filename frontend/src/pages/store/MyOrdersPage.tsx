import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Calendar, DollarSign } from 'lucide-react';
import { orderApi } from '../../api/order.api';
import { Order } from '../../types/order.types';
import { usePagination } from '../../hooks/usePagination';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    setTotalCount,
  } = usePagination(10);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await orderApi.getMyOrders({ page, limit });
        setOrders(res.data);
        setTotalCount(res.totalCount);
      } catch (e) {
        console.error('Failed to load my orders:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, setTotalCount]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'muted';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>My Orders</h1>
        <p>Track shipment status and order history</p>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No Orders Placed Yet"
          description="It looks like you haven't placed any orders yet. Go back to our products page and find something you like!"
          icon={<ShoppingBag size={48} />}
          action={
            <Link to="/products" className="btn btn-primary">
              Browse Store
            </Link>
          }
        />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                }}
              >
                {/* Details */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', flex: 1 }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Order ID</span>
                    <h4 style={{ margin: 0 }}>#{order.id}</h4>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Calendar size={12} />
                      Placed On
                    </span>
                    <h5 style={{ margin: 0, fontWeight: 500 }}>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </h5>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <DollarSign size={12} />
                      Total Amount
                    </span>
                    <h5 style={{ margin: 0, color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      ${order.totalAmount.toFixed(2)}
                    </h5>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                      Status
                    </span>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </div>
                </div>

                {/* Action */}
                <div>
                  <Link
                    to={`/my-orders/${order.id}`}
                    className="btn btn-secondary"
                    style={{ gap: '0.35rem' }}
                  >
                    <Eye size={16} />
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onPageChange={goToPage}
            onNextPage={nextPage}
            onPrevPage={prevPage}
          />
        </>
      )}
    </div>
  );
};
