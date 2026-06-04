"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentSummary = exports.recordPayment = exports.getPayments = exports.generateInvoices = void 0;
const models_1 = require("../../models");
const ApiError_1 = require("../../utils/ApiError");
const pagination_1 = require("../../utils/pagination");
const notification_service_1 = require("../../services/notification.service");
const generateInvoices = async (req, res) => {
    const { month, year } = req.body;
    const societyId = req.user.society;
    if (!societyId)
        throw new ApiError_1.ApiError(400, "Society context required");
    const society = await models_1.Society.findById(societyId);
    if (!society)
        throw new ApiError_1.ApiError(404, "Society not found");
    const residents = await models_1.User.find({
        society: societyId,
        role: "resident",
        isActive: true,
    });
    const dueDate = new Date(year, month, 5);
    const invoices = [];
    for (const resident of residents) {
        const existing = await models_1.Payment.findOne({
            society: societyId,
            resident: resident._id,
            month,
            year,
        });
        if (existing)
            continue;
        const payment = await models_1.Payment.create({
            society: societyId,
            resident: resident._id,
            amount: society.maintenanceAmount,
            month,
            year,
            dueDate,
            status: "pending",
        });
        invoices.push(payment);
        await (0, notification_service_1.createNotification)({
            recipientId: resident._id.toString(),
            title: "Maintenance Invoice",
            message: `Invoice for ${month}/${year} - ₹${society.maintenanceAmount}`,
            type: "payment",
            link: "/payments",
        });
    }
    res
        .status(201)
        .json({ success: true, data: invoices, count: invoices.length });
};
exports.generateInvoices = generateInvoices;
const getPayments = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const filter = {};
    if (req.user.role === "resident") {
        filter.resident = req.user._id;
    }
    else if (req.user.society) {
        filter.society = req.user.society;
    }
    if (req.query.status)
        filter.status = req.query.status;
    if (req.query.month)
        filter.month = parseInt(req.query.month, 10);
    if (req.query.year)
        filter.year = parseInt(req.query.year, 10);
    const [payments, total] = await Promise.all([
        models_1.Payment.find(filter)
            .populate("resident", "name flatNumber block email")
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit),
        models_1.Payment.countDocuments(filter),
    ]);
    res.json({
        success: true,
        ...(0, pagination_1.paginatedResponse)(payments, total, page, limit),
    });
};
exports.getPayments = getPayments;
const recordPayment = async (req, res) => {
    const payment = await models_1.Payment.findById(req.params.id);
    if (!payment)
        throw new ApiError_1.ApiError(404, "Payment not found");
    if (req.user.role === "resident" &&
        payment.resident.toString() !== req.user._id) {
        throw new ApiError_1.ApiError(403, "Access denied");
    }
    payment.status = "paid";
    payment.paidAt = new Date();
    payment.transactionId = req.body.transactionId || `TXN-${Date.now()}`;
    payment.paymentMethod = req.body.paymentMethod || "online";
    await payment.save();
    res.json({
        success: true,
        data: payment,
        message: "Payment recorded. Gateway integration ready via transactionId.",
    });
};
exports.recordPayment = recordPayment;
const getPaymentSummary = async (req, res) => {
    const societyId = req.user.society;
    const [pending, paid, overdue] = await Promise.all([
        models_1.Payment.countDocuments({ society: societyId, status: "pending" }),
        models_1.Payment.countDocuments({ society: societyId, status: "paid" }),
        models_1.Payment.countDocuments({ society: societyId, status: "overdue" }),
    ]);
    const revenue = await models_1.Payment.aggregate([
        { $match: { society: societyId, status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res.json({
        success: true,
        data: {
            pending,
            paid,
            overdue,
            totalRevenue: revenue[0]?.total || 0,
        },
    });
};
exports.getPaymentSummary = getPaymentSummary;
//# sourceMappingURL=payment.controller.js.map