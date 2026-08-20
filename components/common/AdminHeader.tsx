import Link from "next/link";
import LogoutButton from "./LogoutButton";

interface AdminHeaderProps {
    onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-card">
            <div className="px-4 pc:px-6 h-14 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold">
                        <Link href="/admin" className="text-title hover:text-primary">ADMIN</Link>
                    </h3>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="메뉴 열기"
                        className="-ml-1 flex h-10 items-center justify-center rounded-lg text-title hover:bg-surface pc:hidden"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                            className="h-5 w-5"
                        >
                            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                        </svg>
                    </button>
                    
                </div>
                <div className="hidden pc:block">
                    <ul className="flex items-center gap-3 pc:gap-4">
                        <li>
                            <Link href="/" className="text-xs pc:text-sm font-semibold text-primary">
                                사이트 돌아가기
                            </Link>
                        </li>
                        <li>
                            <LogoutButton />
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
