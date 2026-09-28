import type { Metadata } from "next";
import CategoryBanner from "@/components/common/CategoryBanner";
import { COMPANY_INFO } from "@/datas/company";

export const metadata: Metadata = {
    title: "개인정보처리방침",
    description: `${COMPANY_INFO.name}의 개인정보처리방침을 안내합니다.`,
    keywords: ["개인정보처리방침", "세도어뮤즈먼트 개인정보"],
};

interface PrivacyArticle {
    title: string;
    body: (string | string[])[];
}

const PRIVACY_ARTICLES: PrivacyArticle[] = [
    {
        title: "1. 개인정보의 처리 목적",
        body: [
            `${COMPANY_INFO.name}(이하 "회사")는 홈페이지 내 창업·제품 상담 신청 접수 및 처리, 상담 결과 안내, 문의에 대한 회신을 목적으로 개인정보를 처리합니다.`,
            "회사는 수집한 개인정보를 명시한 목적 이외의 용도로 이용하지 않으며, 이용 목적이 변경되는 경우 관련 법령에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.",
        ],
    },
    {
        title: "2. 처리하는 개인정보 항목",
        body: [
            "회사는 홈페이지 내 창업 상담 문의 폼을 통해 다음과 같은 개인정보를 수집합니다.",
            [
                "필수 항목: 성함/직급, 연락처, 관심 창업 분야",
                "선택 항목: 오픈 예정 지역, 보유 평수 및 예산, 문의 내용",
                "자동 수집 항목: 접속 IP, 방문 일시, 브라우저 및 기기 정보 등 서비스 이용 과정에서 자동으로 생성되는 정보",
            ],
            "전화 상담(전화 연결 버튼 이용)의 경우 통화 연결 자체는 이용자의 통신기기 및 통신사를 통해 처리되며, 회사는 이를 통해 별도로 개인정보를 수집·저장하지 않습니다.",
        ],
    },
    {
        title: "3. 개인정보의 처리 및 보유기간",
        body: [
            "회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.",
            [
                "상담 신청 정보: 상담 처리 완료 후 1년까지 보관 후 파기 (재상담 문의 대응 목적)",
                "관련 법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간 동안 보관",
            ],
        ],
    },
    {
        title: "4. 개인정보의 제3자 제공",
        body: [
            "회사는 정보주체의 개인정보를 제1조(처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 다만 다음의 경우는 예외로 합니다.",
            [
                "정보주체로부터 별도의 동의를 받은 경우",
                "법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우",
                "수사기관이 법령에서 정한 절차에 따라 수사 목적으로 요구하는 경우",
            ],
        ],
    },
    {
        title: "5. 개인정보 처리업무의 위탁",
        body: [
            "회사는 현재 개인정보 처리업무를 외부에 위탁하고 있지 않습니다.",
            "추후 문자(SMS) 발송, 상담 관리 시스템 운영 등을 위해 개인정보 처리업무를 위탁하는 경우, 위탁받는 자와 위탁업무의 내용을 사전에 정보주체에게 고지하고 본 방침을 통해 공개합니다.",
        ],
    },
    {
        title: "6. 정보주체의 권리·의무 및 행사방법",
        body: [
            "정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.",
            [
                "개인정보 열람 요구",
                "오류 등이 있을 경우 정정 요구",
                "삭제 요구",
                "처리 정지 요구",
            ],
            "권리 행사는 회사에 대해 서면, 전화, 이메일 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.",
        ],
    },
    {
        title: "7. 개인정보의 파기 절차 및 방법",
        body: [
            "회사는 개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.",
            [
                "전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.",
                "종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.",
            ],
        ],
    },
    {
        title: "8. 개인정보의 안전성 확보조치",
        body: [
            "회사는 개인정보보호법에 따라 개인정보 처리 담당자를 최소한으로 지정하고 접근 권한을 관리하는 등 개인정보가 분실, 도난, 유출, 변조 또는 훼손되지 않도록 안전성 확보에 필요한 조치를 취하고 있습니다.",
        ],
    },
    {
        title: "9. 개인정보 보호책임자",
        body: [
            "회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.",
            [
                `상호: ${COMPANY_INFO.name}`,
                `연락처: ${COMPANY_INFO.phone}`,
                `이메일: ${COMPANY_INFO.email}`,
                `주소: ${COMPANY_INFO.address}`,
            ],
            "정보주체는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.",
        ],
    },
    {
        title: "10. 권익침해 구제방법",
        body: [
            "정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁 해결이나 상담 등을 신청할 수 있습니다.",
            [
                "개인정보분쟁조정위원회: (국번없이) 1833-6972 (privacy.kisa.or.kr)",
                "개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)",
                "대검찰청 사이버범죄수사단: (국번없이) 1301 (spo.go.kr)",
                "경찰청 사이버수사국: (국번없이) 182 (ecrm.cyber.go.kr)",
            ],
        ],
    },
    {
        title: "11. 개인정보처리방침의 변경",
        body: [
            "이 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일 전부터 사이트를 통해 공지할 예정입니다.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <>
            <CategoryBanner title="개인정보처리방침" description="세도어뮤즈먼트 개인정보처리방침 안내" basePath="/privacy" />
            <article>
                <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    <div className="space-y-10">
                        {PRIVACY_ARTICLES.map((article) => (
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
