import { Router } from "express";
import { oktaLogin } from "../../controller/admin/auth.js";
import { adminOktaMiddleware } from "../../middleware/adminOkta.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { adminOktaLoginSchema } from "../../validator/auth.validation.js";
const router = Router();
/**
 * @swagger
 * /api/v1/admin/auth/okta/login:
 *   post:
 *     summary: Authenticate an admin using an Okta OIDC token.
 *     tags:
 *       - Admin Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Okta OIDC ID token or access token issued for the configured audience. You can also pass this token as a Bearer token.
 *     responses:
 *       200:
 *         description: Admin authentication successful.
 *       401:
 *         description: Okta authentication failed or no matching admin exists.
 */
router.post("/okta/login", validate(adminOktaLoginSchema), adminOktaMiddleware, oktaLogin);
export { router as adminAuthRoutes };
//# sourceMappingURL=auth.routes.js.map