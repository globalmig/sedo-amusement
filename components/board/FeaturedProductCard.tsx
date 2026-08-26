"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "../common/Skeleton";
import { Product } from "@/types/product";
import { getProductCategoryLabel, getProductTypeBadge } from "@/datas/categories";

interface FeaturedProductCardProps {
  product: Product;
}

// 홈페이지 대표 제품 슬라이더 전용 카드: 뱃지 + 이미지 + 제품명만 노출 (가격 미표시)
export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const mainImageUrl = product.main_image_url;
  const typeBadge = getProductTypeBadge(product.product_type);

  return (
    <Link
      href={`/products/${product.product_type ?? "all"}/${product.id}`}
      className="group block overflow-hidden rounded-[15px] bg-white shadow-[0px_2px_6px_0px_rgba(85,85,85,0.25)] transition-shadow duration-300 hover:shadow-[0_10px_30px_-8px_rgba(255,140,0,0.45)] pc:rounded-[30px]"
    >
      <div className="relative aspect-square w-full bg-white">
        {mainImageUrl ? (
          <>
            {!imageLoaded && <Skeleton className="absolute inset-0 m-0! p-0!" />}
            <Image
              src={mainImageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className={`object-contain p-4 transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? "" : "invisible"}`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-base-dark/40">
            이미지 준비중
          </div>
        )}
        {typeBadge ? (
          <span
            className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-extrabold tracking-wide text-white shadow-md ${typeBadge.className}`}
          >
            {typeBadge.label}
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-md bg-black/5 px-2.5 py-1 text-xs font-medium text-title/70">
            {getProductCategoryLabel(product.category)}
          </span>
        )}
      </div>

      <div className="border-t border-black/5 px-4 py-3.5">
        <h3 className="line-clamp-1 text-sm font-bold text-title sm:text-base">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}
