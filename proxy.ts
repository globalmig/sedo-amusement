import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

const WRITE_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

// 낙관적(optimistic) 인증 체크 — 실제 데이터 접근 권한 검증은 각 Route Handler에서 한 번 더 수행함
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthenticated = verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

    if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (pathname.startsWith("/api/product") && WRITE_METHODS.has(request.method)) {
        if (!isAuthenticated) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/product/:path*"],
};
