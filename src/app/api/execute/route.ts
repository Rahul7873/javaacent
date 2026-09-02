import { NextRequest, NextResponse } from 'next/server';
import { getProblemById, recordSubmission } from '@/lib/store';
import { executeCode } from '@/lib/judge/runner';
import { Language } from '@/types';

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
      submissionRecord = recordSubmission({
        userId: 'user-demo',
        userName: 'Alex Developer',
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
    }

    return NextResponse.json({
      ...execResult,
      submission: submissionRecord
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal execution error' },
      { status: 500 }
    );
  }
}
