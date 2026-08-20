"use client";
import { ADMIN_CATEGORY } from "@/datas/categories";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSideMenuProps {
    open?: boolean;
    onClose?: () => void;
}

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
                className={`fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-64 max-w-[80%] shrink-0 overflow-y-auto bg-black/80 transition-transform duration-200 pc:static pc:z-auto pc:h-auto pc:min-h-screen pc:w-56 pc:max-w-none pc:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
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
                                                        onClick={onClose}
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
        </>
    );
}
