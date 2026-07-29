import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Product } from "@/types/product";
import ProductImageGallery from "@/components/board/ProductImageGallery";
import ProductInfoTable from "@/components/board/ProductInfoTable";
import PrevNextNavbar from "@/components/common/PrevNextNavbar";
import { getProducts } from "@/lib/products";

interface AdminProductViewPageProps {
    params: Promise<{ categories: string; id: string }>;
}

export default async function AdminProductViewPage({ params }: AdminProductViewPageProps) {
    const { categories, id } = await params;

    const { data: product } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", id)
        .single<Product>();

    if (!product) notFound();

    const sameCategoryProducts = await getProducts(categories);
    const currentIndex = sameCategoryProducts.findIndex((p) => p.id === product.id);
    const prev = currentIndex > 0 ? sameCategoryProducts[currentIndex - 1] : null;
    const next =
        currentIndex >= 0 && currentIndex < sameCategoryProducts.length - 1
            ? sameCategoryProducts[currentIndex + 1]
            : null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-title">제품 상세보기</h2>
                <Link href={`/admin/${categories}/${id}`} className="btn-primary">
                    수정하기
                </Link>
            </div>
            <div className="pc:max-w-100">
                <ProductImageGallery
                    mainImageUrl={product.main_image_url}
                    detailImages={product.detail_images ?? []}
                    alt={product.name}
                />
            </div>
            <ProductInfoTable product={product} />
            <PrevNextNavbar
                prevItem={prev ? { href: `/admin/${categories}/${prev.id}/view`, title: prev.name } : null}
                nextItem={next ? { href: `/admin/${categories}/${next.id}/view`, title: next.name } : null}
                prevLabel="이전 제품"
                nextLabel="다음 제품"
            />
        </div>
    );
}
