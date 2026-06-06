import { Response } from "express";
import { Announcement, User } from "../../models";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { createNotification } from "../../services/notification.service";
import { errorResponse, successResponse } from "../../utils/ApiResponse";

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const societyId = req.user!.society
    if (!societyId) {
      return errorResponse(res, 400, "Society context required");
    }

    const announcement = await Announcement.create({
      ...req.body,
      society: societyId,
      createdBy: req.user!._id,
    });

    const residents = await User.find({
      society: societyId,
      role: "resident",
      isActive: true,
    });

    await Promise.all(
      residents.map((r) =>
        createNotification({
          recipientId: r._id.toString(),
          title: req.body.isImportant
            ? "Important Notice"
            : "New Announcement",
          message: announcement.title,
          type: "announcement",
          link: `/announcements/${announcement._id}`,
        }),
      ),
    );

    return successResponse(res, 201, "Announcement created successfully", announcement);

  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(
      req.query.page,
      req.query.limit,
    );

    const societyId =
      req.user!.role === "super_admin"
        ? (req.query.societyId as string)
        : req.user!.society;

    const filter: Record<string, unknown> = {};

    if (societyId) filter.society = societyId;
    if (req.query.important === "true") filter.isImportant = true;
    if (req.query.events === "true") filter.isEvent = true;

    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Announcement.countDocuments(filter),
    ]);

    return successResponse(res, 200, "Announcements fetched successfully", paginatedResponse(announcements, total, page, limit));
  
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const getAnnouncement = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const announcement = await Announcement.findById(
      req.params.id,
    ).populate("createdBy", "name role");

    if (!announcement) {
      return errorResponse(res, 404, "Announcement not found");
    }

    return successResponse(
      res,
      200,
      "Announcement fetched successfully",
      announcement,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const updateAnnouncement = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!announcement) {
      return errorResponse(res, 404, "Announcement not found");
    }

    return successResponse(
      res,
      200,
      "Announcement updated successfully",
      announcement,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const deleteAnnouncement = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(
      req.params.id,
    );

    if (!announcement) {
      return errorResponse(res, 404, "Announcement not found");
    }

    return successResponse(
      res,
      200,
      "Announcement deleted successfully",
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};
