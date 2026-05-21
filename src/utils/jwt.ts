import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "UGU8432^%$GSUGD&%^$$745453"; 

interface TokenPayload {
  userId: string;
  tenantId: string;
  role: string;
}

//  Generate Token
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d", 
  });
};

//  Verify Token
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
