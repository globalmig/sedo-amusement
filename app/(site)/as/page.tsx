import type { Metadata } from "next";
import CategoryBanner from "@/components/common/CategoryBanner";
import FaqList from "@/components/common/FaqList";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "@/datas/faq";
import Image from "next/image";

export const metadata: Metadata = {
    title: "A/S 및 사후관리 안내",
    description:
        "전국 출장 A/S와 정품 파츠 교체, 정기 점검까지 책임지는 세도어뮤즈먼트의 사후관리 서비스를 안내합니다. 자가 점검 가이드와 A/S 접수 절차를 확인해보세요.",
    keywords: ["게임기 A/S", "전자오락기 수리", "오락실 A/S", "출장 수리", "정품 파츠 교체", "게임기 정기점검", "세도어뮤즈먼트 A/S"],
};

const SELF_CHECK_ITEMS = [
    {
        title: "전원 연결 확인",
        description: "전원 케이블이 콘센트에 완전히 꽂혀 있는지, 멀티탭 스위치가 켜져 있는지 확인해주세요.",
    },
    {
        title: "재부팅",
        description: "전원을 껐다가 10초 뒤 다시 켜보세요. 일시적인 오류는 재부팅만으로 해결되는 경우가 많습니다.",
    },
    {
        title: "투입구 이물질 확인",
        description: "동전·지폐·카드 투입구에 이물질이 끼어 있지 않은지 확인 후 제거해주세요.",
    },
    {
        title: "비상정지 스위치 확인",
        description: "비상정지(EMS) 스위치가 눌려 있는 상태라면 시계 방향으로 돌려 해제해주세요.",
    },
    {
        title: "케이블 연결 확인",
        description: "통신용 랜선, 결제 단말기 케이블이 제대로 연결되어 있는지 확인해주세요.",
    },
];

const AS_STEPS = [
    { step: "01", title: "접수", description: "전화로 매장명, 기종, 증상을 알려주세요.", icon: "/icons/process-1.png" },
    { step: "02", title: "1차 진단", description: "담당 엔지니어가 증상을 확인하고 방문 일정을 안내합니다.", icon: "/icons/process-2.png" },
    { step: "03", title: "방문 · 수리", description: "약속된 일정에 방문하여 점검 및 수리를 진행합니다.", icon: "/icons/process-3.png" },
    { step: "04", title: "완료 확인", description: "정상 작동을 확인한 뒤 A/S 내역을 안내해 드립니다.", icon: "/icons/process-4.png" },
];

export default function AsPage() {
    return (
        <>
            <CategoryBanner
                title="A/S 및 사후관리 안내"
                description="사후관리 안내"
                basePath="/as"
            />
            <article>

                {/* 자가 점검 가이드 */}
                <section id="self-check" className="scroll-mt-20 bg-surface">
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                        <p className="text-base font-bold tracking-widest text-primary pc:text-[20px]">SELF-CHECK GUIDE</p>
                        <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">자가 점검 가이드</h2>
                        <p className="mt-3 max-w-xl text-base leading-6 text-body pc:text-[20px]">
                            A/S 요청 전, 아래 항목을 먼저 확인해보세요. 간단한 점검만으로 바로
                            해결되는 경우가 많습니다.
                        </p>
                        <div className="mt-10 pc:flex pc:justify-between">
                            <div className="flex flex-col gap-4">
                                {SELF_CHECK_ITEMS.map((item, index) => (
                                    <div key={item.title} className="card basis-full p-4 sm:basis-1/2 pc:basis-0 pc:p-6">
                                        <div className="flex gap-4 pb-2 border-b border-b-muted/20">
                                            <div className="mx-0 my-auto flex items-center justify-center">
                                                <Image src="/icons/self-check.png"
                                                    alt="자가 점검 아이콘"
                                                    width={42}
                                                    height={42}
                                                    className="w-4 h-auto pc:w-5" />
                                            </div>
                                            <h3 className="text-base font-bold text-title pc:text-[1.3rem]">
                                                <span className="text-primary">0{index + 1}. </span>
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p className="mt-2 leading-5 text-body pc:text-[20px] pc:leading-6">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="hidden pc:flex pc:items-end">
                                <Image
                                    src="/images/self-guide.png"
                                    alt="자가 점검 가이드"
                                    width={505}
                                    height={497}
                                    className="w-120 h-auto pl-10"
                                />
                            </div>
                        </div>

                    </div>
                </section>

                {/* A/S 프로세스 */}
                <section className="bg-white">
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                        <p className="text-base font-bold tracking-widest text-primary pc:text-[20px]">PROCESS</p>
                        <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">
                            그래도 해결되지 않으셨다면
                        </h2>
                        <p className="mt-3 max-w-xl text-base leading-6 text-body pc:text-[20px]">
                            아래 4단계 절차를 통해 빠르고 정확하게 A/S를 접수해 드립니다.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 pc:grid-cols-4">
                            {AS_STEPS.map((item) => (
                                <div key={item.step} className="group card flex min-h-56 flex-col justify-between gap-8 p-6 transition-colors pc:p-8">
                                    <div>
                                        <span className="text-base font-black text-primary transition-colors pc:text-[20px]">{item.step}</span>
                                        <h3 className="mt-3 text-lg font-bold text-title transition-colors pc:text-[1.3rem]">{item.title}</h3>
                                        <p className="mt-2 text-base leading-6 text-body transition-colors pc:mt-3 pc:text-[20px]">{item.description}</p>
                                    </div>
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        width={48}
                                        height={48}
                                        className="h-10 w-10 self-end transition duration-300 pc:h-12 pc:w-12"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <FaqList items={FAQ_ITEMS} categories={FAQ_CATEGORIES} />
            </article>
        </>
    );
}
