"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "../common/Skeleton";
import { Product } from "@/types/product";
import { getProductCategoryLabel } from "@/datas/categories";

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

  return (
    <Link
      href={`/products/${product.category}/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-4/3 w-full bg-base-light">
        {mainImageUrl ? (
          <>
            {!imageLoaded && <Skeleton className="absolute inset-0 m-0! p-0!" />}
            <Image
              src={mainImageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? "" : "invisible"}`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-base-dark/40">
            이미지 준비중
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-base-dark/80 px-2.5 py-1 text-xs font-medium text-white">
          {getProductCategoryLabel(product.category)}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="line-clamp-1 text-base font-semibold text-title sm:text-lg">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-point">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
