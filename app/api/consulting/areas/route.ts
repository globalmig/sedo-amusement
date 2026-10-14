import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from("consulting_areas")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("컨설팅 분야 목록 조회 실패:", error.message);
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

        const title = String(body.title ?? "").trim();
        const subtitle = String(body.subtitle ?? "").trim();
        const points = Array.isArray(body.points)
            ? body.points.map((p: unknown) => String(p).trim()).filter(Boolean)
            : [];

        if (!title) {
            return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
        }

        const { data: lastRow } = await supabaseAdmin
            .from("consulting_areas")
            .select("sort_order")
            .order("sort_order", { ascending: false })
            .limit(1)
            .maybeSingle();
        const nextOrder = (lastRow?.sort_order ?? -1) + 1;

        const { data, error } = await supabaseAdmin
            .from("consulting_areas")
            .insert({ title, subtitle, points, sort_order: nextOrder })
            .select()
            .single();

        if (error) {
            console.error("컨설팅 분야 등록 실패:", error.message);
            return NextResponse.json({ error: "등록에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (err) {
        console.error("컨설팅 분야 등록 처리 중 오류:", err);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}
