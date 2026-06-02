import { Response } from 'express';
import { Announcement, User } from '../../models';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth';
import { getPagination, paginatedResponse } from '../../utils/pagination';
import { createNotification } from '../../services/notification.service';

export const createAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const societyId = req.user!.society;
  if (!societyId) throw new ApiError(400, 'Society context required');

  const announcement = await Announcement.create({
    ...req.body,
    society: societyId,
    createdBy: req.user!._id,
  });

  const residents = await User.find({
    society: societyId,
    role: 'resident',
    isActive: true,
  });

  await Promise.all(
    residents.map((r) =>
      createNotification({
        recipientId: r._id.toString(),
        title: req.body.isImportant ? 'Important Notice' : 'New Announcement',
        message: announcement.title,
        type: 'announcement',
        link: `/announcements/${announcement._id}`,
      })
    )
  );

  res.status(201).json({ success: true, data: announcement });
});

export const getAnnouncements = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
  const societyId =
    req.user!.role === 'super_admin'
      ? (req.query.societyId as string)
      : req.user!.society;

  const filter: Record<string, unknown> = {};
  if (societyId) filter.society = societyId;
  if (req.query.important === 'true') filter.isImportant = true;
  if (req.query.events === 'true') filter.isEvent = true;

  const [announcements, total] = await Promise.all([
    Announcement.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Announcement.countDocuments(filter),
  ]);

  res.json({ success: true, ...paginatedResponse(announcements, total, page, limit) });
});

export const getAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const announcement = await Announcement.findById(req.params.id).populate(
    'createdBy',
    'name role'
  );
  if (!announcement) throw new ApiError(404, 'Announcement not found');
  res.json({ success: true, data: announcement });
});

export const updateAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!announcement) throw new ApiError(404, 'Announcement not found');
  res.json({ success: true, data: announcement });
});

export const deleteAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) throw new ApiError(404, 'Announcement not found');
  res.json({ success: true, message: 'Announcement deleted' });
});
