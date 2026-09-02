import { NextRequest, NextResponse } from 'next/server';
import { getProblems, addProblem } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const difficulty = searchParams.get('difficulty');
    const topic = searchParams.get('topic');
    const category = searchParams.get('category');
    const includeUnpublished = searchParams.get('all') === 'true';

    let problems = getProblems(includeUnpublished);

    if (category && category !== 'All') {
      problems = problems.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      problems = problems.filter(
        p =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.topics.some(t => t.toLowerCase().includes(search))
      );
    }

    if (difficulty && difficulty !== 'All') {
      problems = problems.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (topic && topic !== 'All') {
      problems = problems.filter(p => p.topics.includes(topic));
    }

    return NextResponse.json({ problems, total: problems.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = addProblem(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
