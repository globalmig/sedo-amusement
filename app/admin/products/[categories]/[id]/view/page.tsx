import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Product } from "@/types/product";
import ProductImageGallery from "@/components/board/ProductImageGallery";
import ProductInfoTable from "@/components/board/ProductInfoTable";
import DeleteProductButton from "@/components/board/DeleteProductButton";
import PrevNextNavbar from "@/components/common/PrevNextNavbar";
import { getAdminProducts } from "@/lib/products";
import { filterAdminProducts } from "@/lib/adminProductFilter";

interface AdminProductViewPageProps {
    params: Promise<{ categories: string; id: string }>;
    searchParams: Promise<{ filterCategory?: string; filterType?: string; q?: string; page?: string }>;
}

export default async function AdminProductViewPage({ params, searchParams }: AdminProductViewPageProps) {
    const { categories, id } = await params;
    const { filterCategory, filterType, q, page } = await searchParams;

    const { data: product } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", id)
        .single<Product>();

    if (!product) notFound();

    // 제품관리 목록에서 적용 중이던 필터(카테고리/분류/검색어)를 그대로 재현해 이전/다음을 계산
    // -> 목록에서 보던 순서와 상세페이지 탐색 순서가 항상 일치함
    const allProducts = await getAdminProducts();
    const filteredProducts = filterAdminProducts(allProducts, {
        category: filterCategory ?? null,
        productType: filterType ?? null,
        keyword: q ?? null,
    });
    const currentIndex = filteredProducts.findIndex((p) => p.id === product.id);
    const prev = currentIndex > 0 ? filteredProducts[currentIndex - 1] : null;
    const next =
        currentIndex >= 0 && currentIndex < filteredProducts.length - 1
            ? filteredProducts[currentIndex + 1]
            : null;

    const filterQuery = new URLSearchParams();
    if (filterCategory) filterQuery.set("filterCategory", filterCategory);
    if (filterType) filterQuery.set("filterType", filterType);
    if (q) filterQuery.set("q", q);
    if (page) filterQuery.set("page", page);
    const qs = filterQuery.toString();
    const withFilterQuery = (href: string) => `${href}${qs ? `?${qs}` : ""}`;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-title">제품 상세보기</h2>
                <Link href={withFilterQuery("/admin/products")} className="btn-primary hidden pc:inline-flex">
                    뒤로가기
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
            <div className="flex gap-3">
                <Link href={`/admin/products/${categories}/${id}`} className="btn-primary pc:text-[20px]">
                    수정하기
                </Link>
                <Link href={withFilterQuery("/admin/products")} className="btn-ghost bg-muted pc:hidden">
                    뒤로가기
                </Link>
                <DeleteProductButton productId={product.id} className="pc:text-[20px]" />
            </div>
            <PrevNextNavbar
                prevItem={prev ? { href: withFilterQuery(`/admin/products/${prev.category}/${prev.id}/view`), title: prev.name } : null}
                nextItem={next ? { href: withFilterQuery(`/admin/products/${next.category}/${next.id}/view`), title: next.name } : null}
                prevLabel="이전 제품"
                nextLabel="다음 제품"
            />
        </div>
    );
}
