import { supabaseClient } from "@/lib/supabaseClient";
import { STORAGE_BUCKET } from "@/lib/storage";

// 관리자가 제품 폼에서 이미지를 선택하면: 1) 서버에 서명된 업로드 URL을 요청하고
// 2) 그 URL로 브라우저가 Supabase Storage에 직접 업로드한다 (Vercel 서버를 거치지 않음).
export async function uploadProductImage(file: File, folder: "main" | "detail"): Promise<string> {
    const res = await fetch("/api/product/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, fileName: file.name, fileType: file.type, fileSize: file.size }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "이미지 업로드 준비에 실패했습니다.");

    const { error } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .uploadToSignedUrl(result.path, result.token, file);
    if (error) throw new Error("이미지 업로드에 실패했습니다.");

    return result.publicUrl as string;
}
