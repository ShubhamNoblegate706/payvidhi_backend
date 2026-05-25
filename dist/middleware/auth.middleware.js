import { ApiError } from "../utils/apiError.js";
import { verifyOktaToken, verifyToken } from "../utils/jwt.js";
import { findUserByEmail } from "../services/user/auth.js";
const getBearerToken = (authorizationHeader) => {
    if (!authorizationHeader) {
        return null;
    }
    const [scheme, token] = authorizationHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return null;
    }
    return token.trim();
};
export const authMiddleware = async (req, res, next) => {
    try {
        const token = getBearerToken(req.headers.authorization);
        if (!token) {
            return next(new ApiError(401, "Authentication required."));
        }
        let source = "local";
        let payload = null;
        try {
            payload = verifyToken(token);
        }
        catch {
            if (!process.env.OKTA_ISSUER || !process.env.OKTA_AUDIENCE) {
                return next(new ApiError(401, "Authentication failed."));
            }
            source = "okta";
            payload = await verifyOktaToken(token);
        }
        const authenticatedEmail = payload.email ?? null;
        if (!authenticatedEmail) {
            return next(new ApiError(401, "Authentication failed."));
        }
        const user = await findUserByEmail(authenticatedEmail);
        if (!user) {
            return next(new ApiError(401, "Authentication failed."));
        }
        req.user = {
            userId: user.id,
            tenantId: user.tenantId,
            role: user.role,
            email: user.email,
            source,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.middleware.js.map