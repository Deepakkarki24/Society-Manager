import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered!",
      });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPwd,
      role,
      phoneNumber,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWTSECRETKEY,
      {
        expiresIn: process.env.EXPIRESIN,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    const { password: pwd, ...userWithoutPwd } = newUser._doc;

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPwd,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const foundUser = await userModel.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect!",
      });
    }

    const compare = await bcrypt.compare(password, foundUser.password);

    if (!compare) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect!",
      });
    }

    const token = jwt.sign(
      { id: foundUser._id, role: foundUser.role },
      process.env.JWTSECRETKEY,
      {
        expiresIn: process.env.EXPIRESIN,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    const { password: pwd, ...userWithoutPwd } = foundUser._doc;

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: userWithoutPwd,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully!",
  });
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User authenticated successfully!",
      user,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token!",
    });
  }
};
