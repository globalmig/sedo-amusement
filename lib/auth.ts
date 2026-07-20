import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

// Route Handler에서 관리자 세션을 검증하는 공용 헬퍼
export async function requireAdmin() {
    const cookieStore = await cookies();
    return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
