import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session';

export async function GET() {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get(SESSION_COOKIE_NAME);

    if (verifySessionToken(adminSession?.value)) {
        return NextResponse.json({ isLogin: true, isAdmin: true });
    }

    return NextResponse.json({ isLogin: false, isAdmin: false });
}
