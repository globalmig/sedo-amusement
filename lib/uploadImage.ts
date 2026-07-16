import { supabaseAdmin } from "./supabaseAdmin";

const BUCKET = "demo-images";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// demo 테이블용 이미지 업로드 (대표이미지/상세이미지 공용)
export async function uploadProductImage(file: File, folder: "main" | "detail") {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new Error("이미지 파일(jpg, png, webp, gif)만 업로드할 수 있습니다.");
    }
    if (file.size > MAX_IMAGE_SIZE) {
        throw new Error("이미지 파일은 5MB 이하만 업로드할 수 있습니다.");
    }

    const arrayBuffer = await file.arrayBuffer();
    // 한글/공백 등이 섞인 파일명은 공개 URL에서 깨질 수 있어 안전한 문자로 치환
    const safeName = file.name
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = `${folder}/${Date.now()}_${safeName}`;

    const { error } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(filePath, arrayBuffer, {
            contentType: file.type,
            upsert: false,
        });

    if (error) throw new Error(`이미지 업로드에 실패했습니다. (${error.message})`);

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
}

export async function deleteProductImage(publicUrl: string) {
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const markerIndex = publicUrl.indexOf(marker);
    if (markerIndex === -1) return;

    const filePath = publicUrl.slice(markerIndex + marker.length);
    await supabaseAdmin.storage.from(BUCKET).remove([filePath]);
}
