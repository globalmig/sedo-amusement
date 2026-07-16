import crypto from "crypto";

// 관리자 세션 쿠키: "{admin_id}.{만료시각}.{서명}" 형태의 서명된 토큰
// 서버(Route Handler, Proxy)에서만 생성/검증할 것 — SESSION_SECRET은 절대 클라이언트에 노출하지 말 것
export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 3; // 3시간

function getSecret() {
    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error("Missing SESSION_SECRET environment variable");
    return secret;
}

function sign(payload: string) {
    return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(adminId: string) {
    const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
    const payload = `${adminId}.${expiresAt}`;
    return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [adminId, expiresAtRaw, signature] = parts;

    const expected = sign(`${adminId}.${expiresAtRaw}`);
    const expectedBuf = Buffer.from(expected, "hex");
    const actualBuf = Buffer.from(signature, "hex");
    if (expectedBuf.length !== actualBuf.length) return false;
    if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) return false;

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

    return true;
}
