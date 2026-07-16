import { DemoProduct } from "@/types/demo";
import ProductCard from "./ProductCard";

interface ProductGalleyProps {
  products: DemoProduct[];
}

// 사용자 제품 리스트: ProductCard 그리드형 렌더링
export default function ProductGalley({ products }: ProductGalleyProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted">
        등록된 제품이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-between gap-y-4 sm:gap-4 pc:gap-6 pc:justify-start">
      {products.map((product) => (
        <div key={product.id} className="w-[48%] sm:basis-1/3 pc:basis-[calc(25%-1.125rem)]">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
