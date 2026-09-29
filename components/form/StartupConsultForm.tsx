"use client";
import { useCallback, useState } from "react";
import Toast from "../common/Toast";

const INTEREST_OPTIONS = ["아케이드 게임장", "유원시설", "키즈카페", "기타"] as const;

interface StartupConsultFormValues {
    name: string;
    phone: string;
    interests: string[];
    region: string;
    budget: string;
    message: string;
}

const INITIAL_VALUES: StartupConsultFormValues = {
    name: "",
    phone: "",
    interests: [],
    region: "",
    budget: "",
    message: "",
};

export default function StartupConsultForm() {
    const [form, setForm] = useState<StartupConsultFormValues>(INITIAL_VALUES);
    const [vaild, setVaild] = useState<string | null>(null);

    const onChangeForm = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const onToggleInterest = useCallback((option: string) => {
        setForm((prev) => ({
            ...prev,
            interests: prev.interests.includes(option)
                ? prev.interests.filter((item) => item !== option)
                : [...prev.interests, option],
        }));
    }, []);

    const onSubmitForm = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setVaild("성함/직급을 입력해주세요.");
            return;
        }
        if (!form.phone.trim()) {
            setVaild("연락처를 입력해주세요.");
            return;
        }
        if (form.interests.length === 0) {
            setVaild("관심 창업 분야를 선택해주세요.");
            return;
        }

        setVaild("문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
        setForm(INITIAL_VALUES);
    }, [form]);

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <div className="card p-6 md:p-8 space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="form-label">
                            성함/직급 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="성함/직급을 입력해주세요."
                            value={form.name}
                            onChange={onChangeForm}
                            className="form-input"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="phone" className="form-label">
                            연락처 <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            placeholder="연락 가능한 전화번호를 입력해주세요."
                            value={form.phone}
                            onChange={onChangeForm}
                            className="form-input"
                        />
                    </div>

                    {/* 체크박스 여러 개가 하나의 질문("관심 창업 분야")에 속한다는 것을
                        스크린리더가 안내할 수 있도록 fieldset/legend로 묶음 */}
                    <fieldset className="flex flex-col gap-1.5 border-0 p-0 m-0">
                        <legend className="form-label px-0">
                            관심 창업 분야 <span className="text-red-400">*</span>
                        </legend>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                            {INTEREST_OPTIONS.map((option) => (
                                <label key={option} className="flex items-center gap-2 text-base text-body cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.interests.includes(option)}
                                        onChange={() => onToggleInterest(option)}
                                        className="h-4 w-4 accent-primary"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="region" className="form-label">오픈 예정 지역</label>
                        <input
                            type="text"
                            id="region"
                            name="region"
                            placeholder="예) 인천, 서울 등"
                            value={form.region}
                            onChange={onChangeForm}
                            className="form-input"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="budget" className="form-label">보유 평수 및 예산</label>
                        <input
                            type="text"
                            id="budget"
                            name="budget"
                            placeholder="예) 50평, 1억 원 내외"
                            value={form.budget}
                            onChange={onChangeForm}
                            className="form-input"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="message" className="form-label">문의 내용</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={4}
                            placeholder="궁금하신 내용을 자유롭게 작성해주세요."
                            value={form.message}
                            onChange={onChangeForm}
                            className="form-input resize-none"
                        />
                    </div>

                    <button type="submit" className="btn-primary rounded-full w-full py-3.5 text-base pc:text-[20px] cursor-pointer">
                        무료 창업 컨설팅 문의하기
                    </button>
                </div>
            </form>
            <Toast vaild={vaild} setVaild={setVaild} />
        </>
    );
}
