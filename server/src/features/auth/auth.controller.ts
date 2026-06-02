import { Response } from "express";
import { User } from "../../models";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../middleware/auth";
import { createAuditLog } from "../../services/audit.service";
import { signToken } from "../../utils/token";

export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password, phone, societyId, flatNumber, block } =
    req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

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

  res.status(201).json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        society: user.society,
        flatNumber: user.flatNumber,
        block: user.block,
      },
      token,
    },
  });
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  const token = signToken(
    user._id.toString(),
    user.role,
    user.society?.toString(),
  );

  await createAuditLog(req, "login", "User", user._id.toString());

  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        society: user.society,
        flatNumber: user.flatNumber,
        block: user.block,
        avatar: user.avatar,
      },
      token,
    },
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id)
    .select("-password")
    .populate("society", "name city address");
  if (!user) throw new ApiError(404, "User not found");

  res.json({ success: true, data: user });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { name, phone, avatar },
    { new: true, runValidators: true },
  ).select("-password");

  res.json({ success: true, data: user });
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user!._id).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
};
