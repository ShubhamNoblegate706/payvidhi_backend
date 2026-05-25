import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { ApiError } from "../utils/apiError.js";

const client = jwksClient({
  jwksUri: "https://noblegate-hrms.us.auth0.com/.well-known/jwks.json",
});

const getKey = (header: any, callback: any) => {
  client.getSigningKey(header.kid, function (err, key: any) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

export const TokenVerification = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Missing token"));
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      getKey,
      {
        audience: process.env.AUDIOENCE, 
        issuer: process.env.OKTA_ISSUER,
        algorithms: ["RS256"],
      },
      (err, decoded: any) => {
        if (err) {
          return next(new ApiError(403, err.message));
        }
        console.log("Decoded JWT:", decoded); 
        req.user = {
          userId: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          claims: decoded,
        };

        next();
      }
    );
  } catch (err: any) {
    next(new ApiError(403, err.message));
  }
};