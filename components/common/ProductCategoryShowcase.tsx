import Image from "next/image";
import Link from "next/link";

const CATEGORY_SHOWCASE = [
    {
        name: "크레인/경품 게임기",
        url: "crane",
        image: "/images/category-crane.png",
        description: "높은 가동률과 매장 수익을 책임지는\n필수 인형뽑기·경품기",
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
                        <p className="text-sm font-bold tracking-widest text-primary">DISCOVER OUR LINEUP</p>
                        <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">원하시는 다양한 제품을 확인해보세요</h2>
                    </div>
                    <Link href="/products" className="text-sm font-semibold text-primary hover:underline">
                        전체 카테고리 제품 보기 &gt;
                    </Link>
                </div>

                <div className="mt-12 hidden items-start justify-between gap-6 pc:flex">
                    {CATEGORY_SHOWCASE.map((category) => (
                        <Link
                            key={category.url}
                            href={`/products/${category.url}`}
                            className="group relative flex h-100 w-70 shrink-0 flex-col items-center gap-3 pt-8 pb-8"
                        >
                            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                                <div className="h-70 w-100 rotate-90 rounded-tl-[30px] rounded-bl-[30px] rounded-tr-[140px] rounded-br-[140px] bg-surface transition-colors duration-300 group-hover:bg-primary" />
                            </div>

                            <div className="relative h-56 w-36">
                                <Image src={category.image} alt={category.name} fill sizes="160px" className="object-contain" />
                            </div>

                            <div className="flex flex-col items-center gap-2 px-6 text-center">
                                <p className="text-lg font-bold text-title transition-colors duration-300 group-hover:text-white">
                                    {category.name}
                                </p>
                                <p className="whitespace-pre-line text-sm leading-5 text-body transition-colors duration-300 group-hover:text-white/90">
                                    {category.description}
                                </p>
                                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                    <ArrowIcon className="h-5 w-5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile: 가로형 캡슐 카드 리스트 */}
                <div className="mt-8 flex flex-col gap-5 pc:hidden">
                    {CATEGORY_SHOWCASE.map((category) => (
                        <Link
                            key={category.url}
                            href={`/products/${category.url}`}
                            className="group relative flex h-45 items-center gap-2 overflow-hidden rounded-tl-[20px] rounded-bl-[20px] rounded-tr-[110px] rounded-br-[110px] bg-surface pl-4 transition-colors duration-300 hover:bg-primary"
                        >
                            <div className="relative h-38 w-28 shrink-0">
                                <Image src={category.image} alt={category.name} fill sizes="120px" className="object-contain" />
                            </div>
                            <div className="flex flex-1 flex-col gap-2 pr-6">
                                <p className="hidden whitespace-pre-line text-xs leading-5 text-white/90 group-hover:block">
                                    {category.description}
                                </p>
                                <div className="flex items-center gap-3">
                                    <p className="text-base font-bold text-title group-hover:text-white">{category.name}</p>
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                        <ArrowIcon className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    <Link
                        href="/products"
                        className="mx-auto inline-flex items-center justify-center rounded-full border border-black/20 px-6 py-3 text-sm font-semibold text-body transition-colors hover:bg-surface"
                    >
                        전체 카테고리 보기
                    </Link>
                </div>
            </div>
        </section>
    );
}
