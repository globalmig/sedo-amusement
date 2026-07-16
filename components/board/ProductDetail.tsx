import { DemoProduct } from "@/types/demo";
import { COMPANY_INFO } from "@/datas/company";
import { getProductCategoryLabel } from "@/datas/categories";
import Link from "next/link";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfoTable from "./ProductInfoTable";

function formatPrice(price: number | null) {
  if (price === null) return "가격 문의";
  return `${price.toLocaleString("ko-KR")}원`;
}

interface ProductDetailProps {
  product: DemoProduct;
}

// 제품 상세 정보: 이미지 갤러리 + 설명 + 상세 정보 표 + 상담 CTA
export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8 pc:flex-row">
        <div className="pc:basis-1/2">
          <ProductImageGallery
            mainImageUrl={product.main_image_url}
            detailImages={product.detail_images ?? []}
            alt={product.name}
          />
        </div>

        <div className="flex flex-col pc:basis-1/2">
          <span className="w-fit rounded-full bg-point px-3 py-1 text-xs font-medium text-white">
            {getProductCategoryLabel(product.category)}
          </span>
          <h1 className="mt-3 text-2xl font-black text-title pc:text-3xl">{product.name}</h1>
          <p className="mt-2 text-xl font-bold text-point">{formatPrice(product.price)}</p>
          {product.features && (
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-body pc:text-base">
              {product.features}
            </p>
          )}

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <Link href={COMPANY_INFO.phoneHref} className="btn-primary">
              {COMPANY_INFO.phone} 전화 상담
            </Link>
            <Link href={`${COMPANY_INFO.phoneHref}`} className="btn-ghost">
              견적 문의하기
            </Link>
          </div>
        </div>
      </div>

      <ProductInfoTable product={product} />
    </div>
  );
}
