import express from "express";
import {authRoutes} from "./user/auth.routes.js";
import {adminAuthRoutes} from "./admin/auth.routes.js";

const router = express.Router();

// Mount auth routes
router.use("/user/auth", authRoutes);


router.use("/admin/auth", adminAuthRoutes);

export { router as apiRouter };