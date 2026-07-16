"use client";
import { useState } from "react";
import Link from "next/link";

interface CategoryBannerTab {
    name: string;
    url: string;
}

interface CategoryBannerProps {
    title: string;
    description?: string;
    tabs?: CategoryBannerTab[];
    basePath?: string;
    activeUrl?: string;
}

// 서브 페이지 상단 배너: 제목 + 설명 + (선택) 서브 탭 메뉴
export default function CategoryBanner({
    title,
    description,
    tabs,
    basePath = "",
    activeUrl,
}: CategoryBannerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const activeTab = tabs?.find((tab) => tab.url === activeUrl);

    return (
        <div className="pt-16 bg-title pc:pt-20">
            <div className="mx-auto max-w-300 px-[5%] py-10 pc:px-0 pc:py-14">
                <h1 className="text-2xl font-black text-white pc:text-3xl">{title}</h1>
                {description && (
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 pc:text-base">
                        {description}
                    </p>
                )}
            </div>

            {tabs && tabs.length > 0 && (
                <div className="border-t border-white/10 bg-black/10">
                    <div className="mx-auto max-w-300 px-[5%] py-3 pc:px-0 pc:py-0">
                        {/* 모바일: 클릭 시 서브메뉴 박스 노출 */}
                        <div className="relative pc:hidden">
                            <button
                                type="button"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white"
                            >
                                {activeTab ? activeTab.name : "카테고리 선택"}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                >
                                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {isOpen && (
                                <ul className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-lg border border-white/10 bg-primary shadow-card">
                                    {tabs.map((tab) => {
                                        const isActive = activeUrl === tab.url;
                                        return (
                                            <li key={tab.url} className="border-b border-white/20 last:border-0">
                                                <Link
                                                    href={`${basePath}/${tab.url}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`block px-4 py-3 text-sm font-medium transition-colors ${
                                                        isActive ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10"
                                                    }`}
                                                >
                                                    {tab.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* 데스크탑: 탭 메뉴 */}
                        <nav className="hidden pc:block">
                            <ul className="flex gap-1 whitespace-nowrap">
                                {tabs.map((tab) => {
                                    const isActive = activeUrl === tab.url;
                                    return (
                                        <li key={tab.url}>
                                            <Link
                                                href={`${basePath}/${tab.url}`}
                                                className={`inline-block border-b-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? "border-primary text-white"
                                                        : "border-transparent text-white/60 hover:text-white"
                                                }`}
                                            >
                                                {tab.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
