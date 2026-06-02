"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../utils/ApiError");
const validate = (validations) => {
    return async (req, _res, next) => {
        await Promise.all(validations.map((v) => v.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new ApiError_1.ApiError(400, 'Validation failed', errors.array());
        }
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map