type CategoryItem = { name: string; url: string; children?: { name: string; url: string }[] };

export const USER_CATEGORY: { [key: string]: { title: string; categories?: CategoryItem[], banner?: string } } = {
    company: {
        title: "회사소개",
        categories: [
            { name: "인사말", url: "introduction" },
            { name: "사업 영역", url: "business" },
            { name: "오시는 길", url: "location" },
        ],
    },
    products: {
        title: "제품소개",
        categories: [
            { name: "전체", url: "all" },
            { name: "신제품", url: "new" },
            { name: "히트상품", url: "hit" },
            { name: "추천상품", url: "recommend" },
        ],
    },
    consulting: {
        title: "창업 컨설팅",
    },
    as: {
        title: "A/S 및 사후관리 안내",
    },
}

// 게임기 분류(크레인/슈팅/리듬 등)는 더 이상 여기 하드코딩하지 않음.
// /admin/categories에서 관리하는 categories 테이블(lib/categories.ts의 getCategories)을 사용할 것.

export function getProductTypeLabel(slug: string | null) {
    return USER_CATEGORY.products.categories?.find((c) => c.url === slug)?.name;
}

// 제품 카드 좌측 상단 강조 배지(신제품/히트상품/추천상품). "all"은 강조할 분류가 없으므로 배지를 노출하지 않음
export const PRODUCT_TYPE_BADGE: { [key: string]: { label: string; className: string } } = {
    new: { label: "NEW", className: "bg-blue-600" },
    hit: { label: "HIT", className: "bg-gradient-to-r from-red-500 to-orange-500" },
    recommend: { label: "추천", className: "bg-emerald-600" },
};

export function getProductTypeBadge(productType: string | null) {
    if (!productType) return null;
    return PRODUCT_TYPE_BADGE[productType] ?? null;
}

export const ADMIN_CATEGORY: { [key: string]: { title: string; categories?: CategoryItem[], banner?: string } } = {
    admin: {
        title: "관리자 페이지",
        categories: [
            { name: "제품관리", url: "products" },
            { name: "제품 카테고리 관리", url: "categories" },
            { name: "제품 사진 편집", url: "create-image" },
            {
                name: "컨설팅 콘텐츠 관리", url: "consulting/areas", children: [
                    { name: "제공 분야 관리", url: "consulting/areas" },
                    { name: "진행 절차 관리", url: "consulting/steps" },
                ]
            },
            { name: "FAQ 관리", url: "faq" },
            { name: "사용 가이드", url: "guide" },
        ],
    },
}
