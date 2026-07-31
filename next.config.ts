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
  // private/admin-guide는 public/이 아니라 동적 fs 접근(app/api/admin/guide-image)으로만 읽으므로
  // 서버리스 번들 트레이싱 대상에 명시적으로 포함시켜야 배포 환경에서도 파일을 찾을 수 있음
  outputFileTracingIncludes: {
    "/api/admin/guide-image/*": ["./private/admin-guide/**"],
  },
};

export default nextConfig;
