import { Router } from "express";
import { registerValidation, loginValidation } from "./auth.validation";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from "./auth.controller";
import { body } from "express-validator";

const router = Router();

// need to add middleware
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", getMe);
router.patch("/profile", updateProfile);
router.patch(
  "/change-password",
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  changePassword,
);

export default router;
