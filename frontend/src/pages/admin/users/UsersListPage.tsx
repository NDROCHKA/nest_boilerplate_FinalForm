import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Mail, Phone, Search } from 'lucide-react';
import { userAdminApi } from '../../../api/user-admin.api';
import { User, RoleEnum } from '../../../types/user.types';
import { usePagination } from '../../../hooks/usePagination';
import { useDebounce } from '../../../hooks/useDebounce';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Table, Column } from '../../../components/ui/Table';
import { Pagination } from '../../../components/ui/Pagination';

export const UsersListPage: React.FC = () => {
  const { showToast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
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

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build DTO query
      const queryParams: any = { page, limit };
      if (debouncedSearch) {
        queryParams.filters = { name: debouncedSearch };
      }

      const res = await userAdminApi.getAll(queryParams);
      setUsers(res.data);
      setTotalCount(res.totalCount);
    } catch (e) {
      console.error('Failed to load admin users:', e);
      showToast('Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, limit, page, setTotalCount, showToast]);

  useEffect(() => {
    resetPagination();
  }, [debouncedSearch, resetPagination]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: number, email: string | null) => {
    if (!window.confirm(`Are you sure you want to deactivate user account "${email || id}"?`)) return;

    try {
      await userAdminApi.delete(id);
      showToast('User account soft deleted/deactivated successfully', 'success');
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete user account.', 'error');
    }
  };

  const columns: Column<User>[] = [
    { key: 'id', header: 'ID', sortable: false },
    {
      key: 'name',
      header: 'Full Name',
      sortable: false,
      render: (item) => (
        <span style={{ fontWeight: 600 }}>
          {item.firstName} {item.lastName}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: false,
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
          <Mail size={12} style={{ color: 'var(--color-text-secondary)' }} />
          <span>{item.email || '-'}</span>
        </div>
      ),
    },
    {
      key: 'phoneNumber',
      header: 'Phone Number',
      sortable: false,
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
          <Phone size={12} style={{ color: 'var(--color-text-secondary)' }} />
          <span>{item.phoneNumber || '-'}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role Privileges',
      sortable: false,
      render: (item) => (
        <Badge variant={item.role === RoleEnum.superAdmin ? 'danger' : 'info'}>
          {item.role === RoleEnum.superAdmin ? 'Super Admin' : 'Customer'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined On',
      sortable: false,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            to={`/admin/users/${item.id}`}
            className="btn btn-secondary"
            style={{ padding: '0.4rem', minWidth: 0 }}
          >
            <Eye size={14} />
          </Link>
          <Button
            variant="danger"
            onClick={() => handleDelete(item.id, item.email)}
            style={{ padding: '0.4rem', minWidth: 0 }}
          >
            Suspend
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
          <h1 style={{ fontFamily: 'var(--font-display)' }}>User Directory</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage store credentials and client administrative controls</p>
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
            placeholder="Search users by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '2.25rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={users} isLoading={isLoading} />

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
