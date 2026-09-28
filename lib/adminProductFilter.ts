import { Product } from "@/types/product";

export interface AdminProductFilterParams {
    category?: string | null;
    productType?: string | null;
    keyword?: string | null;
}

// 관리자 제품목록의 필터(카테고리/분류/검색어) 로직.
// 목록 페이지의 필터 상태와 상세페이지의 이전/다음 탐색 기준을 동일하게 유지하기 위해 공용화.
export function filterAdminProducts(
    products: Product[],
    { category, productType, keyword }: AdminProductFilterParams
): Product[] {
    const kw = keyword?.trim().toLowerCase() ?? "";

    return products.filter((product) => {
        const matchesCategory = category ? product.category === category : true;
        const matchesProductType = productType ? product.product_type === productType : true;
        const matchesKeyword = kw ? product.name.toLowerCase().includes(kw) : true;
        return matchesCategory && matchesProductType && matchesKeyword;
    });
}
