import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/form/LoginForm";

export const metadata: Metadata = {
    title: "관리자 로그인",
    robots: { index: false, follow: false },
};

export default function LoginPage() {
    return (
        <div className="flex min-h-dvh items-center justify-center bg-surface px-[5%]">
            <div className="card w-full max-w-sm p-8">
                <Link href="/" className="block text-center text-xl font-black text-title">
                    세도<span className="text-primary">어뮤즈먼트</span>
                </Link>
                <p className="mt-2 text-center text-sm text-muted">관리자 로그인</p>

                <div className="mt-8">
                    <LoginForm />
                </div>

                <Link href="/" className="mt-6 block text-center text-sm text-muted hover:text-primary">
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
