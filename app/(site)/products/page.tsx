import type { Metadata } from "next";
import ProductGalley from "@/components/board/ProductGalley";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "전체 제품",
  description:
    "크레인/경품, 슈팅, 리듬, 레이싱, 스포츠, 비디오게임 등 세도어뮤즈먼트가 취급하는 전자오락기 전체 라인업을 확인하세요.",
};

export default async function ProductListPage() {
  const products = await getProducts();

  return (
    <article>
      <div className="mx-auto max-w-300 px-[5%] py-12 pc:px-0 pc:py-16">
        <ProductGalley products={products} />
      </div>
    </article>
  );
}
