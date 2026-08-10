import Link from "next/link";
import { COMPANY_INFO } from "@/datas/company";

interface ContactButtonsProps {
    className?: string;
    phoneText?: string;
    emailText?: string;
}

export default function ContactButtons({
    className = "",
    phoneText = "전화 상담하기",
}: ContactButtonsProps) {
    return (
        <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
            <Link href={COMPANY_INFO.phoneHref} className="btn-primary px-8 py-3.5 text-base">
                {phoneText}
            </Link>
        </div>
    );
}
