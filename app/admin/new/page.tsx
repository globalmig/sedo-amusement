import ProductForm from "@/components/form/ProductForm";

interface AdminProductNewPageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function AdminProductNewPage({ searchParams }: AdminProductNewPageProps) {
    const { category } = await searchParams;

    return (
        <div className="space-y-6">
            <h2 className="font-semibold text-title text-2xl">제품 등록</h2>
            <ProductForm lockedCategory={category} />
        </div>
    );
}
