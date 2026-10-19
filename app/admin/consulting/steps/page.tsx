"use client";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Toast from "@/components/common/Toast";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/common/AdminIcons";
import { patchJson } from "@/lib/adminFetch";
import { useAdminCrudList } from "@/hooks/useAdminCrudList";
import { ConsultingStep } from "@/types/consulting";

interface StepFormState {
    title: string;
    description: string;
}

const EMPTY_STEP_FORM: StepFormState = { title: "", description: "" };

function StepEditForm({
    form,
    onChange,
    onSave,
    onCancel,
    saving,
}: {
    form: StepFormState;
    onChange: (next: StepFormState) => void;
    onSave: () => void;
    onCancel: () => void;
    saving: boolean;
}) {
    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
                <label className="form-label">단계 제목</label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => onChange({ ...form, title: e.target.value })}
                    className="form-input"
                    placeholder="예) 온라인 문의 접수"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="form-label">설명</label>
                <textarea
                    value={form.description}
                    onChange={(e) => onChange({ ...form, description: e.target.value })}
                    rows={3}
                    className="form-input resize-none"
                    placeholder="창업 분야, 지역, 예산 등 기본 정보를 확인합니다."
                />
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="btn-ghost" disabled={saving}>
                    취소
                </button>
                <button type="button" onClick={onSave} className="btn-primary" disabled={saving}>
                    {saving ? "저장 중..." : "저장"}
                </button>
            </div>
        </div>
    );
}

export default function AdminConsultingStepsPage() {
    const [form, setForm] = useState<StepFormState>(EMPTY_STEP_FORM);

    const {
        items: steps,
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
    } = useAdminCrudList<ConsultingStep>({
        queryKey: ["consulting-steps"],
        fetchList: async () => {
            const res = await fetch("/api/consulting/steps");
            const { data, error } = await res.json();
            if (!res.ok || error) console.error("컨설팅 절차 조회 실패:", error ?? res.status);
            return (data ?? []) as ConsultingStep[];
        },
        baseUrl: "/api/consulting/steps",
    });

    const reorderMutation = useMutation({
        mutationFn: async ({ a, b }: { a: ConsultingStep; b: ConsultingStep }) => {
            await Promise.all([
                patchJson(`/api/consulting/steps/${a.id}`, { sort_order: b.sort_order }),
                patchJson(`/api/consulting/steps/${b.id}`, { sort_order: a.sort_order }),
            ]);
        },
        onSuccess: invalidate,
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const startEdit = useCallback((step: ConsultingStep) => {
        setEditingId(step.id);
        setForm({ title: step.title, description: step.description });
    }, [setEditingId]);

    const startNew = useCallback(() => {
        setEditingId("new");
        setForm(EMPTY_STEP_FORM);
    }, [setEditingId]);

    const saveEdit = () => {
        if (!form.title.trim()) {
            setErrorMsg("단계 제목을 입력해주세요.");
            return;
        }
        const payload = { title: form.title.trim(), description: form.description.trim() };
        if (editingId === "new") {
            createMutation.mutate(payload);
        } else if (editingId !== null) {
            updateMutation.mutate({ id: editingId, payload });
        }
    };

    const moveStep = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= steps.length) return;
        reorderMutation.mutate({ a: steps[index], b: steps[targetIndex] });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-title">컨설팅 진행 절차 관리</h1>
                <p className="mt-2 text-base text-muted">
                    창업 컨설팅 페이지(/consulting)에 노출되는 진행 절차 단계를 관리합니다.
                </p>
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-end">
                    {editingId === null && (
                        <button type="button" onClick={startNew} className="btn-primary">
                            단계 추가
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <p className="px-5 py-8 text-center text-base text-muted">정보를 불러오는 중입니다.</p>
                ) : (
                    <div className="space-y-3">
                        {editingId === "new" && (
                            <div className="card p-6">
                                <StepEditForm form={form} onChange={setForm} onSave={saveEdit} onCancel={() => setEditingId(null)} saving={saving} />
                            </div>
                        )}
                        {steps.map((step, index) => (
                            <div key={step.id} className="card p-6">
                                {editingId === step.id ? (
                                    <StepEditForm form={form} onChange={setForm} onSave={saveEdit} onCancel={() => setEditingId(null)} saving={saving} />
                                ) : (
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <p className="text-base font-bold text-primary">0{index + 1}</p>
                                            <div>
                                                <h3 className="text-xl font-bold text-title">{step.title}</h3>
                                                <p className="mt-1 text-base text-body">{step.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveStep(index, -1)}
                                                disabled={index === 0}
                                                className="rounded-lg border border-black p-1.5 text-title hover:text-primary disabled:opacity-50"
                                                aria-label="위로 이동"
                                            >
                                                <ArrowUpIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveStep(index, 1)}
                                                disabled={index === steps.length - 1}
                                                className="rounded-lg border border-black p-1.5 text-title hover:text-primary disabled:opacity-50"
                                                aria-label="아래로 이동"
                                            >
                                                <ArrowDownIcon className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => startEdit(step)} className="ml-2 text-base font-medium text-primary hover:underline">
                                                수정
                                            </button>
                                            <button type="button" onClick={() => setDeleteId(step.id)} className="text-base font-medium text-muted hover:text-red-500">
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {steps.length === 0 && editingId !== "new" && (
                            <div className="card px-5 py-16 text-center text-base text-muted">
                                등록된 진행 절차가 없습니다.
                            </div>
                        )}
                    </div>
                )}

                <Toast
                    message={deleteId !== null ? "이 단계를 삭제하시겠습니까?" : null}
                    setMessage={() => setDeleteId(null)}
                    onConfirm={deleteId !== null ? () => deleteMutation.mutate(deleteId) : undefined}
                />
                <Toast message={errorMsg} setMessage={() => setErrorMsg(null)} />
            </section>
        </div>
    );
}
