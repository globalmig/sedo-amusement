export interface GuideStep {
    n?: number;
    text: string;
    image: string;
    width: number;
    height: number;
}

export interface GuideSectionData {
    slug: "register" | "edit" | "delete" | "crop-image" | "remover";
    navTitle: string;
    title: string;
    description: string;
    steps: GuideStep[];
}

export const GUIDE_SECTIONS: GuideSectionData[] = [
    {
        slug: "register",
        navTitle: "제품 등록하기",
        title: "1. 제품 등록하기",
        description: "새 제품을 등록하는 방법입니다.",
        steps: [
            { n: 1, text: "등록하시고자 하는 제품의 카테고리를 선택한 후, [등록] 버튼을 클릭합니다.", image: "admin-process-1.jpg", width: 1280, height: 802 },
            { n: 2, text: "제품 등록을 진행합니다. 제품 이름과, 카테고리, 규격은 필수 입력입니다. 입력하지 않으면 등록이 되지 않습니다", image: "admin-process-2.jpg", width: 1280, height: 803 },
            { n: 3, text: "(선택) 가격은 숫자로만 입력합니다. 가격이 미정인 경우, 공란으로 비워두면 '가격 문의'로 표시됩니다.", image: "admin-process-7.jpg", width: 929, height: 114 },
            { n: 4, text: "[파일 선택]을 클릭하여 제품의 대표 사진를 등록합니다.", image: "admin-process-8.jpg", width: 562, height: 148 },
            { n: 5, text: "[파일 선택]을 클릭하여 제품의 상세 사진를 등록합니다. 여러 장을 등록할 수 있습니다.", image: "admin-process-9.jpg", width: 557, height: 164 },
            { n: 6, text: "[등록] 버튼을 클릭하면 제품 등록이 완료됩니다.", image: "admin-process-10.jpg", width: 371, height: 142 },
            { n: 7, text: "등록된 제품을 목록에서 확인하실 수 있습니다.", image: "admin-process-11.jpg", width: 1280, height: 799 },
            { n: 8, text: "제품 상세 예시 화면입니다.", image: "admin-process-12.jpg", width: 1280, height: 796 },
            { n: 9, text: "실제 홈페이지에 등록된 제품 예시 화면입니다.", image: "admin-process-13.jpg", width: 1280, height: 762 },
        ],
    },
    {
        slug: "edit",
        navTitle: "제품 수정하기",
        title: "2. 제품 수정하기",
        description: "제품 상세 페이지 혹은 목록에서 [수정]을 클릭하면 제품 내용을 수정하실 수 있습니다.",
        steps: [
            { n: 1, text: "제품 수정을 진행합니다. 수정하시고자 하는 내용을 변경합니다.", image: "admin-process-14.jpg", width: 1280, height: 798 },
            {
                n: 2,
                text: "대표 사진를 바꾸시려면 [파일 선택]을 클릭하여 원하시는 사진으로 등록합니다. 상세 사진를 추가하시려면 [파일 추가]를 클릭하여 사진을 선택합니다. (수정 전 화면)",
                image: "admin-process-16.jpg",
                width: 568,
                height: 545,
            },
            { n: 3, text: "다른 사진로 변경한 후의 예시 화면입니다.", image: "admin-process-17.jpg", width: 629, height: 275 },
            { n: 4, text: "상세 사진를 추가한 후의 예시 화면입니다.", image: "admin-process-18.jpg", width: 616, height: 280 },
            { n: 5, text: "필요하지 않은 상세 사진는 X 버튼을 클릭하여 삭제합니다.", image: "admin-process-19.jpg", width: 616, height: 280 },
            { n: 6, text: "[수정] 버튼을 클릭하여 제품 수정이 완료됩니다.", image: "admin-process-21.jpg", width: 375, height: 143 },
            { n: 7, text: "수정된 제품 상세 페이지의 예시 화면입니다.", image: "admin-process-22.jpg", width: 1280, height: 796 },
            { n: 8, text: "실제 사이트에 적용된 제품 페이지의 예시 화면입니다.", image: "admin-process-23.jpg", width: 1280, height: 757 },
        ],
    },
    {
        slug: "delete",
        navTitle: "제품 삭제하기",
        title: "3. 제품 삭제하기",
        description: "더 이상 필요하지 않은 제품을 삭제하는 방법입니다.",
        steps: [
            { n: 1, text: "삭제하고자 하시는 제품 항목의 가장 우측에 있는 [삭제] 버튼을 클릭합니다.", image: "admin-process-24.jpg", width: 1280, height: 798 },
            { n: 2, text: "[확인] 버튼을 클릭하면 제품이 삭제됩니다.", image: "admin-process-25.jpg", width: 372, height: 144 },
        ],
    },
    {
        slug: "crop-image",
        navTitle: "제품 사진 자르기",
        title: "4. 제품 사진 자르기",
        description: "제품을 등록할 때 필요한 대표 사진를 편집합니다.",
        steps: [
            { n: 1, text: "[파일 선택]을 클릭하여 촬영한 제품 사진를 선택합니다.", image: "admin-process-24.jpg", width: 1280, height: 798 },
            { n: 2, text: "확대 바를 조작하거나 사진을 움직여 1:1 비율로 자릅니다.", image: "admin-process-25.jpg", width: 372, height: 144 },
            { n: 3, text: "1:1 비율로 자른 사진 결과를 확인하여 다운로드 받을 수 있습니다. 수정이 필요하다면 [다시 자르기] 를 클릭하여 다시 수정합니다.", image: "admin-process-25.jpg", width: 372, height: 144 },
        ],
    },
    {
        slug: "remover",
        navTitle: "사진 배경 제거하기",
        title: "5. 사진 배경 제거하기",
        description: "사진의 배경을 제거합니다.",
        steps: [
            { n: 1, text: "[배경 제거(누끼 따기)]를 클릭하여 배경 제거를 진행합니다.", image: "admin-process-24.jpg", width: 1280, height: 798 },
            { n: 2, text: "사진 결과를 확인하여 다운로드 받을 수 있습니다.", image: "admin-process-25.jpg", width: 372, height: 144 },
        ],
    },
];

export function getGuideSection(slug: string) {
    return GUIDE_SECTIONS.find((section) => section.slug === slug);
}
