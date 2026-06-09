import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { AuditLog } from "../../models/AuditLog";

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
  const filter: Record<string, unknown> = {};

  if (req.user!.role !== "super_admin") {
    filter.society = req.user!.society;
  } else if (req.query.societyId) {
    filter.society = req.query.societyId;
  }

  if (req.query.entity) filter.entity = req.query.entity;
  if (req.query.action) filter.action = req.query.action;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  res.json({ success: true, ...paginatedResponse(logs, total, page, limit) });
};
