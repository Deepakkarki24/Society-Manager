"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedback = exports.submitFeedback = void 0;
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const pagination_1 = require("../../utils/pagination");
const submitFeedback = async (req, res) => {
    const societyId = req.user.society;
    if (!societyId)
        throw new ApiError_1.ApiError(400, "Society context required");
    const feedback = await models_1.Feedback.create({
        ...req.body,
        society: societyId,
        submittedBy: req.user._id,
    });
    res.status(201).json({ success: true, data: feedback });
};
exports.submitFeedback = submitFeedback;
const getFeedback = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const filter = { society: req.user.society };
    const [feedback, total] = await Promise.all([
        models_1.Feedback.find(filter)
            .populate("submittedBy", "name flatNumber")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        models_1.Feedback.countDocuments(filter),
    ]);
    res.json({
        success: true,
        ...(0, pagination_1.paginatedResponse)(feedback, total, page, limit),
    });
};
exports.getFeedback = getFeedback;
//# sourceMappingURL=feedback.controller.js.map