import Link from "next/link";
import { GUIDE_SECTIONS } from "@/datas/adminGuide";

export default function AdminGuidePage() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-title">관리자 페이지 사용 가이드</h1>
                <p className="mt-3 text-base leading-7 text-body">
                    제품을 등록하고, 수정하고, 삭제하는 방법을 화면 캡처와 함께 순서대로 안내해 드립니다.
                    <br />
                    아래에서 원하시는 항목을 눌러주세요.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {GUIDE_SECTIONS.map((section, index) => (
                    <Link
                        key={section.slug}
                        href={`/admin/guide/${section.slug}`}
                        className="card flex flex-col items-center gap-3 p-8 text-center transition-shadow hover:shadow-lg"
                    >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-black text-white">
                            {index + 1}
                        </span>
                        <span className="text-xl font-bold text-title">{section.navTitle}</span>
                        <span className="text-sm text-body">{section.description}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
