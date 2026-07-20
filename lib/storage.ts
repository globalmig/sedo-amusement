// 클라이언트(브라우저)/서버 양쪽에서 공용으로 쓰는 스토리지 상수
// (서버 전용 시크릿을 참조하지 않으므로 클라이언트 컴포넌트에서 import해도 안전함)
export const STORAGE_BUCKET = "demo-images";
export const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
