import type { MetadataRoute } from "next";
import { SITE_URL } from "@/datas/site";

// 관리자/로그인/API 경로는 모든 크롤러(검색엔진, AI 봇 포함)에서 제외
const DISALLOW_PATHS = ["/admin", "/login", "/api/"];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: DISALLOW_PATHS,
            },
            {
                // 네이버(Yeti) 및 AI 검색 봇도 공개 페이지 수집을 명시적으로 허용
                userAgent: ["Yeti", "GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"],
                allow: "/",
                disallow: DISALLOW_PATHS,
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
