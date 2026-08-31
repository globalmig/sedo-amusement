"use client";
import { useState } from "react";
import Image from "next/image";
import Skeleton from "../common/Skeleton";

interface ProductDetailImagesProps {
  images: string[];
  alt: string;
}

// 상세이미지를 스크롤로 순서대로 확인하는 사용자 페이지용 목록
export default function ProductDetailImages({ images, alt }: ProductDetailImagesProps) {
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());

  const markLoaded = (url: string) => {
    setLoadedUrls((prev) => (prev.has(url) ? prev : new Set(prev).add(url)));
  };

  if (images.length === 0) return null;

  return (
    <div className="mx-auto flex w-full flex-col gap-4 pc:max-w-150">
      {images.map((url, index) => (
        <div key={`${url}-${index}`} className="w-full overflow-hidden rounded-xl bg-base-light">
          {!loadedUrls.has(url) && <Skeleton className="aspect-4/3 w-full m-0! p-0!" />}
          <Image
            src={url}
            alt={`${alt} 상세이미지 ${index + 1}`}
            width={0}
            height={0}
            sizes="(min-width: 1024px) 800px, 100vw"
            className={`h-auto w-full ${loadedUrls.has(url) ? "" : "invisible"}`}
            onLoad={() => markLoaded(url)}
          />
        </div>
      ))}
    </div>
  );
}
