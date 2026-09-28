import { Product } from "@/types/product";
import { COMPANY_INFO } from "@/datas/company";
import { getProductCategoryLabel } from "@/datas/categories";
import Link from "next/link";
import ProductMainImage from "./ProductMainImage";
import ProductDetailImages from "./ProductDetailImages";
import ProductInfoTable from "./ProductInfoTable";
import ProductShippingInfo from "./ProductShippingInfo";

function formatPrice(price: number | null) {
  if (price === null) return "가격 문의";
  return `${price.toLocaleString("ko-KR")}원`;
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8 pc:flex-row">
        <div className="pc:basis-1/2">
          <ProductMainImage imageUrl={product.main_image_url} alt={product.name} />
        </div>

        <div className="flex flex-col pc:basis-1/2">
          <span className="w-fit rounded-full bg-base-dark/80 px-3 py-1 text-base font-medium text-white">
            {getProductCategoryLabel(product.category)}
          </span>
          <h2 className="mt-3 text-2xl font-black text-title pc:text-3xl">{product.name}</h2>
          <p className="mt-2 text-xl font-bold text-point">{formatPrice(product.price)}</p>
          {product.features && (
            <p className="mt-4 whitespace-pre-line text-base leading-7 text-body pc:text-[20px]">
              {product.features}
            </p>
          )}

          <div className="bg-white mt-10 overflow-hidden border-y border-black/10">
            <table className="w-full text-base pc:text-[20px]">
              <tbody className="divide-y divide-black/5">
                <tr>
                  <th scope="row" className="w-28 shrink-0 bg-surface px-6 py-4 pc:py-6 text-left font-medium text-title pc:w-40">
                    규격 (사이즈)
                  </th>
                  <td className="whitespace-pre-line px-6 py-4 pc:py-6 text-body">{product.spec || "-"}</td>
                </tr>
                <tr>
                  <th scope="row" className="w-28 shrink-0 bg-surface px-6 py-4 pc:py-6 text-left font-medium text-title pc:w-40">
                    등급분류번호
                  </th>
                  <td className="px-6 py-4 pc:py-6 text-body">{product.rating_number || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 pt-6 pc:mt-8">
            <Link href={COMPANY_INFO.phoneHref} className="btn-primary pc:text-[20px] pc:px-8 rounded-full">
              제품 문의하기
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="card px-6 py-4 pc:py-6 text-base font-bold text-title mt-20 pc:text-2xl">
          제품 상세 이미지
        </h2>
        <ProductDetailImages images={product.detail_images ?? []} alt={product.name} />
      </div>

      <ProductInfoTable product={product} />
      <ProductShippingInfo />
    </div>
  );
}
