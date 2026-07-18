import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldAlert, Check, Shield, User as UserIcon } from 'lucide-react';
import { userAdminApi } from '../../../api/user-admin.api';
import { User, RoleEnum } from '../../../types/user.types';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../context/ToastContext';
import { Spinner } from '../../../components/ui/Spinner';

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [role, setRole] = useState<RoleEnum>(RoleEnum.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      setErrorMsg('');
      try {
        const result = await userAdminApi.getById(Number(id));
        setUserDetail(result);
        setRole(result.role);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to load user details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetail) return;

    setIsUpdating(true);
    try {
      const updated = await userAdminApi.updateRole(userDetail.id, role);
      setUserDetail(updated);
      showToast('User account role updated successfully', 'success');
      navigate('/admin/users');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update user role.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (errorMsg || !userDetail) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }} className="animate-fade-in">
        <ShieldAlert size={48} style={{ color: 'var(--color-danger)', marginBottom: '1rem' }} />
        <h2>User Account Not Found</h2>
        <p style={{ margin: '0.5rem 0 1.5rem 0' }}>{errorMsg || 'We could not find the user details requested.'}</p>
        <Link to="/admin/users">
          <Button variant="secondary">Back to User Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          to="/admin/users"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          <ChevronLeft size={16} />
          Back to user directory
        </Link>
      </div>

      {/* Title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Manage User Profile</h1>
        <p>Update authorization roles and view account metrics</p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--color-bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-border)',
                color: 'var(--color-accent)',
              }}
            >
              {userDetail.role === RoleEnum.superAdmin ? <Shield size={28} /> : <UserIcon size={28} />}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>
                {userDetail.firstName} {userDetail.lastName}
              </h3>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Registered on {new Date(userDetail.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Email Address:</span>
              <span style={{ fontWeight: 500 }}>{userDetail.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Phone Number:</span>
              <span style={{ fontWeight: 500 }}>{userDetail.phoneNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Account ID:</span>
              <span>User #{userDetail.id}</span>
            </div>
          </div>
        </div>

        {/* Edit Role Card */}
        <form onSubmit={handleRoleUpdate} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3>Update Access Control</h3>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <Select
            label="User Role"
            options={[
              { value: RoleEnum.user, label: 'Customer (User)' },
              { value: RoleEnum.superAdmin, label: 'Super Administrator' },
            ]}
            value={role}
            onChange={(e) => setRole(Number(e.target.value) as RoleEnum)}
            disabled={isUpdating}
          />

          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg-tertiary)', padding: '0.75rem', borderRadius: '6px' }}>
            <ShieldAlert size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
            <span>
              Warning: Promoting a user to Super Admin grants full CRUD privileges over inventory, categories, order states, and user configurations.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Link to="/admin/users">
              <Button variant="secondary" disabled={isUpdating}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={isUpdating} style={{ minWidth: '150px' }}>
              <Check size={16} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
