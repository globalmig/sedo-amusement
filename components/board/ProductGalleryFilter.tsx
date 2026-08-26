"use client";
import { useMemo, useState } from "react";
import { Product } from "@/types/product";
import { PRODUCT_GAME_CATEGORIES } from "@/datas/categories";
import ProductGalley from "./ProductGalley";

interface ProductGalleryFilterProps {
  products: Product[];
  initialCategory?: string | null;
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

export default function ProductGalleryFilter({ products, initialCategory = null }: ProductGalleryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory ? product.category === activeCategory : true;
      const matchesKeyword = keyword ? product.name.toLowerCase().includes(keyword) : true;
      return matchesCategory && matchesKeyword;
    });
  }, [products, activeCategory, searchTerm]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 pc:mb-8 pc:flex-row pc:items-center pc:justify-between">
        <div className="relative shrink-0 pc:w-56">
          <select
            value={activeCategory ?? ""}
            onChange={(e) => setActiveCategory(e.target.value || null)}
            className="w-full cursor-pointer appearance-none rounded-lg border border-black/10 bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-body outline-none focus:border-point"
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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제품명 검색"
            className="w-full rounded-lg border border-black/10 bg-white py-2.5 pl-9 pr-3 text-sm text-body outline-none focus:border-point"
          />
        </div>
      </div>

      <ProductGalley products={filteredProducts} />
    </div>
  );
}
