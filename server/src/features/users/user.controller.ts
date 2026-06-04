import { Response } from "express";
import { User } from "../../models";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { createAuditLog } from "../../services/audit.service";
import { UserRole } from "../../types";

const getSocietyFilter = (req: AuthRequest): Record<string, unknown> => {
  if (req.user!.role === "super_admin") {
    return req.query.societyId ? { society: req.query.societyId } : {};
  }
  return { society: req.user!.society };
};

export const createUser = async (req: AuthRequest, res: Response) => {
  const societyId =
    req.user!.role === "super_admin" ? req.body.society : req.user!.society;

  const user = await User.create({ ...req.body, society: societyId });
  await createAuditLog(req, "create", "User", user._id.toString());

  const safeUser = await User.findById(user._id).select("-password");
  res.status(201).json({ success: true, data: safeUser });
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
  const filter: Record<string, unknown> = {
    ...getSocietyFilter(req),
    isActive: true,
  };

  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { flatNumber: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, ...paginatedResponse(users, total, page, limit) });
};

export const getUser = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, data: user });
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  await createAuditLog(req, "update", "User", user._id.toString());
  res.json({ success: true, data: user });
};

export const deactivateUser = async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  ).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  await createAuditLog(req, "deactivate", "User", user._id.toString());
  res.json({ success: true, message: "User deactivated" });
};

export const addFamilyMember = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.role === "resident" ? req.user!._id : req.params.id;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.familyMembers.push(req.body);
  await user.save();

  res.json({ success: true, data: user.familyMembers });
};

export const removeFamilyMember = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.role === "resident" ? req.user!._id : req.params.id;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.familyMembers = user.familyMembers.filter(
    (m) =>
      String((m as { _id?: { toString(): string } })._id) !==
      req.params.memberId,
  );
  await user.save();

  res.json({ success: true, data: user.familyMembers });
};

export const getMaintenanceStaff = async (req: AuthRequest, res: Response) => {
  const societyId = req.user!.society || (req.query.societyId as string);
  const staff = await User.find({
    society: societyId,
    role: "maintenance_staff" as UserRole,
    isActive: true,
  }).select("-password");

  res.json({ success: true, data: staff });
};
