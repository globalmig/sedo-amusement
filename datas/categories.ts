export const USER_CATEGORY: { [key: string]: { title: string; categories?: { name: string, url: string }[], banner?: string } } = {
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

// 게임기 분류(크레인/슈팅/리듬 등) - 제품 등록 시 지정하는 세부 카테고리, 갤러리 필터에 사용
export const PRODUCT_GAME_CATEGORIES: { name: string; url: string }[] = [
    { name: "크레인/경품 게임기", url: "crane" },
    { name: "슈팅게임", url: "shooting" },
    { name: "리듬게임", url: "rhythm" },
    { name: "레이싱게임", url: "racing" },
    { name: "캐주얼게임", url: "casual" },
    { name: "스포츠게임", url: "sports" },
    { name: "비디오게임", url: "video" },
    { name: "라이드 어트렉션", url: "attraction" },
    { name: "시설게임", url: "facility" },
    { name: "교환기", url: "exchange" },
];

export function getProductCategoryLabel(slug: string | null) {
    return PRODUCT_GAME_CATEGORIES.find((c) => c.url === slug)?.name;
}

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

export const ADMIN_CATEGORY: { [key: string]: { title: string; categories?: { name: string, url: string }[], banner?: string } } = {
    admin: {
        title: "관리자 페이지",
        categories: [
            { name: "제품관리", url: "products" },
            { name: "제품 사진 편집", url: "create-image" },
            { name: "사용 가이드", url: "guide" },
        ],
    },
}
