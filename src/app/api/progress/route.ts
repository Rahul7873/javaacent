import { NextResponse } from 'next/server';
import { getUserProgress } from '@/lib/store';

export async function GET() {
  try {
    const progress = getUserProgress();
    return NextResponse.json(progress);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
