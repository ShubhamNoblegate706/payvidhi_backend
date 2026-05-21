import { Request, Response } from "express";
import {prisma} from "../../config/db.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/response.js";
import {} from "../../services/user/auth.js";

export const createUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email } = req.body;

  }
);