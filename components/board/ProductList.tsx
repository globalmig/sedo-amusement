"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePagination } from "@/hooks/usePagination";
import Toast from "../common/Toast";
import Pagination from "../common/Pagination";
import Skeleton from "../common/Skeleton";
import { Product, ProductType } from "@/types/product";
import { USER_CATEGORY } from "@/datas/categories";
import { ArrowUpIcon, ArrowDownIcon } from "../common/AdminIcons";

const ITEMS_PER_PAGE = 12;
// 카테고리(크레인/슈팅 등) 필터일 때는 카테고리 안 순서(display_order), 분류(신제품/히트/추천) 필터일 때는 그 분류 안 순서(type_order)를 바꾼다.
// 둘 다 걸려 있거나 검색 중이면 어느 기준으로 바꿔야 할지 알 수 없어 순서 변경을 막는다 (null).
export type OrderColumn = "display_order" | "type_order" | null;

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

function GripIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <circle cx={9} cy={6} r={1.5} />
      <circle cx={9} cy={12} r={1.5} />
      <circle cx={9} cy={18} r={1.5} />
      <circle cx={15} cy={6} r={1.5} />
      <circle cx={15} cy={12} r={1.5} />
      <circle cx={15} cy={18} r={1.5} />
    </svg>
  );
}

interface ProductListProps {
  products: Product[];
  onReload: () => void;
  activeCategory: string | null;
  activeProductType: string | null;
  searchTerm: string;
  // 카테고리 필터만/분류 필터만/둘 다 없음 중 하나일 때만 순서를 바꿀 수 있다 (OrderColumn 타입 주석 참고).
  orderColumn: OrderColumn;
}

interface ProductRowProps {
  product: Product;
  rowNumber: number;
  mainImageUrl: string | null;
  loadedUrls: Set<string>;
  markLoaded: (url: string) => void;
  currentType: ProductType;
  onChangeType: (product: Product, next: ProductType) => void;
  buildViewHref: (product: Product) => string;
  onDelete: (id: number) => void;
  loading: boolean;
  pendingId: number | null;
  canDrag: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

// PC 테이블의 한 행. 드래그 핸들(useSortable)을 행 단위로 붙이기 위해 별도 컴포넌트로 분리.
function SortableProductRow({
  product,
  rowNumber,
  mainImageUrl,
  loadedUrls,
  markLoaded,
  currentType,
  onChangeType,
  buildViewHref,
  onDelete,
  loading,
  pendingId,
  canDrag,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: ProductRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="relative border-b border-black/5 last:border-0 hover:bg-surface/60"
    >
      <td className="px-3 py-3.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={!canDrag}
          className={`flex items-center justify-center rounded p-1 text-muted ${canDrag ? "cursor-grab touch-none hover:text-title active:cursor-grabbing" : "cursor-not-allowed opacity-30"}`}
          aria-label="드래그로 순서 변경"
          title={canDrag ? "드래그해서 순서를 바꿀 수 있어요" : "필터를 해제하면 순서를 바꿀 수 있어요"}
        >
          <GripIcon className="h-4 w-4" />
        </button>
      </td>
      <td className="px-5 py-3.5 text-muted">
        <div className="flex items-center gap-2">
          <span>{rowNumber}</span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="rounded border border-black p-1 text-title hover:text-primary disabled:opacity-50"
              aria-label="위로 이동"
              title="위로 이동"
            >
              <ArrowUpIcon className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="rounded border border-black p-1 text-title hover:text-primary disabled:opacity-50"
              aria-label="아래로 이동"
              title="아래로 이동"
            >
              <ArrowDownIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      </td>
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
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface text-base text-muted">
            없음
          </span>
        )}
      </td>
      <td className="px-5 py-3.5 font-medium text-title">
        <Link
          href={buildViewHref(product)}
          className="text-body hover:text-primary hover:underline"
        >
          {product.name}
        </Link>
      </td>
      <td className="px-5 py-3.5 font-medium text-body">{product.category_name}</td>
      <td className="px-5 py-3.5 text-body">{formatPrice(product.price)}</td>
      <td className="px-5 py-3.5 text-center">
        <div className="relative inline-block">
          <select
            value={currentType}
            onChange={(e) => onChangeType(product, e.target.value as ProductType)}
            className="appearance-none rounded-lg border border-black/20 bg-white/30 py-1.5 pl-2 pr-8 text-base text-body outline-none focus:border-primary"
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
            className="text-base font-medium text-primary hover:underline"
          >
            수정
          </Link>
          <button
            type="button"
            disabled={loading && pendingId === product.id}
            onClick={() => onDelete(product.id)}
            className="text-base font-medium text-muted hover:text-red-500 cursor-pointer disabled:opacity-50"
          >
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
}

