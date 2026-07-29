"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { COMPANY_INFO } from "@/datas/company";

const SLIDES = [
    {
        image: "/images/arcade-zone-wide.png",
        bg: "bg-title",
        eyebrow: "SEDO AMUSEMENT",
        heading: "20년 전통의\n전자오락기 유통 전문기업",
        description: "오락실 · 키즈카페를 위한 검증된 게임기를 세도어뮤즈먼트가 책임집니다.",
    },
    {
        image: "/images/arcade-racing.jpg",
        bg: "bg-title",
        eyebrow: "PRODUCT LINE-UP",
        heading: "정품 게임기,\n합리적인 창업 비용",
        description: "크레인부터 리듬, 레이싱까지 합리적인 견적과 빠른 설치를 제공합니다.",
    },
    {
        image: "/images/arcade-slot-close.png",
        bg: "bg-gray-800",
        eyebrow: "A/S & SUPPORT",
        heading: "전국 어디서나\n신속한 사후관리",
        description: "설치 이후에도 끝까지 책임지는 세도어뮤즈먼트의 A/S 시스템.",
    },
] as const;

export default function Slide() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-125 min-h-125 pc:h-175 w-full overflow-hidden">
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.heading}
                    aria-hidden={current !== index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                        ${current === index ? "opacity-100" : "opacity-0"}`}
                >
                    <Image
                        src={slide.image}
                        alt=""
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className="object-cover"
                    />
                    {/* 브랜드 컬러 오버레이 (투명도 0.7) */}
                    <div className={`absolute inset-0 ${slide.bg} opacity-90`} />

                    <div className="relative z-10 flex h-full items-center">
                        <div className="w-full max-w-300 px-[5%] pc:mx-auto pc:px-0">
                            <p className="text-sm font-bold tracking-widest text-primary pc:text-base">
                                {slide.eyebrow}
                            </p>
                            <h1 className="mt-4 whitespace-pre-line text-3xl font-black leading-tight text-white pc:text-5xl">
                                {slide.heading}
                            </h1>
                            <p className="mt-5 max-w-md text-sm leading-6 text-white/80 pc:text-base">
                                {slide.description}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href={COMPANY_INFO.phoneHref} className="btn-primary">
                                    전화 상담하기
                                </Link>
                                <Link
                                    href="/products/crane"
                                    className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                                >
                                    제품 둘러보기
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {SLIDES.map((slide, index) => (
                    <button
                        key={slide.heading}
                        type="button"
                        aria-label={`${index + 1}번째 슬라이드로 이동`}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            current === index ? "w-6 bg-primary" : "w-2 bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
