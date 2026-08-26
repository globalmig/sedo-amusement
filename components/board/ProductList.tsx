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
import { Product, ProductType } from "@/types/product";
import { getProductCategoryLabel, USER_CATEGORY } from "@/datas/categories";

const ITEMS_PER_PAGE = 12;

const PRODUCT_TYPE_OPTIONS = USER_CATEGORY.products.categories ?? [];

function formatPrice(price: number | null) {
  if (price === null) return "가격 문의";
  return `${price.toLocaleString("ko-KR")}원`;
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      className={className}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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
  // 목록에서 즉시 변경한 분류(신제품/히트상품/추천상품) 값을 서버 응답 전까지 미리 반영
  const [productTypeOverride, setProductTypeOverride] = useState<Record<number, ProductType>>({});

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

  // useUpdate hook 호출, baseUrl: /api/product
  const { update: updateProductType } = useUpdate<{ product_type: ProductType }>("/api/product");

  // 분류(신제품/히트상품/추천상품) 변경
  const changeProductType = async (product: Product, next: ProductType) => {
    const current = productTypeOverride[product.id] ?? product.product_type ?? "all";
    if (current === next) return;
    // api 요청 전, 분류를 먼저 바꿈 (UI먼저 변경)
    setProductTypeOverride((prev) => ({ ...prev, [product.id]: next }));

    // /api/product/${product.id}/type 호출, 요청 body: { product_type: next }
    const result = await updateProductType(`${product.id}/type`, { product_type: next });
    // api 호출 실패시 rollback
    if (!result) {
      setProductTypeOverride((prev) => ({ ...prev, [product.id]: current }));
      setErrorMsg("분류 변경에 실패했습니다.");
    }
  };

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
      {/* 모바일: 카드형 리스트 */}
      <div className="space-y-3 pc:hidden">
        {currentItems.map((product, localIndex) => {
          const rowNumber = totalCount - ((currentPage - 1) * ITEMS_PER_PAGE + localIndex);
          const mainImageUrl = product.main_image_url;
          const currentType = productTypeOverride[product.id] ?? product.product_type ?? "all";
          return (
            <div key={product.id} className="card flex gap-3 p-4">
              {mainImageUrl ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  {!loadedUrls.has(mainImageUrl) && (
                    <Skeleton className="absolute inset-0 m-0! p-0!" />
                  )}
                  <Image
                    src={mainImageUrl}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className={`object-cover ${loadedUrls.has(mainImageUrl) ? "" : "invisible"}`}
                    onLoad={() => markLoaded(mainImageUrl)}
                  />
                </div>
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-surface text-xs text-muted">
                  없음
                </span>
              )}

              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/products/${product.category}/${product.id}/view`}
                >
                  <p className="font-medium text-title">{product.name}</p>
                  <p className="mt-1 text-sm text-body">
                    {getProductCategoryLabel(product.category)} · {formatPrice(product.price)}
                  </p>
                </Link>
                <div className="relative mt-2 inline-block">
                  <select
                    value={currentType}
                    onChange={(e) => changeProductType(product, e.target.value as ProductType)}
                    className="appearance-none rounded-lg border border-black/20 bg-white/30 py-1.5 pl-2 pr-8 text-xs text-body outline-none focus:border-primary"
                  >
                    {PRODUCT_TYPE_OPTIONS.map((option) => (
                      <option key={option.url} value={option.url}>{option.name}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PC: 테이블형 리스트 */}
      <div className="hidden card overflow-x-auto pc:block">
        <table className="w-full min-w-150 text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-surface text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-5 py-3">번호</th>
              <th className="px-5 py-3">대표이미지</th>
              <th className="px-5 py-3">제품이름</th>
              <th className="px-5 py-3">카테고리</th>
              <th className="px-5 py-3">가격</th>
              <th className="px-5 py-3 text-center">분류</th>
              <th className="px-5 py-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, localIndex) => {
              const rowNumber = totalCount - ((currentPage - 1) * ITEMS_PER_PAGE + localIndex);
              const mainImageUrl = product.main_image_url;
              const currentType = productTypeOverride[product.id] ?? product.product_type ?? "all";
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
                    <div className="relative inline-block">
                      <select
                        value={currentType}
                        onChange={(e) => changeProductType(product, e.target.value as ProductType)}
                        className="appearance-none rounded-lg border border-black/20 bg-white/30 py-1.5 pl-2 pr-8 text-xs text-body outline-none focus:border-primary"
                      >
                        {PRODUCT_TYPE_OPTIONS.map((option) => (
                          <option key={option.url} value={option.url}>{option.name}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                    </div>
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