// 관리자 제품 리스트: 테이블형 CRUD 인터페이스
export default function ProductList({ products, onReload, activeCategory, activeProductType, searchTerm, orderColumn }: ProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 페이지 번호도 URL 쿼리스트링(page)에 저장한다.
  // usePagination의 currentPage를 컴포넌트 state로만 관리하면, 상세페이지로 이동했다가
  // 뒤로가기로 돌아왔을 때 이 컴포넌트가 새로 마운트되며 항상 1페이지로 되돌아간다.
  const initialPage = Number(searchParams.get("page")) || 1;

  // 목록에서 적용 중인 필터+페이지를 상세페이지의 이전/다음 탐색 기준, "뒤로가기" 복원용으로 그대로 전달하기 위한 쿼리스트링
  const buildViewHref = (product: Product) => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("filterCategory", activeCategory);
    if (activeProductType) params.set("filterType", activeProductType);
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (initialPage > 1) params.set("page", String(initialPage));
    const qs = params.toString();
    return `/admin/products/${product.category}/${product.id}/view${qs ? `?${qs}` : ""}`;
  };

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `/admin/products?${qs}` : "/admin/products", { scroll: false });
  }, [router, searchParams]);

  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());

  // productTypeOverride
  // 목록에서 즉시 변경한 분류(신제품/히트상품/추천상품) 값을 서버 응답 전까지 미리 반영
  // 아직 API에 요청이 도착하지 않았어도 사용자 화면에는 즉시 새값을 보여주기 위한 임시 메모 (화면엔 일단 보여줘.)
  // -> 실제 데이터 (products 배열) 에는 아직 바뀌지 않은 상태
  // 관리자 화면에 벗어나면 임시 메모는 사라짐 (빈 객체)
  const [productTypeOverride, setProductTypeOverride] = useState<Record<number, ProductType>>({});

  const markLoaded = (url: string) => {
    setLoadedUrls((prev) => (prev.has(url) ? prev : new Set(prev).add(url)));
  };

  const { currentPage, currentItems, totalCount, onPageChange } = usePagination(products, ITEMS_PER_PAGE, {
    initialPage,
    onPageChange: handlePageChange,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/product/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "삭제에 실패했습니다.");
      }
      return true;
    },
    onSuccess: () => {
      setPendingId(null);
      setCompletedMessage("삭제가 완료되었습니다.");
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || "서버 내부 오류가 발생했습니다.");
      setPendingId(null);
    },
  });
  const loading = deleteMutation.isPending;

  const updateProductTypeMutation = useMutation({
    mutationFn: async ({ id, product_type }: { id: number; product_type: ProductType }) => {
      const response = await fetch(`/api/product/${id}/type`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_type }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "수정에 실패했습니다.");
      return result;
    },
    // onSuccess
    // productTypeOverride 로 화면 부터 바꾸고, 서버 저장에 성공하면 ["products"] 캐시도 낡았다고 표시
    // -> 이 페이지에 나갔다 다시 들어와도 productTypeOverride가 초기화되는 순간엔
    // 이미 캐시가 최신상태라 예전값이 잠깐 보이는 문제가 사라짐
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // 분류(신제품/히트상품/추천상품) 변경
  const changeProductType = async (product: Product, next: ProductType) => {
    const current = productTypeOverride[product.id] ?? product.product_type ?? "all";
    if (current === next) return;
    // api 요청 전, 분류를 먼저 바꿈 (UI먼저 변경)
    setProductTypeOverride((prev) => ({ ...prev, [product.id]: next }));

    try {
      await updateProductTypeMutation.mutateAsync({ id: product.id, product_type: next });
    } catch {
      // api 호출 실패시 rollback
      setProductTypeOverride((prev) => ({ ...prev, [product.id]: current }));
      setErrorMsg("분류 변경에 실패했습니다.");
    }
  };

  // 드래그로 바뀐 순서를 저장. order는 지금 화면에 보이는(필터가 걸려 있다면 그 필터 기준) 목록 전체의 id 목록.
  const reorderMutation = useMutation({
    mutationFn: async ({ order, column }: { order: number[]; column: "display_order" | "type_order" }) => {
      const response = await fetch("/api/product/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, column }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "순서 변경에 실패했습니다.");
      return result;
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || "순서 변경에 실패했습니다.");
      // 저장에 실패했으므로 화면에 미리 반영했던 순서를 서버 상태로 되돌림
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // products는 지금 화면에 보이는(필터가 걸려 있다면 그 필터 기준) 목록이다. 드래그로 그 안의 순서만 다시 매긴다.
  // react-query 캐시(["products"]) 자체는 필터 없는 전체 목록이므로, 통째로 교체하지 않고
  // 이번에 움직인 id들의 orderColumn 값만 patch해서 필터에 없던 나머지 제품이 캐시에서 사라지지 않게 한다.
  const handleDragEnd = (event: DragEndEvent) => {
    if (!orderColumn) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const pageOffset = (currentPage - 1) * ITEMS_PER_PAGE;
    const oldLocalIndex = currentItems.findIndex((product) => product.id === active.id);
    const newLocalIndex = currentItems.findIndex((product) => product.id === over.id);
    if (oldLocalIndex === -1 || newLocalIndex === -1) return;

    const reorderedVisible = arrayMove(products, pageOffset + oldLocalIndex, pageOffset + newLocalIndex);
    const newOrderById = new Map(reorderedVisible.map((product, i) => [product.id, i + 1]));

    // 드래그 결과를 바로 화면에 반영 (서버 응답을 기다리지 않음)
    queryClient.setQueryData<Product[]>(["products"], (old) => {
      if (!old) return old;
      return old
        .map((product) =>
          newOrderById.has(product.id) ? { ...product, [orderColumn]: newOrderById.get(product.id)! } : product
        )
        .sort((a, b) => (a[orderColumn] ?? 0) - (b[orderColumn] ?? 0));
    });
    reorderMutation.mutate({ order: reorderedVisible.map((product) => product.id), column: orderColumn });
  };

  // 위/아래 버튼으로 지금 보이는 목록에서 바로 이웃한 두 제품의 순서(orderColumn)만 맞바꾼다.
  // products는 필터가 걸려 있어도(검색/카테고리/분류) 화면에 보이는 순서 그대로이므로,
  // 필터 상태와 무관하게 "지금 보이는 목록에서 이웃한 항목"과 바로 순서를 바꿀 수 있다.
  const moveMutation = useMutation({
    mutationFn: async ({
      current,
      neighbor,
      column,
    }: { current: Product; neighbor: Product; column: "display_order" | "type_order" }) => {
      const responses = await Promise.all([
        fetch(`/api/product/${current.id}/order`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ column, value: neighbor[column] }),
        }),
        fetch(`/api/product/${neighbor.id}/order`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ column, value: current[column] }),
        }),
      ]);
      if (responses.some((response) => !response.ok)) throw new Error("순서 변경에 실패했습니다.");
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || "순서 변경에 실패했습니다.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const moveProduct = (current: Product, direction: "up" | "down") => {
    if (!orderColumn) return;
    const index = products.findIndex((product) => product.id === current.id);
    const neighborIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || neighborIndex < 0 || neighborIndex >= products.length) return;
    const neighbor = products[neighborIndex];
    if (current[orderColumn] == null || neighbor[orderColumn] == null) return;

    // 전체 제품 캐시에서 이 두 제품의 순서값만 맞바꿔 화면에 바로 반영 (서버 응답을 기다리지 않음)
    queryClient.setQueryData<Product[]>(["products"], (old) => {
      if (!old) return old;
      return old
        .map((product) => {
          if (product.id === current.id) return { ...product, [orderColumn]: neighbor[orderColumn] };
          if (product.id === neighbor.id) return { ...product, [orderColumn]: current[orderColumn] };
          return product;
        })
        .sort((a, b) => (a[orderColumn] ?? 0) - (b[orderColumn] ?? 0));
    });

    moveMutation.mutate({ current, neighbor, column: orderColumn });
  };

  const closeCompletedToast: React.Dispatch<React.SetStateAction<string | null>> = (value) => {
    setCompletedMessage(value);
    if (value === null) {
      onReload();
    }
  };

  if (products.length === 0) {
    return (
      <div className="card px-5 py-16 text-center text-base text-muted">
        등록된 제품이 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* 모바일: 카드형 리스트 */}
      <div className="space-y-3 pc:hidden">
        {currentItems.map((product, localIndex) => {
          const mainImageUrl = product.main_image_url;
          const currentType = productTypeOverride[product.id] ?? product.product_type ?? "all";
          const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + localIndex;
          return (
            <div key={product.id} className="card flex gap-3 p-4">
              <div className="flex shrink-0 flex-col items-center justify-center gap-1 text-muted">
                <span className="text-base">{globalIndex + 1}</span>
                <button
                  type="button"
                  onClick={() => moveProduct(product, "up")}
                  disabled={!orderColumn || globalIndex === 0}
                  className="rounded border border-black p-1 text-title hover:text-primary disabled:opacity-50"
                  aria-label="위로 이동"
                >
                  <ArrowUpIcon className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveProduct(product, "down")}
                  disabled={!orderColumn || globalIndex === products.length - 1}
                  className="rounded border border-black p-1 text-title hover:text-primary disabled:opacity-50"
                  aria-label="아래로 이동"
                >
                  <ArrowDownIcon className="h-3 w-3" />
                </button>
              </div>
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
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-surface text-base text-muted">
                  없음
                </span>
              )}

              <div className="min-w-0 flex-1">
                <Link
                  href={buildViewHref(product)}
                >
                  <p className="font-medium text-title">{product.name}</p>
                  <p className="mt-1 text-base text-body">
                    {product.category_name} · {formatPrice(product.price)}
                  </p>
                </Link>
                <div className="relative mt-2 inline-block">
                  <select
                    value={currentType}
                    onChange={(e) => changeProductType(product, e.target.value as ProductType)}
                    className="appearance-none rounded-lg border border-black/20 bg-white/30 py-1.5 pl-2 pr-8 text-base text-body outline-none focus:border-primary"
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
        {!orderColumn && (
          <p className="border-b border-black/5 px-5 py-2.5 text-base text-muted">
            카테고리와 분류를 동시에 선택했거나 검색 중일 때는 순서를 바꿀 수 없어요. 카테고리별 순서를 바꾸려면 카테고리만,
            분류(신제품/히트/추천)별 순서를 바꾸려면 분류만 선택해주세요.
          </p>
        )}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full min-w-150 text-base">
            <thead>
              <tr className="border-b border-black/5 bg-surface text-left text-base font-semibold uppercase tracking-wider text-muted">
                <th className="px-3 py-3"></th>
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
              <SortableContext items={currentItems.map((product) => product.id)} strategy={verticalListSortingStrategy}>
                {currentItems.map((product, localIndex) => {
                  const mainImageUrl = product.main_image_url;
                  const currentType = productTypeOverride[product.id] ?? product.product_type ?? "all";
                  const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + localIndex;
                  return (
                    <SortableProductRow
                      key={product.id}
                      product={product}
                      rowNumber={globalIndex + 1}
                      mainImageUrl={mainImageUrl}
                      loadedUrls={loadedUrls}
                      markLoaded={markLoaded}
                      currentType={currentType}
                      onChangeType={changeProductType}
                      buildViewHref={buildViewHref}
                      onDelete={setPendingId}
                      loading={loading}
                      pendingId={pendingId}
                      canDrag={orderColumn !== null}
                      canMoveUp={orderColumn !== null && globalIndex > 0}
                      canMoveDown={orderColumn !== null && globalIndex < products.length - 1}
                      onMoveUp={() => moveProduct(product, "up")}
                      onMoveDown={() => moveProduct(product, "down")}
                    />
                  );
                })}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>

      <Pagination totalCount={totalCount} itemsPerPage={ITEMS_PER_PAGE} onPageChange={onPageChange} initialPage={currentPage} />

      <Toast
        message={pendingId !== null ? "이 제품을 삭제하시겠습니까?" : null}
        setMessage={() => setPendingId(null)}
        onConfirm={pendingId !== null ? () => deleteMutation.mutate(pendingId) : undefined}
      />
      <Toast message={completedMessage} setMessage={closeCompletedToast} />
      <Toast message={errorMsg} setMessage={() => setErrorMsg(null)} />
    </>
  );
}
