import { COMPANY_INFO } from "@/datas/company";
import Link from "next/link";

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

export default function CompanyPage() {
    return (
        <article>
            {/* 인사말 */}
            <section className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                <p className="text-sm font-bold tracking-widest text-primary">GREETING</p>
                <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">인사말</h2>
                <div className="mt-6 space-y-5 text-sm leading-7 text-body pc:max-w-2xl pc:text-base">
                    <p>
                        안녕하십니까, 세도어뮤즈먼트를 찾아주셔서 감사합니다.
                    </p>
                    <p>
                        저희는 20년간 오직 전자오락기 유통 한 분야에 집중하며, 오락실과
                        키즈카페를 운영하시는 고객님들이 믿고 거래할 수 있는 파트너가
                        되기 위해 노력해 왔습니다. 정품 게임기의 안정적인 공급은 물론,
                        설치 이후의 사후관리까지 책임지는 것이 저희의 원칙입니다.
                    </p>
                    <p>
                        앞으로도 신뢰를 최우선 가치로 삼아, 고객님의 안정적인 매장
                        운영을 함께 만들어가겠습니다. 감사합니다.
                    </p>
                    <p className="pt-2 font-bold text-title">세도어뮤즈먼트 대표 드림</p>
                </div>
            </section>

            {/* 사업 영역 */}
            <section className="bg-surface">
                <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    <p className="text-sm font-bold tracking-widest text-primary">BUSINESS</p>
                    <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">사업 영역</h2>

                    <div className="mt-10 flex flex-wrap gap-6">
                        {BUSINESS_AREAS.map((area, index) => (
                            <div key={area.title} className="card basis-full p-6 sm:basis-1/2 pc:p-8">
                                <span className="text-sm font-black text-primary">0{index + 1}</span>
                                <h3 className="mt-3 text-lg font-bold text-title">{area.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-body">{area.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 오시는 길 */}
            <section className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                <p className="text-sm font-bold tracking-widest text-primary">LOCATION</p>
                <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">오시는 길</h2>

                <div className="mt-8 flex flex-col gap-8 pc:flex-row">
                    <div className="aspect-4/3 w-full rounded-xl bg-surface pc:aspect-auto pc:basis-1/2" />

                    <dl className="space-y-4 text-sm leading-6 pc:basis-1/2 pc:text-base">
                        <div className="flex gap-4 border-b border-black/5 pb-4">
                            <dt className="w-20 shrink-0 font-bold text-title">주소</dt>
                            <dd className="text-body">{COMPANY_INFO.address}</dd>
                        </div>
                        <div className="flex gap-4 border-b border-black/5 pb-4">
                            <dt className="w-20 shrink-0 font-bold text-title">전화</dt>
                            <dd className="text-body">
                                <Link href={COMPANY_INFO.phoneHref} className="hover:text-primary">{COMPANY_INFO.phone}</Link>
                            </dd>
                        </div>
                        <div className="flex gap-4 border-b border-black/5 pb-4">
                            <dt className="w-20 shrink-0 font-bold text-title">이메일</dt>
                            <dd className="text-body">{COMPANY_INFO.email}</dd>
                        </div>
                        <div className="flex gap-4 pb-4">
                            <dt className="w-20 shrink-0 font-bold text-title">운영시간</dt>
                            <dd className="text-body">{COMPANY_INFO.bizHours}</dd>
                        </div>
                    </dl>
                </div>
            </section>
        </article>
    );
}
