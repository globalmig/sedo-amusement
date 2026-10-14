import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { deleteProductImage, isOwnStorageUrl } from "@/lib/uploadImage";
import { Product } from "@/types/product";
import { requireAdmin } from "@/lib/auth";
import { reorderForMove } from "@/lib/productOrder";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
        .from("products")
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
            .from("products")
            .select("*")
            .eq("id", id)
            .single<Product>();

        if (fetchError || !existing) {
            return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
        }

        const body = await request.json();

        const name = String(body.name ?? "").trim();
        const category = String(body.category ?? "").trim();
        const productTypeRaw = String(body.product_type ?? "").trim();
        const ratingNumber = String(body.rating_number ?? "").trim();
        const spec = String(body.spec ?? "").trim();
        const features = String(body.features ?? "").trim();
        const priceRaw = body.price != null ? String(body.price).trim() : "";
        const displayOrderRaw = body.display_order != null ? String(body.display_order).trim() : "";
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
        const product_type = VALID_PRODUCT_TYPES.includes(productTypeRaw) ? productTypeRaw : existing.product_type ?? "all";

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

        let display_order: number | null = existing.display_order;
        if (displayOrderRaw) {
            display_order = Number(displayOrderRaw);
            if (!Number.isInteger(display_order) || display_order < 1) {
                return NextResponse.json({ error: "순서 번호는 1 이상의 숫자로 입력해주세요." }, { status: 400 });
            }
        }

        if (!isOwnStorageUrl(mainImageUrl)) {
            return NextResponse.json({ error: "대표이미지를 등록해주세요." }, { status: 400 });
        }

        if (!detailImageUrls.every(isOwnStorageUrl)) {
            return NextResponse.json({ error: "잘못된 이미지 URL이 포함되어 있습니다." }, { status: 400 });
        }

        if (youtubeUrl && !/^https?:\/\/.+/i.test(youtubeUrl)) {
            return NextResponse.json({ error: "유튜브 링크는 http(s):// 형식의 URL로 입력해주세요." }, { status: 400 });
        }

        // 순서 번호가 바뀐 경우, 이미 그 번호를 쓰고 있던 제품들을 한 칸씩 밀거나 당겨 번호가 겹치지 않도록 한다.
        if (displayOrderRaw && display_order !== existing.display_order) {
            await reorderForMove(existing.id, existing.display_order, display_order!);
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
            .from("products")
            .update({
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
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("제품 수정 실패:", error.message);
            return NextResponse.json({ error: "제품 수정에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ data });

    } catch (err) {
        console.error("제품 수정 처리 중 오류:", err);
        return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    if (!(await requireAdmin())) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await params;

    const { data: existing } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", id)
        .single<Product>();

    if (existing) {
        const imagesToDelete = [existing.main_image_url, ...(existing.detail_images ?? [])].filter(
            (url): url is string => !!url
        );
        await Promise.all(imagesToDelete.map((url) => deleteProductImage(url)));
    }

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

    if (error) {
        console.error("제품 삭제 실패:", error.message);
        return NextResponse.json({ error: "제품 삭제에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
