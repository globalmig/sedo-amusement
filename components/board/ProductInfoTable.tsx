import { Product } from "@/types/product";
import { getProductCategoryLabel } from "@/datas/categories";

function formatPrice(price: number | null) {
  if (price === null) return "가격 문의";
  return `${price.toLocaleString("ko-KR")}원`;
}

interface ProductInfoTableProps {
  product: Product;
}

// 제품 상세 정보 표 (사용자/관리자 상세 페이지 공용)
export default function ProductInfoTable({ product }: ProductInfoTableProps) {
  return (
    <div className="card overflow-hidden">
      <h2 className="border-b border-black/5 px-6 py-4 text-base font-bold text-title">
        제품 상세 정보
      </h2>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-black/5">
          <tr>
            <th scope="row" className="w-28 shrink-0 bg-surface px-6 py-4 text-left font-medium text-title pc:w-40">
              상품명
            </th>
            <td className="px-6 py-4 text-body">{product.name || "-"}</td>
          </tr>
          <tr>
            <th scope="row" className="w-28 shrink-0 bg-surface px-6 py-4 text-left font-medium text-title pc:w-40">
              카테고리
            </th>
            <td className="px-6 py-4 text-body">{getProductCategoryLabel(product.category)}</td>
          </tr>
          <tr>
            <th scope="row" className="w-28 shrink-0 bg-surface px-6 py-4 text-left font-medium text-title pc:w-40">
              규격
            </th>
            <td className="whitespace-pre-line px-6 py-4 text-body">{product.spec || "-"}</td>
          </tr>
          <tr>
            <th scope="row" className="w-28 shrink-0 bg-surface px-6 py-4 text-left font-medium text-title pc:w-40">
              특징
            </th>
            <td className="whitespace-pre-line px-6 py-4 text-body">{product.features || "-"}</td>
          </tr>
          <tr>
            <th scope="row" className="w-28 shrink-0 bg-surface px-6 py-4 text-left font-medium text-title pc:w-40">
              가격
            </th>
            <td className="px-6 py-4 text-body">{formatPrice(product.price)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
