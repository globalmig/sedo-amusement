"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "../common/Skeleton";
import { Product } from "@/types/product";
import { getProductCategoryLabel, getProductTypeBadge } from "@/datas/categories";

function formatPrice(price: number | null) {
  if (price === null) return "가격 문의";
  return `${price.toLocaleString("ko-KR")}원`;
}

interface ProductCardProps {
  product: Product;
}
 
export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const mainImageUrl = product.main_image_url;
  const typeBadge = getProductTypeBadge(product.product_type);

  return (
    <Link
      href={`/products/${product.product_type ?? "all"}/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition-shadow duration-300"
    >
      <div className="relative flex aspect-4/3 w-full items-center justify-center bg-white">
        {mainImageUrl ? (
          <>
            {!imageLoaded && <Skeleton className="absolute inset-0 m-0! p-0!" />}
            <Image
              src={mainImageUrl}
              alt={product.name}
              width={200}
              height={200}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className={`h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105 pc:h-58 ${imageLoaded ? "" : "invisible"}`}
              onLoad={() => setImageLoaded(true)}
            /> 
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-base text-base-dark/40 pc:text-[20px]">
            이미지 준비중
          </div>
        )}
        {typeBadge ? (
          <span
            className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-base font-extrabold tracking-wide text-white shadow-md ${typeBadge.className}`}
          >
            {typeBadge.label}
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-base-dark/80 px-2.5 py-1 text-base font-medium text-white">
            {getProductCategoryLabel(product.category)}
          </span>
        )}
      </div>

      <div className="border-t border-black/5 p-4 transition-colors duration-300 group-hover:border-point sm:p-5">
        <h3 className="line-clamp-1 text-base font-semibold text-title transition-colors duration-300 sm:text-lg pc:text-[20px]">
          {product.name}
        </h3>
        <p className="mt-1 text-base font-medium text-point transition-colors duration-300">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
