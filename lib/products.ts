import { supabaseAdmin } from "./supabaseAdmin";
import { DemoProduct } from "@/types/demo";

// 공개 사이트에서 사용하는 제품 조회 헬퍼 (demo 테이블 기준)
export async function getProducts(category?: string): Promise<DemoProduct[]> {
    let query = supabaseAdmin
        .from("demo")
        .select("*")
        .order("created_at", { ascending: false });

    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
        console.error("제품 목록 조회 실패:", error.message);
        return [];
    }

    return data ?? [];
}

export async function getProductById(id: number): Promise<DemoProduct | null> {
    const { data, error } = await supabaseAdmin
        .from("demo")
        .select("*")
        .eq("id", id)
        .single<DemoProduct>();

    if (error || !data) return null;

    return data;
}
