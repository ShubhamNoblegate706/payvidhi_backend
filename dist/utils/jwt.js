import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
const JWT_SECRET = process.env.JWT_SECRET || "UGU8432^%$GSUGD&%^$$745453";
const normalizeIssuer = (issuer) => issuer.replace(/\/$/, "");
const getOktaSigningKey = async (token) => {
    const issuer = process.env.OKTA_ISSUER;
    const audience = process.env.OKTA_AUDIENCE;
    if (!issuer || !audience) {
        throw new Error("Okta configuration is incomplete. Set OKTA_ISSUER and OKTA_AUDIENCE.");
    }
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken?.header?.kid) {
        throw new Error("Unable to determine the signing key identifier from the token header.");
    }
    const client = jwksClient({
        jwksUri: `${normalizeIssuer(issuer)}/v1/keys`,
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 10 * 60 * 1000,
    });
    const signingKey = await new Promise((resolve, reject) => {
        client.getSigningKey(decodedToken.header.kid, (error, key) => {
            if (error) {
                reject(error);
                return;
            }
            if (!key) {
                reject(new Error("Unable to resolve the signing key from Okta."));
                return;
            }
            resolve(key);
        });
    });
    const publicKey = signingKey.getPublicKey?.() ?? signingKey.rsaPublicKey ?? null;
    if (!publicKey) {
        throw new Error("Unable to extract a public key from the Okta signing key.");
    }
    return publicKey;
};
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d",
    });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
export const verifyOktaToken = async (token) => {
    const publicKey = await getOktaSigningKey(token);
    const issuer = process.env.OKTA_ISSUER;
    const audience = process.env.OKTA_AUDIENCE;
    if (!issuer || !audience) {
        throw new Error("Okta configuration is incomplete. Set OKTA_ISSUER and OKTA_AUDIENCE.");
    }
    const payload = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
        issuer: normalizeIssuer(issuer),
        audience,
    });
    return payload;
};
//# sourceMappingURL=jwt.js.map