"use client";
import { ADMIN_CATEGORY } from "@/datas/categories";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSideMenu() {
    const pathname = usePathname();

    return (
        <aside className="w-56 shrink-0 bg-black/80 min-h-screen">
            <nav className="py-4">
                <ul className="space-y-1">
                    {Object.entries(ADMIN_CATEGORY).map(([key, value]) => (
                        <li key={key}>
                            <p className="px-5 pt-4 pb-3 font-semibold text-primary uppercase tracking-wider">
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
                                                    className={`flex items-center px-5 py-3 text-sm transition-colors ${
                                                        isActive
                                                            ? "bg-primary font-semibold text-white"
                                                            : "text-white hover:text-primary font-bold"
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
