import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  outputFileTracingIncludes: {
    "/api/admin/guide-image/*": ["./private/admin-guide/**"],
  },
  async headers() {
    return [
      {
        // 모든 경로에 공통 보안 헤더 적용
        source: "/:path*",
        headers: [
          // 다른 사이트가 우리 페이지를 iframe으로 몰래 띄우는 클릭재킹 방지
          { key: "X-Frame-Options", value: "DENY" },
          // 브라우저가 파일 내용을 추측해 다른 MIME 타입으로 실행하는 것을 방지
          { key: "X-Content-Type-Options", value: "nosniff" },
          // 외부 링크 클릭 시 전체 URL(쿼리스트링 등) 대신 출처 도메인만 전달
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 사용하지 않는 브라우저 권한(카메라/마이크/위치 등) 차단
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            // frame-ancestors: X-Frame-Options의 최신 대체 표준 (클릭재킹 방지)
            // object-src/base-uri: 레거시 플러그인 삽입, <base> 태그 조작 등 저비용·저위험 차단
            // 그 외 script-src/connect-src 등은 관리자 페이지의 배경제거(WASM/Web Worker) 기능이
            // 외부 CDN을 사용할 수 있어, 브라우저 실환경 검증 없이 좁히면 기능이 깨질 위험이 있어 보류함
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
