"use client";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Toast from "@/components/common/Toast";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/common/AdminIcons";
import { patchJson } from "@/lib/adminFetch";
import { useAdminCrudList } from "@/hooks/useAdminCrudList";
import { Category } from "@/types/category";

export default function AdminCategoriesPage() {
    const [nameInput, setNameInput] = useState("");

    const {
        items: categories,
        isLoading,
        editingId,
        setEditingId,
        errorMsg,
        setErrorMsg,
        deleteId,
        setDeleteId,
        createMutation,
        updateMutation,
        deleteMutation,
        invalidate,
        saving,
    } = useAdminCrudList<Category>({
        queryKey: ["categories"],
        fetchList: async () => {
            const res = await fetch("/api/category");
            const { data, error } = await res.json();
            if (!res.ok || error) console.error("카테고리 조회 실패:", error ?? res.status);
            return (data ?? []) as Category[];
        },
        baseUrl: "/api/category",
        deleteErrorMessage: "삭제에 실패했습니다.",
    });

    const reorderMutation = useMutation({
        mutationFn: async ({ a, b }: { a: Category; b: Category }) => {
            await Promise.all([
                patchJson(`/api/category/${a.id}`, { sort_order: b.sort_order }),
                patchJson(`/api/category/${b.id}`, { sort_order: a.sort_order }),
            ]);
        },
        onSuccess: invalidate,
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const startEdit = useCallback((category: Category) => {
        setEditingId(category.id);
        setNameInput(category.name);
    }, [setEditingId]);

    const startNew = useCallback(() => {
        setEditingId("new");
        setNameInput("");
    }, [setEditingId]);

    const saveEdit = () => {
        const name = nameInput.trim();
        if (!name) {
            setErrorMsg("카테고리 이름을 입력해주세요.");
            return;
        }
        if (editingId === "new") {
            createMutation.mutate({ name });
        } else if (editingId !== null) {
            updateMutation.mutate({ id: editingId, payload: { name } });
        }
    };

    const moveCategory = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= categories.length) return;
        reorderMutation.mutate({ a: categories[index], b: categories[targetIndex] });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-title">제품 카테고리 관리</h1>
                <p className="mt-2 text-base text-muted">
                    제품 등록/필터에 쓰이는 카테고리(크레인/슈팅/리듬 등)를 추가, 삭제, 순서 변경할 수 있습니다.
                    이름을 바꿔도 이미 등록된 제품과의 연결은 그대로 유지됩니다.
                </p>
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-end">
                    {editingId === null && (
                        <button type="button" onClick={startNew} className="btn-primary">
                            카테고리 추가
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <p className="px-5 py-8 text-center text-base text-muted">정보를 불러오는 중입니다.</p>
                ) : (
                    <div className="space-y-3">
                        {editingId === "new" && (
                            <div className="card flex flex-col gap-3 p-6 pc:flex-row pc:items-center">
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    placeholder="예) VR 체험게임"
                                    className="form-input flex-1"
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setEditingId(null)} className="btn-ghost" disabled={saving}>
                                        취소
                                    </button>
                                    <button type="button" onClick={saveEdit} className="btn-primary" disabled={saving}>
                                        {saving ? "저장 중..." : "저장"}
                                    </button>
                                </div>
                            </div>
                        )}
                        {categories.map((category, index) => (
                            <div key={category.id} className="card flex items-center justify-between gap-4 p-6">
                                {editingId === category.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={nameInput}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            className="form-input flex-1"
                                        />
                                        <div className="flex shrink-0 justify-end gap-2">
                                            <button type="button" onClick={() => setEditingId(null)} className="btn-ghost" disabled={saving}>
                                                취소
                                            </button>
                                            <button type="button" onClick={saveEdit} className="btn-primary" disabled={saving}>
                                                {saving ? "저장 중..." : "저장"}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-bold text-title">{category.name}</h3>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveCategory(index, -1)}
                                                disabled={index === 0}
                                                className="rounded-lg border border-black p-1.5 text-title hover:text-primary disabled:opacity-50"
                                                aria-label="위로 이동"
                                            >
                                                <ArrowUpIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveCategory(index, 1)}
                                                disabled={index === categories.length - 1}
                                                className="rounded-lg border border-black p-1.5 text-title hover:text-primary disabled:opacity-50"
                                                aria-label="아래로 이동"
                                            >
                                                <ArrowDownIcon className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => startEdit(category)} className="ml-2 text-base font-medium text-primary hover:underline">
                                                수정
                                            </button>
                                            <button type="button" onClick={() => setDeleteId(category.id)} className="text-base font-medium text-muted hover:text-red-500">
                                                삭제
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        {categories.length === 0 && editingId !== "new" && (
                            <div className="card px-5 py-16 text-center text-base text-muted">
                                등록된 카테고리가 없습니다.
                            </div>
                        )}
                    </div>
                )}

                <Toast
                    message={deleteId !== null ? "이 카테고리를 삭제하시겠습니까?" : null}
                    setMessage={() => setDeleteId(null)}
                    onConfirm={deleteId !== null ? () => deleteMutation.mutate(deleteId) : undefined}
                />
                <Toast message={errorMsg} setMessage={() => setErrorMsg(null)} />
            </section>
        </div>
    );
}
