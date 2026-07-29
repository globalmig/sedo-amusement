import { notFound } from "next/navigation";
import ProductForm from "@/components/form/ProductForm";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Product } from "@/types/product";

interface AdminProductDetailPageProps {
    params: Promise<{ categories: string; id: string }>;
}

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
    const { id } = await params;

    const { data: product } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", id)
        .single<Product>();

    if (!product) notFound();

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-title">제품 수정</h2>
            <ProductForm editId={product.id} initialData={product} />
        </div>
    );
}
