import type { GuideStep as GuideStepData } from "@/datas/adminGuide";

function renderEmphasizedText(text: string) {
    const parts = text.split(/(\[[^\]]+\]|\*\*[^*]+\*\*)/g).filter(Boolean);

    return parts.map((part, index) => {
        if (part.startsWith("[") && part.endsWith("]")) {
            return (
                <strong key={index} className="font-bold text-primary">
                    {part}
                </strong>
            );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={index} className="font-bold">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return <span key={index}>{part}</span>;
    });
}

export default function GuideStep({ n, text }: GuideStepData) {
    return (
        <div className="flex items-start gap-5 border-b border-black/5 p-6 last:border-b-0 sm:p-8">
            {n !== undefined && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-black text-white">
                    {n}
                </span>
            )}
            <p className="flex-1 text-lg font-normal leading-relaxed text-title">{renderEmphasizedText(text)}</p>
        </div>
        // <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
        //     {n !== undefined && (
        //         <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-black text-white">
        //             {n}
        //         </span>
        //     )}
        //     <div className="flex-1 space-y-4">
        //         <p className="text-lg font-bold leading-relaxed text-title">{text}</p>
        //         <Image
        //             src={`/api/admin/guide-image/${image}`}
        //             alt={text}
        //             width={width}
        //             height={height}
        //             unoptimized
        //             className="h-auto max-w-full rounded-lg border border-black/10"
        //         />
        //     </div>
        // </div>
    );
}
