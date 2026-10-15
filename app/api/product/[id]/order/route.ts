import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// 목록의 위/아래 버튼으로 두 제품의 순서(display_order)를 맞바꿀 때 쓰는 단일 필드 업데이트용 엔드포인트
export async function PATCH(request: Request, { params }: RouteParams) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const display_order = Number(body.display_order);

    if (!Number.isInteger(display_order) || display_order < 1) {
        return NextResponse.json({ error: "올바르지 않은 순서 값입니다." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("products")
        .update({ display_order })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("제품 순서 변경 실패:", error.message);
        return NextResponse.json({ error: "순서 변경에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ data });
}
