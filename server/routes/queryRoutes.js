import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addQuery,
  deleteQuery,
  getUserQueries,
  updateQuery,
} from "../controllers/queryController.js";

const queryRouter = express.Router();

queryRouter.get("/get-user-queries", authMiddleware, getUserQueries);
queryRouter.post("/add-query", authMiddleware, addQuery);
queryRouter.put("/update-query/:id", authMiddleware, updateQuery);
queryRouter.delete("/delete-query/:id", authMiddleware, deleteQuery);

export default queryRouter;
