import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { deleteProductImage, isOwnStorageUrl } from "@/lib/uploadImage";
import { DemoProduct } from "@/types/demo";
import { requireAdmin } from "@/lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
        .from("demo")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const { id } = await params;

        const { data: existing, error: fetchError } = await supabaseAdmin
            .from("demo")
            .select("*")
            .eq("id", id)
            .single<DemoProduct>();

        if (fetchError || !existing) {
            return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
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

        // 대표이미지가 교체된 경우 기존 이미지를 스토리지에서 삭제
        if (mainImageUrl !== existing.main_image_url && existing.main_image_url) {
            await deleteProductImage(existing.main_image_url);
        }

        // 목록에서 제외된 기존 상세이미지는 스토리지에서도 삭제
        const removedDetailImages = (existing.detail_images ?? []).filter(
            (url) => !detailImageUrls.includes(url)
        );
        await Promise.all(removedDetailImages.map((url) => deleteProductImage(url)));

        const { data, error } = await supabaseAdmin
            .from("demo")
            .update({
                name,
                category,
                spec: spec || null,
                features: features || null,
                price,
                main_image_url: mainImageUrl,
                detail_images: detailImageUrls,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });

    } catch (err) {
        const message = err instanceof Error ? err.message : "서버 내부 오류가 발생했습니다.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await params;

    const { data: existing } = await supabaseAdmin
        .from("demo")
        .select("*")
        .eq("id", id)
        .single<DemoProduct>();

    if (existing) {
        const imagesToDelete = [existing.main_image_url, ...(existing.detail_images ?? [])].filter(
            (url): url is string => !!url
        );
        await Promise.all(imagesToDelete.map((url) => deleteProductImage(url)));
    }

    const { error } = await supabaseAdmin.from("demo").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
