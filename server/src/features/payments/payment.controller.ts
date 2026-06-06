import { Response } from "express";
import { Payment, Society, User } from "../../models";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { createNotification } from "../../services/notification.service";
import { errorResponse } from "../../utils/ApiResponse";

export const generateInvoices = async (req: AuthRequest, res: Response) => {
    const { month, year } = req.body;
    const societyId = req.user!.society;
    if (!societyId) return errorResponse(res, 400, "Society context required");

    const society = await Society.findById(societyId);
    if (!society) return errorResponse(res, 404, "Society not found");

    const residents = await User.find({
        society: societyId,
        role: "resident",
        isActive: true,
    });

    const dueDate = new Date(year, month, 5);
    const invoices = [];

    for (const resident of residents) {
        const existing = await Payment.findOne({
            society: societyId,
            resident: resident._id,
            month,
            year,
        });
        if (existing) continue;

        const payment = await Payment.create({
            society: societyId,
            resident: resident._id,
            amount: society.maintenanceAmount,
            month,
            year,
            dueDate,
            status: "pending",
        });
        invoices.push(payment);

        await createNotification({
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

export const getPayments = async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const filter: Record<string, unknown> = {};

    if (req.user!.role === "resident") {
        filter.resident = req.user!._id;
    } else if (req.user!.society) {
        filter.society = req.user!.society;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.month) filter.month = parseInt(req.query.month as string, 10);
    if (req.query.year) filter.year = parseInt(req.query.year as string, 10);

    const [payments, total] = await Promise.all([
        Payment.find(filter)
            .populate("resident", "name flatNumber block email")
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit),
        Payment.countDocuments(filter),
    ]);

    res.json({
        success: true,
        ...paginatedResponse(payments, total, page, limit),
    });
};

export const recordPayment = async (req: AuthRequest, res: Response) => {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return errorResponse(res, 404, "Payment not found");

    if (
        req.user!.role === "resident" &&
        payment.resident.toString() !== req.user!._id
    ) {
        return errorResponse(res, 403, "Access denied");
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

export const getPaymentSummary = async (req: AuthRequest, res: Response) => {
    const societyId = req.user!.society;
    const [pending, paid, overdue] = await Promise.all([
        Payment.countDocuments({ society: societyId, status: "pending" }),
        Payment.countDocuments({ society: societyId, status: "paid" }),
        Payment.countDocuments({ society: societyId, status: "overdue" }),
    ]);

    const revenue = await Payment.aggregate([
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
