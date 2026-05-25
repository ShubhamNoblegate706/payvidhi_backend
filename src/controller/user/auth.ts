import type { Request, Response } from "express";
import { forgotPassword, loginUser, resetPassword } from "../../services/user/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";

interface LoginRequestBody {
  email: string;
  password: string;
}

interface ForgotPasswordRequestBody {
  email: string;
}

interface ResetPasswordRequestBody {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequestBody;
  const result = await loginUser(email, password);

  res.status(200).json(
    new ApiResponse(true, "Authentication successful.", result)
  );
});

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body as ForgotPasswordRequestBody;
    const result = await forgotPassword(email);

    res.status(202).json(
      new ApiResponse(true, result.message, result.resetToken ? { resetToken: result.resetToken } : undefined)
    );
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword } = req.body as ResetPasswordRequestBody;
    const result = await resetPassword(token, newPassword);

    res.status(200).json(new ApiResponse(true, result.message));
  }
);