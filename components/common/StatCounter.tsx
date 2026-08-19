'use client';

import { useEffect, useRef, useState } from "react";

type Stat = { label: string; value: string };

function parseStatValue(value: string) {
    const match = value.match(/^(\D*)([\d,]+)(.*)$/);
    if (!match) return null;
    const [, prefix, digits, suffix] = match;
    return { prefix, suffix, hasComma: digits.includes(","), target: Number(digits.replace(/,/g, "")) };
}

function formatStat(value: string, current: number) {
    const parsed = parseStatValue(value);
    if (!parsed) return value;
    const { prefix, suffix, hasComma } = parsed;
    const number = hasComma ? current.toLocaleString("ko-KR") : String(current);
    return `${prefix}${number}${suffix}`;
}

export default function StatCounter({ stats }: { stats: Stat[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);
    const [counts, setCounts] = useState<number[]>(() => stats.map(() => 0));

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;

        const targets = stats.map((stat) => parseStatValue(stat.value)?.target ?? 0);
        const duration = 1500;
        let start: number | null = null;
        let frameId: number;

        const tick = (timestamp: number) => {
            if (start === null) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts(targets.map((target) => Math.round(target * eased)));
            if (progress < 1) frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [started, stats]);

    return (
        <div
            ref={containerRef}
            className="flex justify-between pt-8 pc:flex pc:w-44.25 pc:flex-none pc:flex-col pc:gap-12.5 pc:border-0 pc:pt-0"
        >
            {stats.map((stat, i) => (
                <div key={stat.label} className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-primary mb-2 pc:text-base">{stat.label}</p>
                    <p className="text-xl font-bold text-title pc:text-[42px]">
                        {formatStat(stat.value, counts[i])}
                    </p>
                </div>
            ))}
        </div>
    );
}
