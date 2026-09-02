import { Problem, AITutorMessage } from '@/types';

interface TutorRequest {
  problem: Problem;
  currentCode?: string;
  language?: string;
  userMessage: string;
  history?: AITutorMessage[];
  requestedLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  lastError?: string;
}

interface TutorResponse {
  message: string;
  hintLevel: 1 | 2 | 3 | 4 | 5 | 6;
  suggestedPrompts: string[];
}

export async function generateTutorResponse({
  problem,
  currentCode,
  language = 'java',
  userMessage,
  history = [],
  requestedLevel,
  lastError
}: TutorRequest): Promise<TutorResponse> {
  // Check if Gemini API key is available in environment
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      return await queryGeminiTutor({
        apiKey: geminiApiKey,
        problem,
        currentCode,
        language,
        userMessage,
        requestedLevel,
        lastError
      });
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local pedagogical engine:', e);
    }
  }

  // Built-in Pedagogical Tutor Engine implementing the 6-level teaching hierarchy
  return generateBuiltInTutorResponse({
    problem,
    currentCode,
    language,
    userMessage,
    requestedLevel,
    lastError
  });
}

function generateBuiltInTutorResponse({
  problem,
  currentCode,
  language,
  userMessage,
  requestedLevel,
  lastError
}: {
  problem: Problem;
  currentCode?: string;
  language: string;
  userMessage: string;
  requestedLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  lastError?: string;
}): TutorResponse {
  const query = userMessage.toLowerCase().trim();

  // 1. Detect requested level from explicit param OR embedded in message
  let effectiveLevel = requestedLevel;
  if (!effectiveLevel) {
    if (query.includes('level 1') || query.includes('guiding question')) effectiveLevel = 1;
    else if (query.includes('level 2') || query.includes('conceptual') || query.includes('concept')) effectiveLevel = 2;
    else if (query.includes('level 3') || query.includes('data structure') || query.includes('pattern')) effectiveLevel = 3;
    else if (query.includes('level 4') || query.includes('algorithmic approach') || query.includes('algorithm steps') || query.includes('step by step')) effectiveLevel = 4;
    else if (query.includes('level 5') || query.includes('complexity') || query.includes('big o')) effectiveLevel = 5;
    else if (query.includes('level 6') || query.includes('full solution') || query.includes('complete solution') || query.includes('give me code') || query.includes('answer code')) effectiveLevel = 6;
  }

  if (effectiveLevel) {
    return createLevelResponse(problem, effectiveLevel, language);
  }

  // 2. Code Review Request
  if (query.includes('review') || query.includes('check my code') || query.includes('look at my code') || query.includes('is my code')) {
    const review = reviewStudentCode(problem, currentCode, language, lastError);
    return {
      message: `🧐 **Code Review for ${problem.title}:**\n\n${review}`,
      hintLevel: 4,
      suggestedPrompts: [
        'Explain the algorithm approach (Level 4)',
        'What is the optimal complexity? (Level 5)',
        'Show the complete solution (Level 6)'
      ]
    };
  }

  // 3. User is experiencing an error or failure
  if (lastError || query.includes('error') || query.includes('failing') || query.includes('wrong') || query.includes('stuck') || query.includes('why is it not working')) {
    const errorAnalysis = analyzeUserCode(problem, currentCode, language, lastError);
    return {
      message: `🛠️ **Debugging Assistance:**\n\n${errorAnalysis}\n\n💡 **Guiding Concept (Level 2):** ${problem.hints.level2}`,
      hintLevel: 2,
      suggestedPrompts: [
        'How should I approach this? (Level 4)',
        'Review my current code',
        'Show the full solution (Level 6)'
      ]
    };
  }

  // 4. Questions about reading input / Scanner in Java
  if (query.includes('read') || query.includes('scanner') || query.includes('input') || query.includes('system.in')) {
    return {
      message: `📥 **Reading Input in Java:**\n\nIn Java, you can use \`java.util.Scanner\` to read from \`System.in\`:\n\n\`\`\`java\nimport java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n        // Reading integers:\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        \n        // Or reading lines of text:\n        // String text = sc.nextLine();\n    }\n}\n\`\`\`\n\nFor **${problem.title}**, make sure your Scanner variables match the input types given in the problem description!`,
      hintLevel: 2,
      suggestedPrompts: [
        'How do I calculate and print the result?',
        'Review my current code',
        'Walk through algorithm approach (Level 4)'
      ]
    };
  }

  // 5. Questions about printing or output in Java
  if (query.includes('print') || query.includes('output') || query.includes('display') || query.includes('system.out')) {
    return {
      message: `📤 **Printing Output in Java:**\n\nUse \`System.out.println()\` to print values followed by a new line:\n\n\`\`\`java\n// Printing a single variable or result:\nSystem.out.println(result);\n\n// Printing with text:\nSystem.out.println("Result: " + result);\n\`\`\`\n\nCheck the **Expected Output** in the problem tab to ensure the output format (spacing, newlines) matches exactly!`,
      hintLevel: 2,
      suggestedPrompts: [
        'Can you review my current code?',
        'Walk through algorithm approach (Level 4)',
        'Show the complete solution (Level 6)'
      ]
    };
  }

  // 6. Questions about arithmetic / adding / sum / math
  if (query.includes('sum') || query.includes('add') || query.includes('divide') || query.includes('multiply') || query.includes('math') || query.includes('remainder')) {
    return {
      message: `🔢 **Arithmetic Logic for ${problem.title}:**\n\nJava provides standard arithmetic operators:\n- Addition: \`+\` (e.g. \`int sum = a + b;\`)\n- Subtraction: \`-\`\n- Multiplication: \`*\`\n- Division: \`/\`\n- Modulo (Remainder): \`%\`\n\n💡 **Next Step:** Store the calculation in a variable, then output it with \`System.out.println(sum);\`.`,
      hintLevel: 2,
      suggestedPrompts: [
        'Can you review my current code?',
        'Explain the algorithm approach (Level 4)',
        'Show the complete solution (Level 6)'
      ]
    };
  }

  // 7. Questions about arrays or collections
  if (query.includes('array') || query.includes('list') || query.includes('hashmap') || query.includes('map') || query.includes('set')) {
    return {
      message: `📦 **Data Structure Guidance (Level 3):**\n\n${problem.hints.level3}\n\nIn Java, choosing the right data structure allows you to avoid nested loops and achieve optimal performance.`,
      hintLevel: 3,
      suggestedPrompts: [
        'Walk through algorithm approach (Level 4)',
        'What is the optimal complexity? (Level 5)',
        'Can you review my current code?'
      ]
    };
  }

  // 8. Friendly greetings & small talk
  if (query === 'hi' || query === 'hello' || query === 'hey' || query.startsWith('hi ') || query.startsWith('hello ')) {
    return {
      message: `👋 Hi there! I'm your Socratic AI Tutor for **${problem.title}**.\n\nI can help guide you through the logic, review your code, explain Java syntax (like \`Scanner\` or \`System.out\`), or walk through hints step-by-step.\n\nWhere would you like to start?`,
      hintLevel: 1,
      suggestedPrompts: [
        'I need a conceptual hint (Level 2)',
        'How should I approach this? (Level 4)',
        'Can you review my current code?'
      ]
    };
  }

  // 9. Expressions of gratitude / confirmation
  if (query.includes('thank') || query === 'ok' || query === 'got it' || query === 'cool' || query === 'understood') {
    return {
      message: `You're very welcome! Feel free to write your solution in the editor and click **Run** to test it against the test cases.\n\nIf you get stuck or receive an error, ask me anytime!`,
      hintLevel: 1,
      suggestedPrompts: [
        'Can you review my current code?',
        'What is the optimal complexity? (Level 5)',
        'Show the complete solution (Level 6)'
      ]
    };
  }

  // 10. Default contextual guiding question (Level 1)
  return {
    message: `🎯 **Socratic Guidance for ${problem.title}:**\n\n${problem.hints.level1}\n\n*Tip: You can ask me questions about Java syntax (e.g. "How to use Scanner?"), ask me to review your code, or request specific hint levels (L1 to L6).*`,
    hintLevel: 1,
    suggestedPrompts: [
      'I need a conceptual hint (Level 2)',
      'How should I approach this? (Level 4)',
      'Can you review my current code?'
    ]
  };
}

