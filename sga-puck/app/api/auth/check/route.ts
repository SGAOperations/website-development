import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');

    if (!authToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = JSON.parse(authToken.value);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}