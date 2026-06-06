import { Response } from "express";
import { User } from "../../models";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { createAuditLog } from "../../services/audit.service";
import { UserRole } from "../../types";
import { errorResponse, successResponse } from "../../utils/ApiResponse";

const getSocietyFilter = (req: AuthRequest): Record<string, unknown> => {
  if (req.user!.role === "super_admin") {
    return req.query.societyId ? { society: req.query.societyId } : {};
  }

  return { society: req.user!.society };
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const societyId =
      req.user!.role === "super_admin"
        ? req.body.society
        : req.user!.society;

    const user = await User.create({
      ...req.body,
      society: societyId,
    });

    await createAuditLog(
      req,
      "create",
      "User",
      user._id.toString(),
    );

    const safeUser = await User.findById(user._id).select("-password");

    return successResponse(
      res,
      201,
      "User created successfully",
      safeUser,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(
      req.query.page,
      req.query.limit,
    );

    const filter: Record<string, unknown> = {
      ...getSocietyFilter(req),
      isActive: true,
    };

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.search) {
      filter.$or = [
        {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          flatNumber: {
            $regex: req.query.search,
            $options: "i",
          },
        },
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

    return successResponse(
      res,
      200,
      "Users fetched successfully",
      paginatedResponse(users, total, page, limit),
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(
      res,
      200,
      "User fetched successfully",
      user,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    await createAuditLog(
      req,
      "update",
      "User",
      user._id.toString(),
    );

    return successResponse(
      res,
      200,
      "User updated successfully",
      user,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const deactivateUser = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    ).select("-password");

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    await createAuditLog(
      req,
      "deactivate",
      "User",
      user._id.toString(),
    );

    return successResponse(
      res,
      200,
      "User deactivated successfully",
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const addFamilyMember = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId =
      req.user!.role === "resident"
        ? req.user!._id
        : req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    user.familyMembers.push(req.body);

    await user.save();

    return successResponse(
      res,
      200,
      "Family member added successfully",
      user.familyMembers,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const removeFamilyMember = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId =
      req.user!.role === "resident"
        ? req.user!._id
        : req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    user.familyMembers = user.familyMembers.filter(
      (m) =>
        String(
          (m as { _id?: { toString(): string } })._id,
        ) !== req.params.memberId,
    );

    await user.save();

    return successResponse(
      res,
      200,
      "Family member removed successfully",
      user.familyMembers,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};

export const getMaintenanceStaff = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const societyId =
      req.user!.society ||
      (req.query.societyId as string);

    const staff = await User.find({
      society: societyId,
      role: "maintenance_staff" as UserRole,
      isActive: true,
    }).select("-password");

    return successResponse(
      res,
      200,
      "Maintenance staff fetched successfully",
      staff,
    );
  } catch (err: any) {
    return errorResponse(res, 500, err.message);
  }
};
