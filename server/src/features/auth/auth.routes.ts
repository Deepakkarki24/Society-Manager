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
import { authenticate } from "../../middleware/auth";

const router = Router();

router.use(authenticate);

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
