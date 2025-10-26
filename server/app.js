import express from "express";
import { connectDb } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import userModel from "./models/userModel.js";
import queryModel from "./models/queryModel.js";

import userRoutes from "./routes/userRoutes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);

// MongoDB connect
connectDb();

app.listen(PORT, () => {
  console.log(`Port is running on ${PORT}`);
});
