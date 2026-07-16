"use client";
import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  mainImageUrl: string | null;
  detailImages: string[];
  alt: string;
}

// 대표이미지 + 상세이미지를 탭처럼 클릭해 큰 이미지를 바꿔 보여주는 갤러리
export default function ProductImageGallery({ mainImageUrl, detailImages, alt }: ProductImageGalleryProps) {
  const images = [mainImageUrl, ...detailImages].filter((url): url is string => !!url);
  const [selected, setSelected] = useState<string | null>(images[0] ?? null);

  return (
    <div>
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-base-light">
        {selected ? (
          <Image
            src={selected}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-base-dark/40">
            이미지 준비중
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setSelected(url)}
              aria-label={`${index + 1}번째 이미지 보기`}
              aria-current={selected === url}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors cursor-pointer ${
                selected === url ? "border-primary" : "border-transparent hover:border-black/10"
              }`}
            >
              <Image src={url} alt={`${alt} 썸네일 ${index + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
