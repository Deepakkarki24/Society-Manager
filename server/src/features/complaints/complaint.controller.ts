import { Response } from 'express';
import { Complaint, User } from '../../models';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth';
import { getPagination, paginatedResponse } from '../../utils/pagination';
import { uploadMultipleImages } from '../../middleware/upload';
import { createAuditLog } from '../../services/audit.service';
import { createNotification } from '../../services/notification.service';
import mongoose from 'mongoose';
import { ComplaintStatus } from '../../types';

const buildComplaintFilter = (req: AuthRequest): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};

  if (req.user!.role === 'super_admin' && req.query.societyId) {
    filter.society = req.query.societyId;
  } else if (req.user!.role !== 'super_admin') {
    filter.society = req.user!.society;
  }

  if (req.user!.role === 'resident') {
    filter.createdBy = req.user!._id;
  } else if (req.user!.role === 'maintenance_staff') {
    filter.assignedTo = req.user!._id;
  }

  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  return filter;
};

const addTimeline = (
  status: ComplaintStatus,
  userId: string,
  note?: string
) => ({
  status,
  note,
  updatedBy: new mongoose.Types.ObjectId(userId),
  createdAt: new Date(),
});

export const createComplaint = asyncHandler(async (req: AuthRequest, res: Response) => {
  const images = await uploadMultipleImages(req.files as Express.Multer.File[], 'complaints');
  const societyId = req.user!.society;

  if (!societyId) throw new ApiError(400, 'Resident must belong to a society');

  const complaint = await Complaint.create({
    ...req.body,
    society: societyId,
    createdBy: req.user!._id,
    images,
    timeline: [addTimeline('pending', req.user!._id, 'Complaint created')],
  });

  const populated = await Complaint.findById(complaint._id)
    .populate('createdBy', 'name email flatNumber')
    .populate('society', 'name');

  const admins = await User.find({
    society: societyId,
    role: 'society_admin',
    isActive: true,
  });

  await Promise.all(
    admins.map((admin) =>
      createNotification({
        recipientId: admin._id.toString(),
        title: 'New Complaint',
        message: `New complaint: ${complaint.title}`,
        type: 'complaint',
        link: `/complaints/${complaint._id}`,
      })
    )
  );

  await createAuditLog(req, 'create', 'Complaint', complaint._id.toString());
  res.status(201).json({ success: true, data: populated });
});

export const getComplaints = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
  const filter = buildComplaintFilter(req);

  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .populate('createdBy', 'name email flatNumber block')
      .populate('assignedTo', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Complaint.countDocuments(filter),
  ]);

  res.json({ success: true, ...paginatedResponse(complaints, total, page, limit) });
});

export const getComplaint = asyncHandler(async (req: AuthRequest, res: Response) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('createdBy', 'name email flatNumber block phone')
    .populate('assignedTo', 'name email phone')
    .populate('comments.user', 'name role avatar')
    .populate('timeline.updatedBy', 'name role');

  if (!complaint) throw new ApiError(404, 'Complaint not found');

  if (
    req.user!.role === 'resident' &&
    complaint.createdBy._id.toString() !== req.user!._id
  ) {
    throw new ApiError(403, 'Access denied');
  }

  res.json({ success: true, data: complaint });
});

export const assignComplaint = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { assignedTo, note } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');

  complaint.assignedTo = assignedTo;
  complaint.status = 'assigned';
  complaint.timeline.push(addTimeline('assigned', req.user!._id, note));
  await complaint.save();

  await createNotification({
    recipientId: assignedTo,
    title: 'Complaint Assigned',
    message: `You have been assigned: ${complaint.title}`,
    type: 'complaint',
    link: `/complaints/${complaint._id}`,
  });

  await createAuditLog(req, 'assign', 'Complaint', complaint._id.toString());
  res.json({ success: true, data: complaint });
});

export const updateComplaintStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, note } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');

  if (
    req.user!.role === 'maintenance_staff' &&
    complaint.assignedTo?.toString() !== req.user!._id
  ) {
    throw new ApiError(403, 'Not assigned to this complaint');
  }

  complaint.status = status;
  complaint.timeline.push(addTimeline(status, req.user!._id, note));

  if (status === 'resolved') {
    complaint.resolvedAt = new Date();
    const proof = await uploadMultipleImages(
      req.files as Express.Multer.File[],
      'complaint-proof'
    );
    if (proof.length) complaint.completionProof.push(...proof);
  }

  await complaint.save();

  await createNotification({
    recipientId: complaint.createdBy.toString(),
    title: 'Complaint Updated',
    message: `Your complaint "${complaint.title}" is now ${status}`,
    type: 'complaint',
    link: `/complaints/${complaint._id}`,
  });

  res.json({ success: true, data: complaint });
});

export const reopenComplaint = asyncHandler(async (req: AuthRequest, res: Response) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');

  if (complaint.createdBy.toString() !== req.user!._id) {
    throw new ApiError(403, 'Only the creator can reopen');
  }

  complaint.status = 'reopened';
  complaint.resolvedAt = undefined;
  complaint.timeline.push(
    addTimeline('reopened', req.user!._id, req.body.note || 'Complaint reopened')
  );
  await complaint.save();

  res.json({ success: true, data: complaint });
});

export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');

  complaint.comments.push({
    user: req.user!._id as unknown as import('mongoose').Types.ObjectId,
    text: req.body.text,
    createdAt: new Date(),
  });
  await complaint.save();

  const updated = await Complaint.findById(complaint._id).populate(
    'comments.user',
    'name role avatar'
  );

  res.json({ success: true, data: updated });
});

export const getComplaintHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filter: Record<string, unknown> = {
    createdBy: req.user!._id,
    status: { $in: ['resolved', 'reopened'] },
  };
  if (req.user!.society) filter.society = req.user!.society;

  const complaints = await Complaint.find(filter)
    .sort({ updatedAt: -1 })
    .limit(50);

  res.json({ success: true, data: complaints });
});
