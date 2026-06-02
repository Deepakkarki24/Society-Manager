"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuperAdminAnalytics = exports.getDashboardAnalytics = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../models");
const asyncHandler_1 = require("../../utils/asyncHandler");
const getSocietyScope = (req) => {
    if (req.user.role === 'super_admin') {
        return req.query.societyId
            ? new mongoose_1.default.Types.ObjectId(req.query.societyId)
            : undefined;
    }
    return req.user.society
        ? new mongoose_1.default.Types.ObjectId(req.user.society)
        : undefined;
};
exports.getDashboardAnalytics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const societyId = getSocietyScope(req);
    const match = societyId ? { society: societyId } : {};
    const [totalComplaints, resolvedComplaints, pendingComplaints, categoryStats, monthlyTrends, totalResidents, totalSocieties,] = await Promise.all([
        models_1.Complaint.countDocuments(match),
        models_1.Complaint.countDocuments({ ...match, status: 'resolved' }),
        models_1.Complaint.countDocuments({
            ...match,
            status: { $in: ['pending', 'assigned', 'in_progress', 'reopened'] },
        }),
        models_1.Complaint.aggregate([
            { $match: match },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        models_1.Complaint.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
                    },
                },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 },
        ]),
        societyId
            ? models_1.User.countDocuments({ society: societyId, role: 'resident', isActive: true })
            : models_1.User.countDocuments({ role: 'resident', isActive: true }),
        req.user.role === 'super_admin'
            ? models_1.Society.countDocuments({ isActive: true })
            : Promise.resolve(1),
    ]);
    const paymentMatch = societyId ? { society: societyId } : {};
    const paymentStats = await models_1.Payment.aggregate([
        { $match: paymentMatch },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                amount: { $sum: '$amount' },
            },
        },
    ]);
    const recentAnnouncements = societyId
        ? await models_1.Announcement.countDocuments({
            society: societyId,
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        })
        : 0;
    res.json({
        success: true,
        data: {
            complaints: {
                total: totalComplaints,
                resolved: resolvedComplaints,
                pending: pendingComplaints,
                resolutionRate: totalComplaints > 0
                    ? Math.round((resolvedComplaints / totalComplaints) * 100)
                    : 0,
            },
            categoryStats,
            monthlyTrends,
            residents: { total: totalResidents },
            societies: { total: totalSocieties },
            payments: paymentStats,
            engagement: {
                announcementsLast30Days: recentAnnouncements,
                activeResidents: totalResidents,
            },
        },
    });
});
exports.getSuperAdminAnalytics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const societiesByCity = await models_1.Society.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
    ]);
    const complaintsBySociety = await models_1.Complaint.aggregate([
        {
            $group: {
                _id: '$society',
                total: { $sum: 1 },
                resolved: {
                    $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
                },
            },
        },
        { $limit: 10 },
        {
            $lookup: {
                from: 'societies',
                localField: '_id',
                foreignField: '_id',
                as: 'society',
            },
        },
        { $unwind: '$society' },
        {
            $project: {
                societyName: '$society.name',
                total: 1,
                resolved: 1,
            },
        },
    ]);
    res.json({
        success: true,
        data: { societiesByCity, complaintsBySociety },
    });
});
//# sourceMappingURL=analytics.controller.js.map