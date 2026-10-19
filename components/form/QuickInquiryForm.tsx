"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import Toast from "../common/Toast";

interface QuickInquiryValues {
    name: string;
    phone: string;
}

const PHONE_REGEX = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

const INITIAL_VALUES: QuickInquiryValues = { name: "", phone: "" };

export default function QuickInquiryForm() {
    const [form, setForm] = useState<QuickInquiryValues>(INITIAL_VALUES);
    const [agree, setAgree] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const onChangeForm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const onSubmitForm = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (!form.name.trim()) {
                setToastMessage("성함을 입력해주세요.");
                return;
            }
            if (!form.phone.trim()) {
                setToastMessage("연락처를 입력해주세요.");
                return;
            }
            if (!PHONE_REGEX.test(form.phone.trim())) {
                setToastMessage("올바른 연락처를 입력해주세요.");
                return;
            }
            if (!agree) {
                setToastMessage("개인정보 수집동의가 필요합니다.");
                return;
            }

            setToastMessage("문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
            setForm(INITIAL_VALUES);
            setAgree(false);
        },
        [form, agree]
    );

    return (
        <>
            <form
                onSubmit={onSubmitForm}
                aria-label="간편 상담 신청"
                className="fixed inset-x-0 bottom-0 z-45 border-t border-white/10 bg-base-dark px-4 py-4 pc:px-[5%] pc:py-6"
            >
                <div className="mx-auto flex max-w-300 flex-col gap-2 pc:flex-row pc:items-center pc:gap-4">
                    <span className="hidden shrink-0 text-base font-bold text-white pc:inline pc:text-lg">간편상담</span>

                    <div className="flex gap-2 pc:flex-1">
                        <div className="flex flex-1 items-center gap-1.5 pc:flex-none">
                            <label htmlFor="quick-inquiry-name" className="sr-only shrink-0 text-sm font-medium text-white/80 pc:not-sr-only pc:text-base">
                                성함
                            </label>
                            <input
                                type="text"
                                id="quick-inquiry-name"
                                name="name"
                                placeholder="성함"
                                value={form.name}
                                onChange={onChangeForm}
                                className="w-full min-w-0 rounded-lg border border-white/15 bg-white px-3 py-1.5 text-base text-title outline-none transition-colors focus:border-primary pc:py-2 pc:text-lg"
                            />
                        </div>
                        <div className="flex flex-1 items-center gap-1.5 pc:flex-none">
                            <label htmlFor="quick-inquiry-phone" className="sr-only shrink-0 text-sm font-medium text-white/80 pc:not-sr-only pc:text-base">
                                연락처
                            </label>
                            <input
                                type="tel"
                                id="quick-inquiry-phone"
                                name="phone"
                                placeholder="연락처"
                                value={form.phone}
                                onChange={onChangeForm}
                                className="w-full min-w-0 rounded-lg border border-white/15 bg-white px-3 py-1.5 text-base text-title outline-none transition-colors focus:border-primary pc:py-2 pc:text-lg"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pc:w-auto pc:shrink-0 pc:justify-end">
                        <label className="flex shrink-0 items-center gap-1.5 text-sm text-white/80 pc:text-base">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                                className="h-4 w-4 shrink-0 accent-primary"
                            />
                            <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
                                개인정보 수집동의
                            </Link>
                        </label>

                        <button
                            type="submit"
                            className="btn-primary shrink-0 rounded-md px-5 py-1.5 text-base pc:py-2 pc:text-lg"
                        >
                            상담 신청
                        </button>
                    </div>
                </div>
            </form>
            <Toast message={toastMessage} setMessage={setToastMessage} />
        </>
    );
}
