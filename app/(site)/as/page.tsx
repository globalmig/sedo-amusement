import type { Metadata } from "next";
import CategoryBanner from "@/components/common/CategoryBanner";
import ContactButtons from "@/components/common/ContactButtons";
import FaqList from "@/components/common/FaqList";
import { COMPANY_INFO } from "@/datas/company";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "@/datas/faq";
import Image from "next/image";

export const metadata: Metadata = {
    title: "A/S 및 사후관리 안내",
    description:
        "전국 출장 A/S와 정품 파츠 교체, 정기 점검까지 책임지는 세도어뮤즈먼트의 사후관리 서비스를 안내합니다. 자가 점검 가이드와 A/S 접수 절차를 확인해보세요.",
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
    { step: "01", title: "접수", description: "전화로 매장명, 기종, 증상을 알려주세요." },
    { step: "02", title: "1차 진단", description: "담당 엔지니어가 증상을 확인하고 방문 일정을 안내합니다." },
    { step: "03", title: "방문 · 수리", description: "약속된 일정에 방문하여 점검 및 수리를 진행합니다." },
    { step: "04", title: "완료 확인", description: "정상 작동을 확인한 뒤 A/S 내역을 안내해 드립니다." },
];

const PROMISES = [
    {
        title: "정품 파츠 사용",
        description: "모든 수리는 제조사 정품 부품만을 사용하여 진행하며, 비정품 사용으로 인한 재고장을 원천 차단합니다.",
    },
    {
        title: "수리 보증 제도",
        description: "출장 수리 완료 후 30일 이내 동일 증상이 재발하면 추가 비용 없이 다시 점검해 드립니다.",
    },
    {
        title: "정기 점검 프로그램",
        description: "고장이 발생하기 전에 미리 막는 것이 원칙입니다. 정기 방문점검으로 매장 가동률을 지켜드립니다.",
    },
];

const FIELD_CASES = [
    {
        title: "출장 수리 현장",
        description: "매장 방문 후 1시간 이내 1차 진단을 완료합니다.",
        image: "/images/as-visit-repair.png",
    },
    {
        title: "부품 교체 전/후",
        description: "정품 부품 교체로 재고장 위험을 최소화합니다.",
        image: "/images/as-parts-replacement.jpg",
    },
    {
        title: "정기 점검 현장",
        description: "월 1회 정기 점검으로 사전에 이상 유무를 확인합니다.",
        image: "/images/as-regular-checkup.jpg",
    },
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
                {/* 1. 메인 메시지 */}
                <section>
                    <div className="mx-auto max-w-300 px-[5%] py-16 text-center pc:px-0 pc:py-24">
                        <p className="text-sm font-bold tracking-widest text-primary">SERVICE PHILOSOPHY</p>
                        <h2 className="mx-auto mt-4 whitespace-pre-line text-2xl font-black leading-snug text-title pc:text-5xl">
                            판매에서 끝이 아닙니다.<br />걱정없는 사후관리로 든든하게
                        </h2>
                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-body pc:text-base">
                            운영하시면서 불편한 점이 없도록 빠르고 친절하게 지원해 드립니다.
                        </p>
                    </div>
                </section>

                <div className="border-b border-b-muted/20"></div>

                {/* 2. 자가 점검 가이드 */}
                <section id="self-check" className="scroll-mt-20 bg-surface">
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                        <p className="text-sm font-bold tracking-widest text-primary">SELF-CHECK GUIDE</p>
                        <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">자가 점검 가이드</h2>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-body pc:text-base">
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
                                                className="w-4 h-auto pc:w-5"/>
                                            </div>
                                            <h3 className="text-sm font-bold text-title pc:text-[1.3rem]">
                                                <span className="text-primary">0{index + 1}. </span>
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p className="mt-2 leading-5 text-body pc:text-[1rem] pc:leading-6">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="hidden pc:block">
                                <Image 
                                src="/images/self-guide.png" 
                                alt="자가 점검 가이드" 
                                width={505} 
                                height={497}
                                className="w-120 h-auto"
                                />
                            </div>
                        </div>

                    </div>
                </section>

                <div className="border-b border-b-muted/20"></div>

                {/* 3. A/S 프로세스 */}
                <section className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    <p className="text-sm font-bold tracking-widest text-primary">PROCESS</p>
                    <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">
                        그래도 해결되지 않으셨다면
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-body pc:text-base">
                        아래 4단계 절차를 통해 빠르고 정확하게 A/S를 접수해 드립니다.
                    </p>

                    <div className="mt-10 flex flex-wrap pc:flex-nowrap gap-6">
                        {AS_STEPS.map((item) => (
                            <div key={item.step} className="card basis-full p-6 sm:basis-1/2 pc:basis-0 pc:flex-1 pc:p-8">
                                <span className="text-2xl font-black text-primary pc:text-3xl">{item.step}</span>
                                <h3 className="mt-3 text-base font-bold text-title pc:text-[1.3rem]">{item.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-body pc:text-[1rem]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. 우리의 약속 */}
                {/* <section className="bg-primary/50">
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                        <p className="text-sm font-bold tracking-widest text-primary">OUR PROMISE</p>
                        <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">우리의 약속</h2>

                        <div className="mt-10 flex flex-wrap pc:flex-nowrap gap-6">
                            {PROMISES.map((item, index) => (
                                <div key={item.title} className="card basis-full p-6 sm:basis-1/3 pc:basis-0 pc:flex-1 pc:p-8">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-white pc:h-12 pc:w-12 pc:text-base">
                                        {index + 1}
                                    </span>
                                    <h3 className="mt-5 text-lg font-bold text-title pc:text-[1.3rem]">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-body pc:text-[1rem]">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section> */}

                {/* 5. 실제 현장 사진 */}
                {/* <section>
                    <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                        <p className="text-sm font-bold tracking-widest text-primary">FIELD CASE</p>
                        <h2 className="mt-4 text-2xl font-black text-wthie pc:text-5xl">실제 현장 사진</h2>
                        <p className="mt-3 max-w-xl text-sm leading-6 pc:text-base">
                            세도어뮤즈먼트 엔지니어가 직접 방문해 처리한 A/S 현장입니다.
                        </p>

                        <div className="mt-10 flex flex-wrap pc:flex-nowrap gap-6">
                            {FIELD_CASES.map((item) => (
                                <div key={item.title} className="basis-full sm:basis-1/3 pc:basis-0 pc:flex-1">
                                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-surface">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="(min-width: 1024px) 33vw, 100vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="mt-4 text-sm font-bold text-title pc:text-lg">{item.title}</h3>
                                    <p className="mt-1 text-xs leading-5 text-body pc:text-sm">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section> */}

                {/* 6. CTA */}
                <section className="bg-[#FFA73C]">
                    <div className="mx-auto max-w-300 px-[5%] py-16 text-center pc:px-0 pc:py-20">
                        <h2 className="text-2xl font-black text-white pc:text-5xl">
                            매출 손실, 더는 방치하지 마세요
                        </h2>
                        <p className="mt-3 text-sm text-white pc:text-base">
                            {COMPANY_INFO.bizHours} · 지금 바로 상담하시면 가장 빠른 방문 일정을 안내해 드립니다.
                        </p>
                        <ContactButtons className="mt-8" phoneText="지금 긴급 수리 상담하기" emailText="A/S 이메일 문의하기" />
                    </div>
                </section>

                {/* FAQ */}
                <FaqList items={FAQ_ITEMS} categories={FAQ_CATEGORIES} />
            </article>
        </>
    );
}
