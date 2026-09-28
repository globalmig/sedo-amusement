import { supabaseAdmin } from "./supabaseAdmin";
import { Product, ProductType } from "@/types/product";

// 제품 노출 우선순위: 신제품 > 히트상품 > 추천상품 > 그 외
const PRODUCT_TYPE_PRIORITY: Record<string, number> = {
    new: 0,
    hit: 1,
    recommend: 2,
    all: 3,
};

function sortByProductTypePriority(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
        const priorityDiff =
            (PRODUCT_TYPE_PRIORITY[a.product_type ?? "all"] ?? 3) -
            (PRODUCT_TYPE_PRIORITY[b.product_type ?? "all"] ?? 3);

        if (priorityDiff !== 0) return priorityDiff;

        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

// 공개 사이트에서 사용하는 제품 조회 헬퍼 (products 테이블 기준)
// 신제품 > 히트상품 > 추천상품 > 그 외 순으로 정렬, 동일 분류 내에서는 최신 등록순
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

    return sortByProductTypePriority(data ?? []);
}

// 제품 분류(신제품/히트상품/추천상품) 기준 조회
export async function getProductsByType(productType: string): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("product_type", productType as ProductType)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("분류별 제품 조회 실패:", error.message);
        return [];
    }

    return data ?? [];
}

// 홈페이지 대표 제품 슬라이더용: 히트상품 중 무작위로 limit개 조회
export async function getRandomHitProducts(limit: number): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("product_type", "hit" as ProductType);

    if (error) {
        console.error("히트 제품 조회 실패:", error.message);
        return [];
    }

    const products = data ?? [];
    for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
    }

    return products.slice(0, limit);
}

// 관리자 목록 조회: 필터 없이 최신 등록순 전체 조회 (/api/product GET과 동일한 정렬 기준)
// 관리자 목록 페이지의 필터링 결과 및 상세페이지 이전/다음 탐색 기준과 순서를 맞추기 위해 사용
export async function getAdminProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("관리자 제품 목록 조회 실패:", error.message);
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

/*
서버 컴포넌트에서만 import 되는 파일

만약 이 함수들을 각 page.tsx마다 따로 짰다면,
Supabase 쿼리 코드(supabaseAdmin.from("products").select(...))가 5곳에 복붙 -> 재사용
*/