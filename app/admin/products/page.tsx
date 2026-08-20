"use client"
import ProductList from "@/components/board/ProductList";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Product } from "@/types/product";
import { USER_CATEGORY } from "@/datas/categories";

const PRODUCT_CATEGORIES = USER_CATEGORY.products.categories ?? [];

function StarIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
            className={className}
        >
            <path
                d="M12 3.3 14.6 9l6.2.6-4.7 4.1 1.4 6.1L12 16.8l-5.5 3 1.4-6.1-4.7-4.1L9.4 9 12 3.3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function AdminProductListPage() {
    // activeCategory: 선택된 카테고리 / null이면 전체 카테고리
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    // searchTerm : 검색어
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFeatured, setActiveFeatured] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    // ProductList에서 삭제 완료 Toast를 닫을 때 이 값을 증가시켜 아래 effect를 재실행(재조회)함
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/product`);
                const { data, error } = await res.json();
                if (!res.ok || error) {
                    console.error("제품 목록 조회 실패:", error ?? res.status);
                }
                setProducts(data ?? []);
            } catch (err) {
                console.error("Fail data load...", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [reloadKey]);

    const onChangeSearchTerm = useCallback((e: any) => {
        setSearchTerm(e.target.value);
    }, []);

    const onClickFilterIsFeatured = () => {
        setActiveFeatured((prev) => !prev);
    };

    // 탭에서 선택한 카테고리와 검색어에 맞게 이미 불러온 전체 목록을 필터링
    const filteredProducts = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        return products.filter((product) => {
            if (activeFeatured) {
                return product.is_featured === true;
            }
            const matchesCategory = activeCategory ? product.category === activeCategory : true;
            const matchesKeyword = keyword ? product.name.toLowerCase().includes(keyword) : true;
            return matchesCategory && matchesKeyword;
        });

    }, [products, activeCategory, searchTerm, activeFeatured]); // 카테고리 변경, 검색어 변경, products 데이터 변동중 하나가 변경되면 연산

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 pc:flex-row pc:items-center pc:justify-between">
                <div className="flex flex-col gap-3 pc:flex-row pc:items-center pc:gap-4">
                    <h2 className="text-xl font-semibold text-title">
                        제품관리
                    </h2>
                    <div className="relative">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                        >
                            <circle cx={11} cy={11} r={7} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={onChangeSearchTerm}
                            placeholder="제품명 검색"
                            className="w-full rounded-lg border border-black/20 bg-white/30 py-2.5 pl-9 pr-3 text-sm text-body outline-none focus:border-primary pc:w-60 pc:py-2"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClickFilterIsFeatured}
                            className={`flex w-[48%] pc:w-fit items-center gap-1.5 rounded-lg px-3 py-2.5 border text-sm ${activeFeatured ? "text-primary border-primary" : "text-body border-black/20"}`}
                        >
                            <StarIcon className="h-5 w-5" /> 주요 제품만 보기 {activeFeatured && "해제"}
                        </button>
                        <button className="btn-primary w-[48%] text-center pc:hidden">
                            <Link
                                href={`/admin/new${activeCategory ? `?category=${activeCategory}` : ""}`}
                            >
                                제품 등록
                            </Link>
                        </button>
                    </div>
                </div>
                <button className="hidden btn-primary w-full text-center pc:block pc:w-auto">
                    <Link
                    href={`/admin/new${activeCategory ? `?category=${activeCategory}` : ""}`}
                    
                >
                    제품 등록
                </Link>
                </button>
            </div>

            <div className="card overflow-x-auto">
                <nav className="flex gap-1 px-2 whitespace-nowrap">
                    <button
                        type="button"
                        onClick={() => setActiveCategory(null)}
                        className={`inline-block cursor-pointer border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeCategory === null
                            ? "border-primary font-semibold text-primary"
                            : "border-transparent text-muted hover:text-title"
                            }`}
                    >
                        전체
                    </button>
                    {PRODUCT_CATEGORIES.map((category) => (
                        <button
                            key={category.url}
                            type="button"
                            onClick={() => setActiveCategory(category.url)}
                            className={`inline-block cursor-pointer border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeCategory === category.url
                                ? "border-primary font-semibold text-primary"
                                : "border-transparent text-muted hover:text-title"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </nav>
            </div>

            {loading ? (
                <p className="px-5 py-8 text-center text-sm text-muted">정보를 불러오는 중입니다.</p>
            ) : (
                <ProductList
                    key={reloadKey}
                    products={filteredProducts}
                    onReload={() => setReloadKey((key) => key + 1)}
                />
            )}
        </div>
    )
}
