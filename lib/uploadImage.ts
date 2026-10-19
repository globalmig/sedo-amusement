import { supabaseAdmin } from "./supabaseAdmin";
import { STORAGE_BUCKET } from "./storage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const STORAGE_URL_MARKER = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

// 서명된 업로드 URL을 발급할 스토리지 경로 생성
// (한글/공백 등이 섞인 파일명은 공개 URL에서 깨질 수 있어 안전한 문자로 치환)
export function buildStoragePath(fileName: string, folder: "main" | "detail") {
    const safeName = fileName
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_");
    return `${folder}/${Date.now()}_${safeName}`;
}

export function getPublicImageUrl(path: string) {
    const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

// 클라이언트가 보낸 이미지 URL이 실제로 우리 버킷 소속인지 검증 (임의 외부 URL 주입 방지)
export function isOwnStorageUrl(url: unknown): url is string {
    if (typeof url !== "string" || !url.includes(STORAGE_URL_MARKER)) return false;

    try {
        return new URL(url).origin === new URL(supabaseUrl).origin;
    } catch {
        return false;
    }
}

// 업로드 URL 발급 시에는 브라우저가 "이 파일은 image/png다"라고 주장하는 말만 확인할 수 있고,
// 실제 파일 바이트는 브라우저→Storage로 직접 전송되어 서버를 거치지 않는다.
// 그래서 제품을 저장하는 시점에 실제 저장된 바이트의 매직바이트를 읽어 진짜 이미지인지 한 번 더 확인한다.
function hasImageSignature(bytes: Uint8Array): boolean {
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true; // JPEG
    if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true; // PNG
    if (bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true; // GIF
    if (
        bytes.length >= 12 &&
        bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    ) return true; // WEBP

    return false;
}

async function isRealImageFile(url: string): Promise<boolean> {
    try {
        const res = await fetch(url, { headers: { Range: "bytes=0-11" } });
        if (!res.ok && res.status !== 206) return false;

        const buffer = new Uint8Array(await res.arrayBuffer());
        return hasImageSignature(buffer);
    } catch {
        return false;
    }
}

// 우리 버킷 소속 URL인지 + 실제 이미지 파일인지(매직바이트)까지 함께 검증
export async function verifyOwnImageUrls(urls: unknown[]): Promise<boolean> {
    if (!urls.every(isOwnStorageUrl)) return false;

    const checks = await Promise.all((urls as string[]).map(isRealImageFile));
    return checks.every(Boolean);
}

export async function deleteProductImage(publicUrl: string) {
    const markerIndex = publicUrl.indexOf(STORAGE_URL_MARKER);
    if (markerIndex === -1) return;

    const filePath = publicUrl.slice(markerIndex + STORAGE_URL_MARKER.length);
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([filePath]);
}
