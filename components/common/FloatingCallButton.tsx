import { COMPANY_INFO } from "@/datas/company";
import Link from "next/link";

export default function FloatingCallButton() {
    return (
        <Link
            href={COMPANY_INFO.phoneHref}
            aria-label={`${COMPANY_INFO.phone}로 전화 상담하기`}
            className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-card transition-all duration-300 hover:scale-105 pc:bottom-8 pc:right-8 pc:h-16 pc:w-16 pc:hover:w-auto pc:hover:justify-start pc:hover:px-6"
        >
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="h-6 w-6 shrink-0 pc:h-7 pc:w-7"
            >
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8Z" />
            </svg>
            <span className="flex max-w-0 flex-col overflow-hidden whitespace-nowrap leading-tight pc:group-hover:ml-2 pc:group-hover:max-w-40 ">
                <span className="text-base font-bold">전화 상담</span>
                <span className="text-[1.2rem] font-medium text-white/85">{COMPANY_INFO.phone}</span>
            </span>
        </Link>
    );
}
