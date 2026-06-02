export interface PaginationOptions {
    page: number;
    limit: number;
    skip: number;
}
export declare const getPagination: (page?: unknown, limit?: unknown) => PaginationOptions;
export declare const paginatedResponse: <T>(data: T[], total: number, page: number, limit: number) => {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
};
//# sourceMappingURL=pagination.d.ts.map