import { Problem, Submission, UserProgress } from '@/types';
import { INITIAL_PROBLEMS } from '@/data/problems';
import { BASIC_PRACTICE_PROBLEMS } from '@/data/basicPracticeProblems';

export interface PlatformStore {
  problems: Problem[];
  submissions: Submission[];
  userProgress: UserProgress;
}

// In-memory runtime state with initial mock history
let globalStore: PlatformStore = {
  problems: [...INITIAL_PROBLEMS, ...BASIC_PRACTICE_PROBLEMS],
  submissions: [
    {
      id: 'sub-101',
      userId: 'user-demo',
      userName: 'Alex Developer',
      problemId: 'prob-1',
      problemSlug: 'two-sum-target',
      problemTitle: 'Two Sum Target',
      language: 'python',
      code: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      status: 'Accepted',
      executionTimeMs: 42,
      memoryMb: 14.2,
      passCount: 4,
      totalCount: 4,
      createdAt: '2025-02-28T14:32:00Z'
    },
    {
      id: 'sub-102',
      userId: 'user-demo',
      userName: 'Alex Developer',
      problemId: 'prob-3',
      problemSlug: 'valid-parentheses-depth',
      problemTitle: 'Valid Parentheses and Brackets',
      language: 'javascript',
      code: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}`,
      status: 'Accepted',
      executionTimeMs: 58,
      memoryMb: 16.8,
      passCount: 5,
      totalCount: 5,
      createdAt: '2025-03-01T10:15:00Z'
    },
    {
      id: 'sub-103',
      userId: 'user-demo',
      userName: 'Alex Developer',
      problemId: 'prob-4',
      problemSlug: 'maximum-subarray-kadane',
      problemTitle: 'Maximum Subarray Contiguous Sum',
      language: 'python',
      code: `def maxSubArray(nums):
    return sum(nums) # Incomplete attempt`,
      status: 'Wrong Answer',
      executionTimeMs: 38,
      memoryMb: 14.1,
      passCount: 1,
      totalCount: 4,
      createdAt: '2025-03-02T08:45:00Z'
    }
  ],
  userProgress: {
    userId: 'user-demo',
    userName: 'Alex Developer',
    currentStreak: 4,
    longestStreak: 9,
    lastActiveDate: new Date().toISOString().split('T')[0],
    solvedProblemIds: ['prob-1', 'prob-3'],
    attemptedProblemIds: ['prob-4'],
    topicMastery: {}
  }
};

export function getProblems(includeUnpublished = false): Problem[] {
  if (includeUnpublished) {
    return globalStore.problems;
  }
  return globalStore.problems.filter(p => p.isPublished);
}

export function getProblemBySlug(slug: string): Problem | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();

  // 1. Check exact slug or id match across globalStore and datasets
  const allProblems = [
    ...BASIC_PRACTICE_PROBLEMS,
    ...INITIAL_PROBLEMS,
    ...globalStore.problems
  ];

  let found = allProblems.find(
    p => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized
  );
  if (found) return found;

  // 2. Flexible number-based resolution (e.g. "1", "basic-1", "exercise-1", "java-1")
  const digits = normalized.replace(/[^0-9]/g, '');
  if (digits) {
    found = allProblems.find(
      p =>
        p.id === `basic-prob-${digits}` ||
        p.slug === `java-basic-exercise-${digits}` ||
        p.id === `prob-${digits}`
    );
    if (found) return found;
  }

  return undefined;
}

export function getProblemById(id: string): Problem | undefined {
  if (!id) return undefined;
  // Use flexible slug resolver since it checks id, slug, and aliases
  return getProblemBySlug(id);
}

export function addProblem(problem: Omit<Problem, 'id' | 'createdAt'>): Problem {
  const newProblem: Problem = {
    ...problem,
    id: `prob-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  globalStore.problems.unshift(newProblem);
  return newProblem;
}

export function updateProblem(id: string, updates: Partial<Problem>): Problem | null {
  const index = globalStore.problems.findIndex(p => p.id === id);
  if (index === -1) return null;
  globalStore.problems[index] = { ...globalStore.problems[index], ...updates };
  return globalStore.problems[index];
}

export function deleteProblem(id: string): boolean {
  const initialLength = globalStore.problems.length;
  globalStore.problems = globalStore.problems.filter(p => p.id !== id);
  return globalStore.problems.length < initialLength;
}

export function getSubmissions(problemId?: string): Submission[] {
  if (problemId) {
    return globalStore.submissions.filter(s => s.problemId === problemId);
  }
  return globalStore.submissions;
}

export function recordSubmission(submission: Omit<Submission, 'id' | 'createdAt'>): Submission {
  const newSub: Submission = {
    ...submission,
    id: `sub-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  globalStore.submissions.unshift(newSub);

  // Update user progress
  if (!globalStore.userProgress.attemptedProblemIds.includes(submission.problemId)) {
    globalStore.userProgress.attemptedProblemIds.push(submission.problemId);
  }

  if (submission.status === 'Accepted') {
    if (!globalStore.userProgress.solvedProblemIds.includes(submission.problemId)) {
      globalStore.userProgress.solvedProblemIds.push(submission.problemId);
      // Streak bump
      const today = new Date().toISOString().split('T')[0];
      if (globalStore.userProgress.lastActiveDate !== today) {
        globalStore.userProgress.currentStreak += 1;
        if (globalStore.userProgress.currentStreak > globalStore.userProgress.longestStreak) {
          globalStore.userProgress.longestStreak = globalStore.userProgress.currentStreak;
        }
        globalStore.userProgress.lastActiveDate = today;
      }
    }
  }

  return newSub;
}

export function getUserProgress(): UserProgress {
  // Recompute topic mastery dynamically
  const mastery: Record<string, { solved: number; total: number }> = {};
  const publishedProblems = getProblems(false);

  for (const prob of publishedProblems) {
    for (const topic of prob.topics) {
      if (!mastery[topic]) {
        mastery[topic] = { solved: 0, total: 0 };
      }
      mastery[topic].total += 1;
      if (globalStore.userProgress.solvedProblemIds.includes(prob.id)) {
        mastery[topic].solved += 1;
      }
    }
  }

  return {
    ...globalStore.userProgress,
    topicMastery: mastery
  };
}

export function getAllTopics(): string[] {
  const set = new Set<string>();
  for (const p of globalStore.problems) {
    for (const t of p.topics) {
      set.add(t);
    }
  }
  return Array.from(set).sort();
}
