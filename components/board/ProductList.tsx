"use client";
import { useState } from "react";
import Link from "next/link";
import { useDelete } from "@/hooks/useDelete";
import Toast from "../common/Toast";
import { DemoProduct } from "@/types/demo";

function formatPrice(price: number | null) {
  if (price === null) return "가격 문의";
  return `${price.toLocaleString("ko-KR")}원`;
}

interface ProductListProps {
  products: DemoProduct[];
  onReload: () => void;
}

// 관리자 제품 리스트: 테이블형 CRUD 인터페이스
export default function ProductList({ products, onReload }: ProductListProps) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
              <th className="px-5 py-3">상품이름</th>
              <th className="px-5 py-3">가격</th>
              <th className="px-5 py-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="border-b border-black/5 last:border-0 hover:bg-surface/60">
                <td className="px-5 py-3.5 text-muted">{index + 1}</td>
                <td className="px-5 py-3.5">
                  {product.main_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.main_image_url} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface text-xs text-muted">
                      없음
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 font-medium text-title">
                  <Link
                      href={`/admin/${product.category}/${product.id}/view`}
                      className="text-body hover:text-primary hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                <td className="px-5 py-3.5 text-body">{formatPrice(product.price)}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/${product.category}/${product.id}`}
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
            ))}
          </tbody>
        </table>
      </div>

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
