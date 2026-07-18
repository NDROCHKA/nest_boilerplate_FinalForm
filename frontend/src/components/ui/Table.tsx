import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onSort?: (key: string, direction: 'ASC' | 'DESC') => void;
  sortKey?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const Table = <T extends { id: number | string }>({
  columns,
  data,
  isLoading = false,
  onSort,
  sortKey,
  sortOrder,
}: TableProps<T>) => {
  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onSort) return;
    const isCurrent = sortKey === col.key;
    const direction = isCurrent && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSort(col.key, direction);
  };

  return (
    <div className="table-container">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col)}
                style={{
                  cursor: col.sortable ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {col.header}
                  {col.sortable && onSort && (
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {sortKey === col.key ? (
                        sortOrder === 'ASC' ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )
                      ) : (
                        <ArrowUpDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="spinner" />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(item) : (item as any)[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
