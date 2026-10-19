"use client";
import { ADMIN_CATEGORY } from "@/datas/categories";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface AdminSideMenuProps {
    open?: boolean;
    onClose?: () => void;
}

const MENU_ICONS: { [key: string]: ReactNode } = {
    products: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="h-5 w-5 shrink-0">
            <path d="M21 8l-9-5-9 5 9 5 9-5z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 8v8l9 5 9-5V8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 13v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    categories: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="h-5 w-5 shrink-0">
            <path d="M3 7l9-4 9 4-9 4-9-4z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12l9 4 9-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 17l9 4 9-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    "create-image": (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="h-5 w-5 shrink-0">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="M21 16l-5-5-4 4-2-2-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    "consulting/areas": (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="h-5 w-5 shrink-0">
            <path d="M21 11.5a8.5 8.5 0 10-3.8 7.1L21 20l-1.3-3.6A8.47 8.47 0 0021 11.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    faq: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="h-5 w-5 shrink-0">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 114.2 1.9c-.6.5-1.2.9-1.2 1.9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 17h.01" strokeLinecap="round" />
        </svg>
    ),
    guide: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className="h-5 w-5 shrink-0">
            <path d="M4 4.5A2.5 2.5 0 016.5 2H20v16H6.5A2.5 2.5 0 004 20.5v-16z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};

export default function AdminSideMenu({ open = false, onClose }: AdminSideMenuProps) {
    const pathname = usePathname();

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 top-14 z-40 bg-black/50 pc:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            <aside
                className={`fixed right-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-64 max-w-[80%] shrink-0 overflow-y-auto bg-black/80 transition-transform duration-200 pc:static pc:z-auto pc:h-auto pc:min-h-screen pc:w-56 pc:max-w-none pc:translate-x-0 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <nav className="py-4">
                    <div className="flex justify-center mb-10">
                        <Image
                            src="/icons/logo_white.png"
                            alt="세도어뮤즈먼트 로고"
                            width={101}
                            height={41}
                        />
                    </div>
                    <ul className="space-y-1">
                        {Object.entries(ADMIN_CATEGORY).map(([key, value]) => (
                            <li key={key}>
                                {value.categories && (
                                    <ul>
                                        {value.categories.map((sub) => {
                                            const isActive = pathname === `/admin/${sub.url}` ||
                                                Boolean(sub.children?.some((child) => pathname === `/admin/${child.url}`));
                                            return (
                                                <li key={sub.url}>
                                                    <Link
                                                        href={`/admin/${sub.url}`}
                                                        onClick={onClose}
                                                        className={`flex items-center gap-2 px-5 py-3 text-base font-semibold transition-colors ${isActive
                                                                ? "bg-primary text-white"
                                                                : "text-white hover:text-primary"
                                                            }`}
                                                    >
                                                        {MENU_ICONS[sub.url]}
                                                        {sub.name}
                                                    </Link>
                                                    {sub.children && (
                                                        <ul>
                                                            {sub.children.map((child) => {
                                                                const isChildActive = pathname === `/admin/${child.url}`;
                                                                return (
                                                                    <li key={child.url}>
                                                                        <Link
                                                                            href={`/admin/${child.url}`}
                                                                            onClick={onClose}
                                                                            className={`flex items-center px-5 py-3 pl-9 text-base transition-colors ${isChildActive
                                                                                    ? "font-semibold text-primary"
                                                                                    : "text-gray-300"
                                                                                }`}
                                                                        >
                                                                            {child.name}
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
