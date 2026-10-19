import Link from "next/link";
import type { GuideStep as GuideStepData } from "@/datas/adminGuide";

function renderEmphasizedText(text: string) {
    const parts = text
        .split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\[[^\]]+\]|\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g)
        .filter(Boolean);

    return parts.map((part, index) => {
        const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
        if (linkMatch) {
            return (
                <Link
                    key={index}
                    href={linkMatch[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-primary underline"
                >
                    {linkMatch[1]}
                </Link>
            );
        }
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
        if (/^https?:\/\//.test(part)) {
            return (
                <Link
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-primary underline"
                >
                    {part}
                </Link>
            );
        }
        return <span key={index}>{part}</span>;
    });
}

export default function GuideStep({ n, text, image }: GuideStepData) {
    const lines = text.split("\n");

    return (
        <div className="flex items-start gap-5 border-b border-black/5 p-6 last:border-b-0 sm:p-8">
            {n !== undefined && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#222] text-lg font-black text-white">
                    {n}
                </span>
            )}
            <div className="flex-1">
                <p className="text-lg font-normal leading-relaxed text-title">
                    {lines.map((line, index) => (
                        <span key={index}>
                            {index > 0 && <br />}
                            {renderEmphasizedText(line)}
                        </span>
                    ))}
                </p>
                {image && (
                    <img
                        src={`/api/admin/guide-image/${image}`}
                        alt={text}
                        className="mt-4 h-auto w-auto max-w-full rounded-lg border border-black/10"
                    />
                )}
            </div>
        </div>
    );
}
