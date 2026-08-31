"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Toast from "../common/Toast";

interface DeleteProductButtonProps {
    productId: number;
    redirectTo?: string;
    className?: string;
}

export default function DeleteProductButton({
    productId,
    redirectTo = "/admin/products",
    className = "",
}: DeleteProductButtonProps) {
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`/api/product/${id}`, { method: "DELETE" });
            if (!response.ok) {
                const result = await response.json().catch(() => null);
                throw new Error(result?.error || "삭제에 실패했습니다.");
            }
            return true;
        },
        onSuccess: () => {
            router.push(redirectTo);
            router.refresh();
        },
        onError: (err: Error) => setErrorMsg(err.message || "서버 내부 오류가 발생했습니다."),
    });
    const loading = deleteMutation.isPending;

    return (
        <>
            <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={loading}
                className={`btn-ghost ${className}`}
            >
                {loading ? "삭제 중..." : "삭제"}
            </button>

            <Toast
                vaild={confirmOpen ? "이 제품을 삭제하시겠습니까?" : null}
                setVaild={() => setConfirmOpen(false)}
                onConfirm={() => deleteMutation.mutate(productId)}
            />
            <Toast vaild={errorMsg} setVaild={() => setErrorMsg(null)} />
        </>
    );
}
