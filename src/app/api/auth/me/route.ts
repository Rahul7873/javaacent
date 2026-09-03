import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getUserProgress } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null, progress: null });
    }

    const fullName = `${user.firstName} ${user.lastName}`;
    const progress = await getUserProgress(user.id, fullName);

    return NextResponse.json({
      user,
      progress
    });
  } catch (err: any) {
    console.error('Session verification error:', err);
    return NextResponse.json({ user: null, progress: null });
  }
}
