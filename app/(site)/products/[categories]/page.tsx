import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryBanner from "@/components/common/CategoryBanner";
import ProductGalleryFilter from "@/components/board/ProductGalleryFilter";
import { USER_CATEGORY } from "@/datas/categories";
import { getProducts, getProductsByType } from "@/lib/products";

interface ProductListPageProps {
  params: Promise<{ categories: string }>;
}

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  all: "세도어뮤즈먼트가 정품으로 공급하는 전체 라인업을 확인하세요.",
  new: "세도어뮤즈먼트가 새롭게 선보이는 최신 라인업입니다.",
  hit: "매장 매출을 견인하는 검증된 인기 기종입니다.",
  recommend: "세도어뮤즈먼트가 자신 있게 추천하는 엄선 기종입니다.",
};

export async function generateMetadata({ params }: ProductListPageProps): Promise<Metadata> {
  const { categories } = await params;
  const category = USER_CATEGORY.products.categories?.find((c) => c.url === categories);

  if (!category) return {};

  const displayTitle = categories === "all" ? "제품소개" : category.name;

  return {
    title: displayTitle,
    description: `세도어뮤즈먼트가 정품으로 공급하는 ${category.name} 라인업을 확인하세요.`,
  };
}

export default async function ProductListPage({ params }: ProductListPageProps) {
  const { categories } = await params;
  const category = USER_CATEGORY.products.categories?.find((c) => c.url === categories);

  if (!category) notFound();

  const displayTitle = categories === "all" ? "제품소개" : category.name;
  const products = categories === "all" ? await getProducts() : await getProductsByType(categories);

  return (
    <>
      <CategoryBanner
        title={displayTitle}
        description={
          CATEGORY_DESCRIPTIONS[category.url] ||
          "세도어뮤즈먼트가 정품으로 공급하는 검증된 기종만 소개합니다."
        }
        tabs={USER_CATEGORY.products.categories}
        basePath="/products"
        activeUrl={categories}
      />
      <article>
        <div className="mx-auto max-w-300 px-[5%] py-12 pc:px-0 pc:py-16">
          <ProductGalleryFilter products={products} />
        </div>
      </article>
    </>
  );
}
