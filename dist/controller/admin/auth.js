import { loginAdminWithOkta } from "../../services/admin/auth.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
export const oktaLogin = asyncHandler(async (req, res) => {
    if (!req.user?.email) {
        throw new ApiError(401, "Okta authentication required.");
    }
    const result = await loginAdminWithOkta(req.user.email);
    res.status(200).json(new ApiResponse(true, "Admin authentication successful.", result));
});
//# sourceMappingURL=auth.js.map