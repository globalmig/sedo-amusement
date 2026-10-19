// 관리자 CRUD 화면(FAQ, 컨설팅 분야/절차 등)에서 공통으로 쓰는 fetch 헬퍼.
// "요청 보내고, 실패하면 서버가 내려준 에러 메시지로 throw" 패턴이 여러 관리자 페이지에
// 복붙돼 있던 것을 하나로 모음.

export async function postJson(url: string, payload: Record<string, unknown>) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "등록에 실패했습니다.");
    return result;
}

export async function patchJson(url: string, payload: Record<string, unknown>) {
    const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "수정에 실패했습니다.");
    return result;
}

export async function deleteJson(url: string, fallbackMessage = "삭제에 실패했습니다.") {
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.error || fallbackMessage);
    }
}
