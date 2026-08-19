import ImageBgRemover from "@/components/ImageBgRemover";

export default function CreateImagePage() {
    return (
        <div className="space-y-6">
            <h2 className="font-semibold text-title text-2xl">이미지 편집</h2>
            <p className="text-sm text-body">
                제품 사진을 업로드해 1:1 비율로 자르고, 배경을 제거(누끼)할 수 있어요.
            </p>
            <ImageBgRemover />
        </div>
    );
}