function reviewStudentCode(problem: Problem, code?: string, language?: string, lastError?: string): string {
  if (!code || code.trim().length === 0) {
    return 'Your code editor is currently empty! Start by writing a `public class Solution` with a `main` method or required solution method.';
  }

  const clean = code.trim();
  const feedback: string[] = [];

  // Check class declaration
  if (clean.includes('class Solution')) {
    feedback.push('✅ Class `Solution` is properly declared.');
  } else if (clean.includes('class ')) {
    feedback.push('ℹ️ You have declared a class. Make sure it is named `Solution` so the judge can find it.');
  } else {
    feedback.push('⚠️ Missing class declaration. Wrap your code inside `public class Solution { ... }`.');
  }

  // Check main or method
  if (clean.includes('public static void main(String[] args)')) {
    feedback.push('✅ `main` method entry point is present.');
  }

  // Check Scanner usage for input problems
  if (problem.description.toLowerCase().includes('input') || problem.description.toLowerCase().includes('takes')) {
    if (clean.includes('Scanner')) {
      feedback.push('✅ `Scanner` is used to read inputs.');
    } else {
      feedback.push('💡 Tip: This problem expects inputs. Consider using `Scanner sc = new Scanner(System.in);` to read them.');
    }
  }

  // Check System.out
  if (clean.includes('System.out.print')) {
    feedback.push('✅ Standard output statement (`System.out.println`) is present.');
  } else if (!clean.includes('return ')) {
    feedback.push('💡 Don\'t forget to print your result using `System.out.println(...)` or return it from your method.');
  }

  if (lastError) {
    feedback.push(`\n⚠️ Note your last run produced: \`${lastError}\`. Double check type conversions and edge cases.`);
  }

  return feedback.join('\n\n');
}

