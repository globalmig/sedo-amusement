import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("카테고리 목록 조회 실패:", error.message);
        return NextResponse.json({ error: "목록을 불러오지 못했습니다." }, { status: 500 });
    }

    return NextResponse.json({ data });
}

// 제품 등록 폼/필터의 <select> 값으로 쓰일 slug를 이름에서 자동으로 만든다.
// 관리자가 "슬러그"라는 개념을 몰라도 카테고리 이름만 입력하면 되도록 함.
function slugify(name: string): string {
    const base = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    return base || `category-${Date.now()}`;
}

async function findAvailableSlug(base: string): Promise<string> {
    let candidate = base;
    let suffix = 2;
    while (true) {
        const { data } = await supabaseAdmin
            .from("categories")
            .select("id")
            .eq("slug", candidate)
            .maybeSingle();
        if (!data) return candidate;
        candidate = `${base}-${suffix}`;
        suffix += 1;
    }
}

export async function POST(request: Request) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const body = await request.json();
        const name = String(body.name ?? "").trim();

        if (!name) {
            return NextResponse.json({ error: "카테고리 이름을 입력해주세요." }, { status: 400 });
        }

        const slug = await findAvailableSlug(slugify(name));

        const { data: lastRow } = await supabaseAdmin
            .from("categories")
            .select("sort_order")
            .order("sort_order", { ascending: false })
            .limit(1)
            .maybeSingle();
        const nextOrder = (lastRow?.sort_order ?? -1) + 1;

        const { data, error } = await supabaseAdmin
            .from("categories")
            .insert({ name, slug, sort_order: nextOrder })
            .select()
            .single();

        if (error) {
            console.error("카테고리 등록 실패:", error.message);
            return NextResponse.json({ error: "등록에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (err) {
        console.error("카테고리 등록 처리 중 오류:", err);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}
