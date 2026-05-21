import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger, { loggerStream } from "./utils/logger.js";
import rateLimit from "express-rate-limit";
import { setupSwagger } from "./config/swagger.js";
// Initialize app
const app = express();
// PORT
const PORT = Number(process.env.PORT) || 5000;
// Request logger
app.use(morgan("combined", { stream: loggerStream }));
// ======================
// Security Middleware
// ======================
// Secure HTTP headers
app.use(helmet());
// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // limit each IP
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
// ======================
// General Middleware
// ======================
// Enable CORS
app.use(cors({
    origin: "*",
    credentials: true,
}));
// Parse JSON
app.use(express.json());
// Parse URL Encoded Data
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);
// ======================
// Routes
// ======================
// ======================
// 404 Handler
// ======================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// ======================
// Global Error Handler
// ======================
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
export { app };
//# sourceMappingURL=app.js.map