function createLevelResponse(problem: Problem, level: 1 | 2 | 3 | 4 | 5 | 6, language: string): TutorResponse {
  switch (level) {
    case 1:
      return {
        message: `🎯 **Level 1: Guiding Question**\n\n${problem.hints.level1}\n\n💡 *Tip: Think through the inputs, outputs, and edge cases before writing code.*`,
        hintLevel: 1,
        suggestedPrompts: [
          'Give me a conceptual hint (Level 2)',
          'What data structure should I use? (Level 3)',
          'Explain the algorithm steps (Level 4)'
        ]
      };
    case 2:
      return {
        message: `💡 **Level 2: Conceptual Hint**\n\n${problem.hints.level2}\n\nNotice how this mental model guides the approach without brute-force repetition.`,
        hintLevel: 2,
        suggestedPrompts: [
          'What data structure should I use? (Level 3)',
          'Explain the algorithm steps (Level 4)',
          'Can you review my current code?'
        ]
      };
    case 3:
      return {
        message: `🧩 **Level 3: Pattern & Data Structure**\n\n${problem.hints.level3}\n\nThis pattern is standard for **${problem.topics.join(', ')}**. How would you structure your variables or classes?`,
        hintLevel: 3,
        suggestedPrompts: [
          'Walk me through the algorithm steps (Level 4)',
          'What is the time complexity? (Level 5)',
          'Can you review my current code?'
        ]
      };
    case 4:
      return {
        message: `📋 **Level 4: Algorithmic Approach**\n\n${problem.hints.level4}\n\nTry writing these steps into your Java code editor now!`,
        hintLevel: 4,
        suggestedPrompts: [
          'Can you review my current code?',
          'What is the time complexity? (Level 5)',
          'Show the complete solution (Level 6)'
        ]
      };
    case 5:
      return {
        message: `⚡ **Level 5: Complexity Analysis**\n\n${problem.hints.level5}\n\nCan you think of why this is the optimal lower bound for **${problem.title}**?`,
        hintLevel: 5,
        suggestedPrompts: [
          'Show the complete solution (Level 6)',
          'Can you review my current code?',
          'Explain the algorithm steps (Level 4)'
        ]
      };
    case 6:
      return {
        message: `🏆 **Level 6: Complete Solution**\n\nHere is the complete reference implementation in **Java 17** for **${problem.title}**:\n\n${problem.hints.level6}\n\n💡 **Key Takeaways:**\n- Notice how this directly implements the approach discussed in Level 4.\n- Try typing it in the editor and clicking **Run** to verify!`,
        hintLevel: 6,
        suggestedPrompts: [
          'Can you review my current code?',
          'What is the optimal complexity? (Level 5)',
          'Explain line by line'
        ]
      };
  }
}

function analyzeUserCode(problem: Problem, code?: string, language?: string, lastError?: string): string {
  if (!code || code.trim().length === 0) {
    return 'Your editor is currently empty. Start by looking at the input types and the required return type.';
  }

  if (lastError?.includes('Time Limit Exceeded')) {
    return 'Your code timed out. This usually means either an infinite loop or an O(n^2) nested loop when an O(n) or O(log n) solution is required.';
  }

  if (lastError?.includes('ReferenceError') || lastError?.includes('NameError')) {
    return 'There is an undefined variable reference in your code. Check your variable declarations and loop indices.';
  }

  return `We encountered an issue during execution: \`${lastError || 'Output did not match expected'}\`. Look closely at how you handle edge cases such as empty inputs, single element arrays, or boundary values.`;
}

