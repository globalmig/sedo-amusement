"use client"
import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "./slide.css";
import Image from "next/image";
import Link from "next/link";
import { COMPANY_INFO } from "@/datas/company";

const SLIDES = [
    {
        image: "/images/arcade-zone-wide.png",
        eyebrow: "SEDO AMUSEMENT",
        heading: "20년 전통의\n전자오락기 유통 전문기업",
        description: "오락실·키즈카페를 위한 검증된 게임기를 세도어뮤즈먼트가 책임집니다.",
    },
    {
        image: "/images/arcade-racing.jpg",
        eyebrow: "PRODUCT LINE-UP",
        heading: "정품 게임기,\n합리적인 창업 비용",
        description: "크레인부터 리듬, 레이싱까지 합리적인 견적과 빠른 설치를 제공합니다.",
    },
    {
        image: "/images/arcade-slot-close.png",
        eyebrow: "A/S & SUPPORT",
        heading: "전국 어디서나\n신속한 사후관리",
        description: "설치 이후에도 끝까지 책임지는 세도어뮤즈먼트의 A/S 시스템",
    },
] as const;

function PhoneIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8Z" />
        </svg>
    );
}

function ArrowRightIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ChevronLeftIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PauseIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
    );
}

function PlayIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <path d="M8 5v14l11-7-11-7Z" />
        </svg>
    );
}

export default function Slide() {
    const sliderRef = useRef<Slider>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4500,
        speed: 800,
        pauseOnHover: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (_current: number, next: number) => setCurrentSlide(next),
    };

    const goPrev = () => sliderRef.current?.slickPrev();
    const goNext = () => sliderRef.current?.slickNext();
    const togglePlay = () => {
        if (isPlaying) sliderRef.current?.slickPause();
        else sliderRef.current?.slickPlay();
        setIsPlaying((prev) => !prev);
    };

    return (
        <main className="relative w-full">
            <div className="relative h-180 w-full overflow-hidden pc:h-200">
                <Slider ref={sliderRef} {...settings}>
                    {SLIDES.map((slide, index) => (
                        <div key={slide.heading} className="relative h-180 w-full pc:h-200">
                            <Image
                                src={slide.image}
                                alt=""
                                fill
                                priority={index === 0}
                                sizes="100vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/70 to-transparent pc:h-40" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/50 to-black/10" />

                            <div className="relative z-10 flex h-full items-center">
                                <div className="slide-content w-full max-w-300 px-[5%] pc:mx-auto pc:px-0">
                                    <p className="text-sm font-bold tracking-widest text-primary pc:text-base">
                                        {slide.eyebrow}
                                    </p>
                                    <h1 className="mt-4 whitespace-pre-line text-3xl font-black leading-tight text-white pc:text-5xl">
                                        {slide.heading}
                                    </h1>
                                    <p className="mt-5 text-sm leading-6 text-white/80 pc:text-base">
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
                </Slider>

                <div className="absolute inset-x-0 bottom-0 z-20 px-[5%] pb-6 pc:px-0 pc:pb-10">
                    <div className="mx-auto flex max-w-300 items-center justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold tracking-widest text-white pc:text-base">
                                {String(currentSlide + 1).padStart(2, "0")}/{String(SLIDES.length).padStart(2, "0")}
                            </p>
                            <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/30 pc:w-64">
                                <div
                                    key={currentSlide}
                                    className="gauge-fill h-full w-full bg-white"
                                    style={{
                                        animationDuration: `${settings.autoplaySpeed}ms`,
                                        animationPlayState: isPlaying ? "running" : "paused",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={goPrev}
                                aria-label="이전 슬라이드"
                                className="text-white transition-opacity hover:opacity-70"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={togglePlay}
                                aria-label={isPlaying ? "슬라이드 멈춤" : "슬라이드 재생"}
                                className="text-white transition-opacity hover:opacity-70"
                            >
                                {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                            </button>
                            <button
                                type="button"
                                onClick={goNext}
                                aria-label="다음 슬라이드"
                                className="text-white transition-opacity hover:opacity-70"
                            >
                                <ArrowRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-primary">
                <div className="mx-auto flex max-w-300 flex-col gap-6 px-[5%] py-8 pc:flex-row pc:items-center pc:justify-between pc:px-0 pc:py-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <PhoneIcon className="h-6 w-6 text-white" />
                            <p className="text-xl font-bold text-white pc:text-2xl">031-824-5851</p>
                        </div>
                        <p className="mt-2 text-sm text-white/90 pc:text-base">구매 또는 문의사항이 있으신 분들은 언제든지 문의바랍니다.</p>
                    </div>
                    <Link
                        href="/as"
                        className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-white px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 pc:self-auto"
                    >
                        빠른 해결 가이드 바로가기
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
