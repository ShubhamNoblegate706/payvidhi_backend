import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.js";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = verifyToken(token);
  req.user = decoded; 
  next();
};