export const FAQ_CATEGORIES = [
    { key: "order", label: "구매/주문" },
    { key: "delivery", label: "배송/설치" },
    { key: "as", label: "A/S 문의" },
    { key: "warranty", label: "보증/부품" },
    { key: "refund", label: "환불/교환" },
    { key: "consulting", label: "창업 컨설팅" },
] as const;

export type FaqCategoryKey = (typeof FAQ_CATEGORIES)[number]["key"];

// FAQ 질문/답변 데이터는 Supabase faq_items 테이블로 이전되었음 (lib/faq.ts의 getFaqItems 참고)
// 관리자 페이지(/admin/faq)에서 카테고리별 FAQ를 등록·수정·삭제할 수 있음
