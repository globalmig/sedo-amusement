import { supabaseAdmin } from "./supabaseAdmin";
import { Product } from "@/types/product";

// 공개 사이트에서 사용하는 제품 조회 헬퍼 (products 테이블 기준)
export async function getProducts(category?: string): Promise<Product[]> {
    let query = supabaseAdmin
        .from("products")
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

// 관리자가 주요 제품으로 지정한(is_featured) 제품만 조회
export async function getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("주요 제품 조회 실패:", error.message);
        return [];
    }

    return data ?? [];
}

export async function getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", id)
        .single<Product>();

    if (error || !data) return null;

    return data;
}
