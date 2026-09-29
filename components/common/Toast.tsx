import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export interface ToastProps {
    vaild: string | null; // 컴포넌트 내에 들어갈 Text
    setVaild: Dispatch<SetStateAction<string | null>>; // Text 변경
    onConfirm?: () => void; // 확인/취소 (컴포넌트 용도에 따라 사용)
}

export default function Toast({ vaild, setVaild, onConfirm }: ToastProps) {
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    // 팝업이 열릴 때 포커스를 팝업 안(확인 버튼)으로 옮겨서, 키보드 사용자가
    // 뒤에 가려진 배경 화면이 아니라 팝업 내용부터 읽고 조작할 수 있게 함
    useEffect(() => {
        if (vaild) confirmButtonRef.current?.focus();
    }, [vaild]);

    // Esc 키로도 닫을 수 있게 함 (모달 형태 UI의 일반적인 동작)
    useEffect(() => {
        if (!vaild) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setVaild(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [vaild, setVaild]);

    return (
        <>
            {vaild && (
                <div
                    role="alertdialog"
                    aria-modal="true"
                    aria-describedby="toast-message"
                    className="card fixed top-1/2 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2"
                >
                    <div className="px-6 pt-6 pb-5">
                        <p id="toast-message" className="text-base text-body text-center pb-5 border-b border-gray-100">{vaild}</p>
                        {onConfirm ? (
                            <div className="flex justify-center gap-3 pt-5">
                                <button
                                    onClick={() => setVaild(null)}
                                    className="btn-ghost flex-1"
                                >
                                    취소
                                </button>
                                <button
                                    ref={confirmButtonRef}
                                    onClick={() => { onConfirm(); setVaild(null); }}
                                    className="btn-primary flex-1"
                                >
                                    확인
                                </button>
                            </div>
                        ) : (
                            <div className="pt-5 text-center">
                                <button ref={confirmButtonRef} onClick={() => setVaild(null)} className="btn-primary px-8">
                                    확인
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {vaild && <div className="black-bg" />}
        </>
    );
}
