"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Pagination from "./Pagination";

interface FaqItem {
    category?: string;
    q: string;
    a: string;
}

interface FaqCategory {
    key: string;
    label: string;
}

interface FaqListProps {
    items: readonly FaqItem[];
    eyebrow?: string;
    title?: string;
    moreHref?: string;
    moreLabel?: string;
    /** 전달 시 카테고리 탭 필터 UI가 함께 노출됨 (전달하지 않으면 기존처럼 전체 목록만 표시) */
    categories?: readonly FaqCategory[];
}

const ALL_CATEGORY_KEY = "all";
const ITEMS_PER_PAGE = 4;

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function FaqList({
    items,
    eyebrow = "FAQ",
    title = "자주 묻는 질문",
    moreHref,
    moreLabel = "더보기",
    categories,
}: FaqListProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY_KEY);
    const [page, setPage] = useState(1);

    const visibleItems = useMemo(() => {
        if (!categories || activeCategory === ALL_CATEGORY_KEY) return items;
        return items.filter((item) => item.category === activeCategory);
    }, [items, categories, activeCategory]);

    const pagedItems = useMemo(
        () => visibleItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
        [visibleItems, page]
    );

    const selectCategory = (key: string) => {
        setActiveCategory(key);
        setOpenIndex(null);
        setPage(1);
    };

    const changePage = (nextPage: number) => {
        setPage(nextPage);
        setOpenIndex(null);
    };

    return (
        <section className="bg-surface">
            <div className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
                <div className="flex gap-2 items-end justify-between">
                    <div>
                        <p className="text-sm font-bold tracking-widest text-primary">{eyebrow}</p>
                        <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">{title}</h2>
                    </div>
                    {moreHref && (
                        <Link
                            href={moreHref}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                            {moreLabel}
                            <ChevronIcon className="h-4 w-4 -rotate-90" />
                        </Link>
                    )}
                </div>

                {categories && categories.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => selectCategory(ALL_CATEGORY_KEY)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === ALL_CATEGORY_KEY
                                    ? "bg-primary text-white"
                                    : "bg-surface border-muted/20 border text-body hover:bg-primary/10"
                                }`}
                        >
                            전체
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.key}
                                type="button"
                                onClick={() => selectCategory(category.key)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === category.key
                                        ? "bg-primary text-white"
                                        : "bg-surface border-muted/20 border text-body hover:bg-primary/10"
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-3">
                    {pagedItems.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={item.q} className="card overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                                >
                                    <span className="flex gap-3 text-base font-bold text-title">
                                        <span className="text-primary">Q</span>
                                        {item.q}
                                    </span>
                                    <ChevronIcon
                                        className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="flex gap-3 px-6 pb-5 text-sm leading-6 text-body">
                                            <span className="font-bold text-muted">A</span>
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {visibleItems.length >= 5 && (
                    <Pagination
                        key={activeCategory}
                        totalCount={visibleItems.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={changePage}
                    />
                )}
            </div>
        </section>
    );
}
