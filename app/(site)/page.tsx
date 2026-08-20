import Image from "next/image";
import Link from "next/link";
import Slide from "@/components/slide/Slide";
import ProductCategoryShowcase from "@/components/common/ProductCategoryShowcase";
import FeaturedProductSlider from "@/components/board/FeaturedProductSlider";
import ContactButtons from "@/components/common/ContactButtons";
import FaqList from "@/components/common/FaqList";
import StatCounter from "@/components/common/StatCounter";
import { FAQ_ITEMS } from "@/datas/faq";
import { getFeaturedProducts } from "@/lib/products";

type IconProps = { className?: string };

// 품질 관리
function QualityIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M12 3 4 6v6c0 5 3.4 8.6 8 9 4.6-.4 8-4 8-9V6l-8-3Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 전국 신속 A/S
function SupportIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18l3 3 6.1-6.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2-2 2.5-2.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 합리적인 유통가
function PriceTagIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M12 2H4v8l9.3 9.3a2 2 0 0 0 2.8 0l5.2-5.2a2 2 0 0 0 0-2.8L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 7.5h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ArrowRightIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const STATS = [
    { label: "업력", value: "20년+" },
    { label: "누적 거래처", value: "1,200곳+" },
    { label: "취급 기종", value: "80종+" },
];

const PROCESS_STEPS = [
    {
        no: "01",
        title: "상담 및 문의",
        desc: "원하시는 게임기 모델, 수량, 납품 희망 장소를 확인하여 신속하게 실시간 재고를 확인해드립니다.",
    },
    {
        no: "02",
        title: "제품 구매",
        desc: "선택한 제품으로 발주를 진행하여 납품 일정을 확정합니다.",
    },
    {
        no: "03",
        title: "배송 및 설치",
        desc: "현장까지 안전하게 배송 후, 정위치 배치, 전원 연결, 정상 작동을 테스트합니다.",
    },
    {
        no: "04",
        title: "사후관리 (A/S)",
        desc: "유통 기기에 대한 부품 수급, 장애 조치, 지속적인 A/S 지원으로 안정적인 기기 가동을 보장합니다.",
    },
];

export default async function Home() {
    const previewProducts = await getFeaturedProducts();

    return (
        <>
            <Slide />
                {/* Product Preview */}
                <section className="bg-white">
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                        <div className="flex flex-col gap-5 pc:flex-row pc:items-end pc:justify-between">
                            <div className="flex flex-col gap-4">
                                <p className="text-sm font-bold tracking-widest text-primary">OUR PRODUCTS</p>
                                <h2 className="text-2xl font-black leading-snug text-title pc:text-5xl pc:leading-tight">
                                    20년 유통 노하우가 검증한,<br />
                                    세도어뮤즈먼트 대표 제품
                                </h2>
                                <p className="text-sm leading-relaxed text-title/80 pc:text-base">
                                    정품 인증부터 전국 A/S까지, 믿을 수 있는 제품만 소개합니다.
                                </p>
                            </div>
                            <Link href="/products/crane" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                                전체 제품 보기
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-4 border-y border-black/10 py-6 pc:mt-12 pc:grid-cols-3 pc:gap-6 pc:py-8">
                            <div className="flex items-center gap-3">
                                <QualityIcon className="h-8 w-8 shrink-0 text-primary" />
                                <div>
                                    <p className="text-sm font-bold text-title pc:text-base">품질 관리</p>
                                    <p className="text-xs text-body pc:text-sm">제조사 정품만 엄선하여 공급</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <SupportIcon className="h-8 w-8 shrink-0 text-primary" />
                                <div>
                                    <p className="text-sm font-bold text-title pc:text-base">전국 신속 A/S</p>
                                    <p className="text-xs text-body pc:text-sm">설치 이후에도 끝까지 책임</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <PriceTagIcon className="h-8 w-8 shrink-0 text-primary" />
                                <div>
                                    <p className="text-sm font-bold text-title pc:text-base">합리적인 유통가</p>
                                    <p className="text-xs text-body pc:text-sm">유통 전문 기업의 합리적 견적</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <FeaturedProductSlider products={previewProducts} />
                        </div>
                    </div>
                </section>

                {/* Brand Story */}
                <section className="bg-surface">
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                        <div className="flex flex-col gap-10 pc:flex-row pc:items-start pc:justify-between pc:gap-8">
                            <div className="flex flex-col items-start gap-4">
                                <p className="text-sm font-bold tracking-widest text-primary">BRAND STORY</p>
                                <h2 className="text-2xl font-black leading-snug text-title pc:text-5xl pc:leading-tight">
                                    매장 예산에 딱 맞는 오락기,<br />
                                    유통 전문 세도어뮤즈먼트와 상의하세요.
                                </h2>
                                <p className="text-sm leading-relaxed text-title/80 pc:text-lg pc:leading-[1.6]">
                                    오락실부터 키즈카페까지, 매장 환경과 예산에 최적화된 80여 종의 기기를 정직하게 제안합니다.<br />
                                    제조사 정품만을 취급하여 고장률을 낮추고, 구매 이후 발생할 수 있는 A/S 문제까지 깔끔하게 연결해 드리는 든든한 유통 파트너가 되겠습니다.
                                </p>
                            </div>
                            <StatCounter stats={STATS} />
                        </div>
                    </div>
                </section>

                {/* Product Categories */}
                <ProductCategoryShowcase />

                {/* Process */}
                <section className="bg-title">
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                        <p className="text-sm font-bold tracking-widest text-primary">PROCESS</p>
                        <h2 className="mt-4 text-2xl font-black text-white pc:text-5xl">구매/납품 프로세스</h2>
                        <div className="mt-10 grid grid-cols-1 gap-4 pc:mt-16 pc:grid-cols-4 pc:gap-6">
                            {PROCESS_STEPS.map((step) => (
                                <div key={step.no} className="rounded-xl bg-white/8 p-6">
                                    <p className="text-sm font-bold text-primary">{step.no}</p>
                                    <h3 className="mt-3 text-lg font-bold text-white pc:text-xl">{step.title}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-white/60">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Preview */}
                <FaqList items={FAQ_ITEMS.slice(0, 4)} moreHref="/as" moreLabel="더보기" />

                {/* CTA */}
                <section className="bg-title">
                    <div className="mx-auto max-w-300 px-[5%] py-16 text-center pc:px-0 pc:py-20">
                        <h2 className="text-2xl font-black text-white pc:text-5xl">
                            지금 바로 상담을 받아보세요
                        </h2>
                        <p className="mt-3 text-sm text-white/70 pc:text-base">
                            복잡한 상담 폼 없이, 전화나 이메일로 빠르게 견적을 안내해 드립니다.
                        </p>
                        <ContactButtons className="mt-8" />
                    </div>
                </section>
        </>

    );
}
