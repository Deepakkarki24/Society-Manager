import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { configureCloudinary } from "./config/cloudinary";
import { CLIENT_URL } from "./config/env";
import cookieParser from "cookie-parser";

export const createApp = () => {
  const app = express();

  app.use(cookieParser());

  configureCloudinary();

  app.use(helmet());
  app.use(
    cors({
      origin: [(CLIENT_URL || "http://localhost:5173"), "http://192.168.43.35:5173/", "https://simp-client.onrender.com"],
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
