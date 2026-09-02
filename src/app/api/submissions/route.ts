import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get('problemId') || undefined;
    const submissions = getSubmissions(problemId);
    return NextResponse.json({ submissions, total: submissions.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
