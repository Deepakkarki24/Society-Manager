import express from "express";
import {
  checkAuth,
  login,
  logout,
  signUp,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/check-auth", checkAuth);

export default userRouter;
