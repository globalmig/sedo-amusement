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
                <Link href="/admin/guide" className="text-sm font-semibold mb-4 text-primary hover:underline">
                    ← 가이드 목록으로
                </Link>
                <h2 className="mt-3 text-2xl font-black text-title">{data.title}</h2>
                <p className="mt-2 text-base text-body">{data.description}</p>
            </div>

            <div className="space-y-5">
                {data.steps.map((step) => (
                    <GuideStep key={step.image} {...step} />
                ))}
            </div>
        </div>
    );
}
