import Link from "next/link";
import { notFound } from "next/navigation";
import GuideStep from "@/components/common/GuideStep";
import { getGuideSection } from "@/datas/adminGuide";

interface GuideSectionPageProps {
    params: Promise<{ section: string }>;
}

export default async function AdminGuideSectionPage({ params }: GuideSectionPageProps) {
    const { section } = await params;
    const data = getGuideSection(section);

    if (!data) {
        notFound();
    }

    return (
        <div className="space-y-8 pb-10">
            <div>
                <Link href="/admin/guide" className="text-base font-semibold mb-4 text-primary hover:underline">
                    ← 가이드 목록으로
                </Link>
                <h2 className="mt-3 text-2xl font-black text-title">{data.title}</h2>
                <p className="mt-2 text-base text-body">{data.description}</p>
            </div>

            <div className="card overflow-hidden">
                {data.steps.map((step, index) => (
                    <GuideStep key={index} {...step} />
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Link href="/admin/products" className="btn-primary">
                    제품관리로 이동
                </Link>
                <Link href="/admin/guide" className="btn-ghost">
                    가이드 목록으로
                </Link>
            </div>
        </div>
    );
}
