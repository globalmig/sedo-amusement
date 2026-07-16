// 일반 로그인
import { NextResponse } from 'next/server';
import crypto from 'crypto';
// admin_user 테이블 조회를 위해 RLS 우회가 필요하므로 공용 admin 클라이언트를 재사용
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/session';

// 아이디 존재 여부가 드러나지 않도록 조회 실패/비밀번호 불일치 모두 동일한 메시지 사용
const INVALID_CREDENTIALS_MESSAGE = '아이디 또는 비밀번호가 올바르지 않습니다.';

export async function POST(request: Request) {
    try {
        const { admin_id, password_hash } = await request.json();

        if (!admin_id || !password_hash) {
            return NextResponse.json({ error: '아이디와 비밀번호를 모두 입력해 주세요.' }, { status: 400 });
        }

        // 1. 입력받은 패스워드를 SHA-256 방식으로 암호화(해싱)
        const inputHash = crypto.createHash('sha256').update(password_hash).digest('hex');

        // 2. DB(admin_user)에서 해당 아이디 정보 조회
        const { data: admin, error } = await supabase
            .from('admin_user')
            .select('*')
            .eq('admin_id', admin_id)
            .single();

        if (error || !admin) {
            return NextResponse.json({ error: INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
        }

        // 3. 입력된 비밀번호 해시값과 DB의 비밀번호 해시값 비교
        if (admin.password_hash !== inputHash) {
            return NextResponse.json({ error: INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
        }

        // 4. 로그인 인증 성공 -> 서명된 세션 토큰을 담은 보안 쿠키 발급
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
        return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}