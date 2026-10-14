import { supabaseAdmin } from "./supabaseAdmin";
import { FaqItem } from "@/types/faq";
import { FaqCategoryKey } from "@/datas/faq";

// 공개 사이트(/, /as, /consulting)에서 사용하는 FAQ 조회 헬퍼
// category 미지정 시 전체 카테고리를 노출 순서(sort_order)대로 반환
export async function getFaqItems(category?: FaqCategoryKey): Promise<FaqItem[]> {
    let query = supabaseAdmin
        .from("faq_items")
        .select("*")
        .order("sort_order", { ascending: true });

    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
        console.error("FAQ 조회 실패:", error.message);
        return [];
    }

    return data ?? [];
}
