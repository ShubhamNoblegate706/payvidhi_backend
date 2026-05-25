import { ApiError } from "../utils/apiError.js";
import { verifyOktaToken } from "../utils/jwt.js";
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
const getEmailFromClaims = (claims) => {
    const emailClaim = claims.email ?? claims.preferred_username;
    if (typeof emailClaim !== "string" || !emailClaim.includes("@")) {
        return null;
    }
    return emailClaim.toLowerCase().trim();
};
export const adminOktaMiddleware = async (req, res, next) => {
    try {
        const token = getBearerToken(req.headers.authorization) ?? req.body?.token;
        if (!token || typeof token !== "string") {
            return next(new ApiError(401, "Okta token is required."));
        }
        const claims = await verifyOktaToken(token);
        const email = getEmailFromClaims(claims);
        if (!email) {
            return next(new ApiError(401, "Okta token does not include a valid admin email."));
        }
        req.user = {
            email,
            source: "okta",
            claims,
        };
        next();
    }
    catch {
        next(new ApiError(401, "Okta authentication failed."));
    }
};
//# sourceMappingURL=adminOkta.middleware.js.map