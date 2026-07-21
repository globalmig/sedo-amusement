import CategoryBanner from "@/components/common/CategoryBanner";
import { USER_CATEGORY } from "@/datas/categories";
import { COMPANY_INFO } from "@/datas/company";
import Link from "next/link";

export default function LocationPage() {
    return (
        <>
            <CategoryBanner
                title="오시는 길"
                description="세도어뮤즈먼트에 오신 것을 환영합니다."
                tabs={USER_CATEGORY.company.categories}
                basePath="/company"
                activeUrl="location"
            />
            <article>
                <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                    {/* 오시는 길 */}
                    <p className="text-sm font-bold tracking-widest text-primary">LOCATION</p>
                    <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">오시는 길</h2>
                    <div className="pc:flex pc:justify-between">
                        {/* 지도 */}
                        <div className="mt-8 rounded-2xl overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m5!3m3!1m2!1s0x357ca4917084e395%3A0x647e7f2ea0e55b49!2z7ISc7Jq47Yq567OE7IucIOyEseuPmeq1rCDshLHsiJjsnbTroZwgNjU!5e0!3m2!1sko!2skr!4v1784517500277!5m2!1sko!2skr"
                                width="600"
                                height="450"
                                className="border-0 w-full pc:w-150 pc:h-100"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                            ></iframe>
                        </div>
                        <div className="mt-8 pc:w-120">
                            <ul>
                                <li className="flex gap-4 border-b border-black/5 py-4 pc:pb-6">
                                    <p className="w-20 shrink-0 font-bold text-title">주소</p>
                                    <p className="text-body">{COMPANY_INFO.address}</p>
                                </li>
                                <li className="flex gap-4 border-b border-black/5 py-4 pc:py-6">
                                    <p className="w-20 shrink-0 font-bold text-title">전화</p>
                                    <p className="text-body">
                                        <Link href={COMPANY_INFO.phoneHref} className="hover:text-primary">{COMPANY_INFO.phone}</Link>
                                    </p>
                                </li>
                                <li className="flex gap-4 py-4 pc:py-6">
                                    <p className="w-20 shrink-0 font-bold text-title pc:hidden">운영시간</p>
                                    <p className="text-body pc:hidden">{COMPANY_INFO.bizHours}</p>
                                    <div className="hidden pc:block bg-primary rounded-xl w-full p-5 pb-10">
                                        <p className="font-bold text-white">운영시간</p>
                                        <p className="text-white mt-2">{COMPANY_INFO.bizHours}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}