import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// 이름 수정, 순서 변경(sort_order)을 같은 엔드포인트로 처리. slug는 제품의 category 값과 연결돼 있어 바꾸지 않는다.
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const updates: Record<string, unknown> = {};

        if (body.name !== undefined) {
            const name = String(body.name).trim();
            if (!name) {
                return NextResponse.json({ error: "카테고리 이름을 입력해주세요." }, { status: 400 });
            }
            updates.name = name;
        }

        if (body.sort_order !== undefined) {
            updates.sort_order = Number(body.sort_order);
        }

        const { data, error } = await supabaseAdmin
            .from("categories")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("카테고리 수정 실패:", error.message);
            return NextResponse.json({ error: "수정에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error("카테고리 수정 처리 중 오류:", err);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await params;

    const { data: category } = await supabaseAdmin
        .from("categories")
        .select("slug")
        .eq("id", id)
        .maybeSingle();

    if (category?.slug) {
        // products.category는 slug 문자열을 그대로 저장하고 있어 DB가 삭제를 자동으로 막아주지 않으므로 직접 확인
        const { count } = await supabaseAdmin
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("category", category.slug);

        if (count && count > 0) {
            return NextResponse.json(
                { error: `이 카테고리를 사용하는 제품이 ${count}개 있어 삭제할 수 없습니다. 먼저 해당 제품들의 카테고리를 변경해주세요.` },
                { status: 400 }
            );
        }
    }

    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);

    if (error) {
        console.error("카테고리 삭제 실패:", error.message);
        return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
