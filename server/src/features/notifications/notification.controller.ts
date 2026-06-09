import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { errorResponse, successResponse } from "../../utils/ApiResponse";
import { Notification } from "../../models/Notification";

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { page, limit, skip } = getPagination(
      req.query.page,
      req.query.limit,
    );

    const filter: Record<string, unknown> = {
      recipient: req.user!._id,
    };

    if (req.query.unread === "true") {
      filter.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Notification.countDocuments(filter),
    ]);

    return successResponse(
      res,
      200,
      "Notifications fetched successfully",
      paginatedResponse(notifications, total, page, limit),
    );
  } catch (err: any) {
    return errorResponse(
      res,
      500,
      err.message || "Failed to fetch notifications",
    );
  }
};

// export const markAsRead = async (
//   req: AuthRequest,
//   res: Response,
// ) => {
//   try {
//     const notification = await Notification.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         recipient: req.user!._id,
//       },
//       {
//         isRead: true,
//       },
//       {
//         new: true,
//       },
//     );

//     if (!notification) {
//       return errorResponse(
//         res,
//         404,
//         "Notification not found",
//       );
//     }

//     return successResponse(
//       res,
//       200,
//       "Notification marked as read",
//       notification,
//     );
//   } catch (err: any) {
//     return errorResponse(
//       res,
//       500,
//       err.message || "Failed to update notification",
//     );
//   }
// };

export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user!._id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return successResponse(
      res,
      200,
      "All notifications marked as read",
    );
  } catch (err: any) {
    return errorResponse(
      res,
      500,
      err.message || "Failed to mark notifications as read",
    );
  }
};

export const getUnreadCount = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user!._id,
      isRead: false,
    });

    return successResponse(
      res,
      200,
      "Unread count fetched successfully",
      { count },
    );
  } catch (err: any) {
    return errorResponse(
      res,
      500,
      err.message || "Failed to fetch unread count",
    );
  }
};