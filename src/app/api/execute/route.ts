import { NextRequest, NextResponse } from 'next/server';
import { getProblemById } from '@/lib/store';
import { executeCode } from '@/lib/judge/runner';
import { Language } from '@/types';
import { getSessionUser } from '@/lib/auth';
import { addSubmission, recordUserProblemAttempt } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, problemId, isSubmit } = body as {
      code: string;
      language: Language;
      problemId: string;
      isSubmit?: boolean;
    };

    if (!code || !language || !problemId) {
      return NextResponse.json(
        { error: 'code, language, and problemId are required' },
        { status: 400 }
      );
    }

    const problem = getProblemById(problemId);
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Determine test cases to evaluate
    // For "Run", evaluate visible cases only; for "Submit", evaluate both visible and hidden cases
    const testCasesToRun = isSubmit
      ? problem.testCases
      : problem.testCases.filter(tc => !tc.isHidden);

    const execResult = await executeCode({
      code,
      language,
      testCases: testCasesToRun,
      timeLimitMs: 2500
    });

    let submissionRecord = null;
    if (isSubmit) {
      const user = await getSessionUser();
      const userId = user ? user.id : 'guest';
      const userName = user ? `${user.firstName} ${user.lastName}` : 'Guest Learner';

      submissionRecord = await addSubmission({
        userId,
        userName,
        problemId: problem.id,
        problemSlug: problem.slug,
        problemTitle: problem.title,
        language,
        code,
        status: execResult.status,
        executionTimeMs: execResult.executionTimeMs,
        memoryMb: execResult.memoryMb,
        passCount: execResult.passedTests,
        totalCount: execResult.totalTests,
        errorMessage: execResult.compileError || execResult.runtimeError
      });

      // Update user progress if authenticated
      if (user) {
        await recordUserProblemAttempt(
          user.id,
          userName,
          problem.id,
          execResult.status === 'Accepted'
        );
      }
    }

    return NextResponse.json({
      ...execResult,
      submission: submissionRecord
    });
  } catch (error: any) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal execution error' },
      { status: 500 }
    );
  }
}
