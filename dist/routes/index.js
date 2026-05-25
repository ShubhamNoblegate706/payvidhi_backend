import express from "express";
import { authRoutes } from "./user/auth.routes.js";
const router = express.Router();
// Mount auth routes
router.use("/user/auth", authRoutes);
export { router as apiRouter };
//# sourceMappingURL=index.js.map