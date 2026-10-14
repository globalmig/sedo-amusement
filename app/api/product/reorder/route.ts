import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth";

// 제품 목록 드래그 정렬 결과 저장용
// body: { order: number[] } - 드래그로 재배열된 순서대로 나열된 제품 id 배열
// 배열의 인덱스(0부터) + 1 을 각 제품의 display_order로 저장한다.
export async function PATCH(request: Request) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const body = await request.json();
    const orderRaw: unknown[] = Array.isArray(body.order) ? body.order : [];
    const ids = orderRaw.map((v) => Number(v)).filter((v) => Number.isInteger(v));

    if (ids.length === 0) {
        return NextResponse.json({ error: "순서 정보가 올바르지 않습니다." }, { status: 400 });
    }

    const results = await Promise.all(
        ids.map((id, index) =>
            supabaseAdmin
                .from("products")
                .update({ display_order: index + 1 })
                .eq("id", id)
        )
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) {
        console.error("제품 순서 변경 실패:", failed.error.message);
        return NextResponse.json({ error: "제품 순서 변경에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
