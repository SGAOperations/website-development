import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // For now, hardcoded user - we'll connect to database later
    if (email === 'admin@test.com' && password === 'password123') {
      const user = {
        id: '1',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'ADMIN' as const,
      };

      // Set a simple auth cookie
      const cookieStore = await cookies();
      cookieStore.set('auth-token', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json({ user });
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}