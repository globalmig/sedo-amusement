"use client";
import { useState } from "react";
import Link from "next/link";

interface FaqItem {
    q: string;
    a: string;
}

interface FaqListProps {
    items: readonly FaqItem[];
    eyebrow?: string;
    title?: string;
    moreHref?: string;
    moreLabel?: string;
}

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
}: FaqListProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="mx-auto max-w-300 px-[5%] py-16 pc:px-0 pc:py-24">
            <div className="flex flex-col gap-2 pc:flex-row pc:items-end pc:justify-between">
                <div>
                    <p className="text-sm font-bold tracking-widest text-primary">{eyebrow}</p>
                    <h2 className="mt-4 text-2xl font-black text-title pc:text-5xl">{title}</h2>
                </div>
                {moreHref && (
                    <Link href={moreHref} className="text-sm font-semibold text-primary hover:underline">
                        {moreLabel} &gt;
                    </Link>
                )}
            </div>

            <div className="mt-10 flex flex-col gap-3">
                {items.map((item, index) => {
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
        </section>
    );
}
