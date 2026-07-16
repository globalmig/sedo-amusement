export const USER_CATEGORY : { [key: string]: { title: string; categories?: {name: string, url: string}[], banner?: string } } = {
    company: { 
        title:"회사소개",
        categories: [
            {name: "인사말", url: "introduction"},
            {name: "사업 영역", url: "business"},
            {name: "오시는 길", url: "location"},
        ],
    },
    products: {
        title:"제품소개",
        categories: [
            {name: "크레인/경품 게임기", url: "crane"},
            {name: "슈팅게임", url: "shooting"},
            {name: "리듬게임", url: "rhythm"},
            {name: "레이싱게임", url: "racing"},
            {name: "캐주얼게임", url: "casual"},
            {name: "스포츠게임", url: "sports"},
            {name: "비디오게임", url: "video"},
        ],
    },
    as: {
        title:"A/S 및 사후관리 안내",
    },
}

export function getProductCategoryLabel(slug: string | null) {
    return USER_CATEGORY.products.categories?.find((c) => c.url === slug)?.name ?? "미분류";
}

export const ADMIN_CATEGORY : { [key: string]: { title: string; categories?: {name: string, url: string}[], banner?: string }} = {
    admin: {
    title: "제품 관리",
    categories: [
      {name: "크레인/경품 게임기", url: "crane"},
            {name: "슈팅게임", url: "shooting"},
            {name: "리듬게임", url: "rhythm"},
            {name: "레이싱게임", url: "racing"},
            {name: "캐주얼게임", url: "casual"},
            {name: "스포츠게임", url: "sports"},
            {name: "비디오게임", url: "video"},
    ],
  },
}