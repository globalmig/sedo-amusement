import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetail from "@/components/board/ProductDetail";
import PrevNextNavbar2 from "@/components/common/PrevNextNavbar2";
import { USER_CATEGORY, getProductTypeLabel } from "@/datas/categories";
import { getProductById, getProducts, getProductsByType } from "@/lib/products";
import CategoryBanner from "@/components/common/CategoryBanner";

interface ProductDetailPageProps {
  params: Promise<{ categories: string; id: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { categories, id } = await params;
  const product = await getProductById(Number(id));

  if (!product) return {};

  const categoryLabel = getProductTypeLabel(categories) ?? "제품";
  const description =
    product.features?.replace(/\s+/g, " ").trim().slice(0, 120) ??
    `세도어뮤즈먼트가 정품으로 공급하는 ${categoryLabel} 기종, ${product.name}을(를) 확인하세요.`;

  return {
    title: product.name,
    description,
    keywords: [product.name, categoryLabel, "전자오락기", "게임기 유통", "세도어뮤즈먼트"],
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

export default async function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
  const { categories, id } = await params;
  const { category: gameCategoryFilter, q } = await searchParams;
  const category = USER_CATEGORY.products.categories?.find((c) => c.url === categories);
  const product = await getProductById(Number(id));

  if (!category || !product) notFound();

  const sameCategoryProducts =
    categories === "all" ? await getProducts() : await getProductsByType(categories);
  const currentIndex = sameCategoryProducts.findIndex((p) => p.id === product.id);
  const prev = currentIndex > 0 ? sameCategoryProducts[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < sameCategoryProducts.length - 1
      ? sameCategoryProducts[currentIndex + 1]
      : null;

  // 목록에서 적용 중이던 게임 카테고리/검색어 필터를 쿼리스트링으로 그대로 이어받아,
  // "돌아가기"와 이전/다음 이동에서도 필터가 유지되도록 한다.
  const filterQuery = new URLSearchParams();
  if (gameCategoryFilter) filterQuery.set("category", gameCategoryFilter);
  if (q) filterQuery.set("q", q);
  const qs = filterQuery.toString();
  const withFilterQuery = (href: string) => `${href}${qs ? `?${qs}` : ""}`;

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
        <Link href={withFilterQuery(`/products/${categories}`)} className="inline-flex items-center gap-1 text-base text-muted hover:text-primary pc:text-base">
          <ArrowLeftIcon className="h-4 w-4" />
          {category.name} 목록으로 돌아가기
        </Link>

        <div className="mt-15">
          <ProductDetail product={product} />
        </div>

        <div className="mt-20">
          <PrevNextNavbar2
            prevItem={prev ? { href: withFilterQuery(`/products/${categories}/${prev.id}`), title: prev.name } : null}
            nextItem={next ? { href: withFilterQuery(`/products/${categories}/${next.id}`), title: next.name } : null}
            prevLabel="이전 제품"
            nextLabel="다음 제품"
          />
        </div>
      </div>
    </article>
    </>
  );
}
