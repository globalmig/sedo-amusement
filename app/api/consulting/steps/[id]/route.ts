import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const updates: Record<string, unknown> = {};

        if (body.title !== undefined) {
            const title = String(body.title).trim();
            if (!title) {
                return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
            }
            updates.title = title;
        }

        if (body.description !== undefined) {
            updates.description = String(body.description).trim();
        }

        if (body.sort_order !== undefined) {
            updates.sort_order = Number(body.sort_order);
        }

        const { data, error } = await supabaseAdmin
            .from("consulting_steps")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("컨설팅 절차 수정 실패:", error.message);
            return NextResponse.json({ error: "수정에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error("컨설팅 절차 수정 처리 중 오류:", err);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await params;
    const { error } = await supabaseAdmin.from("consulting_steps").delete().eq("id", id);

    if (error) {
        console.error("컨설팅 절차 삭제 실패:", error.message);
        return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
