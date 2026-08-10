"use client";
import { useCallback, useEffect, useState } from "react";
import { useCreate } from "@/hooks/useCreate";
import { useUpdate } from "@/hooks/useUpdate";
import { USER_CATEGORY } from "@/datas/categories";
import { supabaseClient } from "@/lib/supabaseClient";
import { STORAGE_BUCKET } from "@/lib/storage";
import Toast from "../common/Toast";
import Link from "next/link";
import Image from "next/image";

const PRODUCT_CATEGORIES = USER_CATEGORY.products.categories ?? [];

export interface ProductFormValues {
    name: string;
    category: string;
    spec: string;
    features: string;
    price: string;
    main_image: File | null;
    detail_images: File[];
}

interface ProductFormInitialData {
    name?: string;
    category?: string | null;
    spec?: string | null;
    features?: string | null;
    price?: number | null;
    main_image_url?: string | null;
    detail_images?: string[] | null;
}

interface ProductFormOwnProps {
    editId?: number;
    initialData?: ProductFormInitialData;
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
    }, [file]);

    return (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-black/10">
            {previewUrl && (
                <Image src={previewUrl} alt={file.name} fill sizes="80px" className="object-cover" />
            )}
            <button
                type="button"
                onClick={onRemove}
                aria-label="이미지 삭제"
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white cursor-pointer"
            >
                ✕
            </button>
        </div>
    );
}

