import { COMPANY_INFO } from "@/datas/company";

// 배송 및 환불/반품 안내 (제품 상세 정보 표 하단 공용)
export default function ProductShippingInfo() {
  return (
    <div className="card overflow-hidden">
      <h2 className="border-b border-black/5 px-6 py-4 text-base font-bold text-title">
        배송 및 환불/반품 안내
      </h2>
      <div className="divide-y divide-black/5 text-sm">
        <div className="flex flex-col gap-2 px-6 py-4 pc:flex-row">
          <span className="w-28 shrink-0 font-medium text-title pc:w-40">배송정보</span>
          <p className="leading-7 text-body">
            모든 배송비는 착불이며, 1일~3일 정도 소요됩니다.
            <br />
            기간적 여유를 가지고 신중한 구매를 부탁드립니다.
            <br />
            기타 문의사항은 {COMPANY_INFO.phone}로 연락주시길 바랍니다.
          </p>
        </div>
        <div className="flex flex-col gap-2 px-6 py-4 pc:flex-row">
          <span className="w-28 shrink-0 font-medium text-title pc:w-40">환불/반품</span>
          <p className="leading-7 text-body">
            배송 도중이나 택배를 받으신 후 주문 취소를 원하실 때는 단순변심이기 때문에 반품 택배비를 부담해주셔야 합니다.
            <br />
            배송/주문 취소에 대한 문의사항은 {COMPANY_INFO.phone}로 연락주시길 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
