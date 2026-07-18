import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, Heart, ShoppingBag } from 'lucide-react';
import { productApi } from '../../api/product.api';
import { categoryApi } from '../../api/category.api';
import { Product } from '../../types/product.types';
import { Category } from '../../types/category.types';
import { usePagination } from '../../hooks/usePagination';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from query params
  const initialCategoryId = searchParams.get('categoryId')
    ? Number(searchParams.get('categoryId'))
    : undefined;
  const initialSearch = searchParams.get('search') || '';

  const [categoryId, setCategoryId] = useState<number | undefined>(initialCategoryId);
  const [search, setSearch] = useState<string>(initialSearch);
  const debouncedSearch = useDebounce(search, 400);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

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
  } = usePagination(8);

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryApi.getAll({ limit: 100 });
        setCategories(res.data);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    };
    loadCategories();
  }, []);

  // Update categories filters when categoryId or search query changes
  useEffect(() => {
    // Reset pagination to page 1 on search / filter updates
    resetPagination();
  }, [categoryId, debouncedSearch]);

  // Load products when page, limit, categoryId, or search changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      try {
        const res = await productApi.getAll({
          page,
          limit,
          categoryId,
          search: debouncedSearch || undefined,
        });
        setProducts(res.data);
        setTotalCount(res.totalCount);
      } catch (e) {
        console.error('Failed to query products', e);
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();

    // Synchronize URL search params
    const newParams: Record<string, string> = {};
    if (categoryId) newParams.categoryId = String(categoryId);
    if (debouncedSearch) newParams.search = debouncedSearch;
    newParams.page = String(page);
    setSearchParams(newParams);
  }, [page, limit, categoryId, debouncedSearch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Shop Catalog</h1>
        <p>Explore all active items and designer clothing</p>
      </div>

      {/* Filters Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flex: 1, minWidth: '280px', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ minWidth: '200px' }}>
            <select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
              style={{ width: '100%' }}
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

        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Showing {products.length} of {totalCount} items
        </div>
      </div>

      {/* Products Grid */}
      {isProductsLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description="We couldn't find any items matching your selected filters. Try adjusting your search query."
          icon={<ShoppingBag size={48} />}
        />
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {products.map((prod) => {
              const thumbnail = prod.images && prod.images.length > 0
                ? prod.images.sort((a, b) => a.sortOrder - b.sortOrder)[0].url
                : null;

              return (
                <div key={prod.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
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
