"use client";
import { Product } from "@/types/product";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import ProductCard from "./ProductCard";
import Loading from "../common/Loading";

const ITEMS_PER_PAGE = 12;

interface ProductGalleyProps {
  products: Product[];
}

// 사용자 제품 리스트: ProductCard 그리드형 렌더링(무한 스크롤)
export default function ProductGalley({ products }: ProductGalleyProps) {
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
      <div className="flex flex-wrap justify-between gap-y-4 sm:gap-4 pc:gap-6 pc:justify-start">
        {visibleItems.map((product) => (
          <div key={product.id} className="w-[48%] sm:basis-1/3 pc:basis-[calc(25%-1.125rem)]">
            <ProductCard product={product} />
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
