import { supabaseAdmin } from "./supabaseAdmin";
import { Category } from "@/types/category";

// 제품 카테고리(크레인/슈팅/리듬 등) 조회 헬퍼 (categories 테이블 기준)
// 관리자가 /admin/categories에서 추가/삭제/순서변경을 하면 이 함수가 그 결과를 그대로 돌려준다.
export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabaseAdmin
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("카테고리 목록 조회 실패:", error.message);
        return [];
    }

    return (data as unknown as Category[]) ?? [];
}

// slug -> 이름 매핑. 제품 목록에 카테고리 이름을 붙여줄 때 매번 전체 목록을 조회하지 않도록 함.
export async function getCategoryNameMap(): Promise<Map<string, string>> {
    const categories = await getCategories();
    return new Map(categories.map((c) => [c.slug, c.name]));
}

// 제품 배열에 category_name(카테고리 한글 이름)을 붙여서 돌려준다.
// 화면(ProductCard, ProductDetail 등)에서는 product.category(slug) 대신 이 값을 표시용으로 사용한다.
export async function attachCategoryNames<T extends { category: string | null }>(
    rows: T[]
): Promise<(T & { category_name: string | null })[]> {
    const map = await getCategoryNameMap();
    return rows.map((row) => ({ ...row, category_name: map.get(row.category ?? "") ?? null }));
}
