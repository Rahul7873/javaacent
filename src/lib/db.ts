import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { User, UserProgress, Submission } from '@/types';
import { INITIAL_PROBLEMS } from '@/data/problems';
import { BASIC_PRACTICE_PROBLEMS } from '@/data/basicPracticeProblems';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    })
  : null;

// Local persistent filesystem fallback directory
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

interface LocalDbSchema {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    createdAt: string;
  }>;
  progress: Record<string, UserProgress>;
  submissions: Submission[];
}

function ensureDataFile(): LocalDbSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initialData: LocalDbSchema = {
        users: [],
        progress: {},
        submissions: []
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as LocalDbSchema;
  } catch (e) {
    console.error('Error reading local db file, initializing empty store', e);
    return { users: [], progress: {}, submissions: [] };
  }
}

function saveLocalDb(data: LocalDbSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write to local db file', e);
  }
}

// Compute topic mastery dynamically for a set of solved problem IDs
export function calculateTopicMastery(solvedIds: string[]): Record<string, { solved: number; total: number }> {
  const allProblems = [...INITIAL_PROBLEMS, ...BASIC_PRACTICE_PROBLEMS];
  const mastery: Record<string, { solved: number; total: number }> = {};

  for (const prob of allProblems) {
    for (const topic of prob.topics || []) {
      if (!mastery[topic]) {
        mastery[topic] = { solved: 0, total: 0 };
      }
      mastery[topic].total += 1;
      if (solvedIds.includes(prob.id)) {
        mastery[topic].solved += 1;
      }
    }
  }
  return mastery;
}

// ----------------- USER REPOSITORY -----------------

export async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();

  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', normalized)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          passwordHash: data.password_hash,
          createdAt: data.created_at
        };
      }
    } catch (e) {
      console.warn('Supabase findUserByEmail failed, using local fallback', e);
    }
  }

  // Fallback to local
  const local = ensureDataFile();
  const found = local.users.find(u => u.email.toLowerCase() === normalized);
  return found || null;
}

export async function findUserById(id: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          passwordHash: data.password_hash,
          createdAt: data.created_at
        };
      }
    } catch (e) {
      console.warn('Supabase findUserById failed, using local fallback', e);
    }
  }

  const local = ensureDataFile();
  return local.users.find(u => u.id === id) || null;
}

export async function createUser(user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}): Promise<User> {
  const createdAt = new Date().toISOString();
  const normalizedEmail = user.email.trim().toLowerCase();

  const newUser: User = {
    id: user.id,
    firstName: user.firstName.trim(),
    lastName: user.lastName.trim(),
    email: normalizedEmail,
    createdAt
  };

  // Sync to Supabase
  if (supabase) {
    try {
      await supabase.from('users').insert({
        id: user.id,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        email: newUser.email,
        password_hash: user.passwordHash,
        created_at: createdAt
      });

      await supabase.from('user_progress').insert({
        user_id: user.id,
        solved_problem_ids: [],
        attempted_problem_ids: [],
        current_streak: 0,
        longest_streak: 0,
        last_active_date: null
      });
    } catch (e) {
      console.warn('Supabase createUser insert failed, fallback to local', e);
    }
  }

  // Save to local file
  const local = ensureDataFile();
  local.users.push({
    ...newUser,
    passwordHash: user.passwordHash
  });
  local.progress[user.id] = {
    userId: user.id,
    userName: `${newUser.firstName} ${newUser.lastName}`,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    solvedProblemIds: [],
    attemptedProblemIds: [],
    topicMastery: calculateTopicMastery([])
  };
  saveLocalDb(local);

  return newUser;
}

// ----------------- PROGRESS REPOSITORY -----------------

