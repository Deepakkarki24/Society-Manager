import { Response } from "express";
import { errorResponse, successResponse } from "../../utils/ApiResponse";
import { AuthRequest } from "../../middleware/auth";
import { createAuditLog } from "../../services/audit.service";
import { signToken } from "../../utils/token";
import { NODE_ENV } from "../../config/env";
import { User } from "../../models/User";

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, phone, societyId, flatNumber, block } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return errorResponse(res, 409, "Email already registered");

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "resident",
      society: societyId,
      flatNumber,
      block,
    });

    const token = signToken(
      user._id.toString(),
      user.role,
      user.society?.toString(),
    );

    await createAuditLog(req, "register", "User", user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const data = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        society: user.society,
        flatNumber: user.flatNumber,
        block: user.block,
      }
    }

    return successResponse(res, 200, "Registered successfully!", data)

  } catch (err: any) {
    return errorResponse(res, 500, err.message)
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return errorResponse(res, 401, "Invalid email or password");
  }
  if (!user.isActive) return errorResponse(res, 403, "Account is deactivated");

  const token = signToken(
    user._id.toString(),
    user.role,
    user.society?.toString(),
  );

  await createAuditLog(req, "login", "User", user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const data = {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      society: user.society,
      flatNumber: user.flatNumber,
      block: user.block,
      avatar: user.avatar,
    }
  }

  return successResponse(res, 200, "Loggedin successfully!", data)
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return errorResponse(res, 401, "User not found or already logged out!")

    res.clearCookie("token")

    return successResponse(res, 200, "Logged out successfully!")
  }
  catch (err) {
    return errorResponse(res, 500, (err as any).message)
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id)
      .select("-password")
      .populate("society", "name city address");
    if (!user) return errorResponse(res, 404, "User not found");

    return successResponse(res, 200, "Fetched user data!", { data: user });
  } catch (err: any) {
    return errorResponse(res, 500, err.message)
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {

    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, phone, avatar },
      { new: true, runValidators: true },
    ).select("-password");

    return successResponse(res, 200, "Profile updated!", { data: user });
  } catch (err: any) {
    return errorResponse(res, 500, err.message)
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!._id).select("+password");

    if (!user) return errorResponse(res, 404, "User not found");

    if (!(await user.comparePassword(currentPassword))) {
      return errorResponse(res, 400, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, "Password updated successfully");

  } catch (err: any) {
    return errorResponse(res, 500, err.message)
  }
};
