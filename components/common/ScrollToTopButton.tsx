"use client";
import { useEffect, useState } from "react";

function ArrowUpIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > 400);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="맨 위로 이동"
            className={`fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-card transition-all duration-300 hover:bg-primary/90 pc:bottom-8 pc:left-8 pc:h-14 pc:w-14 ${
                isVisible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
            }`}
        >
            <ArrowUpIcon className="h-5 w-5 pc:h-6 pc:w-6" />
        </button>
    );
}
