import express from "express";
import { connectDb } from "./config/db";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// MongoDB connect
connectDb();

app.listen(PORT, () => {
  console.log(`Port is running on ${PORT}`);
});
