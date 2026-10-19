"use client";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Toast from "@/components/common/Toast";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/common/AdminIcons";
import { patchJson } from "@/lib/adminFetch";
import { useAdminCrudList } from "@/hooks/useAdminCrudList";
import { ConsultingArea } from "@/types/consulting";

interface AreaFormState {
    title: string;
    subtitle: string;
    pointsText: string;
}

const EMPTY_AREA_FORM: AreaFormState = { title: "", subtitle: "", pointsText: "" };

function areaToForm(area: ConsultingArea): AreaFormState {
    return { title: area.title, subtitle: area.subtitle, pointsText: area.points.join("\n") };
}

function formToPayload(form: AreaFormState) {
    return {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        points: form.pointsText.split("\n").map((p) => p.trim()).filter(Boolean),
    };
}

function AreaEditForm({
    form,
    onChange,
    onSave,
    onCancel,
    saving,
}: {
    form: AreaFormState;
    onChange: (next: AreaFormState) => void;
    onSave: () => void;
    onCancel: () => void;
    saving: boolean;
}) {
    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
                <label className="form-label">제목</label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => onChange({ ...form, title: e.target.value })}
                    className="form-input"
                    placeholder="예) 상권 분석 및 최적의 공간 기획"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="form-label">소제목</label>
                <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => onChange({ ...form, subtitle: e.target.value })}
                    className="form-input"
                    placeholder="예) 부동산 · 입지 컨설팅"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="form-label">세부 항목 (한 줄에 하나씩 입력)</label>
                <textarea
                    value={form.pointsText}
                    onChange={(e) => onChange({ ...form, pointsText: e.target.value })}
                    rows={4}
                    className="form-input resize-none"
                    placeholder={"지역 상권 및 주 타깃층에 맞춘 수익 모델 설계\n특수 상권 입점 및 부동산 개발 연계 프로젝트 자문"}
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

export default function AdminConsultingAreasPage() {
    const [form, setForm] = useState<AreaFormState>(EMPTY_AREA_FORM);

    const {
        items: areas,
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
    } = useAdminCrudList<ConsultingArea>({
        queryKey: ["consulting-areas"],
        fetchList: async () => {
            const res = await fetch("/api/consulting/areas");
            const { data, error } = await res.json();
            if (!res.ok || error) console.error("컨설팅 분야 조회 실패:", error ?? res.status);
            return (data ?? []) as ConsultingArea[];
        },
        baseUrl: "/api/consulting/areas",
    });

    const reorderMutation = useMutation({
        mutationFn: async ({ a, b }: { a: ConsultingArea; b: ConsultingArea }) => {
            await Promise.all([
                patchJson(`/api/consulting/areas/${a.id}`, { sort_order: b.sort_order }),
                patchJson(`/api/consulting/areas/${b.id}`, { sort_order: a.sort_order }),
            ]);
        },
        onSuccess: invalidate,
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const startEdit = useCallback((area: ConsultingArea) => {
        setEditingId(area.id);
        setForm(areaToForm(area));
    }, [setEditingId]);

    const startNew = useCallback(() => {
        setEditingId("new");
        setForm(EMPTY_AREA_FORM);
    }, [setEditingId]);

    const saveEdit = () => {
        if (!form.title.trim()) {
            setErrorMsg("제목을 입력해주세요.");
            return;
        }
        const payload = formToPayload(form);
        if (editingId === "new") {
            createMutation.mutate(payload);
        } else if (editingId !== null) {
            updateMutation.mutate({ id: editingId, payload });
        }
    };

    const moveArea = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= areas.length) return;
        reorderMutation.mutate({ a: areas[index], b: areas[targetIndex] });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-title">주요 컨설팅 제공 분야 관리</h1>
                <p className="mt-2 text-base text-muted">
                    창업 컨설팅 페이지(/consulting)에 노출되는 제공 분야 항목을 관리합니다.
                </p>
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-end">
                    {editingId === null && (
                        <button type="button" onClick={startNew} className="btn-primary">
                            분야 추가
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <p className="px-5 py-8 text-center text-base text-muted">정보를 불러오는 중입니다.</p>
                ) : (
                    <div className="space-y-3">
                        {editingId === "new" && (
                            <div className="card p-6">
                                <AreaEditForm form={form} onChange={setForm} onSave={saveEdit} onCancel={() => setEditingId(null)} saving={saving} />
                            </div>
                        )}
                        {areas.map((area, index) => (
                            <div key={area.id} className="card p-6">
                                {editingId === area.id ? (
                                    <AreaEditForm form={form} onChange={setForm} onSave={saveEdit} onCancel={() => setEditingId(null)} saving={saving} />
                                ) : (
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <p className="text-base font-bold text-primary">0{index + 1}</p>
                                            <div>
                                                <h3 className="text-xl font-bold text-title">{area.title}</h3>
                                                <p className="mt-0.5 text-base text-muted">{area.subtitle}</p>
                                                <ul className="mt-2 space-y-1 text-base text-body">
                                                    {area.points.map((p, i) => <li key={i}>· {p}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveArea(index, -1)}
                                                disabled={index === 0}
                                                className="rounded-lg border border-black p-1.5 text-title hover:text-primary disabled:opacity-50"
                                                aria-label="위로 이동"
                                            >
                                                <ArrowUpIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveArea(index, 1)}
                                                disabled={index === areas.length - 1}
                                                className="rounded-lg border border-black p-1.5 text-title hover:text-primary disabled:opacity-50"
                                                aria-label="아래로 이동"
                                            >
                                                <ArrowDownIcon className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => startEdit(area)} className="ml-2 text-base font-medium text-primary hover:underline">
                                                수정
                                            </button>
                                            <button type="button" onClick={() => setDeleteId(area.id)} className="text-base font-medium text-muted hover:text-red-500">
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {areas.length === 0 && editingId !== "new" && (
                            <div className="card px-5 py-16 text-center text-base text-muted">
                                등록된 컨설팅 분야가 없습니다.
                            </div>
                        )}
                    </div>
                )}

                <Toast
                    message={deleteId !== null ? "이 항목을 삭제하시겠습니까?" : null}
                    setMessage={() => setDeleteId(null)}
                    onConfirm={deleteId !== null ? () => deleteMutation.mutate(deleteId) : undefined}
                />
                <Toast message={errorMsg} setMessage={() => setErrorMsg(null)} />
            </section>
        </div>
    );
}
