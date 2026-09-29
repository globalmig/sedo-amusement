import type { Metadata } from "next";
import Image from "next/image";
import CategoryBanner from "@/components/common/CategoryBanner";
import { USER_CATEGORY } from "@/datas/categories";

export const metadata: Metadata = {
    title: "사업 영역",
    description:
        "전자오락기 유통, 설치·시공, A/S·유지보수, 창업 컨설팅까지 세도어뮤즈먼트가 제공하는 사업 영역을 소개합니다.",
    keywords: ["전자오락기 유통", "게임기 설치 시공", "게임기 A/S 유지보수", "오락실 창업 컨설팅", "세도어뮤즈먼트 사업영역"],
};

const BUSINESS_AREAS = [
    {
        title: "전자오락기 유통",
        description: "크레인, 슈팅, 리듬, 레이싱 등 다양한 게임기를 제조사와 직거래로 공급합니다.",
        icon: "/icons/business-1.png",
    },
    {
        title: "설치 · 시공",
        description: "매장 동선을 고려한 배치 설계부터 전기·설치 시공까지 원스톱으로 진행합니다.",
        icon: "/icons/business-2.png",
    },
    {
        title: "A/S · 유지보수",
        description: "전국 출동 네트워크를 통해 고장 접수 후 신속하게 방문하여 수리합니다.",
        icon: "/icons/business-3.png",
    },
    {
        title: "창업 컨설팅",
        description: "입지 분석부터 기종 구성, 예산 설계까지 창업 전 과정을 상담해드립니다.",
        icon: "/icons/business-4-consulting.svg",
    },
];

export default function BusinessPage() {
    return (
        <>
            <CategoryBanner
                title="사업 영역"
                description="세도어뮤즈먼트에 오신 것을 환영합니다."
                tabs={USER_CATEGORY.company.categories}
                basePath="/company"
                activeUrl="business"
            />
            <article>
                <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    {/* 사업 영역 */}
                    <p className="text-base font-bold tracking-widest text-primary pc:text-[20px]">BUSINESS</p>
                    <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">사업 영역</h2>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 pc:grid-cols-4">
                        {BUSINESS_AREAS.map((area, index) => (
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
                                    <p className="mt-2 text-base leading-6 text-body transition-colors pc:mt-3 pc:text-[20px]">
                                        {area.description}
                                    </p>
                                </div>
                                <Image
                                    src={area.icon}
                                    alt={area.title}
                                    width={48}
                                    height={48}
                                    unoptimized={area.icon.endsWith(".svg")}
                                    className="h-10 w-10 self-end transition duration-300 pc:h-12 pc:w-12"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </article>
        </>
    )
}