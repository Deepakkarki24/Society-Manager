import { Response } from 'express';
import { Society, User } from '../../models';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth';
import { getPagination, paginatedResponse } from '../../utils/pagination';
import { createAuditLog } from '../../services/audit.service';

export const createSociety = asyncHandler(async (req: AuthRequest, res: Response) => {
  const society = await Society.create(req.body);
  await createAuditLog(req, 'create', 'Society', society._id.toString());
  res.status(201).json({ success: true, data: society });
});

export const getSocieties = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
  const search = (req.query.search as string) || '';
  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$text = { $search: search };
  }
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const [societies, total] = await Promise.all([
    Society.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Society.countDocuments(filter),
  ]);

  res.json({
    success: true,
    ...paginatedResponse(societies, total, page, limit),
  });
});

export const getSociety = asyncHandler(async (req: AuthRequest, res: Response) => {
  const society = await Society.findById(req.params.id);
  if (!society) throw new ApiError(404, 'Society not found');
  res.json({ success: true, data: society });
});

export const updateSociety = asyncHandler(async (req: AuthRequest, res: Response) => {
  const society = await Society.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!society) throw new ApiError(404, 'Society not found');
  await createAuditLog(req, 'update', 'Society', society._id.toString());
  res.json({ success: true, data: society });
});

export const deleteSociety = asyncHandler(async (req: AuthRequest, res: Response) => {
  const society = await Society.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!society) throw new ApiError(404, 'Society not found');
  await createAuditLog(req, 'deactivate', 'Society', society._id.toString());
  res.json({ success: true, message: 'Society deactivated' });
});

export const assignSocietyAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;
  const societyId = req.params.id;

  const user = await User.findByIdAndUpdate(
    userId,
    { role: 'society_admin', society: societyId },
    { new: true }
  ).select('-password');

  if (!user) throw new ApiError(404, 'User not found');
  await createAuditLog(req, 'assign_admin', 'User', userId, { societyId });

  res.json({ success: true, data: user });
});

export const getSocietyStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const societyId = req.params.id;
  const [residents, staff, admins] = await Promise.all([
    User.countDocuments({ society: societyId, role: 'resident', isActive: true }),
    User.countDocuments({ society: societyId, role: 'maintenance_staff', isActive: true }),
    User.countDocuments({ society: societyId, role: 'society_admin', isActive: true }),
  ]);

  res.json({
    success: true,
    data: { residents, maintenanceStaff: staff, admins },
  });
});
