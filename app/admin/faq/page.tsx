"use client";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "@/components/common/Toast";
import { FAQ_CATEGORIES, FaqCategoryKey } from "@/datas/faq";
import { FaqItem } from "@/types/faq";

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

interface FaqFormState {
    category: FaqCategoryKey;
    question: string;
    answer: string;
}

function emptyForm(category: FaqCategoryKey): FaqFormState {
    return { category, question: "", answer: "" };
}

function FaqEditForm({
    form,
    onChange,
    onSave,
    onCancel,
    saving,
}: {
    form: FaqFormState;
    onChange: (next: FaqFormState) => void;
    onSave: () => void;
    onCancel: () => void;
    saving: boolean;
}) {
    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
                <label className="form-label">카테고리</label>
                <select
                    value={form.category}
                    onChange={(e) => onChange({ ...form, category: e.target.value as FaqCategoryKey })}
                    className="form-input"
                >
                    {FAQ_CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="form-label">질문</label>
                <textarea
                    value={form.question}
                    onChange={(e) => onChange({ ...form, question: e.target.value })}
                    rows={2}
                    className="form-input resize-none"
                    placeholder="고객이 자주 묻는 질문을 입력해주세요."
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="form-label">답변</label>
                <textarea
                    value={form.answer}
                    onChange={(e) => onChange({ ...form, answer: e.target.value })}
                    rows={4}
                    className="form-input resize-none"
                    placeholder="답변 내용을 입력해주세요."
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

export default function AdminFaqPage() {
    const queryClient = useQueryClient();
    const [activeCategory, setActiveCategory] = useState<FaqCategoryKey>(FAQ_CATEGORIES[0].key);

    const { data: items = [], isLoading } = useQuery({
        queryKey: ["faq-items", activeCategory],
        queryFn: async () => {
            const res = await fetch(`/api/faq?category=${activeCategory}`);
            const { data, error } = await res.json();
            if (!res.ok || error) console.error("FAQ 조회 실패:", error ?? res.status);
            return (data ?? []) as FaqItem[];
        },
    });

    const [editingId, setEditingId] = useState<number | "new" | null>(null);
    const [form, setForm] = useState<FaqFormState>(emptyForm(activeCategory));
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["faq-items", activeCategory] });

    const selectCategory = useCallback((key: FaqCategoryKey) => {
        setActiveCategory(key);
        setEditingId(null);
    }, []);

    const createMutation = useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            const res = await fetch("/api/faq", {
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
            patchJson(`/api/faq/${id}`, payload),
        onSuccess: () => { setEditingId(null); invalidate(); },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/faq/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const result = await res.json().catch(() => null);
                throw new Error(result?.error || "삭제에 실패했습니다.");
            }
        },
        onSuccess: invalidate,
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const reorderMutation = useMutation({
        mutationFn: async ({ a, b }: { a: FaqItem; b: FaqItem }) => {
            await Promise.all([
                patchJson(`/api/faq/${a.id}`, { sort_order: b.sort_order }),
                patchJson(`/api/faq/${b.id}`, { sort_order: a.sort_order }),
            ]);
        },
        onSuccess: invalidate,
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const startEdit = useCallback((item: FaqItem) => {
        setEditingId(item.id);
        setForm({ category: item.category, question: item.question, answer: item.answer });
    }, []);

    const startNew = useCallback(() => {
        setEditingId("new");
        setForm(emptyForm(activeCategory));
    }, [activeCategory]);

    const saveEdit = () => {
        if (!form.question.trim()) {
            setErrorMsg("질문을 입력해주세요.");
            return;
        }
        if (!form.answer.trim()) {
            setErrorMsg("답변을 입력해주세요.");
            return;
        }
        const payload = { category: form.category, question: form.question.trim(), answer: form.answer.trim() };
        if (editingId === "new") {
            createMutation.mutate(payload);
        } else if (editingId !== null) {
            updateMutation.mutate({ id: editingId, payload });
        }
    };

    const saving = createMutation.isPending || updateMutation.isPending;

    const moveItem = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= items.length) return;
        reorderMutation.mutate({ a: items[index], b: items[targetIndex] });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 pc:flex-row pc:items-center pc:justify-between">
                <div>
                    <h1 className="text-2xl font-black text-title">FAQ 관리</h1>
                    <p className="mt-2 text-base text-muted">
                        구매/배송/A·S/보증/환불/창업 컨설팅 등 카테고리별 자주 묻는 질문을 관리합니다.
                    </p>
                </div>
                {editingId === null && (
                    <button type="button" onClick={startNew} className="btn-primary shrink-0">
                        질문 추가
                    </button>
                )}
            </div>

            <div className="card overflow-x-auto">
                <nav className="flex gap-1 px-2 whitespace-nowrap">
                    {FAQ_CATEGORIES.map((category) => (
                        <button
                            key={category.key}
                            type="button"
                            onClick={() => selectCategory(category.key)}
                            className={`inline-block cursor-pointer border-b-2 px-4 py-3 text-base font-medium transition-colors ${activeCategory === category.key
                                ? "border-primary font-semibold text-primary"
                                : "border-transparent text-muted hover:text-title"
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </nav>
            </div>

            {isLoading ? (
                <p className="px-5 py-8 text-center text-base text-muted">정보를 불러오는 중입니다.</p>
            ) : (
                <div className="space-y-3">
                    {editingId === "new" && (
                        <div className="card p-6">
                            <FaqEditForm form={form} onChange={setForm} onSave={saveEdit} onCancel={() => setEditingId(null)} saving={saving} />
                        </div>
                    )}
                    {items.map((item, index) => (
                        <div key={item.id} className="card p-6">
                            {editingId === item.id ? (
                                <FaqEditForm form={form} onChange={setForm} onSave={saveEdit} onCancel={() => setEditingId(null)} saving={saving} />
                            ) : (
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="flex gap-2 font-bold text-title">
                                            <span className="text-primary">Q</span>
                                            <span>{item.question}</span>
                                        </p>
                                        <p className="mt-2 flex gap-2 text-base text-body">
                                            <span className="font-bold text-muted">A</span>
                                            <span>{item.answer}</span>
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => moveItem(index, -1)}
                                            disabled={index === 0}
                                            className="rounded-lg border border-black/10 p-1.5 text-muted hover:text-primary disabled:opacity-30"
                                            aria-label="위로 이동"
                                        >
                                            <ArrowUpIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveItem(index, 1)}
                                            disabled={index === items.length - 1}
                                            className="rounded-lg border border-black/10 p-1.5 text-muted hover:text-primary disabled:opacity-30"
                                            aria-label="아래로 이동"
                                        >
                                            <ArrowDownIcon className="h-4 w-4" />
                                        </button>
                                        <button type="button" onClick={() => startEdit(item)} className="ml-2 text-base font-medium text-primary hover:underline">
                                            수정
                                        </button>
                                        <button type="button" onClick={() => setDeleteId(item.id)} className="text-base font-medium text-muted hover:text-red-500">
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {items.length === 0 && editingId !== "new" && (
                        <div className="card px-5 py-16 text-center text-base text-muted">
                            등록된 FAQ가 없습니다.
                        </div>
                    )}
                </div>
            )}

            <Toast
                vaild={deleteId !== null ? "이 질문을 삭제하시겠습니까?" : null}
                setVaild={() => setDeleteId(null)}
                onConfirm={deleteId !== null ? () => deleteMutation.mutate(deleteId) : undefined}
            />
            <Toast vaild={errorMsg} setVaild={() => setErrorMsg(null)} />
        </div>
    );
}
