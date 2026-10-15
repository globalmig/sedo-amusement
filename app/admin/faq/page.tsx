"use client";
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePagination } from "@/hooks/usePagination";
import { useAdminCrudList } from "@/hooks/useAdminCrudList";
import Toast from "@/components/common/Toast";
import Pagination from "@/components/common/Pagination";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/common/AdminIcons";
import { FAQ_CATEGORIES, FaqCategoryKey } from "@/datas/faq";
import { FaqItem } from "@/types/faq";

const ITEMS_PER_PAGE = 10;

function GripIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <circle cx={9} cy={6} r={1.5} />
            <circle cx={9} cy={12} r={1.5} />
            <circle cx={9} cy={18} r={1.5} />
            <circle cx={15} cy={6} r={1.5} />
            <circle cx={15} cy={12} r={1.5} />
            <circle cx={15} cy={18} r={1.5} />
        </svg>
    );
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

interface FaqCardProps {
    item: FaqItem;
    isEditing: boolean;
    form: FaqFormState;
    onChange: (next: FaqFormState) => void;
    onSave: () => void;
    onCancel: () => void;
    saving: boolean;
    onStartEdit: (item: FaqItem) => void;
    onDelete: (id: number) => void;
    onMoveUp: (item: FaqItem) => void;
    onMoveDown: (item: FaqItem) => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
    canDrag: boolean;
}

