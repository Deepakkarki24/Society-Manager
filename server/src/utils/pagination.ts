import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../constants';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (
  page?: unknown,
  limit?: unknown
): PaginationOptions => {
  const parsedPage = Math.max(1, parseInt(String(page || DEFAULT_PAGE), 10) || DEFAULT_PAGE);
  const parsedLimit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(String(limit || DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

export const paginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => ({
  data,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
});
