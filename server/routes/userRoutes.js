import express from "express";
import { login, logout, signUp } from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

export default userRouter;
