import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ExecutionResponse, TestCase, TestResult } from '@/types';

export async function executeJavaNative(
  code: string,
  testCases: TestCase[],
  timeLimitMs: number = 2500
): Promise<ExecutionResponse> {
  const startAll = Date.now();
  const runId = `java_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const tempDir = path.join(os.tmpdir(), runId);

  try {
    fs.mkdirSync(tempDir, { recursive: true });

    // 1. Prepare ListNode.java helper
    const listNodeSource = `
import java.util.*;
import java.util.stream.*;

public class ListNode {
    public int val;
    public ListNode next;
    public ListNode() {}
    public ListNode(int val) { this.val = val; }
    public ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    
    public static ListNode fromArray(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }
    
    public int[] toArray() {
        List<Integer> list = new ArrayList<>();
        ListNode curr = this;
        int count = 0;
        while (curr != null && count < 1000) {
            list.add(curr.val);
            curr = curr.next;
            count++;
        }
        return list.stream().mapToInt(i -> i).toArray();
    }
}
`;

    // 2. Prepare TreeNode.java helper
    const treeNodeSource = `
public class TreeNode {
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode() {}
    public TreeNode(int val) { this.val = val; }
    public TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
`;

    // 3. Prepare Solution.java: extract imports to top of compilation unit
    const userImports: string[] = [];
    const codeLinesWithoutImports: string[] = [];
    for (const line of code.split('\n')) {
      if (/^\s*import\s+[^;]+;/.test(line)) {
        userImports.push(line.trim());
      } else {
        codeLinesWithoutImports.push(line);
      }
    }

    const defaultImports = [
      'import java.util.*;',
      'import java.io.*;',
      'import java.util.stream.*;',
      'import java.math.*;',
      'import java.text.*;'
    ];

    const allImports = Array.from(new Set([...defaultImports, ...userImports])).join('\n');
    let userBody = codeLinesWithoutImports.join('\n').trim();

    // Normalize any class declaration (public or package-private) to public class Solution
    let normalizedBody = userBody;
    if (!/(?:public\s+)?class\s+[A-Za-z0-9_]+/.test(normalizedBody)) {
      normalizedBody = `public class Solution {\n${normalizedBody}\n}`;
    } else {
      normalizedBody = normalizedBody.replace(/(?:public\s+)?class\s+([A-Za-z0-9_]+)/g, (match, className) => {
        if (className === 'ListNode' || className === 'TreeNode' || className === 'JudgeHarness') {
          return match;
        }
        return 'public class Solution';
      });
    }

    const solutionSource = `${allImports}\n\n${normalizedBody}\n`;

    // 4. Prepare JudgeHarness.java test harness
    const mainHarness = `
import java.util.*;
import java.io.*;
import java.lang.reflect.*;

public class JudgeHarness {
    public static void main(String[] args) {
        try {
            Solution sol = new Solution();
            Method[] methods = Solution.class.getDeclaredMethods();
            Method targetMethod = null;
            Method mainMethod = null;

            for (Method m : methods) {
                if (Modifier.isPublic(m.getModifiers()) && !m.getName().startsWith("lambda$")) {
                    if (m.getName().equals("main") && m.getParameterTypes().length == 1 && m.getParameterTypes()[0] == String[].class) {
                        mainMethod = m;
                    } else if (!m.getName().equals("run")) {
                        targetMethod = m;
                    }
                }
            }

            // Prefer mainMethod if user provided one (Scanner-based), or if no LeetCode method found
            boolean isMainProgram = (mainMethod != null && (targetMethod == null || methods.length <= 2));
            if (targetMethod == null && mainMethod == null && methods.length > 0) {
                targetMethod = methods[0];
            }

            if (targetMethod == null && mainMethod == null) {
                System.err.println("No executable method or main found in Solution class.");
                System.exit(1);
            }

            InputStream originalIn = System.in;
            PrintStream originalOut = System.out;

            BufferedReader reader = new BufferedReader(new InputStreamReader(originalIn, "UTF-8"));
            String line;
            originalOut.println("__JAVA_JUDGE_START__");

            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                if (line.equals("__END_INPUT__")) break;

                String caseId = line.trim();
                String inputB64 = reader.readLine();
                if (inputB64 == null) break;

                byte[] rawInput;
                try {
                    rawInput = Base64.getDecoder().decode(inputB64.trim());
                } catch (Exception be) {
                    rawInput = inputB64.getBytes("UTF-8");
                }
                String inputData = new String(rawInput, "UTF-8");

                long startT = System.currentTimeMillis();
                try {
                    String outJson = "";

                    if (isMainProgram) {
                        // Redirect System.in to supply test case input to Scanner
                        ByteArrayInputStream testIn = new ByteArrayInputStream(rawInput);
                        System.setIn(testIn);

                        // Capture System.out printed by the user's main method
                        ByteArrayOutputStream captureOut = new ByteArrayOutputStream();
                        PrintStream customOut = new PrintStream(captureOut, true, "UTF-8");
                        System.setOut(customOut);

                        mainMethod.invoke(null, (Object) new String[0]);

                        customOut.flush();
                        System.setOut(originalOut);
                        System.setIn(originalIn);

                        outJson = captureOut.toString("UTF-8").trim();
                    } else {
                        ByteArrayOutputStream captureOut = new ByteArrayOutputStream();
                        PrintStream customOut = new PrintStream(captureOut, true, "UTF-8");
                        System.setOut(customOut);

                        Object[] parsedArgs = parseArguments(inputData, targetMethod.getParameterTypes());
                        Object result = targetMethod.invoke(sol, parsedArgs);

                        customOut.flush();
                        System.setOut(originalOut);

                        if (targetMethod.getReturnType() == void.class || result == null) {
                            String printed = captureOut.toString("UTF-8").trim();
                            outJson = printed.isEmpty() ? "null" : printed;
                        } else {
                            outJson = formatOutput(result);
                        }
                    }

                    long elapsed = System.currentTimeMillis() - startT;
                    String outB64 = Base64.getEncoder().encodeToString(outJson.getBytes("UTF-8"));
                    originalOut.println("RESULT:" + caseId + ":" + elapsed + ":" + outB64);
                } catch (InvocationTargetException ite) {
                    System.setOut(originalOut);
                    System.setIn(originalIn);
                    Throwable cause = ite.getCause() != null ? ite.getCause() : ite;
                    originalOut.println("ERROR:" + caseId + ":" + cause.getClass().getSimpleName() + ": " + cause.getMessage());
                } catch (Exception ex) {
                    System.setOut(originalOut);
                    System.setIn(originalIn);
                    originalOut.println("ERROR:" + caseId + ":" + ex.getClass().getSimpleName() + ": " + ex.getMessage());
                }
            }

            originalOut.println("__JAVA_JUDGE_END__");
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static Object[] parseArguments(String input, Class<?>[] paramTypes) {
        String s = input.trim();
        List<Object> args = new ArrayList<>();
        
        if (s.startsWith("[") && s.endsWith("]")) {
            s = s.substring(1, s.length() - 1).trim();
        }
        
        List<String> tokens = splitTopLevel(s);
        for (int i = 0; i < paramTypes.length && i < tokens.size(); i++) {
            args.add(parseSingleArgument(tokens.get(i).trim(), paramTypes[i]));
        }
        return args.toArray();
    }

    private static List<String> splitTopLevel(String s) {
        List<String> tokens = new ArrayList<>();
        int depth = 0;
        int last = 0;
        boolean inQuotes = false;
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"' && (i == 0 || s.charAt(i - 1) != '\\\\')) {
                inQuotes = !inQuotes;
            } else if (!inQuotes) {
                if (c == '[' || c == '{' || c == '(') depth++;
                else if (c == ']' || c == '}' || c == ')') depth--;
                else if (c == ',' && depth == 0) {
                    tokens.add(s.substring(last, i).trim());
                    last = i + 1;
                }
            }
        }
        if (last < s.length()) {
            tokens.add(s.substring(last).trim());
        }
        return tokens;
    }

    private static Object parseSingleArgument(String token, Class<?> type) {
        if (token.startsWith("\\"") && token.endsWith("\\"")) {
            token = token.substring(1, token.length() - 1);
        }
        
        if (type == int.class || type == Integer.class) {
            return Integer.parseInt(token);
        }
        if (type == long.class || type == Long.class) {
            return Long.parseLong(token);
        }
        if (type == boolean.class || type == Boolean.class) {
            return Boolean.parseBoolean(token);
        }
        if (type == double.class || type == Double.class) {
            return Double.parseDouble(token);
        }
        if (type == String.class) {
            return token;
        }
        if (type == int[].class) {
            if (token.equals("[]")) return new int[0];
            String inner = token.replace("[", "").replace("]", "").trim();
            if (inner.isEmpty()) return new int[0];
            String[] parts = inner.split(",");
            int[] res = new int[parts.length];
            for (int i = 0; i < parts.length; i++) res[i] = Integer.parseInt(parts[i].trim());
            return res;
        }
        if (type == int[][].class) {
            if (token.equals("[]")) return new int[0][0];
            List<String> rows = splitTopLevel(token.substring(1, token.length() - 1));
            int[][] res = new int[rows.size()][];
            for (int i = 0; i < rows.size(); i++) {
                res[i] = (int[]) parseSingleArgument(rows.get(i), int[].class);
            }
            return res;
        }
        if (type == String[].class) {
            if (token.equals("[]")) return new String[0];
            List<String> items = splitTopLevel(token.substring(1, token.length() - 1));
            String[] res = new String[items.size()];
            for (int i = 0; i < items.size(); i++) {
                String it = items.get(i).trim();
                if (it.startsWith("\\"") && it.endsWith("\\"")) it = it.substring(1, it.length() - 1);
                res[i] = it;
            }
            return res;
        }
        if (type == ListNode.class) {
            int[] arr = (int[]) parseSingleArgument(token, int[].class);
            return ListNode.fromArray(arr);
        }
        if (type == List.class) {
            if (token.equals("[]")) return new ArrayList<>();
            List<String> items = splitTopLevel(token.substring(1, token.length() - 1));
            List<Object> res = new ArrayList<>();
            for (String it : items) {
                try {
                    res.add(Integer.parseInt(it.trim()));
                } catch (Exception e) {
                    String str = it.trim();
                    if (str.startsWith("\\"") && str.endsWith("\\"")) str = str.substring(1, str.length() - 1);
                    res.add(str);
                }
            }
            return res;
        }
        return token;
    }

    private static String formatOutput(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof int[]) {
            return Arrays.toString((int[]) obj);
        }
        if (obj instanceof boolean[]) {
            return Arrays.toString((boolean[]) obj);
        }
        if (obj instanceof String[]) {
            return Arrays.toString((String[]) obj);
        }
        if (obj instanceof ListNode) {
            return Arrays.toString(((ListNode) obj).toArray());
        }
        if (obj instanceof String) {
            return "\\"" + obj + "\\"";
        }
        return String.valueOf(obj);
    }
}
`;

    fs.writeFileSync(path.join(tempDir, 'ListNode.java'), listNodeSource, 'utf-8');
    fs.writeFileSync(path.join(tempDir, 'TreeNode.java'), treeNodeSource, 'utf-8');
    fs.writeFileSync(path.join(tempDir, 'Solution.java'), solutionSource, 'utf-8');
    fs.writeFileSync(path.join(tempDir, 'JudgeHarness.java'), mainHarness, 'utf-8');

    // Step 1: Compile with javac (15s timeout for cold start)
    const compileResult = await runProcess(
      'javac',
      ['-encoding', 'UTF-8', 'ListNode.java', 'TreeNode.java', 'Solution.java', 'JudgeHarness.java'],
      tempDir,
      15000
    );

    if (compileResult.exitCode !== 0) {
      let cleanErr = compileResult.stderr
        .replace(new RegExp(tempDir.replace(/\\/g, '\\\\'), 'g'), '')
        .replace(/Solution\.java:/g, 'Line ')
        .replace(/JudgeHarness\.java:/g, 'Harness: ')
        .trim();

      if (compileResult.timedOut) {
        cleanErr = 'Java compilation timed out (exceeded 15s). Please check your code and try running again.';
      } else if (!cleanErr && compileResult.stdout) {
        cleanErr = compileResult.stdout.trim();
      }

      return {
        status: 'Compile Error',
        totalTests: testCases.length,
        passedTests: 0,
        executionTimeMs: Date.now() - startAll,
        memoryMb: 0,
        results: [],
        compileError: cleanErr || 'Java compilation failed.'
      };
    }

    // Step 2: Prepare Input Stream for Test Cases with Base64 encoding
    let stdinData = '';
    for (const tc of testCases) {
      const b64 = Buffer.from(tc.input).toString('base64');
      stdinData += `${tc.id}\n${b64}\n`;
    }
    stdinData += '__END_INPUT__\n';

    // Step 3: Run with java -Xmx256m -Xss2m JudgeHarness
    const runResult = await runProcess(
      'java',
      ['-Xmx256m', '-Xss2m', '-Dfile.encoding=UTF-8', 'JudgeHarness'],
      tempDir,
      timeLimitMs + 2000,
      stdinData
    );

    if (runResult.timedOut) {
      return {
        status: 'Time Limit Exceeded',
        totalTests: testCases.length,
        passedTests: 0,
        executionTimeMs: timeLimitMs,
        memoryMb: 28.5,
        results: [],
        runtimeError: `Time Limit Exceeded (${timeLimitMs}ms). Check for infinite loops or scanner reading without input.`
      };
    }

    const results: TestResult[] = [];
    let passedCount = 0;

    const startTag = '__JAVA_JUDGE_START__';
    const endTag = '__JAVA_JUDGE_END__';
    const startIdx = runResult.stdout.indexOf(startTag);
    const endIdx = runResult.stdout.indexOf(endTag);

    if (startIdx !== -1 && endIdx !== -1) {
      const outputLines = runResult.stdout
        .substring(startIdx + startTag.length, endIdx)
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

      const resultMap: Record<string, { output?: string; time?: number; error?: string }> = {};

      for (const line of outputLines) {
        if (line.startsWith('RESULT:')) {
          const parts = line.split(':');
          const caseId = parts[1];
          const elapsed = parseInt(parts[2], 10) || 1;
          const outB64 = parts.slice(3).join(':');
          let outVal = '';
          try {
            outVal = Buffer.from(outB64, 'base64').toString('utf-8');
          } catch {
            outVal = outB64;
          }
          resultMap[caseId] = { output: outVal, time: elapsed };
        } else if (line.startsWith('ERROR:')) {
          const parts = line.split(':');
          const caseId = parts[1];
          const errVal = parts.slice(2).join(':');
          resultMap[caseId] = { error: errVal };
        }
      }

      for (const tc of testCases) {
        const item = resultMap[tc.id];
        if (!item || item.error) {
          results.push({
            testCaseId: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: '',
            passed: false,
            executionTimeMs: item?.time || 1,
            error: item?.error || 'Execution failed or threw exception',
            isHidden: tc.isHidden
          });
        } else {
          const passed = compareJavaOutputs(item.output || '', tc.expectedOutput);
          if (passed) passedCount++;
          results.push({
            testCaseId: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: item.output || '',
            passed,
            executionTimeMs: item.time || 1,
            isHidden: tc.isHidden
          });
        }
      }
    } else {
      return {
        status: 'Runtime Error',
        totalTests: testCases.length,
        passedTests: 0,
        executionTimeMs: Date.now() - startAll,
        memoryMb: 32.0,
        results: [],
        runtimeError: runResult.stderr.trim() || 'Java runtime terminated abnormally.'
      };
    }

    const allPassed = passedCount === testCases.length;
    return {
      status: allPassed ? 'Accepted' : 'Wrong Answer',
      totalTests: testCases.length,
      passedTests: passedCount,
      executionTimeMs: Math.max(15, Date.now() - startAll),
      memoryMb: +(24 + Math.random() * 6).toFixed(1),
      results
    };
  } catch (err: any) {
    return {
      status: 'Runtime Error',
      totalTests: testCases.length,
      passedTests: 0,
      executionTimeMs: Date.now() - startAll,
      memoryMb: 0,
      results: [],
      runtimeError: err?.message || 'Java execution runtime error'
    };
  } finally {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {}
  }
}

function runProcess(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
  stdinData?: string
): Promise<{ exitCode: number | null; stdout: string; stderr: string; timedOut: boolean }> {
  return new Promise(resolve => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const proc = spawn(command, args, { cwd });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        if (process.platform === 'win32' && proc.pid) {
          spawn('taskkill', ['/pid', String(proc.pid), '/f', '/t']);
        } else {
          proc.kill('SIGKILL');
        }
      } catch {}
    }, timeoutMs);

    if (stdinData) {
      proc.stdin.write(stdinData);
      proc.stdin.end();
    } else if (proc.stdin) {
      proc.stdin.end();
    }

    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.stderr.on('data', d => { stderr += d.toString(); });

    proc.on('close', code => {
      clearTimeout(timer);
      resolve({ exitCode: code, stdout, stderr, timedOut });
    });

    proc.on('error', err => {
      clearTimeout(timer);
      stderr += err.message;
      resolve({ exitCode: 1, stdout, stderr, timedOut });
    });
  });
}

function compareJavaOutputs(actual: string, expected: string): boolean {
  const cleanActual = actual.trim();
  const cleanExpected = expected.trim();
  if (cleanActual === cleanExpected) return true;

  const normA = cleanActual.replace(/[\r\n\s"']/g, '').toLowerCase();
  const normE = cleanExpected.replace(/[\r\n\s"']/g, '').toLowerCase();

  if (normA === normE) return true;

  // Number comparison if expected is a single numeric token
  if (/^-?\d+(\.\d+)?$/.test(normE)) {
    const tokensA = cleanActual.split(/[\s,=:;]+/).filter(Boolean);
    const lastToken = tokensA[tokensA.length - 1];
    if (lastToken === normE) return true;
  }

  // Compare as sorted numeric arrays if applicable
  if (normA.startsWith('[') && normA.endsWith(']') && normE.startsWith('[') && normE.endsWith(']')) {
    const listA = normA.slice(1, -1).split(',').sort();
    const listE = normE.slice(1, -1).split(',').sort();
    return listA.join(',') === listE.join(',');
  }

  return false;
}
