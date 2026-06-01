export function paginateRows(rows, page = 1, perPage = 10) {
  const safePerPage = Math.max(5, Math.min(Number(perPage) || 10, 50));
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / safePerPage));
  const safePage = Math.max(1, Math.min(Number(page) || 1, totalPages));
  const start = (safePage - 1) * safePerPage;

  return {
    rows: rows.slice(start, start + safePerPage),
    meta: {
      page: safePage,
      perPage: safePerPage,
      total,
      totalPages,
    },
  };
}
