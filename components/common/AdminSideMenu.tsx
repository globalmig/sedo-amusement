"use client";
import { ADMIN_CATEGORY } from "@/datas/categories";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 메뉴 : 제품 카테고리로 분류
export default function AdminSideMenu() {
    const pathname = usePathname();

    return (
        <aside className="w-56 shrink-0 bg-primary/10 min-h-screen">
            <nav className="py-4">
                <ul className="space-y-1">
                    {Object.entries(ADMIN_CATEGORY).map(([key, value]) => (
                        <li key={key}>
                            <p className="px-5 pt-4 pb-1 text-xs font-semibold text-muted uppercase tracking-wider">
                                {value.title}
                            </p>
                            {value.categories && (
                                <ul>
                                    {value.categories.map((sub) => {
                                        const isActive = pathname === `/admin/${sub.url}`;
                                        return (
                                            <li key={sub.url}>
                                                <Link
                                                    href={`/admin/${sub.url}`}
                                                    className={`flex items-center px-5 py-2 text-sm transition-colors ${
                                                        isActive
                                                            ? "bg-primary/10 font-semibold text-primary"
                                                            : "text-body hover:bg-surface hover:text-primary"
                                                    }`}
                                                >
                                                    {sub.name}
                                                </Link>
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
    );
}
