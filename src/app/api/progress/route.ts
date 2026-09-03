import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getUserProgress, calculateTopicMastery } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();

    if (user) {
      const fullName = `${user.firstName} ${user.lastName}`;
      const progress = await getUserProgress(user.id, fullName);
      return NextResponse.json(progress);
    }

    // Guest default progress
    return NextResponse.json({
      userId: 'guest',
      userName: 'Guest Learner',
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      solvedProblemIds: [],
      attemptedProblemIds: [],
      topicMastery: calculateTopicMastery([])
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
