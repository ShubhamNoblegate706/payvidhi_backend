import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import { hashPassword, verifyPassword } from "../../utils/hashing.js";
import { generateToken } from "../../utils/jwt.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { resetPasswordTemplate } from "../../templates/authTemplates.js";

export type AuthUserSummary = {
  id: string;
  email: string;
  role: string;
  tenantId: string;
};

export type LoginResult = {
  accessToken: string;
  user: AuthUserSummary;
};

export type ForgotPasswordResult = {
  message: string;
  resetToken?: string;
};

export const findUserByEmail = async (
  email: string,
): Promise<AuthUserSummary | null> => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  };
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new ApiError(401, "No user found with the provided email.");
  }

  const isPasswordValid = await verifyPassword(user.password, password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Wrong password.");
  }

  const payload = {
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
    email: user.email,
  };

  return {
    accessToken: generateToken(payload),
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    },
  };
};

export const forgotPassword = async (
  email: string,
): Promise<ForgotPasswordResult> => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return {
      message: "If the email exists, a reset link has been sent.",
    };
  }

  //  Create token payload
  const payload = {
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
    email: user.email,
  };

  //  Generate token
  const resetToken = generateToken(payload);

  //  Hash token before saving
  const resetTokenHash =await hashPassword(resetToken);

  const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: resetTokenHash,
      resetTokenExpiresAt,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail(
    user.email,
    "Reset Your Password",
    resetPasswordTemplate({
      resetLink: resetUrl,
      userName: user.email.split("@")[0],
    }),
  );

  return {
    message: "If the email exists, a reset link has been sent.",
  };
};

export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<{ message: string }> => {
  const tokenHash = await hashPassword(token);
  const user = await prisma.user.findFirst({
    where: {
      resetToken: tokenHash,
      resetTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or has expired.");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return {
    message: "Password has been reset successfully.",
  };
};
