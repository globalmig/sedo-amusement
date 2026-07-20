import Image from "next/image";
import Link from "next/link";
import Slide from "@/components/slide/Slide";
import ProductGalley from "@/components/board/ProductGalley";
import { COMPANY_INFO } from "@/datas/company";
import { getProducts } from "@/lib/products";

type IconProps = { className?: string };

// 품질 관리: 방패 + 체크
function QualityIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M12 3 4 6v6c0 5 3.4 8.6 8 9 4.6-.4 8-4 8-9V6l-8-3Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 전국 신속 A/S: 렌치
function SupportIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18l3 3 6.1-6.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2-2 2.5-2.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// 합리적인 유통가: 가격표
function PriceTagIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M12 2H4v8l9.3 9.3a2 2 0 0 0 2.8 0l5.2-5.2a2 2 0 0 0 0-2.8L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 7.5h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const CORE_STRENGTHS = [
    {
        title: "철저한 품질 관리",
        image: "/images/arcade-slot-neon.jpg",
        bg: "bg-title",
        icon: QualityIcon,
        points: [
            "정품 인증 제품만 엄선 유통",
            "출고 전 다단계 품질 검수",
            "낮은 불량률로 안정적인 가동",
        ],
    },
    {
        title: "전국 신속 A/S",
        image: "/images/arcade-claw-basketball.png",
        bg: "bg-primary",
        icon: SupportIcon,
        points: [
            "전국 출동 엔지니어 네트워크",
            "접수 후 빠른 방문 점검",
            "정기 점검으로 고장 예방",
        ],
    },
    {
        title: "합리적인 유통가",
        image: "/images/arcade-kids-zone.jpg",
        bg: "bg-gray-700",
        icon: PriceTagIcon,
        points: [
            "제조사 직거래로 유통마진 절감",
            "투명한 견적, 숨은 비용 없음",
            "예산에 맞는 기종 비교 안내",
        ],
    },
];

const STATS = [
    { label: "업력", value: "20년+" },
    { label: "누적 거래처", value: "1,200곳+" },
    { label: "취급 기종", value: "80종+" },
];

export default async function Home() {
    const products = await getProducts();
    const previewProducts = products.slice(0, 4);

    return (
        <>
            <Slide />
            <article>
                {/* Brand Story */}
                <section className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    <div className="pc:flex pc:justify-between pc:items-center">
                        <div className="pc:w-[60%]">
                            <p className="text-sm font-bold tracking-widest text-primary">BRAND STORY</p>
                            <h2 className="mt-4 text-2xl font-black leading-snug text-title pc:text-5xl">
                                오락실, 키즈카페 운영의 시작부터
                                <br />
                                끝까지 함께합니다
                            </h2>
                            <p className="mt-5 text-sm leading-7 text-body pc:text-base">
                                세도어뮤즈먼트는 20년간 전자오락기 유통 한 길을 걸어온 B2B 전문
                                기업입니다. 크레인 게임기부터 리듬, 레이싱, 스포츠 게임기까지
                                폭넓은 라인업을 정품으로 공급하며, 설치 이후에도 신속한 A/S로
                                운영 리스크를 최소화해 드립니다.
                            </p>

                            <div className="mt-8 flex gap-4 border-t border-black/5 pt-6">
                                {STATS.map((stat) => (
                                    <div key={stat.label} className="flex-1">
                                        <p className="text-xl font-black text-title pc:text-2xl">{stat.value}</p>
                                        <p className="mt-1 text-xs text-muted pc:text-sm">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="aspect-4/3 w-full rounded-xl bg-surface pc:w-[40%]" />
                    </div>
                </section>

                {/* Core Strengths */}
                <section className="bg-title">
                    <div className="mx-auto max-w-300 px-[5%] pt-16 pc:px-0 pc:pt-24">
                        <div className="text-center">
                            <p className="text-sm font-bold tracking-widest text-primary">WHY SEDO AMUSEMENT</p>
                            <h2 className="mt-4 text-2xl font-black text-white pc:text-5xl">
                                믿고 거래할 수 있는 3가지 이유
                            </h2>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col pc:mt-14 pc:h-150 pc:flex-row">
                        {CORE_STRENGTHS.map((item) => (
                            <div
                                key={item.title}
                                className="group relative h-72 flex-1 overflow-hidden transition-[flex-grow] duration-700 ease-in-out pc:h-auto pc:hover:flex-[2.2]"
                            >
                                <Image
                                    src={item.image}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1024px) 34vw, 100vw"
                                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                />
                                {/* 브랜드 컬러 오버레이 (투명도 0.7) */}
                                <div className={`absolute inset-0 ${item.bg} opacity-70`} />
                                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/10" />

                                <div className="relative flex h-full flex-col justify-end p-6 pc:items-center pc:justify-center pc:p-10 pc:text-center">
                                    <div className="transition-all duration-500 pc:group-hover:rounded-2xl pc:group-hover:bg-white pc:group-hover:px-12 pc:group-hover:py-15 pc:group-hover:shadow-card">
                                        <div className="inline-block">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary pc:h-14 pc:w-14">
                                                <item.icon className="h-5 w-5 text-white pc:h-7 pc:w-7" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mt-2 text-xl font-black text-white transition-colors duration-500 pc:mt-4 pc:text-4xl pc:group-hover:text-title">
                                                {item.title}
                                            </h3>
                                            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-white/80 transition-colors duration-500 pc:text-base pc:leading-7 pc:mt-6 pc:group-hover:text-title">
                                                {item.points.map((point) => (
                                                    <li key={point}><span className="text-primary">⦁</span> {point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Product Preview */}
                <section className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    <div className="flex flex-col gap-2 pc:flex-row pc:items-end pc:justify-between">
                        <div>
                            <p className="text-sm font-bold tracking-widest text-primary">PRODUCT LINE-UP</p>
                            <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">주요 취급 제품</h2>
                        </div>
                        <Link href="/products/crane" className="text-sm font-semibold text-primary hover:underline">
                            전체 제품 보기 &gt;
                        </Link>
                    </div>

                    <div className="mt-10">
                        <ProductGalley products={previewProducts} />
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-title">
                    <div className="mx-auto max-w-300 px-[5%] py-16 text-center pc:px-0 pc:py-20">
                        <h2 className="text-2xl font-black text-white pc:text-5xl">
                            지금 바로 전화 상담을 받아보세요
                        </h2>
                        <p className="mt-3 text-sm text-white/70 pc:text-base">
                            복잡한 상담 폼 없이, 전화 한 통으로 빠르게 견적을 안내해 드립니다.
                        </p>
                        <Link href={COMPANY_INFO.phoneHref} className="btn-primary mt-8 inline-flex px-8 py-3.5 text-base">
                            {COMPANY_INFO.phone} 전화 상담하기
                        </Link>
                    </div>
                </section>
            </article>
        </>

    );
}
