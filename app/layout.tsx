import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "세도어뮤즈먼트 | 전자오락기 유통 전문기업",
  description:
    "오락실, 키즈카페를 위한 전자오락기 정품 유통과 전국 A/S를 책임지는 세도어뮤즈먼트입니다. 크레인/경품, 슈팅, 리듬, 레이싱, 스포츠, 비디오게임 등 다양한 라인업을 합리적인 가격에 만나보세요.",
  keywords: ["전자오락기", "오락실 창업", "키즈카페 게임기", "크레인게임기", "게임기 유통", "세도어뮤즈먼트"],
  openGraph: {
    title: "세도어뮤즈먼트 | 전자오락기 유통 전문기업",
    description: "오락실, 키즈카페를 위한 전자오락기 정품 유통과 전국 A/S를 책임지는 세도어뮤즈먼트입니다.",
    url: "https://www.",
    siteName: "세도어뮤즈먼트",
    images: [
      {
        url: "https://www./images/og_image.png",
        width: 1200,
        height: 630,
        alt: "세도어뮤즈먼트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  other: {
    "naver-site-verification": "search-advider",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
