import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { FAQ_CATEGORIES } from "@/datas/faq";

const VALID_CATEGORIES = FAQ_CATEGORIES.map((c) => c.key);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabaseAdmin
        .from("faq_items")
        .select("*")
        .order("sort_order", { ascending: true });

    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
        console.error("FAQ 목록 조회 실패:", error.message);
        return NextResponse.json({ error: "목록을 불러오지 못했습니다." }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(request: Request) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const body = await request.json();

        const category = String(body.category ?? "").trim();
        const question = String(body.question ?? "").trim();
        const answer = String(body.answer ?? "").trim();

        if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
            return NextResponse.json({ error: "카테고리를 선택해주세요." }, { status: 400 });
        }
        if (!question) {
            return NextResponse.json({ error: "질문을 입력해주세요." }, { status: 400 });
        }
        if (!answer) {
            return NextResponse.json({ error: "답변을 입력해주세요." }, { status: 400 });
        }

        const { data: lastRow } = await supabaseAdmin
            .from("faq_items")
            .select("sort_order")
            .eq("category", category)
            .order("sort_order", { ascending: false })
            .limit(1)
            .maybeSingle();
        const nextOrder = (lastRow?.sort_order ?? -1) + 1;

        const { data, error } = await supabaseAdmin
            .from("faq_items")
            .insert({ category, question, answer, sort_order: nextOrder })
            .select()
            .single();

        if (error) {
            console.error("FAQ 등록 실패:", error.message);
            return NextResponse.json({ error: "등록에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (err) {
        console.error("FAQ 등록 처리 중 오류:", err);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}
