import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryBanner from "@/components/common/CategoryBanner";
import ProductGalley from "@/components/board/ProductGalley";
import { USER_CATEGORY } from "@/datas/categories";
import { getProducts } from "@/lib/products";

interface ProductListPageProps {
  params: Promise<{ categories: string }>;
}

export async function generateMetadata({ params }: ProductListPageProps): Promise<Metadata> {
  const { categories } = await params;
  const category = USER_CATEGORY.products.categories?.find((c) => c.url === categories);

  if (!category) return {};

  return {
    title: category.name,
    description: `세도어뮤즈먼트가 정품으로 공급하는 ${category.name} 라인업을 확인하세요. 합리적인 가격과 전국 A/S를 함께 제공합니다.`,
  };
}

export default async function ProductListPage({ params }: ProductListPageProps) {
  const { categories } = await params;
  const category = USER_CATEGORY.products.categories?.find((c) => c.url === categories);

  if (!category) notFound();

  const products = await getProducts(categories);

  return (
    <>
     <CategoryBanner
        title={category.name}
        description="세도어뮤즈먼트가 정품으로 공급하는 검증된 기종만 소개합니다."
        tabs={USER_CATEGORY.products.categories}
        basePath="/products"
        activeUrl={categories}
      />
    <article>
      <div className="mx-auto max-w-300 px-[5%] py-12 pc:px-0 pc:py-16">
        <ProductGalley products={products} />
      </div>
    </article>
    </>
  );
}
