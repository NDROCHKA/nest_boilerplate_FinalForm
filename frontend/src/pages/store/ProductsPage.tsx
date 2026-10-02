import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { productApi } from '../../api/product.api';
import { categoryApi } from '../../api/category.api';
import { Product } from '../../types/product.types';
import { Category } from '../../types/category.types';
import { usePagination } from '../../hooks/usePagination';
import { useDebounce } from '../../hooks/useDebounce';
import { Pagination } from '../../components/ui/Pagination';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';

import { resolveImageUrl } from '../../utils/imageUrl';

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
  }, [categoryId, debouncedSearch, resetPagination]);

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
  }, [page, limit, categoryId, debouncedSearch, setSearchParams, setTotalCount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Shop Catalog</h1>
        <p>Explore all active items and designer clothing</p>
      </div>

      {/* Filters Bar */}
      <div
        className="catalog-filters-wrap"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
          {/* Search bar */}
          <div className="filter-search-box" style={{ position: 'relative', flex: '1 1 200px', width: '100%' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="catalog-search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="filter-category-box" style={{ flex: '1 1 200px', width: '100%' }}>
            <select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
              className="catalog-category-select"
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

        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
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
            className="product-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {products.map((prod) => {
              const thumbnail = prod.images && prod.images.length > 0
                ? resolveImageUrl([...prod.images].sort((a, b) => a.sortOrder - b.sortOrder)[0].url)
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
