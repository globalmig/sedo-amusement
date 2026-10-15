import type { Metadata } from "next";
import CategoryBanner from "@/components/common/CategoryBanner";
import ContactButtons from "@/components/common/ContactButtons";
import FaqList from "@/components/common/FaqList";
import StartupConsultForm from "@/components/form/StartupConsultForm";
import { getConsultingAreas, getConsultingSteps } from "@/lib/consulting";
import { getFaqItems } from "@/lib/faq";

export const metadata: Metadata = {
    title: "창업 컨설팅",
    description:
        "아케이드 게임장, 가족형 유원시설(FEC), 키즈카페 창업을 위한 상권 분석, 기기 소싱, 인허가, 마케팅까지 세도어뮤즈먼트의 창업 컨설팅을 안내합니다.",
    keywords: ["아케이드 창업 컨설팅", "키즈카페 창업", "FEC 창업", "오락실 창업", "게임장 창업 컨설팅", "세도어뮤즈먼트 창업 컨설팅"],
};

export default async function ConsultingPage() {
    const [CONSULTING_AREAS, CONSULTING_STEPS, CONSULTING_FAQ_ITEMS] = await Promise.all([
        getConsultingAreas(),
        getConsultingSteps(),
        getFaqItems("consulting"),
    ]);

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
                                key={area.id}
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
                                        {area.points.map((p, index) => <li key={index} className="mt-4 text-base pc:text-[20px]">· {p}</li>)}
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
                                key={step.id}
                                className="animate-process-glow rounded-xl bg-white/8 p-6"
                                style={{ animationDelay: `${index}s` }}
                            >
                                <p className="text-base font-bold text-primary pc:text-[20px]">0{index + 1}</p>
                                <h3 className="mt-3 text-lg font-bold text-white pc:text-2xl">{step.title}</h3>
                                <p className="mt-3 text-base leading-relaxed text-white/60 pc:text-[20px]">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                </section>

                {/* FAQ */}
                {CONSULTING_FAQ_ITEMS.length > 0 && (
                    <FaqList
                        items={CONSULTING_FAQ_ITEMS.map((item) => ({ category: item.category, q: item.question, a: item.answer }))}
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
