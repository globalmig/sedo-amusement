import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/lib/auth";

// 관리자 사용 메뉴얼 스크린샷 전용 디렉터리 (public/이 아니라 로그인 세션 검증 후에만 응답)
const GUIDE_DIR = path.join(process.cwd(), "private", "admin-guide");
// 파일명만 허용 — 경로 조작(../) 및 다른 확장자 요청 차단
const FILENAME_PATTERN = /^[a-z0-9-]+\.jpg$/;

interface RouteParams {
    params: Promise<{ filename: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { filename } = await params;

    if (!FILENAME_PATTERN.test(filename)) {
        return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    try {
        const file = await readFile(path.join(GUIDE_DIR, filename));
        return new NextResponse(new Uint8Array(file), {
            headers: {
                "Content-Type": "image/jpeg",
                // 관리자 세션이 있을 때만 내려주는 이미지 — private으로 CDN/공유 캐시 저장은 막고
                // 브라우저 자체 캐시만 허용해 페이지 재방문 시 매번 다시 받지 않도록 함
                "Cache-Control": "private, max-age=86400",
            },
        });
    } catch {
        return NextResponse.json({ error: "이미지를 찾을 수 없습니다." }, { status: 404 });
    }
}
