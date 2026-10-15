import Link from "next/link";

function ArrowRightIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const MENU_ITEMS = [
    {
        href: "/admin/consulting/areas",
        title: "주요 컨설팅 제공 분야",
        description: "창업 컨설팅 페이지에 노출되는 제공 분야 항목을 추가, 수정, 삭제합니다.",
    },
    {
        href: "/admin/consulting/steps",
        title: "컨설팅 진행 절차",
        description: "창업 컨설팅 페이지에 노출되는 진행 절차 단계를 추가, 수정, 삭제합니다.",
    },
];

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

            <div className="space-y-3">
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="card flex items-center justify-between gap-4 p-6 transition-colors hover:border-primary/40"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-title">{item.title}</h2>
                            <p className="mt-1 text-base text-muted">{item.description}</p>
                        </div>
                        <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
