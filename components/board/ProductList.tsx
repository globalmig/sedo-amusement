"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDelete } from "@/hooks/useDelete";
import { useUpdate } from "@/hooks/useUpdate";
import { usePagination } from "@/hooks/usePagination";
import Toast from "../common/Toast";
import Pagination from "../common/Pagination";
import Skeleton from "../common/Skeleton";
import { Product } from "@/types/product";
import { getProductCategoryLabel } from "@/datas/categories";

const ITEMS_PER_PAGE = 12;

function formatPrice(price: number | null) {
  if (price === null) return "가격 문의";
  return `${price.toLocaleString("ko-KR")}원`;
}

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 3.3 14.6 9l6.2.6-4.7 4.1 1.4 6.1L12 16.8l-5.5 3 1.4-6.1-4.7-4.1L9.4 9 12 3.3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ProductListProps {
  products: Product[];
  onReload: () => void;
}

// 관리자 제품 리스트: 테이블형 CRUD 인터페이스
export default function ProductList({ products, onReload }: ProductListProps) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());
  // 서버 재조회 없이 즉시 반영하기 위한 주요 상품 상태의 낙관적 오버라이드
  const [featuredOverride, setFeaturedOverride] = useState<Record<number, boolean>>({});

  const markLoaded = (url: string) => {
    setLoadedUrls((prev) => (prev.has(url) ? prev : new Set(prev).add(url)));
  };

  const { currentPage, currentItems, totalCount, onPageChange } = usePagination(products, ITEMS_PER_PAGE);

  const { remove, loading } = useDelete("/api/product", {
    onSuccess: () => {
      setPendingId(null);
      setCompletedMessage("삭제가 완료되었습니다.");
    },
    onError: (message) => {
      setErrorMsg(message);
      setPendingId(null);
    },
  });

  const { update: updateFeatured } = useUpdate<{ is_featured: boolean }>("/api/product");

  const toggleFeatured = async (product: Product) => {
    const current = featuredOverride[product.id] ?? product.is_featured;
    const next = !current;
    setFeaturedOverride((prev) => ({ ...prev, [product.id]: next }));

    const result = await updateFeatured(`${product.id}/featured`, { is_featured: next });
    if (!result) {
      setFeaturedOverride((prev) => ({ ...prev, [product.id]: current }));
      setErrorMsg("주요 상품 설정에 실패했습니다.");
    }
  };

  // 완료 Toast를 닫을 때 목록을 다시 불러와 삭제된 항목을 화면에 반영
  const closeCompletedToast: React.Dispatch<React.SetStateAction<string | null>> = (value) => {
    setCompletedMessage(value);
    if (value === null) {
      onReload();
    }
  };

  if (products.length === 0) {
    return (
      <div className="card px-5 py-16 text-center text-sm text-muted">
        등록된 제품이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-150 text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-surface text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-5 py-3">번호</th>
              <th className="px-5 py-3">대표이미지</th>
              <th className="px-5 py-3">제품이름</th>
              <th className="px-5 py-3">카테고리</th>
              <th className="px-5 py-3">가격</th>
              <th className="px-5 py-3 text-center">주요상품</th>
              <th className="px-5 py-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, localIndex) => {
              const rowNumber = totalCount - ((currentPage - 1) * ITEMS_PER_PAGE + localIndex);
              const mainImageUrl = product.main_image_url;
              const isFeatured = featuredOverride[product.id] ?? product.is_featured;
              return (
                <tr key={product.id} className="border-b border-black/5 last:border-0 hover:bg-surface/60">
                  <td className="px-5 py-3.5 text-muted">{rowNumber}</td>
                  <td className="px-5 py-3.5">
                    {mainImageUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                        {!loadedUrls.has(mainImageUrl) && (
                          <Skeleton className="absolute inset-0 m-0! p-0!" />
                        )}
                        <Image
                          src={mainImageUrl}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className={`object-cover ${loadedUrls.has(mainImageUrl) ? "" : "invisible"}`}
                          onLoad={() => markLoaded(mainImageUrl)}
                        />
                      </div>
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface text-xs text-muted">
                        없음
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-title">
                    <Link
                      href={`/admin/products/${product.category}/${product.id}/view`}
                      className="text-body hover:text-primary hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-body">{getProductCategoryLabel(product.category)}</td>
                  <td className="px-5 py-3.5 text-body">{formatPrice(product.price)}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(product)}
                      aria-pressed={isFeatured}
                      title={isFeatured ? "주요 상품에서 제외" : "주요 상품으로 등록"}
                      className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                        isFeatured ? "text-primary" : "text-black/20 hover:text-primary"
                      }`}
                    >
                      <StarIcon filled={isFeatured} className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.category}/${product.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        수정
                      </Link>
                      <button
                        type="button"
                        disabled={loading && pendingId === product.id}
                        onClick={() => setPendingId(product.id)}
                        className="text-sm font-medium text-muted hover:text-red-500 cursor-pointer disabled:opacity-50"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination totalCount={totalCount} itemsPerPage={ITEMS_PER_PAGE} onPageChange={onPageChange} />

      <Toast
        vaild={pendingId !== null ? "이 제품을 삭제하시겠습니까?" : null}
        setVaild={() => setPendingId(null)}
        onConfirm={pendingId !== null ? () => remove(pendingId) : undefined}
      />
      <Toast vaild={completedMessage} setVaild={closeCompletedToast} />
      <Toast vaild={errorMsg} setVaild={() => setErrorMsg(null)} />
    </>
  );
}
