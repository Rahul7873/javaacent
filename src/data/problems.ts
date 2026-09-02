import { Problem } from '@/types';

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prob-1',
    slug: 'two-sum-target',
    title: 'Two Sum Target',
    difficulty: 'Easy',
    topics: ['Arrays', 'Hash Maps'],
    acceptanceRate: '49.8%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

Return the answer as an array with the two indices in any order.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your code here
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your code here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[2, 7, 11, 15], 9]',
        expectedOutput: '[0, 1]',
        explanation: '2 + 7 = 9 at indices 0 and 1'
      },
      {
        id: 'tc-2',
        input: '[[3, 2, 4], 6]',
        expectedOutput: '[1, 2]',
        explanation: '2 + 4 = 6 at indices 1 and 2'
      },
      {
        id: 'tc-3',
        input: '[[3, 3], 6]',
        expectedOutput: '[0, 1]',
        isHidden: true,
        explanation: 'Identical numbers handling'
      },
      {
        id: 'tc-4',
        input: '[[-1, -2, -3, -4, -5], -8]',
        expectedOutput: '[2, 4]',
        isHidden: true,
        explanation: 'Negative numbers'
      }
    ],
    hints: {
      level1: 'What relationship exists between the current number, the target, and the number you are seeking?',
      level2: 'For every number x, the other required number is target - x. How can you remember numbers you have already visited?',
      level3: 'A Hash Map allows O(1) lookup time. You can map each visited number to its corresponding index.',
      level4: 'Loop through the array once. Check if (target - nums[i]) exists in your map. If yes, return the saved index and i. Otherwise, store nums[i] -> i in the map.',
      level5: 'Time Complexity: O(n) since we traverse the list of n elements once and lookup takes O(1). Space Complexity: O(n) for the hash map storage.',
      level6: "Complete Java 17 Solution:\n```java\nimport java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    isPublished: true,
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'prob-2',
    slug: 'reverse-words-in-string',
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    topics: ['Strings', 'Two Pointers'],
    acceptanceRate: '41.2%',
    description: `Given an input string \`s\`, reverse the order of the **words**.

A **word** is defined as a sequence of non-space characters. The words in \`s\` will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space. Note that \`s\` may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words and no extra spaces.`,
    examples: [
      {
        input: 's = "the sky is blue"',
        output: '"blue is sky the"'
      },
      {
        input: 's = "  hello world  "',
        output: '"world hello"',
        explanation: 'Reversed string should not contain leading or trailing spaces.'
      },
      {
        input: 's = "a good   example"',
        output: '"example good a"',
        explanation: 'Multiple spaces between words should be reduced to a single space.'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's contains English letters (upper-case and lower-case), digits, and spaces \' \'.',
      'There is at least one word in s.'
    ],
    starterCode: {
      javascript: `function reverseWords(s) {
  // Write your code here
  return s.trim().split(/\\s+/).reverse().join(' ');
}`,
      typescript: `function reverseWords(s: string): string {
  // Write your code here
  return s.trim().split(/\\s+/).reverse().join(' ');
}`,
      python: `def reverseWords(s: str) -> str:
    # Write your code here
    return " ".join(s.split()[::-1])`,
      java: `class Solution {
    public String reverseWords(String s) {
        String[] words = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(" ");
        }
        return sb.toString();
    }
}`,
      cpp: `class Solution {
public:
    string reverseWords(string s) {
        stringstream ss(s);
        string word;
        vector<string> words;
        while (ss >> word) words.push_back(word);
        reverse(words.begin(), words.end());
        string res = "";
        for (int i = 0; i < words.size(); ++i) {
            res += words[i];
            if (i < words.size() - 1) res += " ";
        }
        return res;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '["the sky is blue"]',
        expectedOutput: '"blue is sky the"'
      },
      {
        id: 'tc-2',
        input: '["  hello world  "]',
        expectedOutput: '"world hello"'
      },
      {
        id: 'tc-3',
        input: '["a good   example"]',
        expectedOutput: '"example good a"'
      },
      {
        id: 'tc-4',
        input: '["  singleWord  "]',
        expectedOutput: '"singleWord"',
        isHidden: true
      }
    ],
    hints: {
      level1: 'How do you handle irregular spaces before, between, and after words?',
      level2: 'Tokenizing the string by whitespace naturally isolates individual words regardless of multiple spaces.',
      level3: 'A two-pointer reversal approach or a stack can reverse the sequence of extracted words.',
      level4: 'Extract all words ignoring whitespace. Reverse the collected words array and join them with a single space delimiter.',
      level5: 'Time Complexity: O(n) where n is string length. Space Complexity: O(n) to store the extracted words.',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public String reverseWords(String s) {\n        String[] words = s.trim().split(\"\\\\s+\");\n        StringBuilder sb = new StringBuilder();\n        for (int i = words.length - 1; i >= 0; i--) {\n            sb.append(words[i]);\n            if (i > 0) sb.append(\" \");\n        }\n        return sb.toString();\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    isPublished: true,
    createdAt: '2025-01-11T12:00:00Z'
  },
  {
    id: 'prob-3',
    slug: 'valid-parentheses-depth',
    title: 'Valid Parentheses and Brackets',
    difficulty: 'Easy',
    topics: ['Stacks', 'Strings'],
    acceptanceRate: '40.5%',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your code here
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      typescript: `function isValid(s: string): boolean {
  // Write your code here
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s: str) -> bool:
    # Write your code here
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
        else:
            stack.append(char)
    return len(stack) == 0`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                char top = st.top();
                if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '["()"]',
        expectedOutput: 'true'
      },
      {
        id: 'tc-2',
        input: '["()[]{}"]',
        expectedOutput: 'true'
      },
      {
        id: 'tc-3',
        input: '["(]"]',
        expectedOutput: 'false'
      },
      {
        id: 'tc-4',
        input: '["([)]"]',
        expectedOutput: 'false',
        isHidden: true
      },
      {
        id: 'tc-5',
        input: '["{[]}"]',
        expectedOutput: 'true',
        isHidden: true
      }
    ],
    hints: {
      level1: 'What happens when a closing bracket appears before its matching opener has closed?',
      level2: 'The most recently opened bracket must be the first one to be closed. Does a LIFO (Last In First Out) property ring a bell?',
      level3: 'Use a Stack data structure. Push opening brackets, and pop & match when encountering closing brackets.',
      level4: 'Iterate through each character. If it is an opener, push to stack. If it is a closer, pop the top of stack and check if it matches. If not or if stack is empty, return false. At the end, check if stack is empty.',
      level5: 'Time Complexity: O(n) for one pass. Space Complexity: O(n) in worst case (e.g. all opening brackets).',
      level6: "Complete Java 17 Solution:\n```java\nimport java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    isPublished: true,
    createdAt: '2025-01-12T09:30:00Z'
  },
  {
    id: 'prob-4',
    slug: 'maximum-subarray-kadane',
    title: 'Maximum Subarray Contiguous Sum',
    difficulty: 'Medium',
    topics: ['Arrays', 'Dynamic Programming'],
    acceptanceRate: '50.3%',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1'
      },
      {
        input: 'nums = [5, 4, -1, 7, 8]',
        output: '23'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your code here
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      typescript: `function maxSubArray(nums: number[]): number {
  // Write your code here
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      python: `def maxSubArray(nums: list[int]) -> int:
    # Write your code here
    max_sum = nums[0]
    curr_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currentMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentMax = Math.max(nums[i], currentMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currentMax);
        }
        return maxSoFar;
    }
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = nums[0];
        int currSum = nums[0];
        for (size_t i = 1; i < nums.size(); ++i) {
            currSum = max(nums[i], currSum + nums[i]);
            maxSum = max(maxSum, currSum);
        }
        return maxSum;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[-2, 1, -3, 4, -1, 2, 1, -5, 4]]',
        expectedOutput: '6'
      },
      {
        id: 'tc-2',
        input: '[[1]]',
        expectedOutput: '1'
      },
      {
        id: 'tc-3',
        input: '[[5, 4, -1, 7, 8]]',
        expectedOutput: '23'
      },
      {
        id: 'tc-4',
        input: '[[-5, -2, -8, -1]]',
        expectedOutput: '-1',
        isHidden: true
      }
    ],
    hints: {
      level1: 'If the sum of elements before index i becomes negative, does continuing that subarray help future elements?',
      level2: 'Whenever the running sum drops below the current single element, it is better to reset and start a new subarray at the current element.',
      level3: 'This is the classical Kadane\'s Algorithm (Dynamic Programming with O(1) state).',
      level4: 'Maintain two variables: `currentSum` and `maxSum`. At each element x, `currentSum = max(x, currentSum + x)`. Then update `maxSum = max(maxSum, currentSum)`.',
      level5: 'Time Complexity: O(n) single scan. Space Complexity: O(1) auxiliary memory.',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public int maxSubArray(int[] nums) {\n        int maxSum = nums[0], curr = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            curr = Math.max(nums[i], curr + nums[i]);\n            maxSum = Math.max(maxSum, curr);\n        }\n        return maxSum;\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    isPublished: true,
    createdAt: '2025-01-13T08:15:00Z'
  },
  {
    id: 'prob-5',
    slug: 'search-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    topics: ['Binary Search', 'Arrays'],
    acceptanceRate: '39.4%',
    description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\` (\`1 <= k < nums.length\`). For example, \`[0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\`.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return *the index of* \`target\` *if it is in* \`nums\`, *or* \`-1\` *if it is not in* \`nums\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    examples: [
      {
        input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
        output: '4'
      },
      {
        input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 3',
        output: '-1'
      },
      {
        input: 'nums = [1], target = 0',
        output: '-1'
      }
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
      'nums is an ascending array that is possibly rotated.',
      '-10^4 <= target <= 10^4'
    ],
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your code here
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
      typescript: `function search(nums: number[], target: number): number {
  // Write your code here
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
      python: `def search(nums: list[int], target: int) -> int:
    # Write your code here
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[4, 5, 6, 7, 0, 1, 2], 0]',
        expectedOutput: '4'
      },
      {
        id: 'tc-2',
        input: '[[4, 5, 6, 7, 0, 1, 2], 3]',
        expectedOutput: '-1'
      },
      {
        id: 'tc-3',
        input: '[[1], 0]',
        expectedOutput: '-1'
      },
      {
        id: 'tc-4',
        input: '[[5, 1, 3], 3]',
        expectedOutput: '2',
        isHidden: true
      }
    ],
    hints: {
      level1: 'Even though the array has been rotated, notice that if you split it at any midpoint, at least one half is guaranteed to be strictly sorted.',
      level2: 'Can you determine which half (left or right) is normally sorted by comparing `nums[left]` and `nums[mid]`?',
      level3: 'Once you know which half is sorted, check if target falls within that sorted half\'s boundaries. If so, search that half; otherwise search the opposite half.',
      level4: 'Execute binary search: compute `mid`. If `nums[mid] == target`, return `mid`. If `nums[left] <= nums[mid]`, left half is sorted: check `nums[left] <= target < nums[mid]`. Else right half is sorted: check `nums[mid] < target <= nums[right]`.',
      level5: 'Time Complexity: O(log n) because the search space halves on every step. Space Complexity: O(1).',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n}\n```"
    },
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    isPublished: true,
    createdAt: '2025-01-14T11:45:00Z'
  },
  {
    id: 'prob-6',
    slug: 'longest-substring-unique-chars',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topics: ['Strings', 'Hash Maps', 'Two Pointers'],
    acceptanceRate: '34.6%',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with length 3. Notice "pwke" is a subsequence, not a contiguous substring.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your code here
  let maxLen = 0;
  let left = 0;
  const map = new Map();
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Write your code here
  let maxLen = 0;
  let left = 0;
  const map = new Map<string, number>();
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char)! >= left) {
      left = map.get(char)! + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your code here
    char_map = {}
    max_len = 0
    left = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int maxLen = 0;
        int left = 0;
        Map<Character, Integer> map = new HashMap<>();
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> charMap;
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); ++right) {
            char c = s[right];
            if (charMap.count(c) && charMap[c] >= left) {
                left = charMap[c] + 1;
            }
            charMap[c] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '["abcabcbb"]',
        expectedOutput: '3'
      },
      {
        id: 'tc-2',
        input: '["bbbbb"]',
        expectedOutput: '1'
      },
      {
        id: 'tc-3',
        input: '["pwwkew"]',
        expectedOutput: '3'
      },
      {
        id: 'tc-4',
        input: '[""]',
        expectedOutput: '0',
        isHidden: true
      },
      {
        id: 'tc-5',
        input: '["dvdf"]',
        expectedOutput: '3',
        isHidden: true
      }
    ],
    hints: {
      level1: 'What window or range of indices are you currently observing as you read characters from left to right?',
      level2: 'When a repeated character enters the current window, what should happen to the left boundary of your window?',
      level3: 'This is the classic Sliding Window pattern combined with a Hash Map storing each character\'s most recent index.',
      level4: 'Maintain two pointers `left` and `right`. If `s[right]` was seen at index `>= left`, move `left` forward to `lastIndex + 1`. Record `s[right]` index and update `maxLen = max(maxLen, right - left + 1)`.',
      level5: 'Time Complexity: O(n) as both pointers traverse the string at most once. Space Complexity: O(min(m, n)) where m is character set size.',
      level6: "Complete Java 17 Solution:\n```java\nimport java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> map = new HashMap<>();\n        int maxLen = 0, left = 0;\n        for (int r = 0; r < s.length(); r++) {\n            char c = s.charAt(r);\n            if (map.containsKey(c)) {\n                left = Math.max(left, map.get(c) + 1);\n            }\n            map.put(c, r);\n            maxLen = Math.max(maxLen, r - left + 1);\n        }\n        return maxLen;\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(m, n))',
    isPublished: true,
    createdAt: '2025-01-15T14:20:00Z'
  },
  {
    id: 'prob-7',
    slug: 'climbing-stairs-ways',
    title: 'Climbing Stairs Combinations',
    difficulty: 'Easy',
    topics: ['Dynamic Programming', 'Recursion'],
    acceptanceRate: '52.7%',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1 step + 1 step, or 2 steps.'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'Three ways: (1+1+1), (1+2), (2+1).'
      }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
  // Write your code here
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
      typescript: `function climbStairs(n: number): number {
  // Write your code here
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
      python: `def climbStairs(n: int) -> int:
    # Write your code here
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
      java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; ++i) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[2]',
        expectedOutput: '2'
      },
      {
        id: 'tc-2',
        input: '[3]',
        expectedOutput: '3'
      },
      {
        id: 'tc-3',
        input: '[5]',
        expectedOutput: '8'
      },
      {
        id: 'tc-4',
        input: '[10]',
        expectedOutput: '89',
        isHidden: true
      }
    ],
    hints: {
      level1: 'To reach step n, where could you have immediately jumped from?',
      level2: 'You can only jump from step n-1 (taking 1 step) or step n-2 (taking 2 steps).',
      level3: 'Therefore, ways(n) = ways(n-1) + ways(n-2). This mirrors the Fibonacci sequence!',
      level4: 'Iteratively calculate step counts from 3 up to n keeping track of only the previous two steps.',
      level5: 'Time Complexity: O(n). Space Complexity: O(1) by maintaining just two variables.',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    isPublished: true,
    createdAt: '2025-01-16T10:00:00Z'
  },
  {
    id: 'prob-8',
    slug: 'container-with-most-water',
    title: 'Container With Most Water Volume',
    difficulty: 'Medium',
    topics: ['Two Pointers', 'Arrays'],
    acceptanceRate: '54.2%',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    examples: [
      {
        input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        output: '49',
        explanation: 'Vertical lines are at indices 1 and 8. Distance is 7, height is min(8, 7) = 7. Area is 7 * 7 = 49.'
      },
      {
        input: 'height = [1, 1]',
        output: '1'
      }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your code here
  let maxVolume = 0;
  let left = 0;
  let right = height.length - 1;
  while (left < right) {
    const currentHeight = Math.min(height[left], height[right]);
    const width = right - left;
    maxVolume = Math.max(maxVolume, currentHeight * width);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxVolume;
}`,
      typescript: `function maxArea(height: number[]): number {
  // Write your code here
  let maxVolume = 0;
  let left = 0;
  let right = height.length - 1;
  while (left < right) {
    const currentHeight = Math.min(height[left], height[right]);
    const width = right - left;
    maxVolume = Math.max(maxVolume, currentHeight * width);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxVolume;
}`,
      python: `def maxArea(height: list[int]) -> int:
    # Write your code here
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        h = min(height[left], height[right])
        max_water = max(max_water, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int max = 0, l = 0, r = height.length - 1;
        while (l < r) {
            int h = Math.min(height[l], height[r]);
            max = Math.max(max, h * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return max;
    }
}`,
      cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int maxA = 0, l = 0, r = height.size() - 1;
        while (l < r) {
            int h = min(height[l], height[r]);
            maxA = max(maxA, h * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return maxA;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[1, 8, 6, 2, 5, 4, 8, 3, 7]]',
        expectedOutput: '49'
      },
      {
        id: 'tc-2',
        input: '[[1, 1]]',
        expectedOutput: '1'
      },
      {
        id: 'tc-3',
        input: '[[4, 3, 2, 1, 4]]',
        expectedOutput: '16',
        isHidden: true
      }
    ],
    hints: {
      level1: 'The capacity is bounded by the shorter of the two lines and the distance between them: `min(h[l], h[r]) * (r - l)`.',
      level2: 'If you start with the widest possible container (two extreme ends), which pointer should you move inward to have any hope of finding a larger area?',
      level3: 'Use the Two Pointer technique. Moving the taller line can only decrease width without increasing height. Always advance the pointer pointing to the shorter line.',
      level4: 'While `left < right`: calculate area, update `maxArea`. Increment `left` if `height[left] < height[right]`, else decrement `right`.',
      level5: 'Time Complexity: O(n) single traversal. Space Complexity: O(1).',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, maxA = 0;\n        while (l < r) {\n            maxA = Math.max(maxA, Math.min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxA;\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    isPublished: true,
    createdAt: '2025-01-17T15:10:00Z'
  },
  {
    id: 'prob-9',
    slug: 'coin-change-minimum',
    title: 'Coin Change Minimum Quantity',
    difficulty: 'Medium',
    topics: ['Dynamic Programming'],
    acceptanceRate: '42.9%',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1, 2, 5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1'
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0'
      }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  // Write your code here
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      typescript: `function coinChange(coins: number[], amount: number): number {
  // Write your code here
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `def coinChange(coins: list[int], amount: int) -> int:
    # Write your code here
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i - c >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - c] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; ++i) {
            for (int c : coins) {
                if (i - c >= 0) {
                    dp[i] = min(dp[i], dp[i - c] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[1, 2, 5], 11]',
        expectedOutput: '3'
      },
      {
        id: 'tc-2',
        input: '[[2], 3]',
        expectedOutput: '-1'
      },
      {
        id: 'tc-3',
        input: '[[1], 0]',
        expectedOutput: '0'
      },
      {
        id: 'tc-4',
        input: '[[186, 419, 83, 408], 6249]',
        expectedOutput: '20',
        isHidden: true
      }
    ],
    hints: {
      level1: 'Can greedy choice fail here? For example, with coins [1, 3, 4] and target 6, greedy picks 4 + 1 + 1 (3 coins), but 3 + 3 is 2 coins.',
      level2: 'Because greedy does not guarantee an optimal answer, we can define subproblems: what is the minimum coins needed for each intermediate sum from 0 to amount?',
      level3: 'Dynamic Programming (bottom-up table of size amount + 1). `dp[i]` represents fewest coins to form amount `i`.',
      level4: 'Initialize `dp[0] = 0` and all other entries to infinity. For `i` from 1 to `amount`: for each coin `c`: if `i - c >= 0`, `dp[i] = min(dp[i], dp[i - c] + 1)`.',
      level5: 'Time Complexity: O(amount * n) where n is number of coins. Space Complexity: O(amount).',
      level6: "Complete Java 17 Solution:\n```java\nimport java.util.*;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}\n```"
    },
    timeComplexity: 'O(amount * n)',
    spaceComplexity: 'O(amount)',
    isPublished: true,
    createdAt: '2025-01-18T16:30:00Z'
  },
  {
    id: 'prob-10',
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    topics: ['Hash Maps', 'Arrays'],
    acceptanceRate: '63.5%',
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in **any order**.`,
    examples: [
      {
        input: 'nums = [1, 1, 1, 2, 2, 3], k = 2',
        output: '[1, 2]'
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      'k is in the range [1, the number of unique elements in the array].',
      'It is guaranteed that the answer is unique.'
    ],
    starterCode: {
      javascript: `function topKFrequent(nums, k) {
  // Write your code here
  const count = new Map();
  for (const n of nums) {
    count.set(n, (count.get(n) || 0) + 1);
  }
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of count.entries()) {
    buckets[freq].push(num);
  }
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    if (buckets[i].length > 0) {
      result.push(...buckets[i]);
    }
  }
  return result.slice(0, k);
}`,
      typescript: `function topKFrequent(nums: number[], k: number): number[] {
  // Write your code here
  const count = new Map<number, number>();
  for (const n of nums) {
    count.set(n, (count.get(n) || 0) + 1);
  }
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of count.entries()) {
    buckets[freq].push(num);
  }
  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    if (buckets[i].length > 0) {
      result.push(...buckets[i]);
    }
  }
  return result.slice(0, k);
}`,
      python: `def topKFrequent(nums: list[int], k: int) -> list[int]:
    # Write your code here
    from collections import Counter
    count = Counter(nums)
    return [item[0] for item in count.most_common(k)]`,
      java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int n : nums) map.put(n, map.getOrDefault(n, 0) + 1);
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> map.get(a) - map.get(b));
        for (int n : map.keySet()) {
            pq.add(n);
            if (pq.size() > k) pq.poll();
        }
        int[] res = new int[k];
        for (int i = 0; i < k; i++) res[i] = pq.poll();
        return res;
    }
}`,
      cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        for (int n : nums) count[n]++;
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        for (auto& [n, freq] : count) {
            pq.push({freq, n});
            if (pq.size() > k) pq.pop();
        }
        vector<int> res;
        while (!pq.empty()) {
            res.push_back(pq.top().second);
            pq.pop();
        }
        return res;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[1, 1, 1, 2, 2, 3], 2]',
        expectedOutput: '[1, 2]'
      },
      {
        id: 'tc-2',
        input: '[[1], 1]',
        expectedOutput: '[1]'
      },
      {
        id: 'tc-3',
        input: '[[4, 1, -1, 2, -1, 2, 3], 2]',
        expectedOutput: '[-1, 2]',
        isHidden: true
      }
    ],
    hints: {
      level1: 'First step: how do you keep track of how many times each number appears?',
      level2: 'Use a frequency table. Now, how can you extract the k items with the largest frequencies in better than O(n log n) time?',
      level3: 'You can use a Min-Heap of size k, or Bucket Sort where index represents frequency (0 to n).',
      level4: 'In bucket sort: `buckets[f]` stores numbers with frequency `f`. Iterate from index `n` down to 0, appending numbers until you collect `k` items.',
      level5: 'Time Complexity: O(n) using Bucket Sort. Space Complexity: O(n).',
      level6: "Complete Java 17 Solution:\n```java\nimport java.util.*;\n\nclass Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> counts = new HashMap<>();\n        for (int n : nums) counts.put(n, counts.getOrDefault(n, 0) + 1);\n        PriorityQueue<Map.Entry<Integer, Integer>> pq = new PriorityQueue<>(Comparator.comparingInt(Map.Entry::getValue));\n        for (var e : counts.entrySet()) {\n            pq.offer(e);\n            if (pq.size() > k) pq.poll();\n        }\n        return pq.stream().mapToInt(Map.Entry::getKey).toArray();\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    isPublished: true,
    createdAt: '2025-01-19T17:00:00Z'
  },
  {
    id: 'prob-11',
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Surface Water',
    difficulty: 'Hard',
    topics: ['Two Pointers', 'Stacks', 'Dynamic Programming'],
    acceptanceRate: '60.1%',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.'
      },
      {
        input: 'height = [4, 2, 0, 3, 2, 5]',
        output: '9'
      }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    starterCode: {
      javascript: `function trap(height) {
  // Write your code here
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }
  return water;
}`,
      typescript: `function trap(height: number[]): number {
  // Write your code here
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }
  return water;
}`,
      python: `def trap(height: list[int]) -> int:
    # Write your code here
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    trapped = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                trapped += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                trapped += right_max - height[right]
            right -= 1
    return trapped`,
      java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= lMax) lMax = height[l];
                else water += lMax - height[l];
                l++;
            } else {
                if (height[r] >= rMax) rMax = height[r];
                else water += rMax - height[r];
                r--;
            }
        }
        return water;
    }
}`,
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1, lMax = 0, rMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= lMax) lMax = height[l];
                else water += lMax - height[l];
                l++;
            } else {
                if (height[r] >= rMax) rMax = height[r];
                else water += rMax - height[r];
                r--;
            }
        }
        return water;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]]',
        expectedOutput: '6'
      },
      {
        id: 'tc-2',
        input: '[[4, 2, 0, 3, 2, 5]]',
        expectedOutput: '9'
      },
      {
        id: 'tc-3',
        input: '[[3, 0, 2, 0, 4]]',
        expectedOutput: '7',
        isHidden: true
      }
    ],
    hints: {
      level1: 'At any index i, how high can water rise directly above height[i]?',
      level2: 'Water at index i is determined by `min(max_left, max_right) - height[i]`, if positive.',
      level3: 'Can you compute this in O(1) space instead of precomputing prefix and suffix max arrays? Think Two Pointers.',
      level4: 'Maintain `leftMax` and `rightMax`. At each step, if `height[left] < height[right]`, the left side is the bottleneck: update `leftMax` or add `leftMax - height[left]` to water, then `left++`. Otherwise process the right side.',
      level5: 'Time Complexity: O(n) single pass. Space Complexity: O(1) constant auxiliary memory.',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, total = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= leftMax) leftMax = height[l];\n                else total += leftMax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rightMax) rightMax = height[r];\n                else total += rightMax - height[r];\n                r--;\n            }\n        }\n        return total;\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    isPublished: true,
    createdAt: '2025-01-20T19:00:00Z'
  },
  {
    id: 'prob-12',
    slug: 'number-of-islands-grid',
    title: 'Number of Connected Islands',
    difficulty: 'Medium',
    topics: ['Graphs', 'BFS', 'DFS'],
    acceptanceRate: '57.8%',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
        output: '1'
      },
      {
        input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
        output: '3'
      }
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    starterCode: {
      javascript: `function numIslands(grid) {
  // Write your code here
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0'; // mark visited
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      typescript: `function numIslands(grid: string[][]): number {
  // Write your code here
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r: number, c: number) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      python: `def numIslands(grid: list[list[str]]) -> int:
    # Write your code here
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}`,
      cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < grid.size(); ++r) {
            for (int c = 0; c < grid[0].size(); ++c) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]]',
        expectedOutput: '1'
      },
      {
        id: 'tc-2',
        input: '[[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]]',
        expectedOutput: '3'
      },
      {
        id: 'tc-3',
        input: '[[["1","0","1"],["0","1","0"],["1","0","1"]]]',
        expectedOutput: '5',
        isHidden: true
      }
    ],
    hints: {
      level1: 'Think of the 2D grid as an undirected graph where every land cell \'1\' connects to horizontal/vertical neighbors.',
      level2: 'Each connected component of \'1\'s forms exactly one island. How do we count distinct connected components?',
      level3: 'Depth First Search (DFS) or Breadth First Search (BFS) allows exploring and "sinking" each connected piece of land.',
      level4: 'Iterate through the matrix. When you encounter a \'1\', increment `count` and run DFS/BFS to convert all connected \'1\'s into \'0\'s (marking them visited).',
      level5: 'Time Complexity: O(m * n) since each cell is visited a constant number of times. Space Complexity: O(m * n) in the worst-case recursive call stack.',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int i = 0; i < grid.length; i++) {\n            for (int j = 0; j < grid[0].length; j++) {\n                if (grid[i][j] == '1') {\n                    count++;\n                    dfs(grid, i, j);\n                }\n            }\n        }\n        return count;\n    }\n    private void dfs(char[][] grid, int r, int c) {\n        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        dfs(grid, r + 1, c);\n        dfs(grid, r - 1, c);\n        dfs(grid, r, c + 1);\n        dfs(grid, r, c - 1);\n    }\n}\n```"
    },
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)',
    isPublished: true,
    createdAt: '2025-01-21T21:15:00Z'
  },
  {
    id: 'prob-13',
    slug: 'invert-binary-tree',
    title: 'Invert Binary Hierarchy Tree',
    difficulty: 'Easy',
    topics: ['Trees', 'Recursion', 'DFS'],
    acceptanceRate: '76.4%',
    description: `Given the root of a binary tree, invert the tree, and return its root.

For array representation of tree levels: inverting swaps the left and right children for every node recursively.`,
    examples: [
      {
        input: 'root = [4, 2, 7, 1, 3, 6, 9]',
        output: '[4, 7, 2, 9, 6, 3, 1]'
      },
      {
        input: 'root = [2, 1, 3]',
        output: '[2, 3, 1]'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    starterCode: {
      javascript: `function invertTree(root) {
  // Write your code here
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      typescript: `function invertTree(root: any): any {
  // Write your code here
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      python: `def invertTree(root):
    # Write your code here
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}`,
      cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        TreeNode* temp = root->left;
        root->left = invertTree(root->right);
        root->right = invertTree(temp);
        return root;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[4, 2, 7, 1, 3, 6, 9]]',
        expectedOutput: '[4, 7, 2, 9, 6, 3, 1]'
      },
      {
        id: 'tc-2',
        input: '[[2, 1, 3]]',
        expectedOutput: '[2, 3, 1]'
      },
      {
        id: 'tc-3',
        input: '[[]]',
        expectedOutput: '[]',
        isHidden: true
      }
    ],
    hints: {
      level1: 'What does inverting a tree mean at the level of a single node?',
      level2: 'It means swapping its left and right child pointers.',
      level3: 'Does this same swap need to happen for all descendants down to the leaf nodes?',
      level4: 'Base case: if node is null, return null. Recursively invert left subtree and right subtree, swap them, and return the node.',
      level5: 'Time Complexity: O(n) visiting each node once. Space Complexity: O(h) where h is the tree height.',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left;\n        root.left = invertTree(root.right);\n        root.right = invertTree(temp);\n        return root;\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    isPublished: true,
    createdAt: '2025-01-22T08:00:00Z'
  },
  {
    id: 'prob-14',
    slug: 'merge-sorted-linked-lists',
    title: 'Merge Two Sorted Sequences',
    difficulty: 'Easy',
    topics: ['Linked Lists', 'Two Pointers'],
    acceptanceRate: '63.9%',
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return *the head of the merged linked list*.`,
    examples: [
      {
        input: 'list1 = [1, 2, 4], list2 = [1, 3, 4]',
        output: '[1, 1, 2, 3, 4, 4]'
      },
      {
        input: 'list1 = [], list2 = []',
        output: '[]'
      }
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.'
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {
  // Write your code here
  const dummy = { val: 0, next: null };
  let cur = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }
  cur.next = list1 || list2;
  return dummy.next;
}`,
      typescript: `function mergeTwoLists(list1: any, list2: any): any {
  // Write your code here
  const dummy = { val: 0, next: null };
  let cur: any = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }
  cur.next = list1 || list2;
  return dummy.next;
}`,
      python: `def mergeTwoLists(list1, list2):
    # Write your code here
    dummy = ListNode(0)
    cur = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            cur.next = list1
            list1 = list1.next
        else:
            cur.next = list2
            list2 = list2.next
        cur = cur.next
    cur.next = list1 or list2
    return dummy.next`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
            else { cur.next = l2; l2 = l2.next; }
            cur = cur.next;
        }
        cur.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}`,
      cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* cur = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { cur->next = l1; l1 = l1->next; }
            else { cur->next = l2; l2 = l2->next; }
            cur = cur->next;
        }
        cur->next = l1 ? l1 : l2;
        return dummy.next;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[1, 2, 4], [1, 3, 4]]',
        expectedOutput: '[1, 1, 2, 3, 4, 4]'
      },
      {
        id: 'tc-2',
        input: '[[], []]',
        expectedOutput: '[]'
      },
      {
        id: 'tc-3',
        input: '[[], [0]]',
        expectedOutput: '[0]',
        isHidden: true
      }
    ],
    hints: {
      level1: 'How do you avoid handling edge cases for the new head node?',
      level2: 'A dummy head node simplifies pointer manipulation immensely.',
      level3: 'Compare current nodes of both lists, attach the smaller one to `cur.next`, and advance that list.',
      level4: 'Loop while both lists are non-empty. After loop, attach the remaining tail `cur.next = list1 || list2`. Return `dummy.next`.',
      level5: 'Time Complexity: O(n + m). Space Complexity: O(1) in-place splicing.',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        ListNode dummy = new ListNode(0), curr = dummy;\n        while (list1 != null && list2 != null) {\n            if (list1.val <= list2.val) {\n                curr.next = list1;\n                list1 = list1.next;\n            } else {\n                curr.next = list2;\n                list2 = list2.next;\n            }\n            curr = curr.next;\n        }\n        curr.next = list1 != null ? list1 : list2;\n        return dummy.next;\n    }\n}\n```"
    },
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    isPublished: true,
    createdAt: '2025-01-23T11:00:00Z'
  },
  {
    id: 'prob-15',
    slug: 'linked-list-cycle-detection',
    title: 'Detect Cycle in Linked Nodes',
    difficulty: 'Easy',
    topics: ['Linked Lists', 'Two Pointers'],
    acceptanceRate: '49.1%',
    description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer.

Return \`true\` if there is a cycle in the linked list. Otherwise, return \`false\`.`,
    examples: [
      {
        input: 'head = [3, 2, 0, -4], pos = 1',
        output: 'true',
        explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).'
      },
      {
        input: 'head = [1, 2], pos = 0',
        output: 'true'
      },
      {
        input: 'head = [1], pos = -1',
        output: 'false'
      }
    ],
    constraints: [
      'The number of the nodes in the list is in the range [0, 10^4].',
      '-10^5 <= Node.val <= 10^5'
    ],
    starterCode: {
      javascript: `function hasCycle(head) {
  // Write your code here
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      typescript: `function hasCycle(head: any): boolean {
  // Write your code here
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      python: `def hasCycle(head) -> bool:
    # Write your code here
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
      java: `public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool hasCycle(ListNode *head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[3, 2, 0, -4], 1]',
        expectedOutput: 'true'
      },
      {
        id: 'tc-2',
        input: '[[1, 2], 0]',
        expectedOutput: 'true'
      },
      {
        id: 'tc-3',
        input: '[[1], -1]',
        expectedOutput: 'false'
      }
    ],
    hints: {
      level1: 'Can two runners on a circular track run at different speeds without ever meeting?',
      level2: 'If there is a cycle, a faster runner must eventually catch up to the slower runner.',
      level3: 'Floyd\'s Tortoise and Hare algorithm (two pointers moving at 1x and 2x speeds).',
      level4: 'Move `slow` by 1 step and `fast` by 2 steps. If `slow == fast`, cycle detected (return true). If `fast` reaches null, no cycle exists.',
      level5: 'Time Complexity: O(n). Space Complexity: O(1).',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public boolean hasCycle(ListNode head) {\n        if (head == null) return false;\n        ListNode slow = head, fast = head.next;\n        while (fast != null && fast.next != null) {\n            if (slow == fast) return true;\n            slow = slow.next;\n            fast = fast.next.next;\n        }\n        return false;\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    isPublished: true,
    createdAt: '2025-01-24T12:00:00Z'
  },
  {
    id: 'prob-16',
    slug: 'course-schedule-dependency',
    title: 'Course Prerequisite Scheduler',
    difficulty: 'Medium',
    topics: ['Graphs', 'BFS', 'DFS'],
    acceptanceRate: '46.8%',
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a_i, b_i]\` indicates that you **must** take course \`b_i\` first if you want to take course \`a_i\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1, 0]]',
        output: 'true',
        explanation: 'To take course 1 you should have finished course 0. So it is possible.'
      },
      {
        input: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]',
        output: 'false',
        explanation: 'Course 1 requires 0, and 0 requires 1. Circular dependency detected.'
      }
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      'All the pairs prerequisites[i] are unique.'
    ],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
  // Write your code here
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    inDegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let count = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    count++;
    for (const next of adj[node]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  return count === numCourses;
}`,
      typescript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  // Write your code here
  const inDegree = new Array(numCourses).fill(0);
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    inDegree[course]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let count = 0;
  while (queue.length > 0) {
    const node = queue.shift()!;
    count++;
    for (const next of adj[node]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  return count === numCourses;
}`,
      python: `def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    # Write your code here
    from collections import deque
    in_degree = [0] * numCourses
    adj = [[] for _ in range(numCourses)]
    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1
    q = deque([i for i in range(numCourses) if in_degree[i] == 0])
    visited = 0
    while q:
        u = q.popleft()
        visited += 1
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
    return visited == numCourses`,
      java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        int[] inDegree = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);
        int visited = 0;
        while (!q.isEmpty()) {
            int cur = q.poll();
            visited++;
            for (int next : adj.get(cur)) {
                if (--inDegree[next] == 0) q.offer(next);
            }
        }
        return visited == numCourses;
    }
}`,
      cpp: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<int> inDegree(numCourses, 0);
        vector<vector<int>> adj(numCourses);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            inDegree[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; ++i) if (inDegree[i] == 0) q.push(i);
        int visited = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            visited++;
            for (int v : adj[u]) {
                if (--inDegree[v] == 0) q.push(v);
            }
        }
        return visited == numCourses;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[2, [[1, 0]]]',
        expectedOutput: 'true'
      },
      {
        id: 'tc-2',
        input: '[2, [[1, 0], [0, 1]]]',
        expectedOutput: 'false'
      },
      {
        id: 'tc-3',
        input: '[4, [[1, 0], [2, 0], [3, 1], [3, 2]]]',
        expectedOutput: 'true',
        isHidden: true
      }
    ],
    hints: {
      level1: 'Can courses be completed if there is a cycle in the dependency graph?',
      level2: 'Courses cannot be finished if and only if there exists a directed cycle.',
      level3: 'Topological Sort using Kahn\'s Algorithm (BFS with In-degree count) or DFS with 3 color states.',
      level4: 'Calculate in-degrees. Enqueue all courses with in-degree 0. While queue not empty, dequeue course, decrement in-degree of its outgoing neighbors, and enqueue neighbors whose in-degree becomes 0. If count processed equals numCourses, return true.',
      level5: 'Time Complexity: O(V + E) where V = numCourses and E = prerequisites. Space Complexity: O(V + E).',
      level6: "Complete Java 17 Solution:\n```java\nimport java.util.*;\n\nclass Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        List<List<Integer>> adj = new ArrayList<>();\n        int[] inDegree = new int[numCourses];\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        for (int[] p : prerequisites) {\n            adj.get(p[1]).add(p[0]);\n            inDegree[p[0]]++;\n        }\n        Queue<Integer> q = new LinkedList<>();\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);\n        int count = 0;\n        while (!q.isEmpty()) {\n            int curr = q.poll();\n            count++;\n            for (int next : adj.get(curr)) if (--inDegree[next] == 0) q.offer(next);\n        }\n        return count == numCourses;\n    }\n}\n```"
    },
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    isPublished: true,
    createdAt: '2025-01-25T14:30:00Z'
  },
  {
    id: 'prob-17',
    slug: 'word-break-dictionary',
    title: 'Word Break Dictionary Search',
    difficulty: 'Medium',
    topics: ['Dynamic Programming', 'Strings', 'Hash Maps'],
    acceptanceRate: '46.1%',
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet", "code"]',
        output: 'true',
        explanation: 'Return true because "leetcode" can be segmented as "leet code".'
      },
      {
        input: 's = "applepenapple", wordDict = ["apple", "pen"]',
        output: 'true',
        explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple".'
      },
      {
        input: 's = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 300',
      '1 <= wordDict.length <= 1000',
      '1 <= wordDict[i].length <= 20',
      's and wordDict[i] consist of only lowercase English letters.',
      'All strings in wordDict are unique.'
    ],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {
  // Write your code here
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
      typescript: `function wordBreak(s: string, wordDict: string[]): boolean {
  // Write your code here
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
      python: `def wordBreak(s: str, wordDict: list[str]) -> bool:
    # Write your code here
    words = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`,
      java: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> set = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && set.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
}`,
      cpp: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> set(wordDict.begin(), wordDict.end());
        vector<bool> dp(s.length() + 1, false);
        dp[0] = true;
        for (size_t i = 1; i <= s.length(); ++i) {
            for (size_t j = 0; j < i; ++j) {
                if (dp[j] && set.find(s.substr(j, i - j)) != set.end()) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '["leetcode", ["leet", "code"]]',
        expectedOutput: 'true'
      },
      {
        id: 'tc-2',
        input: '["applepenapple", ["apple", "pen"]]',
        expectedOutput: 'true'
      },
      {
        id: 'tc-3',
        input: '["catsandog", ["cats", "dog", "sand", "and", "cat"]]',
        expectedOutput: 'false'
      }
    ],
    hints: {
      level1: 'Can you break this down into smaller prefixes of s that can be segmented?',
      level2: 'If prefix `s[0...j]` is valid and the substring `s[j...i]` is in the dictionary, then prefix `s[0...i]` is also valid.',
      level3: 'Dynamic Programming array `dp[i]` of length `n + 1`, representing whether `s[0...i]` can be segmented.',
      level4: '`dp[0] = true`. For `i` from 1 to `n`: check all `j < i`. If `dp[j] == true` and `s[j:i]` in dictionary set, set `dp[i] = true` and break.',
      level5: 'Time Complexity: O(n^2 * k) where k is substring comparison cost. Space Complexity: O(n) for the dp array.',
      level6: "Complete Java 17 Solution:\n```java\nimport java.util.*;\n\nclass Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> dict = new HashSet<>(wordDict);\n        boolean[] dp = new boolean[s.length() + 1];\n        dp[0] = true;\n        for (int i = 1; i <= s.length(); i++) {\n            for (int j = 0; j < i; j++) {\n                if (dp[j] && dict.contains(s.substring(j, i))) {\n                    dp[i] = true;\n                    break;\n                }\n            }\n        }\n        return dp[s.length()];\n    }\n}\n```"
    },
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n)',
    isPublished: true,
    createdAt: '2025-01-26T16:00:00Z'
  },
  {
    id: 'prob-18',
    slug: 'lowest-common-ancestor-tree',
    title: 'Lowest Common Ancestor in Binary Tree',
    difficulty: 'Medium',
    topics: ['Trees', 'Recursion', 'DFS'],
    acceptanceRate: '60.8%',
    description: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow **a node to be a descendant of itself**).`,
    examples: [
      {
        input: 'root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 1',
        output: '3',
        explanation: 'The LCA of nodes 5 and 1 is 3.'
      },
      {
        input: 'root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 4',
        output: '5',
        explanation: 'The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself.'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [2, 10^5].',
      '-10^9 <= Node.val <= 10^9',
      'All Node.val are unique.',
      'p != q',
      'p and q will exist in the tree.'
    ],
    starterCode: {
      javascript: `function lowestCommonAncestor(root, p, q) {
  // Write your code here
  if (!root || root.val === p || root.val === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}`,
      typescript: `function lowestCommonAncestor(root: any, p: number, q: number): any {
  // Write your code here
  if (!root || root.val === p || root.val === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}`,
      python: `def lowestCommonAncestor(root, p: int, q: int):
    # Write your code here
    if not root or root.val == p or root.val == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right:
        return root
    return left or right`,
      java: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return (left != null) ? left : right;
    }
}`,
      cpp: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        if (left && right) return root;
        return left ? left : right;
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[3, 5, 1, 6, 2, 0, 8], 5, 1]',
        expectedOutput: '3'
      },
      {
        id: 'tc-2',
        input: '[[3, 5, 1, 6, 2, 0, 8], 5, 4]',
        expectedOutput: '5'
      },
      {
        id: 'tc-3',
        input: '[[1, 2], 1, 2]',
        expectedOutput: '1',
        isHidden: true
      }
    ],
    hints: {
      level1: 'What happens if the current node is equal to either p or q?',
      level2: 'If the current node is p or q, or null, it returns itself immediately.',
      level3: 'Look at what the left and right subtrees return: if one finds p and the other finds q, what does that say about the current node?',
      level4: 'If both left and right recursive searches return a non-null node, then the current root is the LCA. Otherwise return the non-null child.',
      level5: 'Time Complexity: O(n) traversing each node at most once. Space Complexity: O(h) recursion stack.',
      level6: "Complete Java 17 Solution:\n```java\nclass Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        if (root == null || root == p || root == q) return root;\n        TreeNode left = lowestCommonAncestor(root.left, p, q);\n        TreeNode right = lowestCommonAncestor(root.right, p, q);\n        if (left != null && right != null) return root;\n        return left != null ? left : right;\n    }\n}\n```"
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    isPublished: true,
    createdAt: '2025-01-27T18:00:00Z'
  }
];
