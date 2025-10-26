import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is not found!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    req.user = await userModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token!",
    });
  }
};
