import { Response } from "express";
import { Society, User } from "../../models";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { createAuditLog } from "../../services/audit.service";
import { errorResponse, successResponse } from "../../utils/ApiResponse";

export const createSociety = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const society = await Society.create(req.body);

    await createAuditLog(
      req,
      "create",
      "Society",
      society._id.toString(),
    );

    return successResponse(
      res,
      201,
      "Society created successfully",
      society,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const getSocieties = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { page, limit, skip } = getPagination(
      req.query.page,
      req.query.limit,
    );

    const search = (req.query.search as string) || "";

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    const [societies, total] = await Promise.all([
      Society.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Society.countDocuments(filter),
    ]);

    return successResponse(
      res,
      200,
      "Societies fetched successfully",
      paginatedResponse(societies, total, page, limit),
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const getSociety = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const society = await Society.findById(req.params.id);

    if (!society) {
      return errorResponse(res, 404, "Society not found");
    }

    return successResponse(
      res,
      200,
      "Society fetched successfully",
      society,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const updateSociety = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const society = await Society.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!society) {
      return errorResponse(res, 404, "Society not found");
    }

    await createAuditLog(
      req,
      "update",
      "Society",
      society._id.toString(),
    );

    return successResponse(
      res,
      200,
      "Society updated successfully",
      society,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const deleteSociety = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const society = await Society.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!society) {
      return errorResponse(res, 404, "Society not found");
    }

    await createAuditLog(
      req,
      "deactivate",
      "Society",
      society._id.toString(),
    );

    return successResponse(
      res,
      200,
      "Society deactivated successfully",
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const assignSocietyAdmin = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { userId } = req.body;
    const societyId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        role: "society_admin",
        society: societyId,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    await createAuditLog(
      req,
      "assign_admin",
      "User",
      userId,
      { societyId },
    );

    return successResponse(
      res,
      200,
      "Society admin assigned successfully",
      user,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const getSocietyStats = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const societyId = req.params.id;

    const [residents, staff, admins] = await Promise.all([
      User.countDocuments({
        society: societyId,
        role: "resident",
        isActive: true,
      }),

      User.countDocuments({
        society: societyId,
        role: "maintenance_staff",
        isActive: true,
      }),

      User.countDocuments({
        society: societyId,
        role: "society_admin",
        isActive: true,
      }),
    ]);

    return successResponse(
      res,
      200,
      "Society statistics fetched successfully",
      {
        residents,
        maintenanceStaff: staff,
        admins,
      },
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};