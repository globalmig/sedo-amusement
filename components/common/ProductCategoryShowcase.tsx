import Image from "next/image";
import Link from "next/link";

const CATEGORY_SHOWCASE = [
    {
        name: "크레인/경품 게임기",
        url: "crane",
        image: "/images/category-crane.png",
        description: "높은 가동률과 매장 수익을 책임지는 필수 인형뽑기·경품기",
    },
    {
        name: "슈팅 게임",
        url: "shooting",
        image: "/images/category-shooting.png",
        description: "뛰어난 몰입감과 화려한 연출의\n1인·다인용 사격 게임기",
    },
    {
        name: "리듬 게임",
        url: "rhythm",
        image: "/images/category-rhythm.png",
        description: "매니아층 형성과 높은 재방문율을\n끌어내는 체감형 리듬 장비",
    },
    {
        name: "레이싱 게임",
        url: "racing",
        image: "/images/category-racing.png",
        description: "실감 나는 체감 효과와 다이나믹\n스피드를 선사하는 레이싱기",
    },
] as const;

function ArrowIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function ProductCategoryShowcase() {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                <div className="flex flex-col gap-5 pc:flex-row pc:items-end pc:justify-between">
                    <div>
                        <p className="text-base font-bold tracking-widest text-primary pc:text-[20px]">DISCOVER OUR LINEUP</p>
                        <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">원하시는 다양한 제품을 확인해보세요.</h2>
                    </div>
                    <Link
                        href="/products/all"
                        className="hidden shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary/90 pc:inline-flex pc:text-[20px]"
                    >
                        전체 제품 보기
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-10 hidden items-start justify-between gap-6 pc:flex">
                    {CATEGORY_SHOWCASE.map((category, index) => {
                        const isImageTop = index % 2 === 0;

                        const textPosition = isImageTop ? "top-56" : "top-0";
                        const boxPosition = isImageTop ? "top-[57px] h-[447px]" : "bottom-[57px] h-[487px]";
                        const boxShape = isImageTop ? "rounded-t-4xl rounded-b-[140px]" : "rounded-t-[140px] rounded-b-4xl";

                        const textBlock = (
                            <div
                                className={`absolute inset-x-0 z-10 flex w-70 h-70 shrink-0 flex-col items-center gap-2 px-6 pt-8 pb-12 text-center pc:px-4 ${textPosition}`}
                            >
                                <h3 className="text-lg pc:text-2xl font-bold text-title transition-colors duration-300 group-hover:text-white">
                                    {category.name}
                                </h3>
                                <p className="whitespace-pre-line text-base text-body transition-colors duration-300 group-hover:text-white/90 pc:text-[20px] mt-2">
                                    {category.description}
                                </p>
                                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors duration-300 group-hover:bg-white group-hover:text-primary">
                                    <ArrowIcon className="h-5 w-5" />
                                </span>
                            </div>
                        );

                        const imageBlock = (
                            <div className={`absolute inset-x-0 z-10 flex justify-center ${isImageTop ? "top-0" : "bottom-0"}`}>
                                <div className="relative h-56 w-36 shrink-0">
                                    <Image src={category.image} alt={category.name} fill sizes="160px" className="object-contain" />
                                </div>
                            </div>
                        );

                        return (
                            <Link key={category.url} href={`/products/${category.url}`} className="group shrink-0">
                                <div className="relative h-136 w-70">
                                    <div>
                                        {imageBlock}
                                        {textBlock}
                                    </div>
                                    {/* 배경 박스: imageBlock과 -167px 겹치도록 배치 */}
                                    <div
                                        className={`absolute inset-x-0 w-70 bg-surface transition-colors duration-300 group-hover:bg-primary ${boxPosition} ${boxShape}`}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile: 이미지 상단 + 하단 블롭 카드 리스트 */}
                <div className="mt-10 flex flex-col gap-12 pc:hidden">
                    {CATEGORY_SHOWCASE.map((category) => (
                        <Link key={category.url} href={`/products?category=${category.url}`} className="group flex flex-col">
                            <div className="relative z-10 h-52 w-42 shrink-0">
                                <Image src={category.image} alt={category.name} fill sizes="200px" className="object-contain" />
                            </div>
                            <div className="-mt-6 flex flex-col gap-2 rounded-[140px] rounded-tl-[30px] bg-surface px-7 pt-8 pb-12 transition-colors duration-300 group-hover:bg-primary">
                                <div className="flex items-center gap-3">
                                    <p className="text-lg font-bold text-title transition-colors duration-300 group-hover:text-white">
                                        {category.name}
                                    </p>
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors duration-300 group-hover:bg-white group-hover:text-primary">
                                        <ArrowIcon className="h-4 w-4" />
                                    </span>
                                </div>
                                <p className="whitespace-pre-line text-base leading-5 text-body transition-colors duration-300 group-hover:text-white/90">
                                    {category.description}
                                </p>
                            </div>
                        </Link>
                    ))}

                    <Link
                        href="/products/all"
                        className="mx-auto inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                        전체 제품 보기
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
