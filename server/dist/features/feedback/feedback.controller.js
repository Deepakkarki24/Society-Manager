"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedback = exports.submitFeedback = void 0;
const pagination_1 = require("../../utils/pagination");
const ApiResponse_1 = require("../../utils/ApiResponse");
const Feedback_1 = require("../../models/Feedback");
const submitFeedback = async (req, res) => {
    try {
        const societyId = req.user.society;
        if (!societyId) {
            return (0, ApiResponse_1.errorResponse)(res, 400, "Society context required");
        }
        const feedback = await Feedback_1.Feedback.create({
            ...req.body,
            society: societyId,
            submittedBy: req.user._id,
        });
        return (0, ApiResponse_1.successResponse)(res, 201, "Feedback submitted successfully", feedback);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message || "Failed to submit feedback");
    }
};
exports.submitFeedback = submitFeedback;
const getFeedback = async (req, res) => {
    try {
        const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
        const filter = {
            society: req.user.society,
        };
        const [feedback, total] = await Promise.all([
            Feedback_1.Feedback.find(filter)
                .populate("submittedBy", "name flatNumber")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Feedback_1.Feedback.countDocuments(filter),
        ]);
        return (0, ApiResponse_1.successResponse)(res, 200, "Feedback fetched successfully", (0, pagination_1.paginatedResponse)(feedback, total, page, limit));
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message || "Failed to fetch feedback");
    }
};
exports.getFeedback = getFeedback;
//# sourceMappingURL=feedback.controller.js.map