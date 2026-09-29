import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const VALID_PRODUCT_TYPES = ["all", "new", "hit", "recommend"];

export async function PATCH(request: Request, { params }: RouteParams) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const product_type = String(body.product_type ?? "").trim();

    if (!VALID_PRODUCT_TYPES.includes(product_type)) {
        return NextResponse.json({ error: "올바르지 않은 분류입니다." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("products")
        .update({ product_type })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("제품 분류 변경 실패:", error.message);
        return NextResponse.json({ error: "제품 분류 변경에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ data });
}
