import type { Metadata } from "next";
import CategoryBanner from "@/components/common/CategoryBanner";
import { USER_CATEGORY } from "@/datas/categories";

export const metadata: Metadata = {
    title: "사업 영역",
    description:
        "전자오락기 유통, 설치·시공, A/S·유지보수, 상시 재고 공급까지 세도어뮤즈먼트가 제공하는 사업 영역을 소개합니다.",
};

const BUSINESS_AREAS = [
    {
        title: "전자오락기 유통",
        description: "크레인, 슈팅, 리듬, 레이싱 등 다양한 게임기를 제조사와 직거래로 공급합니다.",
    },
    {
        title: "설치 · 시공",
        description: "매장 동선을 고려한 배치 설계부터 전기·설치 시공까지 원스톱으로 진행합니다.",
    },
    {
        title: "A/S · 유지보수",
        description: "전국 출동 네트워크를 통해 고장 접수 후 신속하게 방문하여 수리합니다.",
    },
    {
        title: "상시 재고 · 신속 공급",
        description: "다양한 기종을 상시 재고로 보유하여 주문 즉시 빠르게 공급합니다.",
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
                    <p className="text-sm font-bold tracking-widest text-primary">BUSINESS</p>
                    <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">사업 영역</h2>

                    <div className="mt-10 flex flex-wrap gap-6">
                        {BUSINESS_AREAS.map((area, index) => (
                            <div key={area.title} className="group">
                                <div
                                    className="card w-full p-6 pc:w-70.5 pc:p-8 pc:pb-30
                                group-hover:bg-primary transition-colors
                                ">
                                    <span
                                        className="text-sm font-black text-primary group-hover:text-white transition-colors pc:text-lg">
                                        0{index + 1}
                                    </span>
                                    <h3 className="mt-3 text-lg font-bold text-title group-hover:text-white transition-colors pc:text-[1.3rem]">
                                        {area.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-body group-hover:text-white pc:text-[1rem] transition-colors pc:mt-3">
                                        {area.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </article>
        </>
    )
}