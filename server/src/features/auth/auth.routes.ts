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

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);


router.get("/me", authenticate, getMe);
router.patch("/profile", authenticate, updateProfile);
router.patch(
  "/change-password",
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  authenticate,
  changePassword,
);

export default router;
