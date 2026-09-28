import type { Metadata } from "next";
import CategoryBanner from "@/components/common/CategoryBanner";
import { USER_CATEGORY } from "@/datas/categories";

export const metadata: Metadata = {
    title: "인사말",
    description:
        "35년간 전자오락기 유통 한 분야에 집중해온 세도어뮤즈먼트의 인사말입니다. 정품 게임기의 안정적인 공급과 사후관리를 약속드립니다.",
    keywords: ["세도어뮤즈먼트 소개", "전자오락기 유통 회사", "게임기 유통 전문기업", "세도어뮤즈먼트 인사말"],
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
                    <p className="text-base font-bold tracking-widest text-primary pc:text-[20px]">GREETING</p>
                    <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">인사말</h2>
                    <div className="mt-6 space-y-5 text-base leading-7 text-body pc:text-[20px] pc:mt-10">
                        <p>안녕하십니까, 세도어뮤즈먼트를 찾아주신 고객 여러분께 깊은 감사의 말씀을 드립니다.</p>

                        <p>
                            저희 세도어뮤즈먼트는 지난 35년 동안 오직 <span className="font-bold">&apos;전자오락기 유통&apos;</span>이라는 한 길만을 묵묵히 걸어왔습니다.
                            일반 아케이드 게임장부터 키즈카페, 복합 가족 엔터테인먼트 공간에 이르기까지, 시시각각 변화하는 어뮤즈먼트 시장
                            속에서도 저희가 흔들림 없이 자리를 지킬 수 있었던 것은 오로지 고객 여러분께서 보내주신 굳건한 믿음 덕분입니다.
                        </p>

                        <p>
                            매장을 운영하시는 대표님들께 게임기 한 대, 한 대는 단순한 기계가 아니라 매장의 경쟁력과 수익에 직결되는
                            소중한 자산임을 누구보다 잘 알고 있습니다. 그렇기에 세도어뮤즈먼트는 단순히 기기를 판매하고 유통하는 데
                            그치지 않고, 다음과 같은 두 가지 원칙을 반드시 지켜나가고 있습니다.
                        </p>
                        <div className="p-4 rounded-2xl bg-white pc:p-7">
                            <div className="mb-4 pc:mb-8">
                                <p className="font-bold text-[1.2rem]"><span className="text-primary">첫째, </span>검증된 정품 게임기만을 엄선하여 안정적으로 공급합니다.</p>
                                <p className="mt-2 text-body">
                                    시장 트렌드를 주도하는 최신 기기부터 남녀노소 누구나 즐길 수 있는 스테디셀러까지, 매장의 상권과
                                    타겟 고객층에 맞춘 최적의 기기 라인업을 제안해 드립니다.
                                </p>
                            </div>
                            <div>
                                <p className="font-bold text-[1.2rem]"><span className="text-primary">둘째, </span>설치 이후의 사후관리(A/S)를 끝까지 책임집니다.</p>
                                <p className="mt-2 text-body">
                                    기기의 멈춤은 곧 매장의 손실입니다. 저희는 35년간 축적된 현장 노하우와 기술력을 바탕으로, 문제
                                    발생 시 신속하고 정확하게 대응하여 대표님들께서 오직 매장 운영과 고객 서비스에만 전념하실 수
                                    있도록 든든한 울타리가 되어 드리겠습니다.
                                </p>
                            </div>
                        </div>
                        <p>
                            <span className="font-bold">&apos;신뢰&apos;</span>는 하루아침에 만들어지지 않으며, 말로만 완성되는 것도 아닙니다. 지난 35년이 그랬듯, 앞으로의
                            세도어뮤즈먼트 역시 정직한 가격, 확실한 품질, 그리고 끝까지 책임지는 사후관리로 고객님의 성공을 돕는 가장
                            든든한 비즈니스 파트너가 되겠습니다.
                        </p>
                        <p>고객님의 사업장에 늘 번영이 함께하시기를 진심으로 기원합니다. 감사합니다.</p>
                        <p className="pt-4 text-right font-bold text-title">세도어뮤즈먼트 대표 전기석 올림</p>
                    </div>
                </div>
            </article>
        </>
    );
}
