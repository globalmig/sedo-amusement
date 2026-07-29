"use client";
import { Product } from "@/types/product";
import { usePagination } from "@/hooks/usePagination";
import ProductCard from "./ProductCard";
import Pagination from "../common/Pagination";

const ITEMS_PER_PAGE = 8;

interface ProductGalleyProps {
  products: Product[];
}

// 사용자 제품 리스트: ProductCard 그리드형 렌더링
export default function ProductGalley({ products }: ProductGalleyProps) {
  const { currentItems, totalCount, onPageChange } = usePagination(products, ITEMS_PER_PAGE);

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted">
        등록된 제품이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-between gap-y-4 sm:gap-4 pc:gap-6 pc:justify-start">
        {currentItems.map((product) => (
          <div key={product.id} className="w-[48%] sm:basis-1/3 pc:basis-[calc(25%-1.125rem)]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <Pagination totalCount={totalCount} itemsPerPage={ITEMS_PER_PAGE} onPageChange={onPageChange} />
    </>
  );
}
