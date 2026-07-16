import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { uploadProductImage } from "@/lib/uploadImage";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabaseAdmin
        .from("demo")
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
        const cookieStore = await cookies();
        if (!verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const formData = await request.formData();

        const name = String(formData.get("name") ?? "").trim();
        const category = String(formData.get("category") ?? "").trim();
        const spec = String(formData.get("spec") ?? "").trim();
        const features = String(formData.get("features") ?? "").trim();
        const priceRaw = String(formData.get("price") ?? "").trim();
        const mainImage = formData.get("main_image");
        const detailImages = formData.getAll("detail_images");

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

        if (!(mainImage instanceof File) || mainImage.size === 0) {
            return NextResponse.json({ error: "대표이미지를 등록해주세요." }, { status: 400 });
        }

        const mainImageUrl = await uploadProductImage(mainImage, "main");

        const detailImageUrls: string[] = [];
        for (const file of detailImages) {
            if (file instanceof File && file.size > 0) {
                detailImageUrls.push(await uploadProductImage(file, "detail"));
            }
        }

        const { data, error } = await supabaseAdmin
            .from("demo")
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