export default function ProductForm({ editId, initialData }: ProductFormOwnProps = {}) {
    const isEditMode = !!editId;

    const [form, setForm] = useState({
        name: initialData?.name ?? "",
        category: initialData?.category ?? "",
        spec: initialData?.spec ?? "",
        features: initialData?.features ?? "",
        price: initialData?.price != null ? String(initialData.price) : "",
    });
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [existingMainImageUrl, setExistingMainImageUrl] = useState<string | null>(
        initialData?.main_image_url ?? null
    );
    const [existingDetailImages, setExistingDetailImages] = useState<string[]>(
        initialData?.detail_images ?? []
    );
    const [newDetailImages, setNewDetailImages] = useState<File[]>([]);

    const [vaild, setVaild] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!mainImage) return;
        const reader = new FileReader();
        reader.onload = () => setMainImagePreview(reader.result as string);
        reader.readAsDataURL(mainImage);
    }, [mainImage]);

    const handleCloseToast: React.Dispatch<React.SetStateAction<string | null>> = (value) => {
        if (isSuccess) {
            window.location.href = "/admin";
        }
        setVaild(value);
        setIsSuccess(false);
    };

    const { create, loading: createLoading } = useCreate("/api/product", {
        onSuccess: () => { setIsSuccess(true); setVaild("제품이 등록되었습니다."); },
        onError: (message) => setVaild(message),
    });

    const { update, loading: updateLoading } = useUpdate("/api/product", {
        onSuccess: () => { setIsSuccess(true); setVaild("제품이 수정되었습니다."); },
        onError: (message) => setVaild(message),
    });

    const loading = isEditMode ? updateLoading : createLoading;

    const onChangeForm = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const onChangeMainImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setMainImage(file);
        if (file) {
            setExistingMainImageUrl(null);
        } else {
            setMainImagePreview(null);
        }
        e.target.value = "";
    }, []);

    const onChangeDetailImages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 0) setNewDetailImages((prev) => [...prev, ...files]);
        e.target.value = "";
    }, []);

    const removeExistingDetailImage = useCallback((url: string) => {
        setExistingDetailImages((prev) => prev.filter((item) => item !== url));
    }, []);

    const removeNewDetailImage = useCallback((index: number) => {
        setNewDetailImages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const uploadImage = useCallback(async (file: File, folder: "main" | "detail") => {
        const res = await fetch("/api/product/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folder, fileName: file.name, fileType: file.type, fileSize: file.size }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "이미지 업로드 준비에 실패했습니다.");

        const { error } = await supabaseClient.storage
            .from(STORAGE_BUCKET)
            .uploadToSignedUrl(result.path, result.token, file);
        if (error) throw new Error("이미지 업로드에 실패했습니다.");

        return result.publicUrl as string;
    }, []);

    const onSubmitForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || uploading) return;

        if (!form.name.trim()) { setVaild("제품 이름을 입력해주세요."); return; }
        if (!form.category) { setVaild("카테고리를 선택해주세요."); return; }
        if (!form.spec.trim()) { setVaild("규격을 입력해주세요."); return; }
        if (form.price && Number.isNaN(Number(form.price))) { setVaild("가격은 숫자로 입력해주세요."); return; }
        if (!mainImage && !existingMainImageUrl) { setVaild("대표이미지를 등록해주세요."); return; }

        setUploading(true);
        try {
            const mainImageUrl = mainImage ? await uploadImage(mainImage, "main") : existingMainImageUrl!;
            const newDetailImageUrls = await Promise.all(
                newDetailImages.map((file) => uploadImage(file, "detail"))
            );

            const payload = {
                name: form.name,
                category: form.category,
                spec: form.spec,
                features: form.features,
                price: form.price,
                main_image_url: mainImageUrl,
                detail_images: [...existingDetailImages, ...newDetailImageUrls],
            };

            if (isEditMode) {
                await update(editId, payload);
            } else {
                await create(payload);
            }
        } catch (err) {
            setVaild(err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    }, [form, mainImage, existingMainImageUrl, newDetailImages, existingDetailImages, create, update, loading, uploading, isEditMode, editId, uploadImage]);

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <div className="card p-6 md:p-8 space-y-5">

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="form-label">
                            제품 이름 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="제품 이름을 입력해주세요."
                            value={form.name}
                            onChange={onChangeForm}
                            className="form-input"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="category" className="form-label">
                            카테고리 <span className="text-red-400">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={onChangeForm}
                            className="form-input"
                        >
                            <option value="">카테고리를 선택해주세요</option>
                            {PRODUCT_CATEGORIES.map((c) => (
                                <option key={c.url} value={c.url}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="spec" className="form-label">
                            규격 <span className="text-red-400">*</span>
                        </label>
                        <p className="text-[0.9rem] text-muted">예) 900 x 900 x 2050 mm, 220V, 180kg 와 같이 제품의 규격을 입력해주세요.</p>
                        <textarea
                            id="spec"
                            name="spec"
                            rows={3}
                            placeholder="예) 900 x 900 x 2050 mm, 220V, 180kg"
                            value={form.spec}
                            onChange={onChangeForm}
                            className="form-input resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="features" className="form-label">특징</label>
                         <p className="text-[0.9rem] text-muted">특징 입력은 필수가 아닙니다. 공란일 시, 제품 상세 정보란에 공란으로 표시됩니다.</p>
                        <textarea
                            id="features"
                            name="features"
                            rows={4}
                            placeholder="제품의 특징을 입력해주세요."
                            value={form.features}
                            onChange={onChangeForm}
                            className="form-input resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="price" className="form-label">가격</label>
                        <p className="text-[0.9rem] text-muted">가격 미입력 시, &apos;가격 문의&apos;로 표시됩니다.</p>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="가격은 숫자만 입력해주세요."
                            value={form.price}
                            onChange={onChangeForm}
                            className="form-input"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 mb-7">
                        <label className="form-label">
                            대표이미지 <span className="text-red-400">*</span>
                        </label>
                        <p className="text-[0.9rem] text-muted mb-4">
                            제품의 대표 이미지를 선택해주세요. <br/>
                            이미지는 jpg, png, webp, gif 파일만 등록할 수 있으며, 용량은 5MB 이하를 권장드립니다.
                        </p>
                        <div className="flex items-center gap-3">
                            <input type="file" id="main_image" accept="image/*" className="hidden" onChange={onChangeMainImage} />
                            <label
                                htmlFor="main_image"
                                className="px-4 py-2 bg-surface hover:bg-gray-200 text-body text-sm font-medium rounded-lg cursor-pointer transition-colors shrink-0 border border-gray-300"
                            >
                                파일 선택
                            </label>
                            <span className="text-sm text-muted truncate">
                                {mainImage?.name ?? (existingMainImageUrl ? "기존 이미지 사용 중" : "선택된 파일 없음")}
                            </span>
                        </div>
                        {(mainImagePreview || existingMainImageUrl) && (
                            <Image
                                src={mainImagePreview ?? existingMainImageUrl ?? ""}
                                alt="대표이미지 미리보기"
                                className="mt-1 h-28 w-28 rounded-lg border border-black/10 object-cover"
                                width={112}
                                height={112}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">상세이미지 (여러 장 등록 가능)</label>
                        <p className="text-[0.9rem] text-muted mb-4">
                            제품의 상세 이미지를 선택해주세요. 상세 이미지 등록은 필수가 아닙니다.<br/>
                            이미지를 등록하지 않을 경우, 제품 상세 정보란에 이미지를 표시하지 않습니다.<br/>
                            이미지는 jpg, png, webp, gif 파일만 등록할 수 있으며, 용량은 5MB 이하를 권장드립니다.
                        </p>
                        <div className="flex items-center gap-3">
                            <input type="file" id="detail_images" accept="image/*" multiple className="hidden" onChange={onChangeDetailImages} />
                            <label
                                htmlFor="detail_images"
                                className="px-4 py-2 bg-surface hover:bg-gray-200 text-body text-sm font-medium rounded-lg cursor-pointer transition-colors shrink-0 border border-gray-300"
                            >
                                파일 추가
                            </label>
                            <span className="text-sm text-muted">
                                {existingDetailImages.length + newDetailImages.length}장 등록됨
                            </span>
                        </div>

                        {(existingDetailImages.length > 0 || newDetailImages.length > 0) && (
                            <div className="mt-1 flex flex-wrap gap-3">
                                {existingDetailImages.map((url) => (
                                    <div key={url} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-black/10">
                                        <Image src={url} alt="상세이미지" fill sizes="80px" className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingDetailImage(url)}
                                            aria-label="이미지 삭제"
                                            className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                {newDetailImages.map((file, index) => (
                                    <FilePreview key={`${file.name}-${index}`} file={file} onRemove={() => removeNewDetailImage(index)} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-5 pb-7 border-t border-gray-100 mt-10">
                        <Link href="/admin" className="btn-ghost flex-1 text-center">
                            취소
                        </Link>
                        <button type="submit" disabled={loading || uploading} className="btn-primary flex-1 cursor-pointer">
                            {uploading
                                ? "이미지 업로드 중..."
                                : loading
                                    ? (isEditMode ? "수정 중..." : "등록 중...")
                                    : (isEditMode ? "수정" : "등록")}
                        </button>
                    </div>
                </div>
            </form>
            <Toast vaild={vaild} setVaild={handleCloseToast} />
        </>
    );
}
