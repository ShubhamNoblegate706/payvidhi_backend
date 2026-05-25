import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId?: string;
        email?: string;
        userName?: string;
        role?: string;
        tenantId?: string;
        claims?: any;
      };
    }
  }
}

export {};