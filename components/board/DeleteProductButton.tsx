"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDelete } from "@/hooks/useDelete";
import Toast from "../common/Toast";

interface DeleteProductButtonProps {
    productId: number;
    redirectTo?: string;
}

export default function DeleteProductButton({ productId, redirectTo = "/admin/products" }: DeleteProductButtonProps) {
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { remove, loading } = useDelete("/api/product", {
        onSuccess: () => {
            router.push(redirectTo);
            router.refresh();
        },
        onError: (message) => setErrorMsg(message),
    });

    return (
        <>
            <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={loading}
                className="btn-ghost"
            >
                {loading ? "삭제 중..." : "삭제"}
            </button>

            <Toast
                vaild={confirmOpen ? "이 제품을 삭제하시겠습니까?" : null}
                setVaild={() => setConfirmOpen(false)}
                onConfirm={() => remove(productId)}
            />
            <Toast vaild={errorMsg} setVaild={() => setErrorMsg(null)} />
        </>
    );
}
