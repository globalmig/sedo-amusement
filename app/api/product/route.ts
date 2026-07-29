import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isOwnStorageUrl } from "@/lib/uploadImage";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabaseAdmin
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(request: Request) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const body = await request.json();

        const name = String(body.name ?? "").trim();
        const category = String(body.category ?? "").trim();
        const spec = String(body.spec ?? "").trim();
        const features = String(body.features ?? "").trim();
        const priceRaw = body.price != null ? String(body.price).trim() : "";
        const mainImageUrl = body.main_image_url;
        const detailImageUrls: unknown[] = Array.isArray(body.detail_images) ? body.detail_images : [];

        if (!name) {
            return NextResponse.json({ error: "상품이름을 입력해주세요." }, { status: 400 });
        }

        if (!category) {
            return NextResponse.json({ error: "카테고리를 선택해주세요." }, { status: 400 });
        }

        if (!spec) {
            return NextResponse.json({ error: "규격을 입력해주세요." }, { status: 400 });
        }

        const price = priceRaw ? Number(priceRaw) : null;
        if (priceRaw && Number.isNaN(price)) {
            return NextResponse.json({ error: "가격은 숫자로 입력해주세요." }, { status: 400 });
        }

        if (!isOwnStorageUrl(mainImageUrl)) {
            return NextResponse.json({ error: "대표이미지를 등록해주세요." }, { status: 400 });
        }

        if (!detailImageUrls.every(isOwnStorageUrl)) {
            return NextResponse.json({ error: "잘못된 이미지 URL이 포함되어 있습니다." }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from("products")
            .insert({
                name,
                category,
                spec: spec || null,
                features: features || null,
                price,
                main_image_url: mainImageUrl,
                detail_images: detailImageUrls,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });

    } catch (err) {
        const message = err instanceof Error ? err.message : "서버 내부 오류가 발생했습니다.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
