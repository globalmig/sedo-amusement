import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { uploadProductImage, deleteProductImage } from "@/lib/uploadImage";
import { DemoProduct } from "@/types/demo";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

async function requireAdmin() {
    const cookieStore = await cookies();
    return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

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

        const formData = await request.formData();

        const name = String(formData.get("name") ?? "").trim();
        const category = String(formData.get("category") ?? "").trim();
        const spec = String(formData.get("spec") ?? "").trim();
        const features = String(formData.get("features") ?? "").trim();
        const priceRaw = String(formData.get("price") ?? "").trim();
        const mainImage = formData.get("main_image");
        const newDetailImages = formData.getAll("detail_images");
        const keptDetailImages: string[] = JSON.parse(
            String(formData.get("existing_detail_images") ?? "[]")
        );

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

        if (!(mainImage instanceof File && mainImage.size > 0) && !existing.main_image_url) {
            return NextResponse.json({ error: "대표이미지를 등록해주세요." }, { status: 400 });
        }

        // 대표이미지 교체
        let mainImageUrl = existing.main_image_url;
        if (mainImage instanceof File && mainImage.size > 0) {
            mainImageUrl = await uploadProductImage(mainImage, "main");
            if (existing.main_image_url) {
                await deleteProductImage(existing.main_image_url);
            }
        }

        // 목록에서 제외된 기존 상세이미지는 스토리지에서도 삭제
        const removedDetailImages = (existing.detail_images ?? []).filter(
            (url) => !keptDetailImages.includes(url)
        );
        await Promise.all(removedDetailImages.map((url) => deleteProductImage(url)));

        const newDetailImageUrls: string[] = [];
        for (const file of newDetailImages) {
            if (file instanceof File && file.size > 0) {
                newDetailImageUrls.push(await uploadProductImage(file, "detail"));
            }
        }

        const { data, error } = await supabaseAdmin
            .from("demo")
            .update({
                name,
                category,
                spec: spec || null,
                features: features || null,
                price,
                main_image_url: mainImageUrl,
                detail_images: [...keptDetailImages, ...newDetailImageUrls],
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
