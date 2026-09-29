// 일반 로그인
import { NextResponse } from 'next/server';
// admin_user 테이블 조회를 위해 RLS 우회가 필요하므로 공용 admin 클라이언트를 재사용
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/session';
import { hashPassword, verifyPassword } from '@/lib/password';

// 아이디 존재 여부가 드러나지 않도록 조회 실패/비밀번호 불일치 모두 동일한 메시지 사용
const INVALID_CREDENTIALS_MESSAGE = '아이디 또는 비밀번호가 올바르지 않습니다.';

// 무차별 대입(brute-force) 공격 방지: 연속 실패 시 일정 시간 계정 잠금
// DB(admin_user.failed_login_attempts / locked_until)에 기록하므로 서버리스 인스턴스가 여러 개여도 안전하게 동작함
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15분

export async function POST(request: Request) {
    try {
        // 필드명은 password_hash이지만 실제로는 사용자가 입력한 평문 비밀번호가 담겨 전달됨(HTTPS로 전송)
        const { admin_id, password_hash: password } = await request.json();

        if (!admin_id || !password) {
            return NextResponse.json({ error: '아이디와 비밀번호를 모두 입력해 주세요.' }, { status: 400 });
        }

        // 1. DB(admin_user)에서 해당 아이디 정보 조회
        const { data: admin, error } = await supabase
            .from('admin_user')
            .select('*')
            .eq('admin_id', admin_id)
            .single();

        if (error) {
            console.error("admin_user 조회 실패:", error.message);
        }

        if (error || !admin) {
            return NextResponse.json({ error: INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
        }

        // 2. 연속 실패로 잠긴 계정이면 비밀번호 확인 없이 즉시 차단
        if (admin.locked_until && new Date(admin.locked_until).getTime() > Date.now()) {
            const remainingMinutes = Math.ceil((new Date(admin.locked_until).getTime() - Date.now()) / 60000);
            return NextResponse.json(
                { error: `로그인 시도가 너무 많습니다. ${remainingMinutes}분 후 다시 시도해 주세요.` },
                { status: 429 }
            );
        }

        // 3. 비밀번호 검증 (레거시 SHA-256 계정은 이 시점에 bcrypt로 자동 재해싱)
        const { valid, needsRehash } = await verifyPassword(password, admin.password_hash);

        if (!valid) {
            const failedAttempts = (admin.failed_login_attempts ?? 0) + 1;
            const isNowLocked = failedAttempts >= MAX_FAILED_ATTEMPTS;

            await supabase
                .from('admin_user')
                .update({
                    failed_login_attempts: isNowLocked ? 0 : failedAttempts,
                    locked_until: isNowLocked ? new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString() : null,
                })
                .eq('admin_id', admin_id);

            return NextResponse.json({ error: INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
        }

        // 4. 로그인 성공 -> 실패 카운트 초기화 + 서명된 세션 토큰을 담은 보안 쿠키 발급
        const updatePayload: Record<string, unknown> = { failed_login_attempts: 0, locked_until: null };
        if (needsRehash) {
            updatePayload.password_hash = await hashPassword(password);
        }
        await supabase.from('admin_user').update(updatePayload).eq('admin_id', admin_id);

        const response = NextResponse.json({ success: true, message: '로그인 성공' });

        response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(admin.admin_id), {
            httpOnly: true, // 브라우저 자바스크립트로 접근 불가능 (보안 필수)
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: SESSION_MAX_AGE_SECONDS,
            path: '/',
        });

        return response;

    } catch (err) {
        console.error("로그인 처리 중 오류:", err);
        return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}