export async function getUserProgress(userId: string, defaultName = 'Learner'): Promise<UserProgress> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        const solvedIds: string[] = Array.isArray(data.solved_problem_ids) ? data.solved_problem_ids : [];
        const attemptedIds: string[] = Array.isArray(data.attempted_problem_ids) ? data.attempted_problem_ids : [];

        return {
          userId: data.user_id,
          userName: defaultName,
          currentStreak: data.current_streak || 0,
          longestStreak: data.longest_streak || 0,
          lastActiveDate: data.last_active_date || '',
          solvedProblemIds: solvedIds,
          attemptedProblemIds: attemptedIds,
          topicMastery: calculateTopicMastery(solvedIds)
        };
      }
    } catch (e) {
      console.warn('Supabase getUserProgress failed, using local', e);
    }
  }

  const local = ensureDataFile();
  if (local.progress[userId]) {
    const p = local.progress[userId];
    p.topicMastery = calculateTopicMastery(p.solvedProblemIds);
    return p;
  }

  const newProg: UserProgress = {
    userId,
    userName: defaultName,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    solvedProblemIds: [],
    attemptedProblemIds: [],
    topicMastery: calculateTopicMastery([])
  };
  local.progress[userId] = newProg;
  saveLocalDb(local);
  return newProg;
}

export async function recordUserProblemAttempt(userId: string, userName: string, problemId: string, isAccepted: boolean): Promise<UserProgress> {
  const current = await getUserProgress(userId, userName);

  if (!current.attemptedProblemIds.includes(problemId)) {
    current.attemptedProblemIds.push(problemId);
  }

  if (isAccepted) {
    if (!current.solvedProblemIds.includes(problemId)) {
      current.solvedProblemIds.push(problemId);

      const today = new Date().toISOString().split('T')[0];
      if (current.lastActiveDate !== today) {
        current.currentStreak += 1;
        if (current.currentStreak > current.longestStreak) {
          current.longestStreak = current.currentStreak;
        }
        current.lastActiveDate = today;
      }
    }
  }

  current.topicMastery = calculateTopicMastery(current.solvedProblemIds);

  // Sync to Supabase
  if (supabase) {
    try {
      await supabase.from('user_progress').upsert({
        user_id: userId,
        solved_problem_ids: current.solvedProblemIds,
        attempted_problem_ids: current.attemptedProblemIds,
        current_streak: current.currentStreak,
        longest_streak: current.longestStreak,
        last_active_date: current.lastActiveDate,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Supabase recordUserProblemAttempt failed, updated local', e);
    }
  }

  // Sync to local
  const local = ensureDataFile();
  local.progress[userId] = current;
  saveLocalDb(local);

  return current;
}

// ----------------- SUBMISSIONS REPOSITORY -----------------

export async function addSubmission(subData: Omit<Submission, 'id' | 'createdAt'>): Promise<Submission> {
  const newSub: Submission = {
    ...subData,
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString()
  };

  // Sync to Supabase
  if (supabase) {
    try {
      await supabase.from('submissions').insert({
        id: newSub.id,
        user_id: newSub.userId || null,
        user_name: newSub.userName,
        problem_id: newSub.problemId,
        problem_slug: newSub.problemSlug,
        problem_title: newSub.problemTitle,
        language: newSub.language,
        code: newSub.code,
        status: newSub.status,
        execution_time_ms: newSub.executionTimeMs,
        memory_mb: newSub.memoryMb,
        pass_count: newSub.passCount,
        total_count: newSub.totalCount,
        error_message: newSub.errorMessage || null,
        created_at: newSub.createdAt
      });
    } catch (e) {
      console.warn('Supabase addSubmission failed, saved to local', e);
    }
  }

  // Sync to local
  const local = ensureDataFile();
  local.submissions.unshift(newSub);
  saveLocalDb(local);

  return newSub;
}

export async function getSubmissionsList(userId?: string, problemId?: string): Promise<Submission[]> {
  if (supabase) {
    try {
      let query = supabase.from('submissions').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      if (problemId) {
        query = query.eq('problem_id', problemId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(row => ({
          id: row.id,
          userId: row.user_id,
          userName: row.user_name,
          problemId: row.problem_id,
          problemSlug: row.problem_slug,
          problemTitle: row.problem_title,
          language: row.language,
          code: row.code,
          status: row.status,
          executionTimeMs: row.execution_time_ms,
          memoryMb: Number(row.memory_mb || 0),
          passCount: row.pass_count,
          totalCount: row.total_count,
          errorMessage: row.error_message,
          createdAt: row.created_at
        }));
      }
    } catch (e) {
      console.warn('Supabase getSubmissionsList failed, falling back to local', e);
    }
  }

  const local = ensureDataFile();
  let results = local.submissions;
  if (userId) {
    results = results.filter(s => s.userId === userId);
  }
  if (problemId) {
    results = results.filter(s => s.problemId === problemId);
  }
  return results;
}
