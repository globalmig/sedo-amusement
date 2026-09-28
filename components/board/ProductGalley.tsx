"use client";
import { Product } from "@/types/product";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import ProductCard from "./ProductCard";
import Loading from "../common/Loading";

const ITEMS_PER_PAGE = 12;

interface ProductGalleyProps {
  products: Product[];
  categories?: string;
  filterQuery?: string;
}

// 사용자 제품 리스트: ProductCard 그리드형 렌더링(무한 스크롤)
export default function ProductGalley({ products, categories = "all", filterQuery = "" }: ProductGalleyProps) {
  const { visibleItems, hasMore, observerTarget } = useInfiniteScroll(products, ITEMS_PER_PAGE);

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-base text-muted pc:text-[20px]">
        등록된 제품이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="sm:flex sm:flex-wrap sm:justify-between sm:gap-4 pc:gap-6 pc:justify-start">
        {visibleItems.map((product) => (
          <div
            key={product.id}
            className="mb-4 last:mb-0 sm:mb-0 sm:w-[48%] pc:w-auto pc:basis-[calc(25%-1.125rem)]"
          >
            <ProductCard product={product} categories={categories} filterQuery={filterQuery} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={observerTarget}>
          <Loading contents="제품을 더 불러오는 중..." />
        </div>
      )}
    </>
  );
}
