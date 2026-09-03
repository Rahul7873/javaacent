import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getSubmissionsList } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get('problemId') || undefined;
    const showAll = searchParams.get('all') === 'true';

    const user = await getSessionUser();
    // If logged in and not explicitly requesting all, filter to current user's submissions
    const userIdFilter = (user && !showAll) ? user.id : undefined;

    const submissions = await getSubmissionsList(userIdFilter, problemId);
    return NextResponse.json({ submissions, total: submissions.length });
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
