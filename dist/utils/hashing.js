import argon2 from "argon2";
// 🔒 Hashing function
export const hashPassword = async (password) => {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
    });
};
//compare the hased password with the plain password
export const verifyPassword = async (hashedPassword, plainPassword) => {
    return await argon2.verify(hashedPassword, plainPassword);
};
//# sourceMappingURL=hashing.js.map