// 드래그 핸들(useSortable)을 붙인 FAQ 카드. 편집 중에는 드래그를 막는다.
function SortableFaqCard({
    item,
    isEditing,
    form,
    onChange,
    onSave,
    onCancel,
    saving,
    onStartEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown,
    canDrag,
}: FaqCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
        disabled: !canDrag,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="card p-6">
            {isEditing ? (
                <FaqEditForm form={form} onChange={onChange} onSave={onSave} onCancel={onCancel} saving={saving} />
            ) : (
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <button
                            type="button"
                            {...attributes}
                            {...listeners}
                            disabled={!canDrag}
                            className={`mt-1 flex shrink-0 items-center justify-center rounded p-1 text-muted ${canDrag ? "cursor-grab touch-none hover:text-title active:cursor-grabbing" : "cursor-not-allowed opacity-30"}`}
                            aria-label="드래그로 순서 변경"
                            title={canDrag ? "드래그해서 순서를 바꿀 수 있어요" : "편집을 마치면 순서를 바꿀 수 있어요"}
                        >
                            <GripIcon className="h-4 w-4" />
                        </button>
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
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                        <button
                            type="button"
                            onClick={() => onMoveUp(item)}
                            disabled={!canMoveUp}
                            className="rounded-lg border border-black p-1.5 text-title hover:text-primary disabled:opacity-50"
                            aria-label="위로 이동"
                        >
                            <ArrowUpIcon className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onMoveDown(item)}
                            disabled={!canMoveDown}
                            className="rounded-lg border border-black p-1.5 text-title hover:text-primary disabled:opacity-50"
                            aria-label="아래로 이동"
                        >
                            <ArrowDownIcon className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => onStartEdit(item)} className="ml-2 text-base font-medium text-primary hover:underline">
                            수정
                        </button>
                        <button type="button" onClick={() => onDelete(item.id)} className="text-base font-medium text-muted hover:text-red-500">
                            삭제
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminFaqPage() {
    const queryClient = useQueryClient();
    const [activeCategory, setActiveCategory] = useState<FaqCategoryKey>(FAQ_CATEGORIES[0].key);
    const [form, setForm] = useState<FaqFormState>(emptyForm(activeCategory));

    const {
        items,
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
    } = useAdminCrudList<FaqItem>({
        queryKey: ["faq-items", activeCategory],
        fetchList: async () => {
            const res = await fetch(`/api/faq?category=${activeCategory}`);
            const { data, error } = await res.json();
            if (!res.ok || error) console.error("FAQ 조회 실패:", error ?? res.status);
            return (data ?? []) as FaqItem[];
        },
        baseUrl: "/api/faq",
    });

    const { currentPage, currentItems, totalCount, onPageChange, setCurrentPage } = usePagination(items, ITEMS_PER_PAGE);

    const selectCategory = useCallback((key: FaqCategoryKey) => {
        setActiveCategory(key);
        setEditingId(null);
        setCurrentPage(1);
    }, [setCurrentPage, setEditingId]);

    // 드래그/버튼으로 바뀐 순서를 저장. order는 현재 카테고리 전체 기준으로 새로 배열된 id 목록.
    const reorderMutation = useMutation({
        mutationFn: async (order: number[]) => {
            const res = await fetch("/api/faq/reorder", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "순서 변경에 실패했습니다.");
            return result;
        },
        onError: (err: Error) => {
            setErrorMsg(err.message || "순서 변경에 실패했습니다.");
            invalidate();
        },
    });

    const startEdit = useCallback((item: FaqItem) => {
        setEditingId(item.id);
        setForm({ category: item.category, question: item.question, answer: item.answer });
    }, [setEditingId]);

    const startNew = useCallback(() => {
        setEditingId("new");
        setForm(emptyForm(activeCategory));
    }, [activeCategory, setEditingId]);

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

    const reorderTo = (fromIndex: number, toIndex: number) => {
        if (fromIndex === -1 || toIndex < 0 || toIndex >= items.length) return;
        const reordered = arrayMove(items, fromIndex, toIndex);
        queryClient.setQueryData<FaqItem[]>(["faq-items", activeCategory], reordered);
        reorderMutation.mutate(reordered.map((item) => item.id));
    };

    const moveItem = (item: FaqItem, direction: -1 | 1) => {
        const index = items.findIndex((i) => i.id === item.id);
        reorderTo(index, index + direction);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const pageOffset = (currentPage - 1) * ITEMS_PER_PAGE;
        const oldLocalIndex = currentItems.findIndex((item) => item.id === active.id);
        const newLocalIndex = currentItems.findIndex((item) => item.id === over.id);
        if (oldLocalIndex === -1 || newLocalIndex === -1) return;

        reorderTo(pageOffset + oldLocalIndex, pageOffset + newLocalIndex);
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
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={currentItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                            {currentItems.map((item) => {
                                const globalIndex = items.findIndex((i) => i.id === item.id);
                                return (
                                    <SortableFaqCard
                                        key={item.id}
                                        item={item}
                                        isEditing={editingId === item.id}
                                        form={form}
                                        onChange={setForm}
                                        onSave={saveEdit}
                                        onCancel={() => setEditingId(null)}
                                        saving={saving}
                                        onStartEdit={startEdit}
                                        onDelete={setDeleteId}
                                        onMoveUp={(target) => moveItem(target, -1)}
                                        onMoveDown={(target) => moveItem(target, 1)}
                                        canMoveUp={globalIndex > 0}
                                        canMoveDown={globalIndex < items.length - 1}
                                        canDrag={editingId === null}
                                    />
                                );
                            })}
                        </SortableContext>
                    </DndContext>
                    {items.length === 0 && editingId !== "new" && (
                        <div className="card px-5 py-16 text-center text-base text-muted">
                            등록된 FAQ가 없습니다.
                        </div>
                    )}
                </div>
            )}

            {!isLoading && totalCount > ITEMS_PER_PAGE && (
                <Pagination
                    key={activeCategory}
                    totalCount={totalCount}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={onPageChange}
                    initialPage={currentPage}
                />
            )}

            <Toast
                message={deleteId !== null ? "이 질문을 삭제하시겠습니까?" : null}
                setMessage={() => setDeleteId(null)}
                onConfirm={deleteId !== null ? () => deleteMutation.mutate(deleteId) : undefined}
            />
            <Toast message={errorMsg} setMessage={() => setErrorMsg(null)} />
        </div>
    );
}
