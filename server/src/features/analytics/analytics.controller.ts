import { Response } from "express";
import mongoose from "mongoose";
import { Complaint, Payment, User, Society, Announcement } from "../../models";
import { AuthRequest } from "../../middleware/auth";

const getSocietyScope = (
  req: AuthRequest,
): mongoose.Types.ObjectId | undefined => {
  if (req.user!.role === "super_admin") {
    return req.query.societyId
      ? new mongoose.Types.ObjectId(req.query.societyId as string)
      : undefined;
  }
  return req.user!.society
    ? new mongoose.Types.ObjectId(req.user!.society)
    : undefined;
};

export const getDashboardAnalytics = async (
  req: AuthRequest,
  res: Response,
) => {
  const societyId = getSocietyScope(req);
  const match = societyId ? { society: societyId } : {};

  const [
    totalComplaints,
    resolvedComplaints,
    pendingComplaints,
    categoryStats,
    monthlyTrends,
    totalResidents,
    totalSocieties,
  ] = await Promise.all([
    Complaint.countDocuments(match),
    Complaint.countDocuments({ ...match, status: "resolved" }),
    Complaint.countDocuments({
      ...match,
      status: { $in: ["pending", "assigned", "in_progress", "reopened"] },
    }),
    Complaint.aggregate([
      { $match: match },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Complaint.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]),
    societyId
      ? User.countDocuments({
          society: societyId,
          role: "resident",
          isActive: true,
        })
      : User.countDocuments({ role: "resident", isActive: true }),
    req.user?.role === "super_admin"
      ? Society.countDocuments({ isActive: true })
      : Promise.resolve(1),
  ]);

  const paymentMatch = societyId ? { society: societyId } : {};
  const paymentStats = await Payment.aggregate([
    { $match: paymentMatch },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        amount: { $sum: "$amount" },
      },
    },
  ]);

  const recentAnnouncements = societyId
    ? await Announcement.countDocuments({
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
        resolutionRate:
          totalComplaints > 0
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
};

export const getSuperAdminAnalytics = async (
  req: AuthRequest,
  res: Response,
) => {
  const societiesByCity = await Society.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$city", count: { $sum: 1 } } },
  ]);

  const complaintsBySociety = await Complaint.aggregate([
    {
      $group: {
        _id: "$society",
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
        },
      },
    },
    { $limit: 10 },
    {
      $lookup: {
        from: "societies",
        localField: "_id",
        foreignField: "_id",
        as: "society",
      },
    },
    { $unwind: "$society" },
    {
      $project: {
        societyName: "$society.name",
        total: 1,
        resolved: 1,
      },
    },
  ]);

  res.json({
    success: true,
    data: { societiesByCity, complaintsBySociety },
  });
};
