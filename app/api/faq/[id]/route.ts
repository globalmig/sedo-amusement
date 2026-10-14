import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { FAQ_CATEGORIES } from "@/datas/faq";

const VALID_CATEGORIES = FAQ_CATEGORIES.map((c) => c.key);

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

        if (body.category !== undefined) {
            const category = String(body.category).trim();
            if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
                return NextResponse.json({ error: "카테고리를 선택해주세요." }, { status: 400 });
            }
            updates.category = category;
        }

        if (body.question !== undefined) {
            const question = String(body.question).trim();
            if (!question) {
                return NextResponse.json({ error: "질문을 입력해주세요." }, { status: 400 });
            }
            updates.question = question;
        }

        if (body.answer !== undefined) {
            const answer = String(body.answer).trim();
            if (!answer) {
                return NextResponse.json({ error: "답변을 입력해주세요." }, { status: 400 });
            }
            updates.answer = answer;
        }

        if (body.sort_order !== undefined) {
            updates.sort_order = Number(body.sort_order);
        }

        const { data, error } = await supabaseAdmin
            .from("faq_items")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("FAQ 수정 실패:", error.message);
            return NextResponse.json({ error: "수정에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error("FAQ 수정 처리 중 오류:", err);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await params;
    const { error } = await supabaseAdmin.from("faq_items").delete().eq("id", id);

    if (error) {
        console.error("FAQ 삭제 실패:", error.message);
        return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
