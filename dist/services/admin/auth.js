import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import { generateToken } from "../../utils/jwt.js";
export const findAdminByEmail = async (email) => {
    const admin = await prisma.admin.findUnique({
        where: { email: email.toLowerCase().trim() },
    });
    if (!admin) {
        return null;
    }
    return {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        tenantId: admin.tenantId,
    };
};
export const loginAdminWithOkta = async (email) => {
    const admin = await findAdminByEmail(email);
    if (!admin) {
        throw new ApiError(401, "No admin found for the authenticated Okta account.");
    }
    const payload = {
        userId: admin.id,
        tenantId: admin.tenantId,
        role: admin.role,
        email: admin.email,
    };
    return {
        accessToken: generateToken(payload),
        admin,
    };
};
//# sourceMappingURL=auth.js.map