"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { USER_CATEGORY, PRODUCT_GAME_CATEGORIES } from "@/datas/categories";
import { supabaseClient } from "@/lib/supabaseClient";
import { STORAGE_BUCKET } from "@/lib/storage";
import Toast from "../common/Toast";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";

const UPDATE_SUCCESS_MESSAGE = "제품이 수정되었습니다.";

const PRODUCT_TYPES = USER_CATEGORY.products.categories ?? [];

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
            className={className}
        >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export interface ProductFormValues {
    name: string;
    category: string;
    product_type: string;
    rating_number: string;
    spec: string;
    features: string;
    price: string;
    main_image: File | null;
    detail_images: File[];
}

interface ProductFormInitialData {
    name?: string;
    category?: string | null;
    product_type?: string | null;
    rating_number?: string | null;
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

type DetailImageItem =
    | { id: string; kind: "existing"; url: string }
    | { id: string; kind: "new"; file: File };

let detailImageIdSeq = 0;
function createDetailImageId() {
    detailImageIdSeq += 1;
    return `detail-${Date.now()}-${detailImageIdSeq}`;
}

function DetailImageThumb({
    item,
    index,
    onRemove,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    isDragging,
}: {
    item: DetailImageItem;
    index: number;
    onRemove: () => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDrop: (index: number) => void;
    onDragEnd: () => void;
    isDragging: boolean;
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(item.kind === "existing" ? item.url : null);

    useEffect(() => {
        if (item.kind !== "new") return;
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(item.file);
    }, [item]);

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(index));
                onDragStart(index);
            }}
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                onDragOver(index);
            }}
            onDrop={(e) => {
                e.preventDefault();
                onDrop(index);
            }}
            onDragEnd={onDragEnd}
            className={`relative h-20 w-20 shrink-0 cursor-grab overflow-hidden rounded-lg border border-black/10 transition-opacity active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
        >
            {previewUrl && (
                <Image
                    src={previewUrl}
                    alt="상세이미지"
                    fill
                    sizes="80px"
                    draggable={false}
                    className="pointer-events-none object-cover"
                />
            )}
            <button
                type="button"
                onClick={onRemove}
                aria-label="이미지 삭제"
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-base text-white cursor-pointer"
            >
                ✕
            </button>
        </div>
    );
}

export default function ProductForm({ editId, initialData }: ProductFormOwnProps = {}) {
    const router = useRouter();

    // 등록/수정
    const isEditMode = !!editId;

    // 데이터 관리
    const [form, setForm] = useState({
        name: initialData?.name ?? "",
        category: initialData?.category ?? "",
        product_type: initialData?.product_type ?? "all",
        rating_number: initialData?.rating_number ?? "",
        spec: initialData?.spec ?? "",
        features: initialData?.features ?? "",
        price: initialData?.price != null ? String(initialData.price) : "",
    });

    // 이미지 저장
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [existingMainImageUrl, setExistingMainImageUrl] = useState<string | null>(
        initialData?.main_image_url ?? null
    );
    const [detailImages, setDetailImages] = useState<DetailImageItem[]>(
        (initialData?.detail_images ?? []).map((url) => ({ id: createDetailImageId(), kind: "existing", url }))
    );
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    // toast 관리
    const [vaild, setVaild] = useState<string | null>(null);
    // 이미지 업로드 : fetch + supabase Storage 업로드 시, 별도 loading 필요
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!mainImage) return;
        const reader = new FileReader();
        reader.onload = () => setMainImagePreview(reader.result as string);
        reader.readAsDataURL(mainImage);
    }, [mainImage]);

    const handleCloseToast: React.Dispatch<React.SetStateAction<string | null>> = (value) => {
        if (value === null && vaild === UPDATE_SUCCESS_MESSAGE) {
            router.push("/admin/products");
            router.refresh();
        }
        setVaild(value);
    };

    const createMutation = useMutation({
        mutationFn: async (payload: Record<string, any>) => {
            const response = await fetch("/api/product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "등록에 실패했습니다.");
            return result;
        },
        onSuccess: () => { setVaild("제품이 등록되었습니다."); },
        onError: (err: Error) => setVaild(err.message || "서버 내부 오류가 발생했습니다."),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: Record<string, any> }) => {
            const response = await fetch(`/api/product/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "수정에 실패했습니다.");
            return result;
        },
        onSuccess: () => { setVaild(UPDATE_SUCCESS_MESSAGE); },
        onError: (err: Error) => setVaild(err.message || "서버 내부 오류가 발생했습니다."),
    });

    const loading = isEditMode ? updateMutation.isPending : createMutation.isPending;

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
        if (files.length > 0) {
            setDetailImages((prev) => [
                ...prev,
                ...files.map((file): DetailImageItem => ({ id: createDetailImageId(), kind: "new", file })),
            ]);
        }
        e.target.value = "";
    }, []);

    const removeDetailImage = useCallback((id: string) => {
        setDetailImages((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const reorderDetailImages = useCallback((from: number, to: number) => {
        if (from === to) return;
        setDetailImages((prev) => {
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        });
    }, []);

    const onDetailImageDragStart = useCallback((index: number) => {
        setDraggingIndex(index);
    }, []);

    const onDetailImageDragOver = useCallback((index: number) => {
        setDraggingIndex((current) => {
            if (current === null || current === index) return current;
            reorderDetailImages(current, index);
            return index;
        });
    }, [reorderDetailImages]);

    const onDetailImageDrop = useCallback((_index: number) => {
        setDraggingIndex(null);
    }, []);

    const onDetailImageDragEnd = useCallback(() => {
        setDraggingIndex(null);
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

        if (!form.name.trim()) {
            setVaild("제품 이름을 입력해주세요.");
            return;
        }
        if (!form.category) {
            setVaild("카테고리를 선택해주세요.");
            return;
        }
        if (!form.rating_number.trim()) {
            setVaild("등급분류번호를 입력해주세요.");
            return;
        }
        if (!form.spec.trim()) {
            setVaild("규격을 입력해주세요.");
            return;
        }
        if (form.price && Number.isNaN(Number(form.price))) {
            setVaild("가격은 숫자로 입력해주세요.");
            return;
        }
        if (!mainImage && !existingMainImageUrl) {
            setVaild("대표이미지를 등록해주세요.");
            return;
        }

        setUploading(true);
        
        try {
            const mainImageUrl = mainImage ? await uploadImage(mainImage, "main") : existingMainImageUrl!;
            const detailImageUrls = await Promise.all(
                detailImages.map((item) => (item.kind === "existing" ? item.url : uploadImage(item.file, "detail")))
            );

            const payload = {
                name: form.name,
                category: form.category,
                product_type: form.product_type,
                rating_number: form.rating_number,
                spec: form.spec,
                features: form.features,
                price: form.price,
                main_image_url: mainImageUrl,
                detail_images: detailImageUrls,
            };

            if (isEditMode) {
                await updateMutation.mutateAsync({ id: editId!, payload }).catch(() => {});
            } else {
                await createMutation.mutateAsync(payload).catch(() => {});
            }
        } catch (err) {
            setVaild(err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    }, [form, mainImage, existingMainImageUrl, detailImages, createMutation, updateMutation, loading, uploading, isEditMode, editId, uploadImage]);

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
                        <div className="relative">
                            <select
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={onChangeForm}
                                className="form-input appearance-none pr-9"
                            >
                                <option value="">카테고리를 선택해주세요</option>
                                {PRODUCT_GAME_CATEGORIES.map((c) => (
                                    <option key={c.url} value={c.url}>{c.name}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="product_type" className="form-label">
                            분류 <span className="text-red-400">*</span>
                        </label>
                        <p className="text-base text-muted">사용자 페이지의 신제품/히트상품/추천상품 분류에 사용됩니다.</p>
                        <div className="relative">
                            <select
                                id="product_type"
                                name="product_type"
                                value={form.product_type}
                                onChange={onChangeForm}
                                className="form-input appearance-none pr-9"
                            >
                                {PRODUCT_TYPES.map((t) => (
                                    <option key={t.url} value={t.url}>{t.name}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="rating_number" className="form-label">
                            등급분류번호 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="rating_number"
                            name="rating_number"
                            placeholder="등급분류번호를 입력해주세요."
                            value={form.rating_number}
                            onChange={onChangeForm}
                            className="form-input"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="spec" className="form-label">
                            규격 <span className="text-red-400">*</span>
                        </label>
                        <p className="text-base text-muted">예) 900 x 900 x 2050 mm, 220V, 180kg 와 같이 제품의 규격을 입력해주세요.</p>
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
                        <p className="text-base text-muted">특징 입력은 필수가 아닙니다. 공란일 시, 제품 상세 정보란에 공란으로 표시됩니다.</p>
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
                        <p className="text-base text-muted">가격 미입력 시, &apos;가격 문의&apos;로 표시됩니다.</p>
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
                        <p className="text-base text-muted mb-4">
                            제품의 대표 이미지를 선택해주세요. <br />
                            이미지는 jpg, png, webp, gif 파일만 등록할 수 있으며, 용량은 5MB 이하를 권장드립니다.
                        </p>
                        <div className="flex items-center gap-3">
                            <input type="file" id="main_image" accept="image/*" className="hidden" onChange={onChangeMainImage} />
                            <label
                                htmlFor="main_image"
                                className="px-4 py-2.5 pc:py-2 bg-surface hover:bg-gray-200 text-body text-base font-medium rounded-lg cursor-pointer transition-colors shrink-0 border border-gray-300"
                            >
                                파일 선택
                            </label>
                            <span className="min-w-0 flex-1 truncate text-base text-muted">
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
                        <p className="text-base text-muted mb-4">
                            제품의 상세 이미지를 선택해주세요. 상세 이미지 등록은 필수가 아닙니다.<br />
                            이미지를 등록하지 않을 경우, 제품 상세 정보란에 이미지를 표시하지 않습니다.<br />
                            이미지는 jpg, png, webp, gif 파일만 등록할 수 있으며, 용량은 5MB 이하를 권장드립니다.<br />
                            썸네일을 드래그하면 순서를 바꿀 수 있으며, 등록된 순서대로 상세 페이지에 표시됩니다.
                        </p>
                        <div className="flex items-center gap-3">
                            <input type="file" id="detail_images" accept="image/*" multiple className="hidden" onChange={onChangeDetailImages} />
                            <label
                                htmlFor="detail_images"
                                className="px-4 py-2.5 pc:py-2 bg-surface hover:bg-gray-200 text-body text-base font-medium rounded-lg cursor-pointer transition-colors shrink-0 border border-gray-300"
                            >
                                파일 추가
                            </label>
                            <span className="text-base text-muted">
                                {detailImages.length}장 등록됨
                            </span>
                        </div>

                        {detailImages.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-3">
                                {detailImages.map((item, index) => (
                                    <DetailImageThumb
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        onRemove={() => removeDetailImage(item.id)}
                                        onDragStart={onDetailImageDragStart}
                                        onDragOver={onDetailImageDragOver}
                                        onDrop={onDetailImageDrop}
                                        onDragEnd={onDetailImageDragEnd}
                                        isDragging={draggingIndex === index}
                                    />
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
