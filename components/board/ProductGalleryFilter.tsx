"use client";
import { Suspense, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import { PRODUCT_GAME_CATEGORIES } from "@/datas/categories";
import ProductGalley from "./ProductGalley";

interface ProductGalleryFilterProps {
  products: Product[];
  initialCategory?: string | null;
  categories?: string;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      className={className}
    >
      <circle cx={11} cy={11} r={7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

export default function ProductGalleryFilter(props: ProductGalleryFilterProps) {
  return (
    <Suspense>
      <ProductGalleryFilterInner {...props} />
    </Suspense>
  );
}

function ProductGalleryFilterInner({ products, initialCategory = null, categories = "all" }: ProductGalleryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 게임 카테고리(크레인/슈팅 등)와 검색어 필터를 컴포넌트 state가 아닌
  // URL 쿼리스트링에 저장한다. state로만 관리하면 상세페이지로 이동했다가
  // 뒤로가기로 돌아왔을 때 이 컴포넌트가 새로 마운트되며 필터가 초기화된다.
  const activeCategory = searchParams.get("category") ?? initialCategory;
  const searchTerm = searchParams.get("q") ?? "";

  const updateQuery = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory ? product.category === activeCategory : true;
      const matchesKeyword = keyword ? product.name.toLowerCase().includes(keyword) : true;
      return matchesCategory && matchesKeyword;
    });
  }, [products, activeCategory, searchTerm]);

  // 상세페이지로 이동할 때도 현재 필터를 쿼리스트링으로 함께 넘겨서,
  // 상세페이지의 "돌아가기" 링크가 같은 필터로 목록을 복원할 수 있게 한다.
  const filterQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    return params.toString();
  }, [activeCategory, searchTerm]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 pc:mb-8 pc:flex-row pc:items-center">
        <div className="relative shrink-0 pc:w-56">
          <select
            value={activeCategory ?? ""}
            onChange={(e) => updateQuery({ category: e.target.value || null })}
            className="w-full cursor-pointer appearance-none rounded-lg border border-black/10 bg-white py-2.5 pl-4 pr-9 text-base font-medium text-body outline-none focus:border-point"
          >
            <option value="">전체 카테고리</option>
            {PRODUCT_GAME_CATEGORIES.map((category) => (
              <option key={category.url} value={category.url}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </div>

        <div className="relative shrink-0 pc:w-64">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => updateQuery({ q: e.target.value || null })}
            placeholder="제품명 검색"
            className="w-full rounded-lg border border-black/10 bg-white py-2.5 pl-9 pr-3 text-base font-medium text-body outline-none placeholder:text-body focus:border-point"
          />
        </div>
      </div>

      <ProductGalley products={filteredProducts} categories={categories} filterQuery={filterQuery} />
    </div>
  );
}
