const parsePagination = (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

const buildPagination = ({ page = 1, limit = 10, total = 0 }) => {
  return buildPaginationMeta(total, Math.max(1, Number(page)), Math.max(1, Number(limit)));
};

module.exports = {
  parsePagination,
  buildPaginationMeta,
  buildPagination,
};
