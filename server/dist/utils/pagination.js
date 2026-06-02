"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResponse = exports.getPagination = void 0;
const constants_1 = require("../constants");
const getPagination = (page, limit) => {
    const parsedPage = Math.max(1, parseInt(String(page || constants_1.DEFAULT_PAGE), 10) || constants_1.DEFAULT_PAGE);
    const parsedLimit = Math.min(constants_1.MAX_LIMIT, Math.max(1, parseInt(String(limit || constants_1.DEFAULT_LIMIT), 10) || constants_1.DEFAULT_LIMIT));
    return {
        page: parsedPage,
        limit: parsedLimit,
        skip: (parsedPage - 1) * parsedLimit,
    };
};
exports.getPagination = getPagination;
const paginatedResponse = (data, total, page, limit) => ({
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
exports.paginatedResponse = paginatedResponse;
//# sourceMappingURL=pagination.js.map