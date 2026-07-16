import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetail from "@/components/board/ProductDetail";
import PrevNextNavbar2 from "@/components/common/PrevNextNavbar2";
import { USER_CATEGORY } from "@/datas/categories";
import { getProductById, getProducts } from "@/lib/products";
import CategoryBanner from "@/components/common/CategoryBanner";

interface ProductDetailPageProps {
  params: Promise<{ categories: string; id: string }>;
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
        <Link href={`/products/${categories}`} className="text-sm text-muted hover:text-primary">
          &lt; {category.name} 목록으로
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
