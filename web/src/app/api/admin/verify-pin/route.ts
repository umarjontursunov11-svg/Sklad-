import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Default secure PIN hash or compare against environment variable ADMIN_SECURITY_PIN
// Can be set in .env.local: ADMIN_SECURITY_PIN=...
const ADMIN_PIN = process.env.ADMIN_SECURITY_PIN || '889922';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ success: false, error: 'PIN is required' }, { status: 400 });
    }

    const cleanInput = pin.trim();

    // Constant-time comparison to prevent timing attacks
    const expectedBuffer = Buffer.from(ADMIN_PIN);
    const inputBuffer = Buffer.from(cleanInput);

    const isMatch =
      expectedBuffer.length === inputBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, inputBuffer);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Noto'g'ri xavfsizlik PIN kodi!" },
        { status: 401 }
      );
    }

    // Return success and set secure HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Admin session successfully verified'
    });

    response.cookies.set('admin_verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 4, // 4 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
