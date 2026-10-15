"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export type DetailImageItem =
    | { id: string; kind: "existing"; url: string }
    | { id: string; kind: "new"; file: File };

let detailImageIdSeq = 0;
export function createDetailImageId() {
    detailImageIdSeq += 1;
    return `detail-${Date.now()}-${detailImageIdSeq}`;
}

function ChevronLeftIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
            className={className}
        >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ChevronRightIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
            className={className}
        >
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function DetailImageThumb({
    item,
    isFirst,
    isLast,
    onRemove,
    onMoveLeft,
    onMoveRight,
}: {
    item: DetailImageItem;
    isFirst: boolean;
    isLast: boolean;
    onRemove: () => void;
    onMoveLeft: () => void;
    onMoveRight: () => void;
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(item.kind === "existing" ? item.url : null);

    useEffect(() => {
        if (item.kind !== "new") return;
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(item.file);
    }, [item]);

    return (
        <div className="flex w-40 shrink-0 flex-col gap-1">
            <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-black/10">
                {previewUrl && (
                    <Image
                        src={previewUrl}
                        alt="상세이미지"
                        fill
                        sizes="160px"
                        draggable={false}
                        className="pointer-events-none object-cover"
                    />
                )}
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label="이미지 삭제"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-base text-white cursor-pointer"
                >
                    ✕
                </button>
            </div>
            <div className="flex items-center justify-end gap-1">
                <button
                    type="button"
                    onClick={onMoveLeft}
                    disabled={isFirst}
                    aria-label="왼쪽으로 이동"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-title hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 border border-gray-500"
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={onMoveRight}
                    disabled={isLast}
                    aria-label="오른쪽으로 이동"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-title hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 border border-gray-500"
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
