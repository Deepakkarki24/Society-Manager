import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { errorResponse, successResponse } from "../../utils/ApiResponse";
import { Feedback } from "../../models/Feedback";

export const submitFeedback = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const societyId = req.user!.society;

    if (!societyId) {
      return errorResponse(res, 400, "Society context required");
    }

    const feedback = await Feedback.create({
      ...req.body,
      society: societyId,
      submittedBy: req.user!._id,
    });

    return successResponse(
      res,
      201,
      "Feedback submitted successfully",
      feedback,
    );
  } catch (err: any) {
    return errorResponse(
      res,
      500,
      err.message || "Failed to submit feedback",
    );
  }
};

export const getFeedback = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { page, limit, skip } = getPagination(
      req.query.page,
      req.query.limit,
    );

    const filter = {
      society: req.user!.society,
    };

    const [feedback, total] = await Promise.all([
      Feedback.find(filter)
        .populate("submittedBy", "name flatNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Feedback.countDocuments(filter),
    ]);

    return successResponse(
      res,
      200,
      "Feedback fetched successfully",
      paginatedResponse(feedback, total, page, limit),
    );
  } catch (err: any) {
    return errorResponse(
      res,
      500,
      err.message || "Failed to fetch feedback",
    );
  }
};