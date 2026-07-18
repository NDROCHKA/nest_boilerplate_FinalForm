import React, { useEffect, useState } from 'react';
import { ShoppingBag, FolderTree, FileSpreadsheet, Users, ShieldAlert } from 'lucide-react';
import { productAdminApi } from '../../api/product-admin.api';
import { categoryAdminApi } from '../../api/category-admin.api';
import { orderAdminApi } from '../../api/order-admin.api';
import { userAdminApi } from '../../api/user-admin.api';
import { Spinner } from '../../components/ui/Spinner';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [prodRes, catRes, orderRes, userRes] = await Promise.all([
          productAdminApi.getAll({ limit: 1 }),
          categoryAdminApi.getAll({ limit: 1 }),
          orderAdminApi.getAll({ limit: 1 }),
          userAdminApi.getAll({ limit: 1 }),
        ]);

        setStats({
          products: prodRes.totalCount,
          categories: catRes.totalCount,
          orders: orderRes.totalCount,
          users: userRes.totalCount,
        });
      } catch (e) {
        console.error('Failed to load admin stats:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardItems = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: <ShoppingBag size={24} style={{ color: 'var(--color-accent)' }} />,
      desc: 'Active & inactive store items',
    },
    {
      title: 'Total Categories',
      value: stats.categories,
      icon: <FolderTree size={24} style={{ color: 'var(--color-success)' }} />,
      desc: 'Departments in directory',
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: <FileSpreadsheet size={24} style={{ color: 'var(--color-warning)' }} />,
      desc: 'Shipment packages & COD requests',
    },
    {
      title: 'Registered Users',
      value: stats.users,
      icon: <Users size={24} style={{ color: 'var(--color-info)' }} />,
      desc: 'Customers & administrators',
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Overview Dashboard</h1>
        <p>Real-time Crusaders database statistics</p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {cardItems.map((card, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {card.title}
              </span>
              {card.icon}
            </div>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              {card.value}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {card.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
