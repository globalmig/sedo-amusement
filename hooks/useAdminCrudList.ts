"use client";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { deleteJson, patchJson, postJson } from "@/lib/adminFetch";

interface UseAdminCrudListOptions<TItem> {
    queryKey: QueryKey;
    fetchList: () => Promise<TItem[]>;
    // 생성은 baseUrl로, 수정/삭제는 `${baseUrl}/${id}`로 요청한다.
    baseUrl: string;
    deleteErrorMessage?: string;
}

// FAQ/컨설팅 분야/컨설팅 절차 관리자 화면이 똑같이 반복하던
// "목록 조회 + 등록/수정/삭제 + 편집중인 항목 + 에러/삭제확인 토스트" 상태를 한 군데로 모은 훅.
// 각 화면의 폼 모양(form state)과 카드 렌더링은 페이지마다 다르므로 훅이 책임지지 않는다.
export function useAdminCrudList<TItem extends { id: number }>({
    queryKey,
    fetchList,
    baseUrl,
    deleteErrorMessage = "삭제에 실패했습니다.",
}: UseAdminCrudListOptions<TItem>) {
    const queryClient = useQueryClient();
    const { data: items = [], isLoading } = useQuery({ queryKey, queryFn: fetchList });

    const [editingId, setEditingId] = useState<number | "new" | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const invalidate = useCallback(
        () => queryClient.invalidateQueries({ queryKey }),
        [queryClient, queryKey]
    );

    const createMutation = useMutation({
        mutationFn: (payload: Record<string, unknown>) => postJson(baseUrl, payload),
        onSuccess: () => { setEditingId(null); invalidate(); },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
            patchJson(`${baseUrl}/${id}`, payload),
        onSuccess: () => { setEditingId(null); invalidate(); },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteJson(`${baseUrl}/${id}`, deleteErrorMessage),
        onSuccess: invalidate,
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const saving = createMutation.isPending || updateMutation.isPending;

    return {
        items,
        isLoading,
        invalidate,
        editingId,
        setEditingId,
        errorMsg,
        setErrorMsg,
        deleteId,
        setDeleteId,
        createMutation,
        updateMutation,
        deleteMutation,
        saving,
    };
}
