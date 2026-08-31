import Link from "next/link";

interface NavItem {
    href: string;
    title: string;
}

interface PrevNextNavbarProps {
    prevItem?: NavItem | null;
    nextItem?: NavItem | null;
    prevLabel?: string;
    nextLabel?: string;
}

// 관리자 제품 네비게이션
export default function PrevNextNavbar({
    prevItem,
    nextItem,
    prevLabel = "이전 제품",
    nextLabel = "다음 제품",
}: PrevNextNavbarProps) {
    return (
        <div className="mt-20 border-t border-gray-200">
            {/* 이전 */}
            <div className="border-b border-gray-200">
                {prevItem ? (
                    <Link
                        href={prevItem.href}
                        className="flex items-center gap-6 px-2 py-4 hover:bg-surface transition-colors"
                    >
                        <span className="w-20 shrink-0 text-base font-bold text-primary pc:text-[20px]">{prevLabel}</span>
                        <span className="text-base text-body truncate pc:text-[20px]">{prevItem.title}</span>
                    </Link>
                ) : (
                    <div className="flex items-center gap-6 px-2 py-4">
                        <span className="w-20 shrink-0 text-base font-bold text-primary pc:text-[20px]">{prevLabel}</span>
                        <span className="text-base text-muted pc:text-[20px]">이전 제품이 없습니다.</span>
                    </div>
                )}
            </div>
            {/* 다음 */}
            <div className="border-b border-gray-200">
                {nextItem ? (
                    <Link
                        href={nextItem.href}
                        className="flex items-center gap-6 px-2 py-4 hover:bg-surface transition-colors"
                    >
                        <span className="w-20 shrink-0 text-base font-bold text-primary pc:text-[20px]">{nextLabel}</span>
                        <span className="text-base text-body truncate pc:text-[20px]">{nextItem.title}</span>
                    </Link>
                ) : (
                    <div className="flex items-center gap-6 px-2 py-4">
                        <span className="w-20 shrink-0 text-base font-bold text-primary pc:text-[20px]">{nextLabel}</span>
                        <span className="text-base text-muted pc:text-[20px]">다음 제품이 없습니다.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
