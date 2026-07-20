import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

// 인증 체크 — 실제 데이터 접근 권한 검증은 각 Route Handler에서 한 번 더 수행함
// /api/product는 매처에 넣지 않는다: proxy가 매칭되는 라우트는 Next.js가 요청 바디를
// 메모리에 통째로 복제/버퍼링(기본 10MB 한도)하는데, 이 라우트는 route.ts에서 이미
// 동일한 세션 검증을 하고 있어 proxy를 거칠 실익 없이 불필요한 버퍼링만 유발함
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuthenticated = verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

    if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
