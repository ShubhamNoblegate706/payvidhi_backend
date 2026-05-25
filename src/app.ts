import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { setupSwagger } from "./config/swagger.js";
import { adminAuthRoutes } from "./routes/admin/auth.routes.js";
import {apiRouter} from "./routes/index.js";
import { ApiError } from "./utils/apiError.js";
import logger, { loggerStream } from "./utils/logger.js";

const app: Application = express();

app.use(morgan("combined", { stream: loggerStream }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);

app.use("/api/v1", apiRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  logger.error(err instanceof Error ? err.stack : String(err));

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    "message" in err
  ) {
    const error = err as { statusCode: number; message: string; errors?: unknown };

    res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: err instanceof Error ? err.message : "Internal Server Error",
  });
});

export { app };
