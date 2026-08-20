import { redirect } from "next/navigation";
import { ADMIN_CATEGORY } from "@/datas/categories";

export default function AdminIndexPage() {
    const firstCategory = ADMIN_CATEGORY.admin.categories?.[0]?.url ?? "crane";
    redirect(`/admin/${firstCategory}`);
}
