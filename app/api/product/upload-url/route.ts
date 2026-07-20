import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { buildStoragePath, getPublicImageUrl } from "@/lib/uploadImage";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, STORAGE_BUCKET } from "@/lib/storage";

// 관리자가 이미지를 Vercel 서버를 거치지 않고 Supabase Storage에 직접 업로드할 수 있도록
// 서명된 업로드 URL(단발성 토큰)을 발급한다. 실제 이미지 바이너리는 이 라우트를 통과하지 않는다.
export async function POST(request: Request) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const folder = body?.folder;
    const fileName = body?.fileName;
    const fileType = body?.fileType;
    const fileSize = body?.fileSize;

    if (folder !== "main" && folder !== "detail") {
        return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    if (typeof fileName !== "string" || !fileName.trim()) {
        return NextResponse.json({ error: "파일 이름이 필요합니다." }, { status: 400 });
    }

    if (typeof fileType !== "string" || !ALLOWED_IMAGE_TYPES.has(fileType)) {
        return NextResponse.json({ error: "이미지 파일(jpg, png, webp, gif)만 업로드할 수 있습니다." }, { status: 400 });
    }

    // if (typeof fileSize !== "number" || fileSize <= 0 || fileSize > MAX_IMAGE_SIZE) {
    //     return NextResponse.json({ error: "이미지 파일은 5MB 이하만 업로드할 수 있습니다." }, { status: 400 });
    // }

    const path = buildStoragePath(fileName, folder);
    const { data, error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).createSignedUploadUrl(path);

    if (error || !data) {
        return NextResponse.json({ error: "업로드 URL 발급에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({
        path: data.path,
        token: data.token,
        publicUrl: getPublicImageUrl(data.path),
    });
}
