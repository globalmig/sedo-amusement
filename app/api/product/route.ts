import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isOwnStorageUrl, verifyOwnImageUrls } from "@/lib/uploadImage";
import { requireAdmin } from "@/lib/auth";
import { attachCategoryNames } from "@/lib/categories";
import { Product } from "@/types/product";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabaseAdmin
        .from("products")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
        console.error("제품 목록 조회 실패:", error.message);
        return NextResponse.json({ error: "제품 목록을 불러오지 못했습니다." }, { status: 500 });
    }

    return NextResponse.json({ data: await attachCategoryNames((data as unknown as Product[]) ?? []) });
}

export async function POST(request: Request) { 
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const body = await request.json();

        const name = String(body.name ?? "").trim();
        const category = String(body.category ?? "").trim();
        const productTypeRaw = String(body.product_type ?? "").trim();
        const ratingNumber = String(body.rating_number ?? "").trim();
        const spec = String(body.spec ?? "").trim();
        const features = String(body.features ?? "").trim();
        const priceRaw = body.price != null ? String(body.price).trim() : "";
        const youtubeUrl = String(body.youtube_url ?? "").trim();
        const mainImageUrl = body.main_image_url;
        const detailImageUrls: unknown[] = Array.isArray(body.detail_images) ? body.detail_images : [];

        if (!name) {
            return NextResponse.json({ error: "제품이름을 입력해주세요." }, { status: 400 });
        }

        if (!category) {
            return NextResponse.json({ error: "카테고리를 선택해주세요." }, { status: 400 });
        }

        const VALID_PRODUCT_TYPES = ["all", "new", "hit", "recommend"];
        const product_type = VALID_PRODUCT_TYPES.includes(productTypeRaw) ? productTypeRaw : "all";

        if (!ratingNumber) {
            return NextResponse.json({ error: "등급분류번호를 입력해주세요." }, { status: 400 });
        }

        if (!spec) {
            return NextResponse.json({ error: "규격을 입력해주세요." }, { status: 400 });
        }

        const price = priceRaw ? Number(priceRaw) : null;
        if (priceRaw && Number.isNaN(price)) {
            return NextResponse.json({ error: "가격은 숫자로 입력해주세요." }, { status: 400 });
        }

        // 신규 등록은 항상 맨 뒤 순서로 추가한다. 순서 변경은 목록의 위/아래 버튼(또는 드래그)으로만 할 수 있다.
        const { data: lastOrder } = await supabaseAdmin
            .from("products")
            .select("display_order")
            .order("display_order", { ascending: false, nullsFirst: false })
            .limit(1)
            .maybeSingle();
        const display_order = (lastOrder?.display_order ?? 0) + 1;

        // 분류(신제품/히트/추천) 안에서도 맨 뒤 순서로 추가 (같은 분류 안에서만 비교)
        const { data: lastTypeOrder } = await supabaseAdmin
            .from("products")
            .select("type_order")
            .eq("product_type", product_type)
            .order("type_order", { ascending: false, nullsFirst: false })
            .limit(1)
            .maybeSingle();
        const type_order = (lastTypeOrder?.type_order ?? 0) + 1;

        if (!isOwnStorageUrl(mainImageUrl)) {
            return NextResponse.json({ error: "대표이미지를 등록해주세요." }, { status: 400 });
        }

        if (!(await verifyOwnImageUrls([mainImageUrl, ...detailImageUrls]))) {
            return NextResponse.json({ error: "잘못된 이미지 URL이 포함되어 있습니다." }, { status: 400 });
        }

        if (youtubeUrl && !/^https?:\/\/.+/i.test(youtubeUrl)) {
            return NextResponse.json({ error: "유튜브 링크는 http(s):// 형식의 URL로 입력해주세요." }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from("products")
            .insert({
                name,
                category,
                product_type,
                rating_number: ratingNumber,
                spec: spec || null,
                features: features || null,
                price,
                main_image_url: mainImageUrl,
                detail_images: detailImageUrls,
                youtube_url: youtubeUrl || null,
                display_order,
                type_order,
            })
            .select()
            .single();

        if (error) {
            console.error("제품 등록 실패:", error.message);
            return NextResponse.json({ error: "제품 등록에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });

    } catch (err) {
        console.error("제품 등록 처리 중 오류:", err);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}
