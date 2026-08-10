"use client"
import { USER_CATEGORY } from "@/datas/categories";
import { COMPANY_INFO } from "@/datas/company";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {

    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpenSub, setIsOpenSub] = useState<string | null>(null);
    const [isScroll, setIsScroll] = useState<boolean>(false);
    const [isPc, setIsPc] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScroll(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 64rem)");
        setIsPc(mediaQuery.matches);
        const handleChange = (e: MediaQueryListEvent) => setIsPc(e.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // 모바일 드로어를 닫을 때 아코디언 펼침 상태도 함께 초기화
    useEffect(() => {
        if (!isOpen) setIsOpenSub(null);
    }, [isOpen]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth");
                if (res.ok) {
                    const data = await res.json();
                    setIsLogin(data.isLogin);
                    setIsAdmin(data.isAdmin);
                }
            } catch (err) {
                console.error("인증 상태 확인 실패:", err);
            }
        };
        checkAuth();
    }, []);

    return (
        <>
            <header className={`fixed top-0 left-0 z-40 w-full border-b duration-500
                ${isScroll ? "bg-white border-b-gray-200" : "bg-black/70"}`}>

                <div className="flex py-3 items-center justify-between px-[5%] pc:mx-auto pc:max-w-300 pc:px-0">
                    
                        <Link href="/" rel="canonical">
                            <Image 
                            src="/icons/logo_white.png"
                            alt="세도어뮤즈먼트 로고" 
                            width={101} 
                            height={41}
                            className={`w-15 h-auto pc:w-25 ${isScroll ? "invert" : "invert-0"}`}/>
                        </Link>

                    <nav className={`fixed top-0 h-dvh w-[80%] max-w-xs bg-white py-5 z-50 duration-500 overflow-y-auto
                        pc:static pc:h-auto pc:w-auto pc:max-w-none pc:bg-transparent pc:p-0 pc:overflow-visible
                        ${isOpen ? "right-0" : "-right-full"}`}>

                        <div className="px-5 flex justify-end mb-5 pc:hidden">
                            <button
                                type="button"
                                aria-label="메뉴 닫기"
                                onClick={() => setIsOpen(false)}
                                className="cursor-pointer text-xl leading-none text-title">
                                ✕
                            </button>
                        </div>

                        <ul className="pc:flex pc:h-full pc:items-stretch pc:justify-end">
                            {Object.entries(USER_CATEGORY).map(([key, c]) => {
                                const isTarget = isOpenSub === key;
                                return (
                                    <li key={key}
                                        className="pc:relative pc:flex pc:items-stretch"
                                        onMouseEnter={() => isPc && setIsOpenSub(key)}
                                        onMouseLeave={() => isPc && setIsOpenSub(null)}>
                                        {/* 메인 카테고리 */}
                                        <ul className={`py-3.75 px-5 pc:flex pc:items-center pc:py-0 pc:px-6.25 transition-colors
                                            ${isTarget ? "bg-primary text-white pc:bg-transparent pc:text-primary" : "text-title"}
                                            ${!isTarget && (isScroll ? "pc:text-title" : "pc:text-white")}`}>

                                            {c.categories ? (
                                                <li
                                                    onClick={() => !isPc && setIsOpenSub(isTarget ? null : key)}
                                                    className="flex w-full cursor-pointer items-center justify-between gap-2 font-bold pc:pointer-events-none pc:w-auto pc:font-semibold hover:text-primary">
                                                    {c.title}
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        aria-hidden="true"
                                                        className={`h-4 w-4 shrink-0 transition-transform duration-300 pc:hidden ${isTarget ? "rotate-180" : ""}`}>
                                                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </li>
                                            ) : (
                                                <li>
                                                    <Link href={`/${key}`} rel="canonical" onClick={() => setIsOpen(false)}
                                                        className={`font-bold block cursor-pointer pc:text-base pc:font-semibold pc:hover:text-primary ${isScroll ? "pc:text-title" : "pc:text-white"}`}>
                                                        {c.title}
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                        {/* 서브 카테고리 */}
                                        {c.categories && (
                                            <ul className={`transition-all duration-500 ease-in-out pc:absolute pc:top-full pc:mt-2 pc:left-0 pc:w-62.5 pc:rounded-lg  pc:bg-primary pc:shadow-card
                                                ${isTarget ? "max-h-100 opacity-100 translate-y-0 visible" : "max-h-0 opacity-0 -translate-y-2 invisible"}`}>
                                                {c.categories.map((sub) => (
                                                    <li key={sub.url}
                                                        className="hover:bg-surface pc:hover:bg-surface transition-colors border-b border-black/5 pc:border-white/20 last:border-0"
                                                        onClick={() => setIsOpen(false)}>
                                                        <Link href={`/${key}/${sub.url}`} rel="canonical"
                                                            className="block py-2.5 px-5 text-title pc:text-white pc:hover:text-title">
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="mt-6 space-y-3 px-5 pc:hidden">
                            <Link href={COMPANY_INFO.phoneHref} className="btn-primary w-full">
                                {COMPANY_INFO.phone} 전화상담
                            </Link>
                        </div>
                    </nav>

                    <button
                        type="button"
                        aria-label="메뉴 열기"
                        onClick={() => setIsOpen(true)}
                        className={`cursor-pointer flex flex-col items-end gap-1.5 pc:hidden ${isScroll ? "" : "invert"}`}>
                        <span className="h-0.5 w-6 bg-title" />
                        <span className="h-0.5 w-4 bg-title" />
                    </button>
                </div>
            </header>

            <div className={`fixed inset-0 bg-black/50 z-30 pc:hidden transition-opacity duration-300
                ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setIsOpen(false)}>
            </div>
        </>
    );
}
