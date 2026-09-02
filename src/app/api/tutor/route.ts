import { NextRequest, NextResponse } from 'next/server';
import { getProblemById } from '@/lib/store';
import { generateTutorResponse } from '@/lib/tutor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemId, currentCode, language, userMessage, requestedLevel, lastError } = body;

    if (!problemId || !userMessage) {
      return NextResponse.json(
        { error: 'problemId and userMessage are required' },
        { status: 400 }
      );
    }

    const problem = getProblemById(problemId);
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const response = await generateTutorResponse({
      problem,
      currentCode,
      language,
      userMessage,
      requestedLevel,
      lastError
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'AI Tutor processing error' },
      { status: 500 }
    );
  }
}
