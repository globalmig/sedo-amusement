import { redirect } from "next/navigation";
import { ADMIN_CATEGORY } from "@/datas/categories";

// /admin 인덱스 페이지는 존재하지 않으므로 첫 번째 관리 카테고리로 이동
export default function AdminIndexPage() {
    const firstCategory = ADMIN_CATEGORY.admin.categories?.[0]?.url ?? "crane";
    redirect(`/admin/${firstCategory}`);
}
