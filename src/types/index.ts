export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Language = 'python' | 'javascript' | 'typescript' | 'java' | 'cpp';

export type SubmissionStatus = 
  | 'Accepted' 
  | 'Wrong Answer' 
  | 'Time Limit Exceeded' 
  | 'Runtime Error' 
  | 'Compile Error'
  | 'Pending';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface StarterCode {
  python: string;
  javascript: string;
  typescript: string;
  java: string;
  cpp: string;
}

export interface ProblemHints {
  level1: string; // Guiding question
  level2: string; // Small conceptual hint
  level3: string; // Pattern / Data structure
  level4: string; // Approach without full code
  level5: string; // Complexity analysis
  level6: string; // Complete solution with code
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  acceptanceRate: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: StarterCode;
  testCases: TestCase[];
  hints: ProblemHints;
  explanation?: string;
  timeComplexity: string;
  spaceComplexity: string;
  isPublished: boolean;
  createdAt: string;
  category?: 'DSA' | 'Basic Practice' | string;
  part?: number;
}

export interface TestResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
  stdout?: string;
  error?: string;
  isHidden?: boolean;
}

export interface ExecutionResponse {
  status: SubmissionStatus;
  totalTests: number;
  passedTests: number;
  executionTimeMs: number;
  memoryMb: number;
  results: TestResult[];
  compileError?: string;
  runtimeError?: string;
}

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  problemId: string;
  problemSlug: string;
  problemTitle: string;
  language: Language;
  code: string;
  status: SubmissionStatus;
  executionTimeMs: number;
  memoryMb: number;
  passCount: number;
  totalCount: number;
  errorMessage?: string;
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  userName: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  solvedProblemIds: string[];
  attemptedProblemIds: string[];
  topicMastery: Record<string, { solved: number; total: number }>;
}

export interface AITutorMessage {
  id: string;
  role: 'user' | 'tutor' | 'system';
  content: string;
  hintLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  timestamp: string;
}
