"use client";
import { useState } from "react";
import Image from "next/image";
import Skeleton from "../common/Skeleton";

interface ProductMainImageProps {
  imageUrl: string | null;
  alt: string;
}

// 사용자 페이지에서 보여줄 대표이미지 단독 표시 (탭 전환 없음)
export default function ProductMainImage({ imageUrl, alt }: ProductMainImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-base-light">
      {imageUrl ? (
        <>
          {!loaded && <Skeleton className="absolute inset-0 m-0! p-0!" />}
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`object-cover ${loaded ? "" : "invisible"}`}
            onLoad={() => setLoaded(true)}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-base text-base-dark/40 pc:text-[20px]">
          이미지 준비중
        </div>
      )}
    </div>
  );
}
