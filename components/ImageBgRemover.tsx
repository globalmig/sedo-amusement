'use client';

import { useCallback, useRef, useState } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { removeBackground } from '@imgly/background-removal';

type Step = 'upload' | 'crop' | 'result';

async function getCroppedImageBlob(imageSrc: string, cropArea: Area): Promise<Blob> {
    const image = new Image();
    image.src = imageSrc;
    await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('캔버스를 생성할 수 없습니다.');

    ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('이미지 변환에 실패했습니다.'));
        }, 'image/png');
    });
}

export default function ImageBgRemover() {
    const [step, setStep] = useState<Step>('upload');
    const [originalSrc, setOriginalSrc] = useState<string | null>(null);
    const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropArea, setCropArea] = useState<Area | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const reset = () => {
        setStep('upload');
        setOriginalSrc(null);
        setCroppedUrl(null);
        setResultUrl(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCropArea(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setCroppedUrl(null);
        setResultUrl(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setOriginalSrc(URL.createObjectURL(file));
        setStep('crop');
    };

    const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
        setCropArea(areaPixels);
    }, []);

    const applyCrop = async () => {
        if (!originalSrc || !cropArea) return;
        setProcessing(true);
        setError(null);
        try {
            const blob = await getCroppedImageBlob(originalSrc, cropArea);
            setCroppedUrl(URL.createObjectURL(blob));
            setStep('result');
        } catch {
            setError('이미지를 자르는 중 문제가 발생했습니다.');
        } finally {
            setProcessing(false);
        }
    };

    const removeBg = async () => {
        const target = croppedUrl ?? originalSrc;
        if (!target) return;
        setProcessing(true);
        setError(null);
        try {
            const sourceBlob = await fetch(target).then((res) => res.blob());
            const blob = await removeBackground(sourceBlob);
            setResultUrl(URL.createObjectURL(blob));
        } catch {
            setError('배경 제거 중 문제가 발생했습니다.');
        } finally {
            setProcessing(false);
        }
    };

    const downloadUrl = resultUrl ?? croppedUrl;

    const handleDownload = () => {
        if (!downloadUrl) return;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = resultUrl ? 'product-image-nukki.png' : 'product-image-cropped.png';
        a.click();
    };

    return (
        <div className="flex flex-col gap-6">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block text-sm text-body file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            {step === 'crop' && originalSrc && (
                <div className="flex flex-col gap-4">
                    <div className="relative h-100 w-full overflow-hidden rounded-lg border border-black/10 bg-surface">
                        <Cropper
                            image={originalSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-body">확대</label>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-40"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={applyCrop}
                            disabled={processing || !cropArea}
                            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? '자르는 중...' : '1:1로 자르기'}
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="cursor-pointer rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold text-body hover:bg-surface"
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}

            {step === 'result' && croppedUrl && (
                <div className="flex flex-col gap-4">
                    <div
                        className="mx-auto flex h-80 w-80 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-[repeating-conic-gradient(#e5e5e5_0deg_90deg,#ffffff_90deg_180deg)] bg-size-[20px_20px]"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={resultUrl ?? croppedUrl}
                            alt="편집된 이미지"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={removeBg}
                            disabled={processing || !!resultUrl}
                            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? '배경 제거 중...' : resultUrl ? '배경 제거 완료' : '배경 제거(누끼 따기)'}
                        </button>
                        <button
                            type="button"
                            onClick={handleDownload}
                            className="cursor-pointer rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold text-body hover:bg-surface"
                        >
                            다운로드
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setResultUrl(null);
                                setStep('crop');
                            }}
                            className="cursor-pointer rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold text-body hover:bg-surface"
                        >
                            다시 자르기
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="cursor-pointer rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold text-body hover:bg-surface"
                        >
                            새 이미지 업로드
                        </button>
                    </div>

                    {processing && (
                        <p className="text-sm text-muted">
                            처리 중입니다. 이미지 크기에 따라 다소 시간이 걸릴 수 있어요.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
