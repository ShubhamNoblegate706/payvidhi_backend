import type { Response, Request } from "express";

import { getDashboardData } from "../../services/admin/auth.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";

// Rename: this is NOT login
export const getAdminDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("User info from token:", req.user); // Debugging line to check req.user
    if (!req.user?.userId) {
      throw new ApiError(401, "Unauthorized: user not authenticated.");
    }
    const result = await getDashboardData(req.user.userId);
    if(!result.success) {
      throw new ApiError(404, "Dashboard data not found for the user.");
    }
    return res
      .status(200)
      .json(new ApiResponse(true, "Dashboard fetched successfully.", result.data));
  },
);
