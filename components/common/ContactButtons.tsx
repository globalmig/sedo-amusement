import Link from "next/link";
import { COMPANY_INFO } from "@/datas/company";

interface ContactButtonsProps {
    className?: string;
    phoneText?: string;
    emailText?: string;
}

// 다크 배경(Home/AS CTA 섹션) 위에서 전화문의 · 이메일문의를 나란히 보여주는 CTA 버튼 그룹
export default function ContactButtons({
    className = "",
    phoneText = "전화 상담하기",
    emailText = "이메일 문의하기",
}: ContactButtonsProps) {
    return (
        <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
            <Link href={COMPANY_INFO.phoneHref} className="btn-primary px-8 py-3.5 text-base">
                {COMPANY_INFO.phone} {phoneText}
            </Link>
            <Link
                href={`mailto:${COMPANY_INFO.email}`}
                className="inline-flex items-center justify-center rounded-lg border border-white/40 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
                {emailText}
            </Link>
        </div>
    );
}
