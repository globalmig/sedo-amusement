import Link from "next/link";
import { COMPANY_INFO } from "@/datas/company";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t border-black/5 bg-base-dark text-white/70">
            <div className="mx-auto max-w-300 px-[5%] py-10 pc:px-0 pc:py-14">
                <div className="flex flex-col gap-8 pc:flex-row pc:justify-between">
                    <div>
                        <div>
                            <Image 
                            src="/icons/logo_white.png" 
                            alt="세도어뮤즈먼트 로고" 
                            width={101} 
                            height={41}
                            className="w-22 h-auto pc:w-25 opacity-70"
                            />
                        </div>
                        <p className="mt-3 max-w-sm text-sm leading-6">
                            20년 전통의 전자오락기 유통 전문기업. 오락실 · 키즈카페 창업부터
                            사후관리까지 책임지는 파트너입니다.
                        </p>
                    </div>
                    <ul>
                        <li className="text-sm">대표번호 : <Link href={COMPANY_INFO.phoneHref} className="hover:text-white">{COMPANY_INFO.phone}</Link></li>
                        <li className="text-sm mt-1">이메일 : {COMPANY_INFO.email}</li>
                        <li className="text-sm mt-1">주소 : {COMPANY_INFO.address}</li>
                        <li className="text-sm mt-1">사업자등록번호 : {COMPANY_INFO.bizNumber}</li>
                        <li className="text-sm mt-1">운영시간 : {COMPANY_INFO.bizHours}</li>
                    </ul>
                </div>

                <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 pc:flex-row pc:items-center pc:justify-between">
                    <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
                    <Link href="/admin" className="hover:text-white/70 transition-colors text-sm">
                        관리자 로그인
                    </Link>
                </div>
            </div>
        </footer>
    );
}
