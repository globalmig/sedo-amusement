"use client"
import ProductList from "@/components/board/ProductList";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DemoProduct } from "@/types/demo";
import { ADMIN_CATEGORY } from "@/datas/categories";

export default function AdminProductListPage() {
    const { categories } = useParams<{ categories: string }>();
    const categoryName = ADMIN_CATEGORY.admin.categories?.find((c) => c.url === categories)?.name ?? categories;

    const [products, setProducts] = useState<DemoProduct[]>([]);
    const [loading, setLoading] = useState(true);
    // ProductList에서 삭제 완료 Toast를 닫을 때 이 값을 증가시켜 아래 effect를 재실행(재조회)함
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/product?category=${categories}`);
                const { data } = await res.json();
                setProducts(data ?? []);
            } catch (err) {
                console.error("Fail data load...", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [categories, reloadKey]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-title">
                    <span className="text-primary">{categoryName} </span>
                     제품관리
                </h2>
                <Link href={`/admin/new?category=${categories}`} className="btn-primary">
                    제품 등록
                </Link>
            </div>

            {loading ? (
                <p className="px-5 py-8 text-center text-sm text-muted">정보를 불러오는 중입니다.</p>
            ) : (
                <ProductList
                    key={`${categories}-${reloadKey}`}
                    products={products}
                    onReload={() => setReloadKey((key) => key + 1)}
                />
            )}
        </div>
    )
}
