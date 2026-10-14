"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "@/components/common/Toast";
import { ConsultingArea, ConsultingStep } from "@/types/consulting";

function ArrowUpIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ArrowDownIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

async function patchJson(url: string, payload: Record<string, unknown>) {
    const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "수정에 실패했습니다.");
    return result;
}

// ─────────────────────────────── 주요 컨설팅 제공 분야 ───────────────────────────────

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
            <div className="flex gap-2">
                <button type="button" onClick={onCancel} className="btn-ghost flex-1" disabled={saving}>
                    취소
                </button>
                <button type="button" onClick={onSave} className="btn-primary flex-1" disabled={saving}>
                    {saving ? "저장 중..." : "저장"}
                </button>
            </div>
        </div>
    );
}

function ConsultingAreasSection() {
    const queryClient = useQueryClient();
    const { data: areas = [], isLoading } = useQuery({
        queryKey: ["consulting-areas"],
        queryFn: async () => {
            const res = await fetch("/api/consulting/areas");
            const { data, error } = await res.json();
            if (!res.ok || error) console.error("컨설팅 분야 조회 실패:", error ?? res.status);
            return (data ?? []) as ConsultingArea[];
        },
    });

    const [editingId, setEditingId] = useState<number | "new" | null>(null);
    const [form, setForm] = useState<AreaFormState>(EMPTY_AREA_FORM);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["consulting-areas"] });

    const createMutation = useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            const res = await fetch("/api/consulting/areas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "등록에 실패했습니다.");
            return result;
        },
        onSuccess: () => { setEditingId(null); invalidate(); },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
            patchJson(`/api/consulting/areas/${id}`, payload),
        onSuccess: () => { setEditingId(null); invalidate(); },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/consulting/areas/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const result = await res.json().catch(() => null);
                throw new Error(result?.error || "삭제에 실패했습니다.");
            }
        },
        onSuccess: invalidate,
        onError: (err: Error) => setErrorMsg(err.message),
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
    }, []);

    const startNew = useCallback(() => {
        setEditingId("new");
        setForm(EMPTY_AREA_FORM);
    }, []);

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

    const saving = createMutation.isPending || updateMutation.isPending;

    const moveArea = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= areas.length) return;
        reorderMutation.mutate({ a: areas[index], b: areas[targetIndex] });
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-title">주요 컨설팅 제공 분야</h2>
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
                                            <h3 className="text-base font-bold text-title">{area.title}</h3>
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
                                            className="rounded-lg border border-black/10 p-1.5 text-muted hover:text-primary disabled:opacity-30"
                                            aria-label="위로 이동"
                                        >
                                            <ArrowUpIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveArea(index, 1)}
                                            disabled={index === areas.length - 1}
                                            className="rounded-lg border border-black/10 p-1.5 text-muted hover:text-primary disabled:opacity-30"
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
                vaild={deleteId !== null ? "이 항목을 삭제하시겠습니까?" : null}
                setVaild={() => setDeleteId(null)}
                onConfirm={deleteId !== null ? () => deleteMutation.mutate(deleteId) : undefined}
            />
            <Toast vaild={errorMsg} setVaild={() => setErrorMsg(null)} />
        </section>
    );
}

// ─────────────────────────────── 컨설팅 진행 절차 ───────────────────────────────

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
            <div className="flex gap-2">
                <button type="button" onClick={onCancel} className="btn-ghost flex-1" disabled={saving}>
                    취소
                </button>
                <button type="button" onClick={onSave} className="btn-primary flex-1" disabled={saving}>
                    {saving ? "저장 중..." : "저장"}
                </button>
            </div>
        </div>
    );
}

function ConsultingStepsSection() {
    const queryClient = useQueryClient();
    const { data: steps = [], isLoading } = useQuery({
        queryKey: ["consulting-steps"],
        queryFn: async () => {
            const res = await fetch("/api/consulting/steps");
            const { data, error } = await res.json();
            if (!res.ok || error) console.error("컨설팅 절차 조회 실패:", error ?? res.status);
            return (data ?? []) as ConsultingStep[];
        },
    });

    const [editingId, setEditingId] = useState<number | "new" | null>(null);
    const [form, setForm] = useState<StepFormState>(EMPTY_STEP_FORM);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["consulting-steps"] });

    const createMutation = useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            const res = await fetch("/api/consulting/steps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "등록에 실패했습니다.");
            return result;
        },
        onSuccess: () => { setEditingId(null); invalidate(); },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
            patchJson(`/api/consulting/steps/${id}`, payload),
        onSuccess: () => { setEditingId(null); invalidate(); },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/consulting/steps/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const result = await res.json().catch(() => null);
                throw new Error(result?.error || "삭제에 실패했습니다.");
            }
        },
        onSuccess: invalidate,
        onError: (err: Error) => setErrorMsg(err.message),
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
    }, []);

    const startNew = useCallback(() => {
        setEditingId("new");
        setForm(EMPTY_STEP_FORM);
    }, []);

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

    const saving = createMutation.isPending || updateMutation.isPending;

    const moveStep = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= steps.length) return;
        reorderMutation.mutate({ a: steps[index], b: steps[targetIndex] });
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-title">컨설팅 진행 절차</h2>
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
                                            <h3 className="text-base font-bold text-title">{step.title}</h3>
                                            <p className="mt-1 text-base text-body">{step.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => moveStep(index, -1)}
                                            disabled={index === 0}
                                            className="rounded-lg border border-black/10 p-1.5 text-muted hover:text-primary disabled:opacity-30"
                                            aria-label="위로 이동"
                                        >
                                            <ArrowUpIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveStep(index, 1)}
                                            disabled={index === steps.length - 1}
                                            className="rounded-lg border border-black/10 p-1.5 text-muted hover:text-primary disabled:opacity-30"
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
                vaild={deleteId !== null ? "이 단계를 삭제하시겠습니까?" : null}
                setVaild={() => setDeleteId(null)}
                onConfirm={deleteId !== null ? () => deleteMutation.mutate(deleteId) : undefined}
            />
            <Toast vaild={errorMsg} setVaild={() => setErrorMsg(null)} />
        </section>
    );
}

export default function AdminConsultingPage() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-2xl font-black text-title">컨설팅 콘텐츠 관리</h1>
                <p className="mt-2 text-base text-muted">
                    창업 컨설팅 페이지(/consulting)에 노출되는 제공 분야와 진행 절차를 관리합니다. FAQ는{" "}
                    <Link href="/admin/faq" className="text-primary hover:underline">FAQ 관리</Link> 메뉴에서 수정할 수 있습니다.
                </p>
            </div>
            <ConsultingAreasSection />
            <ConsultingStepsSection />
        </div>
    );
}
