import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { categoryAdminApi } from '../../../api/category-admin.api';
import { Category } from '../../../types/category.types';
import { usePagination } from '../../../hooks/usePagination';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { resolveImageUrl } from '../../../utils/imageUrl';
import { Table, Column } from '../../../components/ui/Table';
import { Pagination } from '../../../components/ui/Pagination';

export const CategoriesListPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
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

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await categoryAdminApi.getAll({ page, limit });
      setCategories(res.data);
      setTotalCount(res.totalCount);
    } catch (e) {
      console.error('Failed to load categories:', e);
      showToast('Failed to load categories', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, setTotalCount, showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      await categoryAdminApi.delete(id);
      showToast('Category deleted successfully', 'success');
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete category.', 'error');
    }
  };

  const columns: Column<Category>[] = [
    { key: 'id', header: 'ID', sortable: false },
    {
      key: 'name',
      header: 'Category Name',
      sortable: false,
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {item.imageUrl ? (
            <img
              src={resolveImageUrl(item.imageUrl)}
              alt={item.name}
              style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                background: 'var(--color-bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
              }}
            >
              <FolderTree size={16} />
            </div>
          )}
          <span style={{ fontWeight: 600 }}>{item.name}</span>
        </div>
      ),
    },
    { key: 'description', header: 'Description', sortable: false },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            to={`/admin/categories/${item.id}`}
            className="btn btn-secondary"
            style={{ padding: '0.4rem', minWidth: 0 }}
          >
            <Edit size={14} />
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
          <h1 style={{ fontFamily: 'var(--font-display)' }}>Categories Directory</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage store departments and styles</p>
        </div>
        <Link to="/admin/categories/new" className="btn btn-primary" style={{ gap: '0.35rem' }}>
          <Plus size={18} />
          Add Category
        </Link>
      </div>

      {/* Table */}
      <Table columns={columns} data={categories} isLoading={isLoading} />

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
