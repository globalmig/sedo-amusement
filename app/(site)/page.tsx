import Image from "next/image";
import Link from "next/link";
import Slide from "@/components/slide/Slide";
import FeaturedProductSlider from "@/components/board/FeaturedProductSlider";
import ContactButtons from "@/components/common/ContactButtons";
import FaqList from "@/components/common/FaqList";
import { FAQ_ITEMS } from "@/datas/faq";
import { getFeaturedProducts } from "@/lib/products";

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

export default async function Home() {
    const previewProducts = await getFeaturedProducts();

    return (
        <>
            <Slide />
            <article className="bg-white">
                {/* Brand Story */}
                <section className="bg-[#222]">
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24 text-center relative">
                        <div>
                            <p className="text-sm font-bold tracking-widest text-primary">BRAND STORY</p>
                            <h2 className="mt-4 text-2xl font-black text-white pc:text-5xl">매장 예산에 딱 맞는 오락기,<br/>유통 전문 세도어뮤즈먼트와 상의하세요.</h2>
                            <p className="mt-4 text-sm text-white/70 pc:text-white">오락실부터 키즈카페까지, 매장 환경과 예산에 최적화된 80여 종의 기기를 정직하게 제안합니다.<br/>제조사 정품만을 취급하여 고장률을 낮추고, 구매 이후 발생할 수 있는 A/S 문제까지 깔끔하게 연결해 드리는 든든한 유통 파트너가 되겠습니다.</p>
                        </div>
                    </div>
                </section>

                {/* Product Preview */}
                <section className=" bg-white">
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                        <div className="flex gap-2 items-end justify-between">
                            <div>
                                <p className="text-sm font-bold tracking-widest text-primary">PRODUCT LINE-UP</p>
                                <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">주요 취급 제품</h2>
                            </div>
                            <Link href="/products/crane" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                                전체 제품 보기
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="mt-10">
                            <FeaturedProductSlider products={previewProducts} />
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
            </article>
        </>

    );
}
