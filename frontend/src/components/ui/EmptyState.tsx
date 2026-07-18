import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      {icon && (
        <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          {icon}
        </div>
      )}
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>{description}</p>
      {action}
    </div>
  );
};
