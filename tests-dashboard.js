/* ============================================================
   EDULEARN — Programming Tests Dashboard
   Assign, write, and take coding tests for programming courses
   ============================================================ */
const TestsDashboard = (() => {
  const STORAGE_KEY = 'edulearn_coding_tests';

  // Pre-built tests per language
  const PRESET_TESTS = {
    python: [
      {
        id: 'py-basics-1',
        title: 'Python Basics Test',
        language: 'python',
        difficulty: 'beginner',
        duration: 30,
        description: 'Test your understanding of Python basics — variables, data types, and basic operations.',
        problems: [
          {
            title: 'Sum of Two Numbers',
            description: 'Write a function `add(a, b)` that returns the sum of two numbers.',
            starterCode: 'def add(a, b):\n    # Write your code here\n    pass\n\n# Test cases\nprint(add(2, 3))    # Expected: 5\nprint(add(-1, 1))   # Expected: 0\nprint(add(100, 200)) # Expected: 300\n',
            testCases: [
              { input: '', expected: '5\n0\n300' },
            ],
          },
          {
            title: 'Even or Odd',
            description: 'Write a function `even_or_odd(n)` that returns "Even" if n is even, else "Odd".',
            starterCode: 'def even_or_odd(n):\n    # Write your code here\n    pass\n\nprint(even_or_odd(4))   # Expected: Even\nprint(even_or_odd(7))   # Expected: Odd\nprint(even_or_odd(0))   # Expected: Even\n',
            testCases: [
              { input: '', expected: 'Even\nOdd\nEven' },
            ],
          },
          {
            title: 'String Reverse',
            description: 'Write a function `reverse_string(s)` that returns the reversed string.',
            starterCode: 'def reverse_string(s):\n    # Write your code here\n    pass\n\nprint(reverse_string("hello"))    # Expected: olleh\nprint(reverse_string("Python"))   # Expected: nohtyP\n',
            testCases: [
              { input: '', expected: 'olleh\nnohtyP' },
            ],
          },
        ],
      },
      {
        id: 'py-intermediate-1',
        title: 'Python Data Structures',
        language: 'python',
        difficulty: 'intermediate',
        duration: 45,
        description: 'Test your knowledge of lists, dictionaries, and string manipulations.',
        problems: [
          {
            title: 'Find Maximum',
            description: 'Write a function `find_max(lst)` that returns the maximum value in a list WITHOUT using max().',
            starterCode: 'def find_max(lst):\n    # Write your code here\n    pass\n\nprint(find_max([3, 7, 2, 9, 1]))  # Expected: 9\nprint(find_max([-5, -2, -8]))     # Expected: -2\n',
            testCases: [{ input: '', expected: '9\n-2' }],
          },
          {
            title: 'Word Counter',
            description: 'Write a function `word_count(sentence)` that returns a dictionary with word frequencies.',
            starterCode: 'def word_count(sentence):\n    # Write your code here\n    pass\n\nresult = word_count("the cat sat on the mat")\nfor word in sorted(result):\n    print(f"{word}: {result[word]}")\n',
            testCases: [{ input: '', expected: 'cat: 1\nmat: 1\non: 1\nsat: 1\nthe: 2' }],
          },
          {
            title: 'List Comprehension',
            description: 'Create a list of squares of even numbers from 1 to 20 using list comprehension.',
            starterCode: '# Use list comprehension to get squares of even numbers from 1-20\nresult = []  # Replace with list comprehension\n\nprint(result)\n# Expected: [4, 16, 36, 64, 100, 144, 196, 256, 324, 400]\n',
            testCases: [{ input: '', expected: '[4, 16, 36, 64, 100, 144, 196, 256, 324, 400]' }],
          },
        ],
      },
      {
        id: 'py-advanced-1',
        title: 'Python OOP & Algorithms',
        language: 'python',
        difficulty: 'advanced',
        duration: 60,
        description: 'Demonstrate your OOP skills and algorithmic thinking.',
        problems: [
          {
            title: 'Stack Class',
            description: 'Implement a Stack class with push, pop, peek, and is_empty methods.',
            starterCode: 'class Stack:\n    def __init__(self):\n        # Your code here\n        pass\n    \n    def push(self, val):\n        pass\n    \n    def pop(self):\n        pass\n    \n    def peek(self):\n        pass\n    \n    def is_empty(self):\n        pass\n\ns = Stack()\ns.push(10)\ns.push(20)\ns.push(30)\nprint(s.peek())      # Expected: 30\nprint(s.pop())       # Expected: 30\nprint(s.pop())       # Expected: 20\nprint(s.is_empty())  # Expected: False\n',
            testCases: [{ input: '', expected: '30\n30\n20\nFalse' }],
          },
          {
            title: 'Binary Search',
            description: 'Implement binary search algorithm that returns the index of target, or -1 if not found.',
            starterCode: 'def binary_search(arr, target):\n    # Write your code here\n    pass\n\nprint(binary_search([1,3,5,7,9,11,13], 7))   # Expected: 3\nprint(binary_search([1,3,5,7,9,11,13], 4))   # Expected: -1\nprint(binary_search([2,4,6,8,10], 10))        # Expected: 4\n',
            testCases: [{ input: '', expected: '3\n-1\n4' }],
          },
        ],
      },
    ],
    javascript: [
      {
        id: 'js-basics-1',
        title: 'JavaScript Fundamentals',
        language: 'javascript',
        difficulty: 'beginner',
        duration: 30,
        description: 'Test your foundational JavaScript skills — variables, functions, and control flow.',
        problems: [
          {
            title: 'Greeting Function',
            description: 'Write a function greet(name) that returns "Hello, [name]!"',
            starterCode: 'function greet(name) {\n  // Your code here\n}\n\nconsole.log(greet("World"));   // Expected: Hello, World!\nconsole.log(greet("EduLearn")); // Expected: Hello, EduLearn!\n',
            testCases: [{ input: '', expected: 'Hello, World!\nHello, EduLearn!' }],
          },
          {
            title: 'Array Sum',
            description: 'Write a function sumArray(arr) that returns the total sum of all numbers.',
            starterCode: 'function sumArray(arr) {\n  // Your code here\n}\n\nconsole.log(sumArray([1, 2, 3, 4, 5]));  // Expected: 15\nconsole.log(sumArray([10, -5, 3]));       // Expected: 8\n',
            testCases: [{ input: '', expected: '15\n8' }],
          },
          {
            title: 'Temperature Converter',
            description: 'Write celsiusToFahrenheit(c) that converts Celsius to Fahrenheit. Formula: F = C × 9/5 + 32',
            starterCode: 'function celsiusToFahrenheit(c) {\n  // Your code here\n}\n\nconsole.log(celsiusToFahrenheit(0));    // Expected: 32\nconsole.log(celsiusToFahrenheit(100));  // Expected: 212\nconsole.log(celsiusToFahrenheit(37));   // Expected: 98.6\n',
            testCases: [{ input: '', expected: '32\n212\n98.6' }],
          },
        ],
      },
      {
        id: 'js-intermediate-1',
        title: 'JS Arrays & Objects',
        language: 'javascript',
        difficulty: 'intermediate',
        duration: 45,
        description: 'Work with arrays, objects, and higher-order functions in JavaScript.',
        problems: [
          {
            title: 'Unique Values',
            description: 'Write a function unique(arr) that returns an array with only unique values (preserve order).',
            starterCode: 'function unique(arr) {\n  // Your code here\n}\n\nconsole.log(unique([1,2,2,3,4,4,5]));      // Expected: [1,2,3,4,5]\nconsole.log(unique(["a","b","a","c"]));  // Expected: ["a","b","c"]\n',
            testCases: [{ input: '', expected: '[ 1, 2, 3, 4, 5 ]\n[ \'a\', \'b\', \'c\' ]' }],
          },
          {
            title: 'Object Merge',
            description: 'Write deepMerge(obj1, obj2) that deeply merges two objects.',
            starterCode: 'function deepMerge(obj1, obj2) {\n  // Your code here\n}\n\nconst a = { x: 1, y: { z: 2 } };\nconst b = { y: { w: 3 }, v: 4 };\nconsole.log(JSON.stringify(deepMerge(a, b)));\n// Expected: {"x":1,"y":{"z":2,"w":3},"v":4}\n',
            testCases: [{ input: '', expected: '{"x":1,"y":{"z":2,"w":3},"v":4}' }],
          },
        ],
      },
    ],
    java: [
      {
        id: 'java-basics-1',
        title: 'Java Basics Test',
        language: 'java',
        difficulty: 'beginner',
        duration: 30,
        description: 'Test Java fundamentals — data types, loops, and basic methods.',
        problems: [
          {
            title: 'Factorial Calculator',
            description: 'Write a method factorial(n) that returns n!',
            starterCode: 'public class Main {\n  public static long factorial(int n) {\n    // Your code here\n    return 0;\n  }\n  \n  public static void main(String[] args) {\n    System.out.println(factorial(5));   // Expected: 120\n    System.out.println(factorial(0));   // Expected: 1\n    System.out.println(factorial(10));  // Expected: 3628800\n  }\n}\n',
            testCases: [{ input: '', expected: '120\n1\n3628800' }],
          },
          {
            title: 'Palindrome Check',
            description: 'Write isPalindrome(s) that returns true if s is a palindrome (case-insensitive).',
            starterCode: 'public class Main {\n  public static boolean isPalindrome(String s) {\n    // Your code here\n    return false;\n  }\n  \n  public static void main(String[] args) {\n    System.out.println(isPalindrome("racecar"));  // true\n    System.out.println(isPalindrome("Hello"));    // false\n    System.out.println(isPalindrome("Madam"));    // true\n  }\n}\n',
            testCases: [{ input: '', expected: 'true\nfalse\ntrue' }],
          },
        ],
      },
    ],
    cpp: [
      {
        id: 'cpp-basics-1',
        title: 'C++ Basics Test',
        language: 'cpp',
        difficulty: 'beginner',
        duration: 30,
        description: 'Test your C++ fundamentals — input/output, loops, and basic functions.',
        problems: [
          {
            title: 'Sum of Digits',
            description: 'Write a function sumOfDigits(n) that returns the sum of all digits of n.',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint sumOfDigits(int n) {\n  // Your code here\n  return 0;\n}\n\nint main() {\n  cout << sumOfDigits(123) << endl;    // Expected: 6\n  cout << sumOfDigits(9999) << endl;   // Expected: 36\n  cout << sumOfDigits(0) << endl;      // Expected: 0\n  return 0;\n}\n',
            testCases: [{ input: '', expected: '6\n36\n0' }],
          },
        ],
      },
    ],
    html: [],
    sql: [],
  };

  let allTests = [];
  let currentTest = null;
  let currentProblemIndex = 0;
  let testStartTime = null;
  let testTimer = null;
  let testResults = [];
  let viewMode = 'available'; // 'available' | 'taking' | 'results' | 'create'

  // ── Init ───────────────────────────────────────────────────
  function init() {
    loadTests();
    renderDashboard();
  }

  // ── Load & Save ────────────────────────────────────────────
  function loadTests() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const customTests = saved ? JSON.parse(saved) : [];
    // Merge preset + custom tests
    allTests = [];
    Object.values(PRESET_TESTS).forEach(langTests => {
      allTests.push(...langTests);
    });
    allTests.push(...customTests);
  }

  function saveCustomTests() {
    // Only save user-created tests (not presets)
    const presetIds = [];
    Object.values(PRESET_TESTS).forEach(langTests => { langTests.forEach(t => presetIds.push(t.id)); });
    const customOnly = allTests.filter(t => !presetIds.includes(t.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
  }

  // ── Dashboard Render ───────────────────────────────────────
  function renderDashboard() {
    const content = document.getElementById('tests-dashboard-content');
    if (!content) return;

    if (viewMode === 'taking') { renderTestTaking(content); return; }
    if (viewMode === 'results') { renderTestResults(content); return; }
    if (viewMode === 'create') { renderTestCreator(content); return; }

    // Default: show available tests
    const selectedLang = Storage.getProgLang() || 'python';
    const langMeta = {
      python: { icon: '🐍', name: 'Python' },
      javascript: { icon: '🌐', name: 'JavaScript' },
      java: { icon: '☕', name: 'Java' },
      cpp: { icon: '⚙️', name: 'C++' },
      html: { icon: '🎨', name: 'HTML & CSS' },
      sql: { icon: '🗄️', name: 'SQL' },
    };

    // Get completed tests
    const completed = JSON.parse(localStorage.getItem('edulearn_test_results') || '[]');
    const completedIds = completed.map(r => r.testId);

    // Stats
    const totalAvailable = allTests.filter(t => t.problems && t.problems.length > 0).length;
    const totalCompleted = completed.length;
    const avgScore = totalCompleted > 0
      ? Math.round(completed.reduce((a, r) => a + r.score, 0) / totalCompleted)
      : 0;

    content.innerHTML = `
      <div class="td-stats-row">
        <div class="td-stat glass-card">
          <div class="td-stat-icon" style="background: rgba(108,99,255,0.15); color: #6C63FF;">📋</div>
          <div class="td-stat-info">
            <span class="td-stat-value">${totalAvailable}</span>
            <span class="td-stat-label">Available Tests</span>
          </div>
        </div>
        <div class="td-stat glass-card">
          <div class="td-stat-icon" style="background: rgba(0,212,170,0.15); color: #00D4AA;">✅</div>
          <div class="td-stat-info">
            <span class="td-stat-value">${totalCompleted}</span>
            <span class="td-stat-label">Completed</span>
          </div>
        </div>
        <div class="td-stat glass-card">
          <div class="td-stat-icon" style="background: rgba(255,179,71,0.15); color: #FFB347;">⭐</div>
          <div class="td-stat-info">
            <span class="td-stat-value">${avgScore}%</span>
            <span class="td-stat-label">Avg Score</span>
          </div>
        </div>
        <div class="td-stat glass-card td-stat-action" onclick="TestsDashboard.showCreateTest()">
          <div class="td-stat-icon" style="background: rgba(132,94,194,0.15); color: #845EC2;">➕</div>
          <div class="td-stat-info">
            <span class="td-stat-value" style="font-size:16px;">Create</span>
            <span class="td-stat-label">New Test</span>
          </div>
        </div>
      </div>

      <div class="td-lang-filter">
        <button class="td-filter-btn ${!document.getElementById('td-filter-active')?.dataset.lang ? 'active' : ''}" onclick="TestsDashboard.filterTests('all')" data-filter="all">All</button>
        ${Object.entries(langMeta).map(([key, meta]) => 
          `<button class="td-filter-btn" onclick="TestsDashboard.filterTests('${key}')" data-filter="${key}">${meta.icon} ${meta.name}</button>`
        ).join('')}
      </div>

      <div class="td-tests-grid" id="td-tests-grid">
        ${renderTestCards(allTests, completedIds)}
      </div>

      ${totalCompleted > 0 ? `
        <div class="td-history-section glass-card">
          <h3>📊 Recent Test Results</h3>
          <div class="td-history-list">
            ${completed.slice(0, 5).map(r => {
              const test = allTests.find(t => t.id === r.testId);
              const lm = langMeta[r.language] || { icon: '💻', name: r.language };
              return `<div class="td-history-item">
                <div class="td-hist-info">
                  <span class="td-hist-lang">${lm.icon}</span>
                  <div>
                    <div class="td-hist-title">${test?.title || r.testId}</div>
                    <div class="td-hist-meta">${new Date(r.timestamp).toLocaleDateString()} • ${r.duration}</div>
                  </div>
                </div>
                <div class="td-hist-score ${r.score >= 70 ? 'good' : r.score >= 40 ? 'ok' : 'bad'}">${r.score}%</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      ` : ''}
    `;

    // Auto-activate the 'all' filter
    content.querySelector('.td-filter-btn[data-filter="all"]')?.classList.add('active');
  }

  function renderTestCards(tests, completedIds) {
    const validTests = tests.filter(t => t.problems && t.problems.length > 0);
    if (!validTests.length) {
      return '<div class="empty-state"><p>No tests available for this language yet.</p></div>';
    }

    const langMeta = {
      python: { icon: '🐍', name: 'Python' },
      javascript: { icon: '🌐', name: 'JavaScript' },
      java: { icon: '☕', name: 'Java' },
      cpp: { icon: '⚙️', name: 'C++' },
      html: { icon: '🎨', name: 'HTML' },
      sql: { icon: '🗄️', name: 'SQL' },
    };
    const diffColors = { beginner: '#00D4AA', intermediate: '#FFB347', advanced: '#FF6B6B' };

    return validTests.map(test => {
      const lm = langMeta[test.language] || { icon: '💻', name: test.language };
      const isCompleted = completedIds.includes(test.id);
      const diffColor = diffColors[test.difficulty] || '#6C63FF';
      return `
        <div class="td-test-card glass-card ${isCompleted ? 'completed' : ''}">
          <div class="td-test-header">
            <span class="td-test-lang">${lm.icon} ${lm.name}</span>
            <span class="td-test-diff" style="color:${diffColor}">${capitalize(test.difficulty)}</span>
          </div>
          <h3 class="td-test-title">${test.title}</h3>
          <p class="td-test-desc">${test.description}</p>
          <div class="td-test-meta">
            <span>📝 ${test.problems.length} problem${test.problems.length > 1 ? 's' : ''}</span>
            <span>⏱️ ${test.duration} min</span>
          </div>
          <button class="btn btn-primary btn-full td-start-btn" onclick="TestsDashboard.startTest('${test.id}')">
            ${isCompleted ? '🔄 Retake Test' : '▶️ Start Test'}
          </button>
        </div>
      `;
    }).join('');
  }

  // ── Filter Tests ───────────────────────────────────────────
  function filterTests(lang) {
    const btns = document.querySelectorAll('.td-filter-btn');
    btns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === lang));

    const grid = document.getElementById('td-tests-grid');
    if (!grid) return;

    const completed = JSON.parse(localStorage.getItem('edulearn_test_results') || '[]');
    const completedIds = completed.map(r => r.testId);

    const filtered = lang === 'all' ? allTests : allTests.filter(t => t.language === lang);
    grid.innerHTML = renderTestCards(filtered, completedIds);
  }

  // ── Start Test ─────────────────────────────────────────────
  function startTest(testId) {
    const test = allTests.find(t => t.id === testId);
    if (!test) { App.showToast('Test not found.', 'error'); return; }

    currentTest = { ...test };
    currentProblemIndex = 0;
    testStartTime = Date.now();
    testResults = test.problems.map(() => ({ code: '', status: 'pending', output: '' }));
    viewMode = 'taking';

    // Fill starter code
    testResults.forEach((r, i) => { r.code = test.problems[i].starterCode; });

    renderDashboard();
    startTimer(test.duration);
  }

  // ── Render Test Taking ─────────────────────────────────────
  function renderTestTaking(content) {
    if (!currentTest) return;
    const problem = currentTest.problems[currentProblemIndex];
    const langMeta = { python: '🐍', javascript: '🌐', java: '☕', cpp: '⚙️' };

    content.innerHTML = `
      <div class="td-taking-header glass-card">
        <div class="td-taking-info">
          <h2>${langMeta[currentTest.language] || '💻'} ${currentTest.title}</h2>
          <div class="td-taking-meta">
            <span>Problem ${currentProblemIndex + 1} of ${currentTest.problems.length}</span>
            <span class="td-timer" id="td-timer">⏱️ 00:00</span>
          </div>
        </div>
        <div class="td-taking-progress">
          <div class="td-taking-progress-fill" style="width: ${((currentProblemIndex + 1) / currentTest.problems.length) * 100}%"></div>
        </div>
      </div>

      <div class="td-problem-tabs">
        ${currentTest.problems.map((p, i) => `
          <button class="td-prob-tab ${i === currentProblemIndex ? 'active' : ''} ${testResults[i]?.status === 'passed' ? 'passed' : testResults[i]?.status === 'failed' ? 'failed' : ''}"
                  onclick="TestsDashboard.goToProblem(${i})">
            ${testResults[i]?.status === 'passed' ? '✅' : testResults[i]?.status === 'failed' ? '❌' : (i + 1)}
          </button>
        `).join('')}
      </div>

      <div class="td-problem-layout">
        <div class="td-problem-desc glass-card">
          <h3>📋 ${problem.title}</h3>
          <p>${problem.description}</p>
          ${problem.testCases?.[0]?.expected ? `
            <div class="td-expected-output">
              <h4>Expected Output:</h4>
              <pre>${escapeHtml(problem.testCases[0].expected)}</pre>
            </div>
          ` : ''}
        </div>
        <div class="td-problem-editor glass-card">
          <div class="td-editor-header">
            <span>✏️ Your Solution</span>
            <div class="td-editor-actions">
              <button class="btn btn-sm btn-outline" onclick="TestsDashboard.resetProblem()">🔄 Reset</button>
              <button class="btn btn-sm btn-success" onclick="TestsDashboard.runProblem()" id="td-run-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run & Test
              </button>
            </div>
          </div>
          <textarea class="td-code-editor" id="td-code-editor" spellcheck="false"
                    oninput="TestsDashboard.onCodeChange()">${escapeHtml(testResults[currentProblemIndex]?.code || problem.starterCode)}</textarea>
          <div class="td-test-output" id="td-test-output">
            <div class="td-output-placeholder">Click "Run & Test" to execute your code</div>
          </div>
        </div>
      </div>

      <div class="td-nav-buttons">
        <button class="btn btn-outline" onclick="TestsDashboard.cancelTest()" style="color:var(--color-danger)">✖ Cancel Test</button>
        <div>
          ${currentProblemIndex > 0 ? '<button class="btn btn-outline" onclick="TestsDashboard.prevProblem()">← Previous</button>' : ''}
          ${currentProblemIndex < currentTest.problems.length - 1
            ? '<button class="btn btn-primary" onclick="TestsDashboard.nextProblem()">Next →</button>'
            : '<button class="btn btn-success" onclick="TestsDashboard.submitTest()">📤 Submit Test</button>'}
        </div>
      </div>
    `;
  }

  // ── Timer ──────────────────────────────────────────────────
  function startTimer(durationMin) {
    if (testTimer) clearInterval(testTimer);
    const endTime = Date.now() + durationMin * 60 * 1000;
    testTimer = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      const el = document.getElementById('td-timer');
      if (el) {
        el.textContent = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (remaining <= 60000) el.style.color = 'var(--color-danger)';
      }
      if (remaining <= 0) {
        clearInterval(testTimer);
        App.showToast('⏰ Time\'s up! Submitting your test.', 'warning');
        submitTest();
      }
    }, 1000);
  }

  // ── Problem Navigation ─────────────────────────────────────
  function goToProblem(index) {
    saveCurrent();
    currentProblemIndex = index;
    const content = document.getElementById('tests-dashboard-content');
    renderTestTaking(content);
  }

  function nextProblem() {
    saveCurrent();
    if (currentProblemIndex < currentTest.problems.length - 1) {
      currentProblemIndex++;
      const content = document.getElementById('tests-dashboard-content');
      renderTestTaking(content);
    }
  }

  function prevProblem() {
    saveCurrent();
    if (currentProblemIndex > 0) {
      currentProblemIndex--;
      const content = document.getElementById('tests-dashboard-content');
      renderTestTaking(content);
    }
  }

  function saveCurrent() {
    const editor = document.getElementById('td-code-editor');
    if (editor && testResults[currentProblemIndex]) {
      testResults[currentProblemIndex].code = editor.value;
    }
  }

  function onCodeChange() {
    saveCurrent();
  }

  function resetProblem() {
    if (!currentTest) return;
    const problem = currentTest.problems[currentProblemIndex];
    const editor = document.getElementById('td-code-editor');
    if (editor) editor.value = problem.starterCode;
    testResults[currentProblemIndex].code = problem.starterCode;
    testResults[currentProblemIndex].status = 'pending';
  }

  // ── Run & Test Problem ─────────────────────────────────────
  async function runProblem() {
    saveCurrent();
    const code = testResults[currentProblemIndex]?.code || '';
    const problem = currentTest.problems[currentProblemIndex];
    const outputEl = document.getElementById('td-test-output');
    const runBtn = document.getElementById('td-run-btn');

    if (!code.trim()) {
      if (outputEl) outputEl.innerHTML = '<div class="td-output-error">⚠️ Write some code first!</div>';
      return;
    }

    if (runBtn) { runBtn.disabled = true; runBtn.innerHTML = '<div class="spinner-sm"></div> Running...'; }
    if (outputEl) outputEl.innerHTML = '<div class="td-output-info">⏳ Executing your code...</div>';

    const testCase = problem.testCases?.[0] || {};
    const expected = (testCase.expected || '').trim();

    try {
      let actualOutput = '';

      if (currentTest.language === 'javascript') {
        // Client-side JS execution
        actualOutput = await executeJSInSandbox(code);
      } else {
        // AI-powered execution for Python/Java/C++
        const result = await executeTestWithAI(code, currentTest.language, testCase.input || '');
        if (result.error) {
          testResults[currentProblemIndex].status = 'failed';
          testResults[currentProblemIndex].output = result.error;
          if (outputEl) outputEl.innerHTML = `<div class="td-output-error">❌ ${escapeHtml(result.error)}</div>`;
          refreshTabs();
          if (runBtn) { runBtn.disabled = false; runBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run & Test'; }
          return;
        }
        actualOutput = (result.output || '').trim();
      }

      // Compare output
      const passed = normalizeOutput(actualOutput) === normalizeOutput(expected);
      testResults[currentProblemIndex].status = passed ? 'passed' : 'failed';
      testResults[currentProblemIndex].output = actualOutput;

      if (outputEl) {
        outputEl.innerHTML = `
          <div class="td-output-${passed ? 'success' : 'error'}">
            ${passed ? '✅ All test cases passed!' : '❌ Output doesn\'t match expected.'}
          </div>
          <div class="td-output-comparison">
            <div class="td-output-col">
              <h5>Your Output:</h5>
              <pre>${escapeHtml(actualOutput || '(no output)')}</pre>
            </div>
            <div class="td-output-col">
              <h5>Expected:</h5>
              <pre>${escapeHtml(expected || '(no expected output)')}</pre>
            </div>
          </div>
        `;
      }
      refreshTabs();
    } catch (err) {
      testResults[currentProblemIndex].status = 'failed';
      if (outputEl) outputEl.innerHTML = `<div class="td-output-error">❌ Error: ${err.message}</div>`;
    } finally {
      if (runBtn) { runBtn.disabled = false; runBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run & Test'; }
    }
  }

  // ── Client-side JS execution in sandbox ────────────────────
  function executeJSInSandbox(code) {
    return new Promise((resolve, reject) => {
      const sandbox = document.createElement('iframe');
      sandbox.style.display = 'none';
      sandbox.sandbox = 'allow-scripts';
      document.body.appendChild(sandbox);

      const wrappedCode = `
        <script>
          const __logs = [];
          const __errors = [];
          console.log = (...args) => __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          console.error = (...args) => __errors.push(args.map(a => String(a)).join(' '));
          console.warn = (...args) => __logs.push(args.map(a => String(a)).join(' '));
          console.info = (...args) => __logs.push(args.map(a => String(a)).join(' '));
          try {
            ${code}
          } catch (e) {
            __errors.push(e.toString());
          }
          parent.postMessage({ type: 'test-result', logs: __logs, errors: __errors }, '*');
        <\/script>
      `;

      const handler = (e) => {
        if (e.data?.type === 'test-result') {
          window.removeEventListener('message', handler);
          sandbox.remove();
          const output = e.data.logs.join('\n');
          if (e.data.errors.length) {
            resolve(output + (output ? '\n' : '') + e.data.errors.join('\n'));
          } else {
            resolve(output);
          }
        }
      };

      window.addEventListener('message', handler);
      sandbox.srcdoc = wrappedCode;

      setTimeout(() => {
        window.removeEventListener('message', handler);
        sandbox.remove();
        reject(new Error('Execution timed out (5s)'));
      }, 5000);
    });
  }

  // ── AI-powered execution for non-JS languages ─────────────
  async function executeTestWithAI(code, language, stdin) {
    const apiKey = Storage.getApiKey();
    const langNames = { python: 'Python', java: 'Java', cpp: 'C++', sql: 'SQL' };
    const langName = langNames[language] || language;

    if (!apiKey) {
      return {
        output: '',
        error: `🔑 No API key configured.\n\nTo run ${langName} tests, add your Gemini API key in Settings.\n\n💡 JavaScript tests run directly in the browser — no API key needed!`,
      };
    }

    const prompt = `You are a code execution engine. Execute the following ${langName} code mentally and return ONLY the exact stdout output the program would produce. Do not include any explanation, markdown formatting, or code blocks — return ONLY the raw console/terminal output.

${stdin ? `The program receives this stdin input:\n${stdin}\n\n` : ''}If the code has a syntax error or runtime error, return the error message prefixed with "ERROR: ".
If the code produces no output, return exactly: (no output)

Code:
\`\`\`
${code}
\`\`\`

Return ONLY the output, nothing else:`;

    try {
      const text = await Gemini.generate(prompt, 'You are a precise code execution simulator. Return ONLY the exact output a program would produce. Never wrap in markdown. Never explain.');
      const cleaned = text.trim()
        .replace(/^```[\s\S]*?\n/, '')
        .replace(/\n```$/, '')
        .trim();

      if (cleaned.startsWith('ERROR:') || cleaned.startsWith('error:')) {
        return { output: '', error: cleaned };
      }
      if (cleaned === '(no output)') {
        return { output: '', error: '' };
      }
      return { output: cleaned, error: '' };
    } catch (err) {
      if (err.message === 'NO_KEY') {
        return { output: '', error: `🔑 Add your Gemini API key in Settings to run ${langName} code.` };
      }
      return { output: '', error: `AI execution error: ${err.message}` };
    }
  }

  function refreshTabs() {
    document.querySelectorAll('.td-prob-tab').forEach((tab, i) => {
      tab.classList.remove('passed', 'failed');
      if (testResults[i]?.status === 'passed') tab.classList.add('passed');
      if (testResults[i]?.status === 'failed') tab.classList.add('failed');
      if (testResults[i]?.status === 'passed') tab.textContent = '✅';
      else if (testResults[i]?.status === 'failed') tab.textContent = '❌';
    });
  }

  // ── Submit Test ────────────────────────────────────────────
  function submitTest() {
    if (testTimer) clearInterval(testTimer);
    saveCurrent();

    const passed = testResults.filter(r => r.status === 'passed').length;
    const total = testResults.length;
    const score = Math.round((passed / total) * 100);
    const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const duration = `${mins}m ${secs}s`;

    // Save result
    const results = JSON.parse(localStorage.getItem('edulearn_test_results') || '[]');
    results.unshift({
      testId: currentTest.id,
      title: currentTest.title,
      language: currentTest.language,
      score,
      passed,
      total,
      duration,
      timestamp: Date.now(),
      details: testResults.map((r, i) => ({
        problem: currentTest.problems[i].title,
        status: r.status,
        code: r.code,
      })),
    });
    localStorage.setItem('edulearn_test_results', JSON.stringify(results.slice(0, 50)));

    // Track activity
    Storage.addActivity({
      type: 'quiz',
      title: `Coding Test: ${currentTest.title} — ${score}%`,
      subject: 'programming',
      score,
    });

    viewMode = 'results';
    renderDashboard();

    if (score >= 70) Confetti.fire();
    App.showToast(`Test submitted! Score: ${score}%`, score >= 70 ? 'success' : 'warning');
  }

  // ── Render Results ─────────────────────────────────────────
  function renderTestResults(content) {
    const results = JSON.parse(localStorage.getItem('edulearn_test_results') || '[]');
    const latest = results[0];
    if (!latest || !currentTest) { viewMode = 'available'; renderDashboard(); return; }

    const scoreClass = latest.score >= 70 ? 'good' : latest.score >= 40 ? 'ok' : 'bad';

    content.innerHTML = `
      <div class="td-results-card glass-card">
        <div class="td-results-header">
          <div class="td-results-score-circle ${scoreClass}">
            <span class="td-score-value">${latest.score}%</span>
            <span class="td-score-label">Score</span>
          </div>
          <div class="td-results-info">
            <h2>${latest.score >= 70 ? '🎉 Great Job!' : latest.score >= 40 ? '👍 Good Effort!' : '💪 Keep Practicing!'}</h2>
            <p>${currentTest.title}</p>
            <div class="td-results-stats">
              <span>✅ ${latest.passed} Passed</span>
              <span>❌ ${latest.total - latest.passed} Failed</span>
              <span>⏱️ ${latest.duration}</span>
            </div>
          </div>
        </div>

        <div class="td-results-breakdown">
          <h3>📋 Problem Breakdown</h3>
          ${latest.details.map((d, i) => `
            <div class="td-result-item ${d.status}">
              <span class="td-result-num">${i + 1}</span>
              <span class="td-result-title">${d.problem}</span>
              <span class="td-result-badge">${d.status === 'passed' ? '✅ Passed' : d.status === 'failed' ? '❌ Failed' : '⚪ Not Attempted'}</span>
            </div>
          `).join('')}
        </div>

        <div class="td-results-actions">
          <button class="btn btn-outline" onclick="TestsDashboard.backToDashboard()">← Back to Tests</button>
          <button class="btn btn-primary" onclick="TestsDashboard.startTest('${currentTest.id}')">🔄 Retake Test</button>
        </div>
      </div>
    `;
  }

  // ── Test Creator ───────────────────────────────────────────
  function showCreateTest() {
    viewMode = 'create';
    renderDashboard();
  }

  function renderTestCreator(content) {
    content.innerHTML = `
      <div class="td-creator glass-card">
        <h2>➕ Create a New Coding Test</h2>
        <p class="text-muted">Design a custom test with your own problems and test cases.</p>

        <div class="td-creator-form">
          <div class="form-row">
            <div class="form-group">
              <label for="td-new-title">Test Title</label>
              <input type="text" id="td-new-title" placeholder="e.g., Python String Challenge">
            </div>
            <div class="form-group">
              <label for="td-new-lang">Language</label>
              <select id="td-new-lang">
                <option value="python">🐍 Python</option>
                <option value="javascript">🌐 JavaScript</option>
                <option value="java">☕ Java</option>
                <option value="cpp">⚙️ C++</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="td-new-diff">Difficulty</label>
              <select id="td-new-diff">
                <option value="beginner">🟢 Beginner</option>
                <option value="intermediate">🟡 Intermediate</option>
                <option value="advanced">🔴 Advanced</option>
              </select>
            </div>
            <div class="form-group">
              <label for="td-new-duration">Duration (minutes)</label>
              <input type="number" id="td-new-duration" value="30" min="5" max="120">
            </div>
          </div>
          <div class="form-group">
            <label for="td-new-desc">Description</label>
            <input type="text" id="td-new-desc" placeholder="Brief description of the test">
          </div>

          <div class="td-problems-builder" id="td-problems-builder">
            <h3>📝 Problems</h3>
            <div id="td-problem-list"></div>
            <button class="btn btn-outline" onclick="TestsDashboard.addProblemField()">+ Add Problem</button>
          </div>

          <div class="td-creator-actions">
            <button class="btn btn-outline" onclick="TestsDashboard.backToDashboard()">Cancel</button>
            <button class="btn btn-primary" onclick="TestsDashboard.saveNewTest()">💾 Save Test</button>
          </div>
        </div>
      </div>
    `;

    // Add one problem field by default
    addProblemField();
  }

  let problemFieldCount = 0;

  function addProblemField() {
    const list = document.getElementById('td-problem-list');
    if (!list) return;
    problemFieldCount++;
    const idx = problemFieldCount;

    const div = document.createElement('div');
    div.className = 'td-problem-field glass-card';
    div.innerHTML = `
      <h4>Problem ${idx}</h4>
      <div class="form-group">
        <label>Title</label>
        <input type="text" class="td-pf-title" placeholder="e.g., Sum Function">
      </div>
      <div class="form-group">
        <label>Description</label>
        <input type="text" class="td-pf-desc" placeholder="What should the student build?">
      </div>
      <div class="form-group">
        <label>Starter Code</label>
        <textarea class="td-pf-starter" rows="5" spellcheck="false" placeholder="# Starter code template..."></textarea>
      </div>
      <div class="form-group">
        <label>Expected Output</label>
        <textarea class="td-pf-expected" rows="3" spellcheck="false" placeholder="Expected stdout output..."></textarea>
      </div>
    `;
    list.appendChild(div);
  }

  function saveNewTest() {
    const title = document.getElementById('td-new-title')?.value.trim();
    const lang = document.getElementById('td-new-lang')?.value;
    const diff = document.getElementById('td-new-diff')?.value;
    const duration = parseInt(document.getElementById('td-new-duration')?.value || '30');
    const desc = document.getElementById('td-new-desc')?.value.trim();

    if (!title) { App.showToast('Please enter a test title.', 'warning'); return; }

    // Collect problems
    const problemFields = document.querySelectorAll('.td-problem-field');
    const problems = [];
    problemFields.forEach(field => {
      const pTitle = field.querySelector('.td-pf-title')?.value.trim();
      const pDesc = field.querySelector('.td-pf-desc')?.value.trim();
      const pStarter = field.querySelector('.td-pf-starter')?.value || '';
      const pExpected = field.querySelector('.td-pf-expected')?.value || '';
      if (pTitle) {
        problems.push({
          title: pTitle,
          description: pDesc || pTitle,
          starterCode: pStarter,
          testCases: [{ input: '', expected: pExpected }],
        });
      }
    });

    if (!problems.length) { App.showToast('Add at least one problem.', 'warning'); return; }

    const newTest = {
      id: `custom-${Date.now()}`,
      title,
      language: lang,
      difficulty: diff,
      duration,
      description: desc || title,
      problems,
      custom: true,
    };

    allTests.push(newTest);
    saveCustomTests();
    App.showToast('✅ Test created successfully!', 'success');
    viewMode = 'available';
    problemFieldCount = 0;
    renderDashboard();
  }

  // ── Cancel / Back ──────────────────────────────────────────
  function cancelTest() {
    if (!confirm('Are you sure you want to cancel? Your progress will be lost.')) return;
    if (testTimer) clearInterval(testTimer);
    viewMode = 'available';
    currentTest = null;
    renderDashboard();
  }

  function backToDashboard() {
    viewMode = 'available';
    currentTest = null;
    problemFieldCount = 0;
    renderDashboard();
  }

  // ── Helpers ────────────────────────────────────────────────
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function escapeHtml(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function normalizeOutput(s) { return (s || '').trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, ''); }

  return {
    init,
    filterTests,
    startTest,
    goToProblem,
    nextProblem,
    prevProblem,
    runProblem,
    resetProblem,
    onCodeChange,
    submitTest,
    cancelTest,
    backToDashboard,
    showCreateTest,
    addProblemField,
    saveNewTest,
  };
})();
