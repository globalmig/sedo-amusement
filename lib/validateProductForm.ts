interface ValidatableProductForm {
    name: string;
    category: string;
    rating_number: string;
    spec: string;
    price: string;
    youtube_url: string;
}

// 제품 등록/수정 제출 전 필수값 검증. 문제가 있으면 사용자에게 보여줄 메시지를, 없으면 null을 반환한다.
export function validateProductForm(form: ValidatableProductForm, hasMainImage: boolean): string | null {
    if (!form.name.trim()) return "제품 이름을 입력해주세요.";
    if (!form.category) return "카테고리를 선택해주세요.";
    if (!form.rating_number.trim()) return "등급분류번호를 입력해주세요.";
    if (!form.spec.trim()) return "규격을 입력해주세요.";
    if (form.price && Number.isNaN(Number(form.price))) return "가격은 숫자로 입력해주세요.";
    if (form.youtube_url.trim() && !/^https?:\/\/.+/i.test(form.youtube_url.trim())) {
        return "유튜브 링크는 http(s):// 형식의 URL로 입력해주세요.";
    }
    if (!hasMainImage) return "대표이미지를 등록해주세요.";

    return null;
}
