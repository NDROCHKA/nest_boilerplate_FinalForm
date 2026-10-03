import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Filter } from 'lucide-react';
import { orderAdminApi } from '../../../api/order-admin.api';
import { Order, OrderStatusEnum } from '../../../types/order.types';
import { usePagination } from '../../../hooks/usePagination';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/ui/Badge';
import { Table, Column } from '../../../components/ui/Table';
import { Pagination } from '../../../components/ui/Pagination';

export const OrdersListPage: React.FC = () => {
  const { showToast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatusEnum | undefined>(undefined);
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
    resetPagination,
  } = usePagination(10);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await orderAdminApi.getAll({
        page,
        limit,
        status: statusFilter || undefined,
      });
      setOrders(res.data);
      setTotalCount(res.totalCount);
    } catch (e) {
      console.error('Failed to load admin orders:', e);
      showToast('Failed to load orders', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, setTotalCount, showToast, statusFilter]);

  useEffect(() => {
    resetPagination();
  }, [resetPagination, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'muted';
    }
  };

  const columns: Column<Order>[] = [
    { key: 'id', header: 'Order ID', sortable: false, render: (item) => `#${item.id}` },
    { key: 'userId', header: 'Customer ID', sortable: false, render: (item) => `User #${item.userId}` },
    {
      key: 'createdAt',
      header: 'Placed On',
      sortable: false,
      render: (item) => new Date(item.createdAt).toLocaleDateString() + ' ' + new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      sortable: false,
      render: (item) => `$${item.totalAmount.toFixed(2)}`,
    },
    {
      key: 'shippingAddress',
      header: 'Shipping Address',
      sortable: false,
      render: (item) => (
        <span style={{ display: 'block', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.shippingAddress}>
          {item.shippingAddress}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      render: (item) => <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item) => (
        <Link
          to={`/admin/orders/${item.id}`}
          className="btn btn-secondary"
          style={{ padding: '0.4rem', minWidth: 0 }}
        >
          <Eye size={14} />
        </Link>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}>Manage Orders</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Track and update order fulfillment processes</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <Filter size={16} style={{ color: 'var(--color-text-secondary)' }} />
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Status:</span>
        <div style={{ minWidth: '150px' }}>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value ? (e.target.value as OrderStatusEnum) : undefined)}
            style={{ height: '2.25rem', padding: '0.25rem 0.5rem' }}
          >
            <option value="">All Orders</option>
            {Object.values(OrderStatusEnum).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={orders} isLoading={isLoading} />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={goToPage}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  );
};
