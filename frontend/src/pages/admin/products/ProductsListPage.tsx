import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ShoppingBag, Search } from 'lucide-react';
import { productAdminApi } from '../../../api/product-admin.api';
import { categoryAdminApi } from '../../../api/category-admin.api';
import { Product } from '../../../types/product.types';
import { Category } from '../../../types/category.types';
import { usePagination } from '../../../hooks/usePagination';
import { useDebounce } from '../../../hooks/useDebounce';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Table, Column } from '../../../components/ui/Table';
import { Pagination } from '../../../components/ui/Pagination';

export const ProductsListPage: React.FC = () => {
  const { showToast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [isLoading, setIsLoading] = useState(true);

  const {
    page,
    limit,
    totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    setTotalCount,
    resetPagination,
  } = usePagination(10);

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAdminApi.getAll({ limit: 100 });
        setCategories(res.data);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    };
    loadCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productAdminApi.getAll({
        page,
        limit,
        categoryId,
        search: debouncedSearch || undefined,
      });
      setProducts(res.data);
      setTotalCount(res.totalCount);
    } catch (e) {
      console.error('Failed to load products:', e);
      showToast('Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resetPagination();
  }, [categoryId, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [page, limit, categoryId, debouncedSearch]);

  const handleToggleActive = async (id: number) => {
    try {
      await productAdminApi.toggleActive(id);
      showToast('Product visibility toggled successfully', 'success');
      
      // Update local state instead of hard reloading to prevent API churn
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
      );
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to toggle status.', 'error');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;

    try {
      await productAdminApi.delete(id);
      showToast('Product deleted successfully', 'success');
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete product.', 'error');
    }
  };

  const columns: Column<Product>[] = [
    { key: 'id', header: 'ID', sortable: false },
    {
      key: 'name',
      header: 'Product Name',
      sortable: false,
      render: (item) => {
        const thumbnail = item.images && item.images.length > 0
          ? item.images.sort((a, b) => a.sortOrder - b.sortOrder)[0].url
          : null;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={item.name}
                style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  background: 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <ShoppingBag size={18} />
              </div>
            )}
            <div>
              <span style={{ fontWeight: 600, display: 'block' }}>{item.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {item.categoryName || 'General'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'price',
      header: 'Base Price',
      sortable: false,
      render: (item) => `$${item.price.toFixed(2)}`,
    },
    {
      key: 'discountPercent',
      header: 'Discount %',
      sortable: false,
      render: (item) => (item.discountPercent ? `${item.discountPercent}%` : '-'),
    },
    {
      key: 'effectivePrice',
      header: 'Effective Price',
      sortable: false,
      render: (item) => (
        <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
          ${item.effectivePrice.toFixed(2)}
        </span>
      ),
    },
    { key: 'stock', header: 'Stock', sortable: false },
    {
      key: 'isActive',
      header: 'Visibility',
      sortable: false,
      render: (item) => (
        <button
          onClick={() => handleToggleActive(item.id)}
          className="badge"
          style={{
            border: 'none',
            cursor: 'pointer',
            background: item.isActive ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
            color: item.isActive ? 'var(--color-success)' : 'var(--color-danger)',
            fontSize: '0.75rem',
            padding: '0.25rem 0.6rem',
            borderRadius: '999px',
            fontWeight: 600,
          }}
        >
          {item.isActive ? 'Visible' : 'Hidden'}
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/admin/products/${item.id}`}>
            <Button variant="secondary" style={{ padding: '0.4rem', minWidth: 0 }}>
              <Edit size={14} />
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={() => handleDelete(item.id, item.name)}
            style={{ padding: '0.4rem', minWidth: 0 }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }}>Products Inventory</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage store listings, sizes, colors, and stock</p>
        </div>
        <Link to="/admin/products/new">
          <Button variant="primary" style={{ gap: '0.35rem' }}>
            <Plus size={18} />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '2.25rem' }}
          />
        </div>

        {/* Category */}
        <div style={{ minWidth: '180px' }}>
          <select
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
            style={{ height: '2.25rem' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={products} isLoading={isLoading} />

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
