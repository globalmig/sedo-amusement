import type { Metadata } from "next";
import CategoryBanner from "@/components/common/CategoryBanner";
import { USER_CATEGORY } from "@/datas/categories";

export const metadata: Metadata = {
    title: "인사말",
    description:
        "20년간 전자오락기 유통 한 분야에 집중해온 세도어뮤즈먼트의 인사말입니다. 정품 게임기의 안정적인 공급과 사후관리를 약속드립니다.",
};

export default function CompanyPage() {

    return (
        <>
            <CategoryBanner
                title="인사말"
                description="세도어뮤즈먼트에 오신 것을 환영합니다."
                tabs={USER_CATEGORY.company.categories}
                basePath="/company"
                activeUrl="introduction"
            />
            <article>
                <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    {/* 인사말 */}
                        <p className="text-sm font-bold tracking-widest text-primary">GREETING</p>
                        <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">인사말</h2>
                        <div className="mt-6 space-y-5 text-sm leading-7 text-body pc:text-base">
                            <p>
                                안녕하십니까, 세도어뮤즈먼트를 찾아주셔서 감사합니다.
                            </p>
                            <p>
                                저희는 20년간 오직 전자오락기 유통 한 분야에 집중하며,<br/>오락실과
                                키즈카페를 운영하시는 고객님들이<br/>믿고 거래할 수 있는 파트너가
                                되기 위해 노력해 왔습니다.<br/>정품 게임기의 안정적인 공급은 물론,
                                설치 이후의 사후관리까지 책임지는 것이 저희의 원칙입니다.
                            </p>
                            <p>
                                앞으로도 신뢰를 최우선 가치로 삼아, 고객님의 안정적인 매장
                                운영을 함께 만들어가겠습니다.<br/>감사합니다.
                            </p>
                            <p className="pt-10 font-bold text-title">세도어뮤즈먼트 대표 드림</p>
                        </div>
                </div>
            </article>
        </>
    );
}
