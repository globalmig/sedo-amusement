import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetail from "@/components/board/ProductDetail";
import PrevNextNavbar2 from "@/components/common/PrevNextNavbar2";
import { USER_CATEGORY, getProductCategoryLabel } from "@/datas/categories";
import { getProductById, getProducts } from "@/lib/products";
import CategoryBanner from "@/components/common/CategoryBanner";

interface ProductDetailPageProps {
  params: Promise<{ categories: string; id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { categories, id } = await params;
  const product = await getProductById(Number(id));

  if (!product) return {};

  const categoryLabel = getProductCategoryLabel(categories);
  const description =
    product.features?.replace(/\s+/g, " ").trim().slice(0, 120) ??
    `세도어뮤즈먼트가 정품으로 공급하는 ${categoryLabel} 기종, ${product.name}을(를) 확인하세요.`;

  return {
    title: product.name,
    description,
  };
}

type IconProps = { className?: string };

function ArrowLeftIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { categories, id } = await params;
  const category = USER_CATEGORY.products.categories?.find((c) => c.url === categories);
  const product = await getProductById(Number(id));

  if (!category || !product) notFound();

  const sameCategoryProducts = await getProducts(categories);
  const currentIndex = sameCategoryProducts.findIndex((p) => p.id === product.id);
  const prev = currentIndex > 0 ? sameCategoryProducts[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < sameCategoryProducts.length - 1
      ? sameCategoryProducts[currentIndex + 1]
      : null;

  return (
    <>
     <CategoryBanner
            title={product.name}
            tabs={USER_CATEGORY.products.categories}
            basePath="/products"
            activeUrl={categories}
          />
    <article>
      <div className="mx-auto max-w-300 px-[5%] py-12 pc:px-0 pc:py-16">
        <Link href={`/products/${categories}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
          <ArrowLeftIcon className="h-4 w-4" />
          {category.name} 목록으로
        </Link>

        <div className="mt-6">
          <ProductDetail product={product} />
        </div>

        <div className="mt-20">
          <PrevNextNavbar2
            prevItem={prev ? { href: `/products/${categories}/${prev.id}`, title: prev.name } : null}
            nextItem={next ? { href: `/products/${categories}/${next.id}`, title: next.name } : null}
            prevLabel="이전 제품"
            nextLabel="다음 제품"
          />
        </div>
      </div>
    </article>
    </>
  );
}
