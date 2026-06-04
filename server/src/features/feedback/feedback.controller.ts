import { Response } from "express";
import { Feedback } from "../../models";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  const societyId = req.user!.society;
  if (!societyId) throw new ApiError(400, "Society context required");

  const feedback = await Feedback.create({
    ...req.body,
    society: societyId,
    submittedBy: req.user!._id,
  });

  res.status(201).json({ success: true, data: feedback });
};

export const getFeedback = async (req: AuthRequest, res: Response) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
  const filter = { society: req.user!.society };

  const [feedback, total] = await Promise.all([
    Feedback.find(filter)
      .populate("submittedBy", "name flatNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Feedback.countDocuments(filter),
  ]);

  res.json({
    success: true,
    ...paginatedResponse(feedback, total, page, limit),
  });
};
