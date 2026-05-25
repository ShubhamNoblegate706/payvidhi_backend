import { forgotPassword, loginUser, resetPassword } from "../../services/user/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(new ApiResponse(true, "Authentication successful.", result));
});
export const forgotPasswordController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await forgotPassword(email);
    res.status(202).json(new ApiResponse(true, result.message, result.resetToken ? { resetToken: result.resetToken } : undefined));
});
export const resetPasswordController = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await resetPassword(token, newPassword);
    res.status(200).json(new ApiResponse(true, result.message));
});
//# sourceMappingURL=auth.js.map