// Optional real Gemini API caller when GEMINI_API_KEY is configured
async function queryGeminiTutor({
  apiKey,
  problem,
  currentCode,
  language,
  userMessage,
  requestedLevel,
  lastError
}: {
  apiKey: string;
  problem: Problem;
  currentCode?: string;
  language: string;
  userMessage: string;
  requestedLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  lastError?: string;
}): Promise<TutorResponse> {
  const examplesText = (problem.examples || [])
    .map((ex, i) => `Example ${i + 1}: Input: "${ex.input}" -> Output: "${ex.output}" (${ex.explanation || 'standard'})`)
    .join('\n');

  const prompt = `
You are an expert, world-class Socratic Java 17 programming mentor on the JavaAscent coding platform.
A student is actively solving a problem in their code editor and has asked for your guidance.

=== FULL PROBLEM SPECIFICATION ===
Title: ${problem.title}
Difficulty: ${problem.difficulty}
Category: ${problem.category || 'Algorithms & Problem Solving'}
Description:
${problem.description}

Examples:
${examplesText || 'Standard input/output according to description.'}

Constraints:
${problem.constraints.join('; ')}

Target Complexities: Time: ${problem.timeComplexity}, Space: ${problem.spaceComplexity}

=== STUDENT'S CURRENT CODE IN EDITOR (${language}) ===
\`\`\`${language}
${currentCode || '// (The editor is currently empty)'}
\`\`\`

=== EXECUTION RESULT / LAST ERROR ===
${lastError ? `Last Error / Result: ${lastError}` : 'No execution errors reported yet.'}

=== STUDENT INQUIRY / ACTION ===
Action: "${userMessage}"
Target Hint Level: ${requestedLevel ? `Level ${requestedLevel} of 6` : 'Auto-detected based on student query'}

=== YOUR INSTRUCTIONS ===
1. 🔍 **Code Review & Feedback**:
   - Examine the student's actual code above.
   - Point out what they did well (e.g. good Scanner usage, correct variable types, clean structure).
   - Point out any specific bugs, missed requirements, edge-case vulnerabilities, or logical traps in their current code.

2. 🎯 **Target Level Response / Guidance**:
   - If Level 1 (Guiding Question): Give an intuitive guiding question tied to their current code progress.
   - If Level 2 (Conceptual Hint): Explain the core mental model or mathematical formula.
   - If Level 3 (Pattern & Data Structure): Recommend the exact Java classes/data structures to use.
   - If Level 4 (Algorithmic Approach): Give clear, numbered, step-by-step implementation steps.
   - If Level 5 (Complexity Analysis): Explain Big-O Time and Space complexity for both optimal solution and their current attempt.
   - If Level 6 (Complete Solution): Provide the COMPLETE, OPTIMAL, PRODUCTION-READY JAVA 17 CODE in a \`\`\`java block with imports and explanations!
   - If a general question: Answer directly and warmly while relating back to their code and this problem.

3. 💡 **Tone & Presentation**:
   - Use warm, engaging GitHub markdown with emojis and clean formatting.
   - Never show Python code — this is a dedicated Java 17 platform.
`;

  let resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1200, temperature: 0.7 }
      })
    }
  );

  if (!resp.ok) {
    // Fallback to gemini-flash-latest if 2.5 is not available
    resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.7 }
        })
      }
    );
  }

  if (!resp.ok) {
    throw new Error(`Gemini API returned status ${resp.status}`);
  }

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I am analyzing your code...';

  // Compute smart suggested prompts based on the current level
  const effectiveLvl = requestedLevel || 2;
  const nextPrompts: string[] = [];
  if (effectiveLvl < 6) {
    nextPrompts.push(`Unlock Level ${effectiveLvl + 1} Guidance`);
  }
  nextPrompts.push('Can you review my code again?');
  if (effectiveLvl !== 5) {
    nextPrompts.push('What is the optimal complexity? (Level 5)');
  }
  if (effectiveLvl < 6 && !nextPrompts.includes('Show complete solution (Level 6)')) {
    nextPrompts.push('Show complete solution (Level 6)');
  }

  return {
    message: text,
    hintLevel: effectiveLvl,
    suggestedPrompts: nextPrompts.slice(0, 3)
  };
}
