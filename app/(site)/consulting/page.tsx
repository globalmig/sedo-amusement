import type { Metadata } from "next";
import CategoryBanner from "@/components/common/CategoryBanner";
import ContactButtons from "@/components/common/ContactButtons";
import FaqList from "@/components/common/FaqList";
import { FAQ_ITEMS } from "@/datas/faq";
import StartupConsultForm from "@/components/form/StartupConsultForm";

export const metadata: Metadata = {
    title: "창업 컨설팅",
    description:
        "아케이드 게임장, 가족형 유원시설(FEC), 키즈카페 창업을 위한 상권 분석, 기기 소싱, 인허가, 마케팅까지 세도어뮤즈먼트의 창업 컨설팅을 안내합니다.",
    keywords: ["아케이드 창업 컨설팅", "키즈카페 창업", "FEC 창업", "오락실 창업", "게임장 창업 컨설팅", "세도어뮤즈먼트 창업 컨설팅"],
};

const CONSULTING_AREAS = [
    {
        title: "상권 분석 및 최적의 공간 기획",
        subtitle: "부동산 · 입지 컨설팅",
        points: [
            "지역 상권 및 주 타깃층(가족, 연인, 키즈 등)에 맞춘 수익 모델 설계",
            "아울렛, 대형 복합쇼핑몰 등 특수 상권 입점 및 부동산 개발(SPC) 연계 프로젝트 자문",
        ],
    },
    {
        title: "트렌드 맞춤형 기기 소싱 및 세팅",
        subtitle: "기기 · MD 컨설팅",
        points: [
            "빅 가챠(Big Gacha), CUK! BOX 등 최신 인기 크레인 및 체감형 아케이드 기기 라인업 제안",
            "매장 동선과 평형을 고려한 최적의 기기 배치 및 투자 대비 수익률(ROI) 분석",
        ],
    },
    {
        title: "까다로운 인허가 및 행정 지원",
        subtitle: "인허가 · 행정 컨설팅",
        points: [
            "유원시설업, 일반/청소년 게임제공업 등 업종별 필수 등록 요건 가이드",
            "소방, 전기, 안전 검사 등 복잡한 행정 절차 및 규제 관련 밀착 자문",
        ],
    },
    {
        title: "온·오프라인 마케팅 및 오픈 지원",
        subtitle: "마케팅 · 운영 컨설팅",
        points: [
            "유튜브 영상 콘텐츠 기획 및 미디어 채널을 활용한 매장 홍보 전략",
            "오픈 초기 안정적인 매장 운영을 위한 실무 가이드 제공",
        ],
    },
];

const CONSULTING_STEPS = [
    {
        no: "01",
        title: "온라인 문의 접수",
        desc: "창업 분야, 지역, 예산 등 기본 정보를 확인합니다.",
    },
    {
        no: "02",
        title: "현장 방문 및 대면 미팅",
        desc: "현장 환경과 공간 조건을 확인하고 창업 방향을 논의합니다.",
    },
    {
        no: "03",
        title: "상권 분석 및 기획안 제안",
        desc: "상권과 타깃에 맞는 공간 구성과 기기 배치를 제안합니다.",
    },
    {
        no: "04",
        title: "기기 입고 및 인허가 진행",
        desc: "기기 구성부터 인허가 및 관련 행정 절차까지 지원합니다.",
    },
    {
        no: "05",
        title: "그랜드 오픈 및 사후 관리",
        desc: "오픈 준비와 초기 운영을 지원하고 실무 가이드를 제공합니다.",
    },
];

const CONSULTING_FAQ_ITEMS = FAQ_ITEMS.filter((item) => item.category === "consulting");

export default function ConsultingPage() {
    return (
        <>
            <CategoryBanner
                title="창업 컨설팅"
                description="성공적인 가족형 놀이 공간의 시작, 검증된 전문가와 함께하세요."
                basePath="/consulting"
            />
            <article>
                {/* 주요 컨설팅 제공 분야 */}
                <section>
                <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    <p className="text-base font-bold tracking-widest text-primary pc:text-[20px]">CONSULTING</p>
                    <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">주요 컨설팅 제공 분야</h2>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 pc:grid-cols-4">
                        {CONSULTING_AREAS.map((area, index) => (
                            <div
                                key={area.title}
                                className="group card flex min-h-56 flex-col justify-between gap-8 p-6 transition-colors pc:p-8"
                            >
                                <div>
                                    <span className="text-base font-black text-primary transition-colors pc:text-[20px]">
                                        0{index + 1}
                                    </span>
                                    <h3 className="mt-3 text-lg font-bold text-title transition-colors pc:text-[1.3rem]">
                                        {area.title}
                                    </h3>
                                    <ul className="mt-2 text-base leading-6 text-body transition-colors pc:mt-3 pc:text-[20px]">
                                        {area.points.map((p, index) => <li key={index} className="mt-4">· {p}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                </section>

                <section className="bg-title">
                <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    <p className="text-base font-bold tracking-widest text-primary pc:text-[20px]">PROCESS</p>
                    <h2 className="mt-4 text-2xl font-black text-white pc:text-5xl">컨설팅 진행 절차</h2>
                    <div className="mt-10 grid grid-cols-1 gap-4 pc:mt-10 pc:grid-cols-5 pc:gap-6">
                        {CONSULTING_STEPS.map((step, index) => (
                            <div
                                key={step.no}
                                className="animate-process-glow rounded-xl bg-white/8 p-6"
                                style={{ animationDelay: `${index}s` }}
                            >
                                <p className="text-base font-bold text-primary pc:text-[20px]">{step.no}</p>
                                <h3 className="mt-3 text-lg font-bold text-white pc:text-2xl">{step.title}</h3>
                                <p className="mt-3 text-base leading-relaxed text-white/60 pc:text-[20px]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                </section>

                {/* FAQ */}
                {CONSULTING_FAQ_ITEMS.length > 0 && (
                    <FaqList
                        items={CONSULTING_FAQ_ITEMS}
                        eyebrow="FAQ"
                        title="창업 컨설팅 자주 묻는 질문"
                        moreHref="/as"
                        moreLabel="전체 FAQ 보기"
                    />
                )}

                {/* CTA */}
                <section className="bg-title">
                <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-20 flex flex-col gap-10 pc:flex-row pc:items-start pc:justify-between">
                    <div>
                        <p className="text-base font-bold tracking-widest text-primary pc:text-[20px]">INQUIRY</p>
                        <h2 className="mt-4 text-2xl font-black text-white pc:text-5xl">
                            무료 창업 컨설팅을 받아보세요
                        </h2>
                        <p className="mt-3 text-base text-white/70 pc:text-[20px]">
                            복잡한 상담 폼 없이, 전화로 빠르게 창업 컨설팅 일정을 안내해 드립니다.
                        </p>
                    </div>
                    <div className="w-full pc:w-125 pc:shrink-0">
                        <StartupConsultForm />
                    </div>
                </div>
                </section>
            </article>
        </>
    );
}
