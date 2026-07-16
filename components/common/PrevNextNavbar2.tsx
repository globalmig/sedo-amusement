import Link from "next/link";

interface NavItem {
    href: string;
    title: string;
}

interface PrevNextNavbar2Props {
    prevItem?: NavItem | null;
    nextItem?: NavItem | null;
    prevLabel?: string;
    nextLabel?: string;
}

// 사용자 제품 네비게이션
export default function PrevNextNavbar2({
    prevItem,
    nextItem,
    prevLabel = "이전 글",
    nextLabel = "다음 글",
}: PrevNextNavbar2Props) {
    return (
        <div className="flex gap-4">
            {/* 이전글 */}
            {prevItem ?
                <Link
                    href={prevItem.href}
                    className="group flex-1 card p-5 hover:border-primary transition-colors"
                >
                    <span className="text-sm text-muted">
                        {prevLabel}
                    </span>
                    <h3 className="font-bold text-title group-hover:text-primary transition-colors mt-2 mb-5 pc:text-xl">
                        {prevItem.title}
                    </h3>
                    <div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 transition-colors group-hover:bg-primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} aria-hidden="true" className="h-4 w-4">
                                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </Link> :
                <div
                    className="group flex-1 card p-5"
                >
                    <span className="text-sm text-muted">
                        {prevLabel}
                    </span>
                    <h3 className="font-bold text-title transition-colors mt-2 mb-5 pc:text-xl">
                        이전 글이 없습니다.
                    </h3>
                    <div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 transition-colors group-hover:bg-primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} aria-hidden="true" className="h-4 w-4">
                                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            }

            {/* 다음글 */}
            {nextItem ?
                <Link
                    href={nextItem.href}
                    className="group flex-1 card p-5 items-end hover:border-primary transition-colors text-right"
                >
                    <span className="text-sm text-muted">
                        {nextLabel}
                    </span>
                    <h3 className="font-bold w-full text-title group-hover:text-primary transition-colors mt-2 mb-5 pc:text-xl">
                        {nextItem.title}
                    </h3>
                    <div className="flex justify-end">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 transition-colors group-hover:bg-primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} aria-hidden="true" className="h-4 w-4">
                                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </Link>
                : <div
                    className="group flex-1 card p-5 items-end hover:border-primary transition-colors text-right"
                >
                    <span className="text-sm text-muted">
                        {nextLabel}
                    </span>
                    <h3 className="font-bold w-full text-title group-hover:text-primary transition-colors mt-2 mb-5 pc:text-xl">
                        다음글이 없습니다.
                    </h3>
                    <div className="flex justify-end">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 transition-colors group-hover:bg-primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} aria-hidden="true" className="h-4 w-4">
                                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}
