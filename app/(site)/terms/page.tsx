import type { Metadata } from "next";
import CategoryBanner from "@/components/common/CategoryBanner";
import { COMPANY_INFO } from "@/datas/company";

export const metadata: Metadata = {
    title: "이용약관",
    description: `${COMPANY_INFO.name} 홈페이지 이용약관을 안내합니다.`,
    keywords: ["이용약관", "세도어뮤즈먼트 이용약관"],
};

interface TermsArticle {
    title: string;
    body: (string | string[])[];
}

const TERMS_ARTICLES: TermsArticle[] = [
    {
        title: "제1조 (목적)",
        body: [
            `본 약관은 ${COMPANY_INFO.name}(이하 "회사")가 운영하는 홈페이지(이하 "사이트")를 통해 제공하는 제품 정보 열람, 상담 신청 등의 서비스(이하 "서비스") 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.`,
        ],
    },
    {
        title: "제2조 (정의)",
        body: [
            [
                '"사이트"란 회사가 취급 제품 정보 제공 및 상담 연결을 위하여 운영하는 웹사이트를 말합니다.',
                '"이용자"란 사이트에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 이용하는 모든 방문자를 말합니다.',
                '"상담 신청"이란 이용자가 사이트 내 문의 폼 작성, 전화 연결 등을 통해 회사에 창업·제품 관련 상담을 요청하는 행위를 말합니다.',
                '"콘텐츠"란 사이트에 게시된 제품 이미지, 설명, 규격, 텍스트, 디자인 등 일체의 정보를 말합니다.',
            ],
        ],
    },
    {
        title: "제3조 (약관의 게시와 개정)",
        body: [
            "회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 사이트 초기 화면 또는 연결 화면에 게시합니다.",
            "회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정 사유를 명시하여 적용일자 7일 전부터 사이트에 공지합니다.",
        ],
    },
    {
        title: "제4조 (서비스의 내용)",
        body: [
            [
                "취급 제품(아케이드 게임기 등)에 대한 정보(사양, 이미지, 특징 등) 제공",
                "전화 상담 연결을 통한 견적 및 구매 상담",
                "창업 컨설팅 관련 정보 제공 및 상담 신청 접수",
                "제품 A/S 및 사후관리 관련 안내",
            ],
            "회사는 사이트를 통해 온라인 결제 및 전자상거래를 진행하지 않으며, 실제 견적, 계약, 납품 조건 등은 전화 또는 대면 상담을 통해 별도로 확정됩니다.",
        ],
    },
    {
        title: "제5조 (서비스의 변경 및 중단)",
        body: [
            "회사는 콘텐츠의 내용, 운영상 필요한 경우 사이트에서 제공하는 서비스의 전부 또는 일부를 변경 또는 수정할 수 있습니다.",
            "회사는 시스템 점검, 설비 장애, 천재지변 등 불가피한 사유가 있는 경우 서비스 제공을 일시적으로 중단할 수 있으며, 이 경우 사전에 공지함을 원칙으로 하되 부득이한 경우 사후에 공지할 수 있습니다.",
        ],
    },
    {
        title: "제6조 (상담 신청 및 처리)",
        body: [
            "이용자는 사이트 내 상담 신청 폼을 통해 성함, 연락처 등 정보를 입력하여 상담을 신청할 수 있으며, 회사는 접수된 정보를 바탕으로 유선 등의 방법으로 이용자에게 연락하여 상담을 진행합니다.",
            "이용자는 상담 신청 시 정확한 정보를 입력하여야 하며, 허위 또는 부정확한 정보 입력으로 인해 발생하는 불이익에 대해 회사는 책임을 지지 않습니다.",
            "상담 신청을 통해 수집되는 개인정보의 처리에 관한 사항은 별도의 개인정보처리방침에 따릅니다.",
        ],
    },
    {
        title: "제7조 (이용자의 의무)",
        body: [
            [
                "상담 신청 시 타인의 정보를 도용하거나 허위 정보를 등록하는 행위",
                "사이트 운영을 방해하거나 사이트의 정상적인 서비스 제공을 저해하는 행위",
                "회사의 사전 동의 없이 사이트의 콘텐츠를 복제, 전송, 출판, 배포, 방송 등에 이용하거나 제3자에게 이용하게 하는 행위",
                "사이트 내 정보를 자동화된 수단(크롤링 등)으로 수집하는 행위",
                "기타 관련 법령에 위배되는 행위",
            ],
            "이용자는 위 각 호에 해당하는 행위를 하여서는 안 되며, 이를 위반하여 회사 또는 제3자에게 손해를 끼친 경우 그에 대한 책임을 부담합니다.",
        ],
    },
    {
        title: "제8조 (지식재산권)",
        body: [
            "사이트에 게시된 제품 이미지, 설명, 로고, 디자인 등 콘텐츠에 대한 저작권 및 지식재산권은 회사 또는 정당한 권리를 가진 제3자(제조사 등)에게 귀속됩니다.",
            "이용자는 회사의 사전 서면 동의 없이 콘텐츠를 영리적 목적으로 복제, 전송, 배포, 2차적저작물 작성 등의 방법으로 이용할 수 없습니다.",
        ],
    },
    {
        title: "제9조 (면책조항)",
        body: [
            "사이트에 게시된 제품 정보, 가격, 규격 등은 제조사 사정 또는 시장 상황에 따라 사전 고지 없이 변경될 수 있으며, 정확한 조건은 상담을 통해 확정됩니다.",
            "회사는 천재지변, 통신장애 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 그에 대한 책임을 지지 않습니다.",
            "회사는 이용자가 사이트를 통해 얻은 정보 또는 자료로 인해 발생한 손해에 대해 회사의 고의 또는 중과실이 없는 한 책임을 지지 않습니다.",
        ],
    },
    {
        title: "제10조 (분쟁 해결 및 관할법원)",
        body: [
            "회사와 이용자 간에 발생한 분쟁에 관하여는 대한민국 법을 적용하며, 회사의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.",
        ],
    },
];

export default function TermsPage() {
    return (
        <>
            <CategoryBanner title="이용약관" description="세도어뮤즈먼트 홈페이지 이용약관 안내" basePath="/terms" />
            <article>
                <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    <div className="space-y-10">
                        {TERMS_ARTICLES.map((article) => (
                            <section key={article.title}>
                                <h3 className="text-lg font-bold text-title pc:text-xl">{article.title}</h3>
                                <div className="mt-3 space-y-2">
                                    {article.body.map((paragraph, index) =>
                                        Array.isArray(paragraph) ? (
                                            <ul key={index} className="space-y-1.5">
                                                {paragraph.map((item) => (
                                                    <li key={item} className="flex gap-2 text-base leading-6 text-body pc:text-[20px] pc:leading-7">
                                                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p key={index} className="text-base leading-6 text-body pc:text-[20px] pc:leading-7">
                                                {paragraph}
                                            </p>
                                        )
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>

                    <p className="mt-14 border-t border-black/10 pt-6 text-base text-muted pc:text-[20px]">
                        공고일자: 2026년 0월 0일<br />
                        시행일자: 2026년 0월 0일
                    </p>
                </div>
            </article>
        </>
    );
}
