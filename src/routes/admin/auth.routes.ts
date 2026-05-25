import { Router } from "express";
import { getAdminDashboard } from "../../controller/admin/auth.js";
import { TokenVerification } from "../../middleware/tokenVerification.js";
const router = Router();

/**
 * @swagger
 * /api/v1/admin/auth/dashboard:
 *   get:
 *     summary: Fetch the admin dashboard data
 *     tags:
 *       - Admin Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard fetched successfully
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Token verification failed
 */
router.get("/dashboard", TokenVerification, getAdminDashboard);

export { router as adminAuthRoutes };
