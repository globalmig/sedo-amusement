import type { Metadata } from "next";
import ProductGalleryFilter from "@/components/board/ProductGalleryFilter";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "전체 제품",
  description:
    "크레인/경품, 슈팅, 리듬, 레이싱, 스포츠, 비디오게임 등 세도어뮤즈먼트가 취급하는 전자오락기 전체 라인업을 확인하세요.",
  keywords: ["전자오락기 전체 제품", "크레인게임기", "슈팅게임기", "리듬게임기", "레이싱게임기", "스포츠게임기", "비디오게임기", "게임기 카탈로그"],
};

interface ProductListPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductListPage({ searchParams }: ProductListPageProps) {
  const { category } = await searchParams;
  const products = await getProducts();

  return (
    <article>
      <div className="mx-auto max-w-300 px-[5%] py-12 pc:px-0 pc:py-16">
        {/* 이 페이지엔 CategoryBanner(제목 배너)가 없어 h1이 비어 있었으므로 화면에는 보이지 않는 제목을 추가 */}
        <h1 className="sr-only">전체 제품</h1>
        <ProductGalleryFilter products={products} initialCategory={category ?? null} />
      </div>
    </article>
  );
}
