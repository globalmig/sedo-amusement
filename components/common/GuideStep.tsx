import Image from "next/image";
import type { GuideStep as GuideStepData } from "@/datas/adminGuide";

export default function GuideStep({ n, text, image, width, height }: GuideStepData) {
    return (
        <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
            {n !== undefined && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-black text-white">
                    {n}
                </span>
            )}
            <div className="flex-1 space-y-4">
                <p className="text-lg font-bold leading-relaxed text-title">{text}</p>
                <Image
                    src={`/api/admin/guide-image/${image}`}
                    alt={text}
                    width={width}
                    height={height}
                    unoptimized
                    className="h-auto max-w-full rounded-lg border border-black/10"
                />
            </div>
        </div>
    );
}
