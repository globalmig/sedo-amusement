"use client"
import ProductList from "@/components/board/ProductList";
import Link from "next/link";
import { Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import { PRODUCT_GAME_CATEGORIES, USER_CATEGORY } from "@/datas/categories";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { filterAdminProducts } from "@/lib/adminProductFilter";

const PRODUCT_CATEGORIES = PRODUCT_GAME_CATEGORIES;
const PRODUCT_TYPE_OPTIONS = USER_CATEGORY.products.categories ?? [];

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
            className={className}
        >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function AdminProductListPage() {
    return (
        <Suspense>
            <AdminProductListPageInner />
        </Suspense>
    );
}

function AdminProductListPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

    // 필터(카테고리/분류/검색어)는 컴포넌트 state가 아닌 URL 쿼리스트링에 저장한다.
    // state로만 관리하면 상세페이지로 이동했다가 뒤로가기로 돌아왔을 때
    // 이 페이지가 새로 마운트되면서 필터가 초기화되어 버린다.
    const activeCategory = searchParams.get("filterCategory");
    const activeProductType = searchParams.get("filterType");
    const searchTerm = searchParams.get("q") ?? "";

    // 제품 불러오기
    const { data: products = [], isLoading: loading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch(`/api/product`);
            const { data, error } = await res.json();
            if (!res.ok || error) {
                console.error("제품 목록 조회 실패:", error ?? res.status);
            }
            return (data ?? []) as Product[];
        },
    });

    const updateQuery = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        // 필터가 바뀌면 목록 구성이 달라지므로 페이지네이션은 1페이지로 되돌린다.
        params.delete("page");
        const qs = params.toString();
        router.replace(qs ? `/admin/products?${qs}` : "/admin/products", { scroll: false });
    }, [router, searchParams]);

    const onChangeSearchTerm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateQuery({ q: e.target.value || null });
    }, [updateQuery]);

    const onChangeProductTypeFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        updateQuery({ filterType: e.target.value || null });
    }, [updateQuery]);

    const onSelectCategory = useCallback((category: string | null) => {
        updateQuery({ filterCategory: category });
    }, [updateQuery]);

    const filteredProducts = useMemo(
        () => filterAdminProducts(products, { category: activeCategory, productType: activeProductType, keyword: searchTerm }),
        [products, activeCategory, activeProductType, searchTerm]
    );

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
                            className="w-full rounded-lg border border-black/20 bg-white/30 py-2.5 pl-9 pr-3 text-base text-body outline-none focus:border-primary pc:w-60 pc:py-2"
                        />
                    </div>
                    <div className="flex justify-between gap-2">
                        <div className="relative w-[48%] pc:w-fit">
                            <select
                                value={activeProductType ?? ""}
                                onChange={onChangeProductTypeFilter}
                                className="w-full appearance-none rounded-lg border border-black/20 bg-white/30 py-2.5 pc:py-2 pl-3 pr-9 text-base text-body outline-none focus:border-primary"
                            >
                                <option value="">모든 분류 보기</option>
                                {PRODUCT_TYPE_OPTIONS.map((option) => (
                                    <option key={option.url} value={option.url}>{option.name}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        </div>
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
                        onClick={() => onSelectCategory(null)}
                        className={`inline-block cursor-pointer border-b-2 px-4 py-3 text-base font-medium transition-colors ${activeCategory === null
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
                            onClick={() => onSelectCategory(category.url)}
                            className={`inline-block cursor-pointer border-b-2 px-4 py-3 text-base font-medium transition-colors ${activeCategory === category.url
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
                <p className="px-5 py-8 text-center text-base text-muted">정보를 불러오는 중입니다.</p>
            ) : (
                <ProductList
                    products={filteredProducts}
                    onReload={() => queryClient.invalidateQueries({ queryKey: ["products"] })}
                    activeCategory={activeCategory}
                    activeProductType={activeProductType}
                    searchTerm={searchTerm}
                />
            )}
        </div>
    )
}
