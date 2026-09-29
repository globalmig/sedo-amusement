import bcrypt from "bcryptjs";
import crypto from "crypto";

// 신규/재해싱 비밀번호에 사용할 bcrypt cost factor
const BCRYPT_ROUNDS = 12;

// 예전 방식(솔트 없는 SHA-256, 64자리 16진수) 해시를 식별하기 위한 패턴
// bcrypt 해시는 "$2a$"/"$2b$"로 시작하므로 이 패턴에 걸리지 않음
const LEGACY_SHA256_PATTERN = /^[a-f0-9]{64}$/i;

export async function hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
}

interface VerifyResult {
    valid: boolean;
    // 레거시(SHA-256) 해시로 검증에 성공한 경우 true — 호출자가 즉시 bcrypt로 재해싱해 DB에 반영해야 함
    needsRehash: boolean;
}

// admin_user.password_hash가 예전 SHA-256 방식이면 그 방식으로,
// bcrypt로 이미 마이그레이션된 계정이면 bcrypt로 검증한다.
// (SQL Editor에서 pgcrypto의 crypt(password, gen_salt('bf'))로 만든 해시도 bcrypt 포맷이라 그대로 호환됨)
export async function verifyPassword(plainPassword: string, storedHash: string): Promise<VerifyResult> {
    if (LEGACY_SHA256_PATTERN.test(storedHash)) {
        const inputHash = crypto.createHash("sha256").update(plainPassword).digest("hex");
        const expectedBuf = Buffer.from(storedHash, "hex");
        const actualBuf = Buffer.from(inputHash, "hex");
        const valid =
            expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf);
        return { valid, needsRehash: valid };
    }

    const valid = await bcrypt.compare(plainPassword, storedHash);
    return { valid, needsRehash: false };
}
