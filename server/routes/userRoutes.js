import express from "express";
import {
  checkAuth,
  isAdmin,
  login,
  logout,
  signUp,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.post("/register", signUp);
userRouter.post("/login", login);
userRouter.post("/logout", authMiddleware, logout);
userRouter.get("/me", authMiddleware, checkAuth);

userRouter.get("/is-admin", isAdmin);

export default userRouter;
