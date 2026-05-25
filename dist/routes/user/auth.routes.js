import { Router } from "express";
import { forgotPasswordController, login, resetPasswordController, } from "../../controller/user/auth.js";
import { validate } from "../../middleware/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, } from "../../validator/auth.validation.js";
const router = Router();
/**
 * @swagger
 * /api/v1/user/auth/login:
 *   post:
 *     summary: Authenticate a user and issue an access token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Authentication successful.
 */
router.post("/login", validate(loginSchema), login);
/**
 * @swagger
 * /api/v1/user/auth/forgot-password:
 *   post:
 *     summary: Issue a password reset token for a user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       202:
 *         description: Reset instructions have been generated if the account exists.
 */
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordController);
/**
 * @swagger
 * /api/v1/user/auth/reset-password:
 *   post:
 *     summary: Reset a user password using a valid reset token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset completed successfully.
 */
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);
export { router as authRoutes };
//# sourceMappingURL=auth.routes.js.map