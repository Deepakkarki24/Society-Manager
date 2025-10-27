import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import {
  addQuery,
  deleteQuery,
  getAllQueries,
  getMyQueries,
  updateQuery,
} from "../controllers/queryController.js";

const queryRouter = express.Router();

queryRouter.get("/get-my-queries", authMiddleware, getMyQueries);
queryRouter.post("/add-query", authMiddleware, addQuery);
queryRouter.put("/update-query/:id", authMiddleware, updateQuery);
queryRouter.delete("/delete-query/:id", authMiddleware, deleteQuery);
queryRouter.get(
  "/get-all-queries",
  authMiddleware,
  adminMiddleware,
  getAllQueries
);

export default queryRouter;
