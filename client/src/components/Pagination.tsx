interface PaginationProps {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  page: number;
  onPageChange: (page: number) => void;
}

function Pagination({ meta, page, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-sm shadow-slate-200 dark:bg-slate-900 dark:shadow-slate-950">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Showing page {page} of {meta.totalPages} ({meta.total} leads)
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={page >= meta.totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
