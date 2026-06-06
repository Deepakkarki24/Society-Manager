import { Response } from "express";
import { Visitor, User } from "../../models";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { errorResponse } from "../../utils/ApiResponse";

const getSocietyId = (req: AuthRequest) =>
    req.user!.role === "super_admin"
        ? (req.query.societyId as string)
        : req.user!.society;

export const preApproveVisitor = async (req: AuthRequest, res: Response) => {
    const societyId = req.user!.society;
    if (!societyId) return errorResponse(res, 400, "Society context required");

    const host = await User.findById(req.user!._id);
    const flatNumber = req.body.flatNumber || host?.flatNumber || "N/A";

    const visitor = await Visitor.create({
        ...req.body,
        society: societyId,
        hostResident: req.user!._id,
        flatNumber,
        status: "pre_approved",
    });

    res.status(201).json({ success: true, data: visitor });
};

export const getVisitors = async (req: AuthRequest, res: Response) => {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const societyId = getSocietyId(req);
    const filter: Record<string, unknown> = {};

    if (societyId) filter.society = societyId;
    if (req.user!.role === "resident") filter.hostResident = req.user!._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.date) {
        const date = new Date(req.query.date as string);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.createdAt = { $gte: date, $lt: nextDay };
    }

    const [visitors, total] = await Promise.all([
        Visitor.find(filter)
            .populate("hostResident", "name flatNumber block")
            .populate("verifiedBy", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Visitor.countDocuments(filter),
    ]);

    res.json({
        success: true,
        ...paginatedResponse(visitors, total, page, limit),
    });
};

export const checkInVisitor = async (req: AuthRequest, res: Response) => {
    const visitor = await Visitor.findByIdAndUpdate(
        req.params.id,
        {
            status: "checked_in",
            checkInAt: new Date(),
            verifiedBy: req.user!._id,
            notes: req.body.notes,
        },
        { new: true },
    );
    if (!visitor) return errorResponse(res, 404, "Visitor not found");
    res.json({ success: true, data: visitor });
};

export const checkOutVisitor = async (req: AuthRequest, res: Response) => {
    const visitor = await Visitor.findByIdAndUpdate(
        req.params.id,
        { status: "checked_out", checkOutAt: new Date() },
        { new: true },
    );
    if (!visitor) return errorResponse(res, 404, "Visitor not found");
    res.json({ success: true, data: visitor });
};

export const rejectVisitor = async (req: AuthRequest, res: Response) => {
    const visitor = await Visitor.findByIdAndUpdate(
        req.params.id,
        { status: "rejected", notes: req.body.notes },
        { new: true },
    );
    if (!visitor) return errorResponse(res, 404, "Visitor not found");
    res.json({ success: true, data: visitor });
};
