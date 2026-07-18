import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (targetPage: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onNextPage,
  onPrevPage,
}) => {
  if (totalPages <= 1) return null;

  // Generate numbered list
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '1.5rem',
      }}
    >
      <Button
        variant="secondary"
        onClick={onPrevPage}
        disabled={!hasPrevPage}
        style={{ padding: '0.5rem' }}
      >
        <ChevronLeft size={16} />
      </Button>

      {pages.map((p) => {
        // Show limited numbers for design layout if it's too big
        if (
          p === 1 ||
          p === totalPages ||
          (p >= page - 1 && p <= page + 1)
        ) {
          return (
            <Button
              key={p}
              variant={p === page ? 'primary' : 'secondary'}
              onClick={() => onPageChange(p)}
              style={{
                minWidth: '2.25rem',
                height: '2.25rem',
                padding: 0,
              }}
            >
              {p}
            </Button>
          );
        } else if (p === page - 2 || p === page + 2) {
          return (
            <span key={p} style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }}>
              ...
            </span>
          );
        }
        return null;
      })}

      <Button
        variant="secondary"
        onClick={onNextPage}
        disabled={!hasNextPage}
        style={{ padding: '0.5rem' }}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
