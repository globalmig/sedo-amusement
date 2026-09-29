import { SITE_URL } from "@/datas/site";
import { COMPANY_INFO } from "@/datas/company";
import { PRODUCT_GAME_CATEGORIES, USER_CATEGORY } from "@/datas/categories";

export const dynamic = "force-static";

export function GET() {
    const companyLinks = (USER_CATEGORY.company.categories ?? [])
        .map((c) => `- [${c.name}](${SITE_URL}/company/${c.url}): 회사 ${c.name} 안내`)
        .join("\n");

    const productLinks = PRODUCT_GAME_CATEGORIES
        .map((c) => `- [${c.name}](${SITE_URL}/products/all?category=${c.url}): ${c.name} 제품 목록`)
        .join("\n");

    const body = `# ${COMPANY_INFO.name}

> 오락실, 키즈카페를 위한 전자오락기 정품 유통과 전국 A/S를 책임지는 ${COMPANY_INFO.name}입니다.

${COMPANY_INFO.name}는 인형뽑기(크레인), 슈팅, 레이싱, 리듬 게임기부터 코인노래방 및 지폐교환기까지 80여 종 이상의 정품 오락기기를 공급하는 전자오락기 유통 전문 기업입니다. 35년 이상의 유통 노하우를 바탕으로 오락실, 복합문화공간, 무인 매장 등을 운영하거나 창업하려는 사업자에게 최적의 정품 기기 견적 산정, 전국 안전 배송, 현장 설치 및 A/S 사후관리를 제공합니다. 투명한 재고 확인과 신속한 납품 프로세스를 통해 고객 매장의 안정적이고 효율적인 기기 가동을 지원합니다.

## 연락처

- 대표번호: ${COMPANY_INFO.phone}
- 이메일: ${COMPANY_INFO.email}
- 주소: ${COMPANY_INFO.address}
- 운영시간: ${COMPANY_INFO.bizHours}

## 회사소개

${companyLinks}

## 제품소개

- [전체 제품](${SITE_URL}/products/all): 전체 제품 라인업
- [신제품](${SITE_URL}/products/new): 새로 출시된 제품
- [히트상품](${SITE_URL}/products/hit): 매출이 검증된 인기 기종
- [추천상품](${SITE_URL}/products/recommend): 세도어뮤즈먼트 추천 기종
${productLinks}

## 창업 컨설팅

- [창업 컨설팅](${SITE_URL}/consulting): 아케이드 게임장, 유원시설, 키즈카페 창업 컨설팅 안내

## 사후관리

- [A/S 및 사후관리 안내](${SITE_URL}/as): 제품 구매 후 사후관리 및 자가 점검 가이드
`;

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
