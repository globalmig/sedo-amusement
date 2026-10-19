import { supabaseAdmin } from "./supabaseAdmin";
import { Product, ProductType } from "@/types/product";
import { attachCategoryNames } from "./categories";

// 목록/카드용으로 쓰는 화면에는 features, detail_images, youtube_url, rating_number 같은
// 큰 텍스트/배열 컬럼이 필요 없다. 상세페이지(getProductById)에서만 전체 컬럼을 가져온다.
const LIST_COLUMNS = "id, name, category, product_type, main_image_url, spec, price, display_order, type_order, created_at";

// 공개 사이트에서 사용하는 제품 조회 헬퍼 (products 테이블 기준)
// 관리자 목록에서 드래그로 정한 카테고리 안 노출 순서(display_order)를 그대로 사용, 값이 없는 제품은 뒤로(최신 등록순)
export async function getProducts(category?: string): Promise<Product[]> {
    let query = supabaseAdmin
        .from("products")
        .select(LIST_COLUMNS)
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
        console.error("제품 목록 조회 실패:", error.message);
        return [];
    }

    return attachCategoryNames((data as unknown as Product[]) ?? []);
}

// 제품 분류(신제품/히트상품/추천상품) 기준 조회
// 분류 안에서의 노출 순서는 display_order가 아닌 type_order를 쓴다 (카테고리 순서와 분류 순서를 서로 간섭하지 않게 분리)
export async function getProductsByType(productType: string): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
        .from("products")
        .select(LIST_COLUMNS)
        .eq("product_type", productType as ProductType)
        .order("type_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("분류별 제품 조회 실패:", error.message);
        return [];
    }

    return attachCategoryNames((data as unknown as Product[]) ?? []);
}

// 홈페이지 대표 제품 슬라이더용: 히트상품 중 무작위로 limit개 조회
export async function getRandomHitProducts(limit: number): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
        .from("products")
        .select(LIST_COLUMNS)
        .eq("product_type", "hit" as ProductType);

    if (error) {
        console.error("히트 제품 조회 실패:", error.message);
        return [];
    }

    const products = (data as unknown as Product[]) ?? [];
    for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
    }

    return attachCategoryNames(products.slice(0, limit));
}

// 관리자 목록 조회: 필터 없이 전체 조회, 노출 순서(display_order) 기준 (/api/product GET과 동일한 정렬 기준)
// 관리자 목록 페이지의 필터링 결과 및 상세페이지 이전/다음 탐색 기준과 순서를 맞추기 위해 사용
export async function getAdminProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
        .from("products")
        .select(LIST_COLUMNS)
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("관리자 제품 목록 조회 실패:", error.message);
        return [];
    }

    return attachCategoryNames((data as unknown as Product[]) ?? []);
}

// 상세페이지의 "이전/다음 제품" 이동용: id/name만 가볍게 조회 (전체 컬럼 재조회 방지)
// 분류(신제품/히트/추천)로 좁혀서 보는 중이면 그 목록 화면과 같은 기준(type_order)으로, "전체"일 때는 display_order로 정렬
export async function getProductNavItems(productType?: string): Promise<Pick<Product, "id" | "name">[]> {
    const isTypeFiltered = Boolean(productType && productType !== "all");
    let query = supabaseAdmin
        .from("products")
        .select("id, name")
        .order(isTypeFiltered ? "type_order" : "display_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (isTypeFiltered) {
        query = query.eq("product_type", productType as ProductType);
    }

    const { data, error } = await query;

    if (error) {
        console.error("제품 이전/다음 목록 조회 실패:", error.message);
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

    const [withCategoryName] = await attachCategoryNames([data]);
    return withCategoryName;
}

/*
서버 컴포넌트에서만 import 되는 파일

만약 이 함수들을 각 page.tsx마다 따로 짰다면,
Supabase 쿼리 코드(supabaseAdmin.from("products").select(...))가 5곳에 복붙 -> 재사용
*/