'use client';

import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  pagination?: PaginationProps;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
  pagination,
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border-light">
      <table className="w-full border-collapse text-sm font-body">
        <thead>
          <tr className="bg-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-muted border-b border-border"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <div className="flex items-center justify-center gap-3 text-on-surface-muted">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Cargando...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-on-surface-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={`
                  ${idx % 2 === 0 ? 'bg-surface-alt' : 'bg-surface'}
                  ${onRowClick ? 'cursor-pointer hover:bg-primary/5' : ''}
                  transition-colors duration-100
                `.trim()}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-on-surface border-b border-border-light"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-light bg-surface">
          <span className="text-xs text-on-surface-muted">
            Mostrando {(pagination.page - 1) * pagination.pageSize + 1}
            {' '}-{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}
            {' '}de {pagination.total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-2.5 py-1 text-xs rounded-md border border-border text-on-surface-muted
                hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Anterior
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => pagination.onPageChange(pageNum)}
                  className={`px-2.5 py-1 text-xs rounded-md cursor-pointer transition-colors ${
                    pagination.page === pageNum
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'border border-border text-on-surface-muted hover:bg-surface-alt'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="px-2.5 py-1 text-xs rounded-md border border-border text-on-surface-muted
                hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
