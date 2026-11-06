/* ============================================================
   EDULEARN — Code Practice Module
   Interactive code editor for programming courses
   ============================================================ */
const CodePractice = (() => {
  // Language metadata for Piston API
  const LANG_META = {
    python:     { id: 'python',     version: '3.10.0', icon: '🐍', name: 'Python',      defaultExt: 'py',   monacoLang: 'python' },
    javascript: { id: 'javascript', version: '18.15.0', icon: '🌐', name: 'JavaScript', defaultExt: 'js',   monacoLang: 'javascript' },
    java:       { id: 'java',       version: '15.0.2', icon: '☕', name: 'Java',         defaultExt: 'java', monacoLang: 'java' },
    cpp:        { id: 'c++',        version: '10.2.0', icon: '⚙️', name: 'C++',         defaultExt: 'cpp',  monacoLang: 'cpp' },
    html:       { id: 'html',       version: '',       icon: '🎨', name: 'HTML & CSS',  defaultExt: 'html', monacoLang: 'html' },
    sql:        { id: 'sqlite3',    version: '3.36.0', icon: '🗄️', name: 'SQL',         defaultExt: 'sql',  monacoLang: 'sql' },
  };

  // Starter code templates
  const STARTER_CODE = {
    python: `# 🐍 Python Practice
# Write your Python code here and click Run!

def greet(name):
    return f"Hello, {name}! Welcome to EduLearn."

name = input("Enter your name: ")
print(greet(name))

# Try some more Python:
numbers = [1, 2, 3, 4, 5]
squared = [n**2 for n in numbers]
print(f"Squared: {squared}")
`,
    javascript: `// 🌐 JavaScript Practice
// Write your JavaScript code here and click Run!

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}

// Try array methods
const fruits = ['apple', 'banana', 'cherry'];
fruits.forEach((fruit, i) => console.log(\`\${i+1}. \${fruit}\`));
`,
    java: `// ☕ Java Practice
// Write your Java code here and click Run!

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        
        // Loop example
        for (int i = 1; i <= 5; i++) {
            System.out.println(i + " x " + i + " = " + (i * i));
        }
        
        // Array example  
        String[] languages = {"Python", "Java", "C++", "JavaScript"};
        for (String lang : languages) {
            System.out.println("I can code in " + lang);
        }
    }
}
`,
    cpp: `// ⚙️ C++ Practice
// Write your C++ code here and click Run!

#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    
    // Vector example
    vector<int> nums = {10, 20, 30, 40, 50};
    int sum = 0;
    for (int n : nums) {
        sum += n;
    }
    cout << "Sum: " << sum << endl;
    
    // String example
    string name;
    cout << "Enter your name: ";
    cin >> name;
    cout << "Welcome, " << name << "!" << endl;
    
    return 0;
}
`,
    html: `<!-- 🎨 HTML & CSS Practice -->
<!-- Write your HTML/CSS here and see the preview! -->

<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #333; margin-bottom: 0.5rem; }
    p { color: #666; line-height: 1.6; }
    .btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 1rem;
    }
    .btn:hover { transform: scale(1.05); transition: 0.2s; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎨 Hello, World!</h1>
    <p>This is your HTML & CSS playground. Edit the code and click Run to see your changes live!</p>
    <button class="btn" onclick="alert('You clicked me!')">Click Me</button>
  </div>
</body>
</html>
`,
    sql: `-- 🗄️ SQL Practice
-- Write your SQL queries here and click Run!

-- Create a sample table
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    grade INTEGER,
    score REAL
);

-- Insert some data
INSERT INTO students VALUES (1, 'Alice', 10, 92.5);
INSERT INTO students VALUES (2, 'Bob', 11, 85.0);
INSERT INTO students VALUES (3, 'Charlie', 10, 78.3);
INSERT INTO students VALUES (4, 'Diana', 12, 95.8);
INSERT INTO students VALUES (5, 'Eve', 11, 88.2);

-- Query the data
SELECT * FROM students ORDER BY score DESC;

-- Try aggregate queries
SELECT grade, AVG(score) as avg_score, COUNT(*) as count
FROM students
GROUP BY grade;
`,
  };

  // Challenge problems per language
  const CHALLENGES = {
    python: [
      { title: '🔢 FizzBuzz', desc: 'Print 1-100. For multiples of 3 print "Fizz", 5 print "Buzz", both print "FizzBuzz".', starter: '# FizzBuzz Challenge\nfor i in range(1, 101):\n    # Your code here\n    pass\n' },
      { title: '🔄 Palindrome Check', desc: 'Write a function to check if a string is a palindrome.', starter: 'def is_palindrome(s):\n    # Your code here\n    pass\n\n# Test\nprint(is_palindrome("racecar"))  # True\nprint(is_palindrome("hello"))    # False\n' },
      { title: '📊 List Operations', desc: 'Find the second largest number in a list without using sort.', starter: 'def second_largest(nums):\n    # Your code here\n    pass\n\nprint(second_largest([3, 1, 4, 1, 5, 9, 2, 6]))  # Expected: 6\n' },
      { title: '⭐ Star Pattern', desc: 'Print a right-angle triangle star pattern with n rows.', starter: 'def star_pattern(n):\n    # Your code here\n    pass\n\nstar_pattern(5)\n' },
    ],
    javascript: [
      { title: '🔢 FizzBuzz', desc: 'Print 1-100. For multiples of 3 print "Fizz", 5 print "Buzz", both print "FizzBuzz".', starter: '// FizzBuzz Challenge\nfor (let i = 1; i <= 100; i++) {\n  // Your code here\n}\n' },
      { title: '🔄 Array Flatten', desc: 'Write a function to flatten a nested array.', starter: 'function flatten(arr) {\n  // Your code here\n}\n\nconsole.log(flatten([1, [2, [3, [4]], 5]]));  // [1,2,3,4,5]\n' },
      { title: '📊 Object Counter', desc: 'Count the frequency of each character in a string.', starter: 'function charCount(str) {\n  // Your code here\n}\n\nconsole.log(charCount("hello world"));\n' },
      { title: '🔗 Linked List', desc: 'Implement a simple singly linked list with add and print methods.', starter: 'class Node {\n  constructor(val) {\n    this.val = val;\n    this.next = null;\n  }\n}\n\nclass LinkedList {\n  constructor() { this.head = null; }\n  // add(val) and print() methods here\n}\n' },
    ],
    java: [
      { title: '🔢 FizzBuzz', desc: 'Print 1-100. For multiples of 3 print "Fizz", 5 print "Buzz", both print "FizzBuzz".', starter: 'public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 100; i++) {\n      // Your code here\n    }\n  }\n}\n' },
      { title: '🔄 Reverse String', desc: 'Reverse a string without using StringBuilder.reverse().', starter: 'public class Main {\n  public static String reverse(String s) {\n    // Your code here\n    return "";\n  }\n  public static void main(String[] args) {\n    System.out.println(reverse("Hello World"));\n  }\n}\n' },
      { title: '📊 Prime Numbers', desc: 'Print all prime numbers up to N.', starter: 'public class Main {\n  public static boolean isPrime(int n) {\n    // Your code here\n    return false;\n  }\n  public static void main(String[] args) {\n    for (int i = 2; i <= 50; i++) {\n      if (isPrime(i)) System.out.print(i + " ");\n    }\n  }\n}\n' },
    ],
    cpp: [
      { title: '🔢 FizzBuzz', desc: 'Print 1-100. For multiples of 3 print "Fizz", 5 print "Buzz", both print "FizzBuzz".', starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n  for (int i = 1; i <= 100; i++) {\n    // Your code here\n  }\n  return 0;\n}\n' },
      { title: '🔄 Factorial', desc: 'Calculate factorial using both recursion and iteration.', starter: '#include <iostream>\nusing namespace std;\n\nlong long factorialRecursive(int n) {\n  // Your code here\n}\n\nlong long factorialIterative(int n) {\n  // Your code here\n}\n\nint main() {\n  cout << "5! = " << factorialRecursive(5) << endl;\n  cout << "10! = " << factorialIterative(10) << endl;\n  return 0;\n}\n' },
    ],
    html: [
      { title: '🎨 Profile Card', desc: 'Create a beautiful profile card with an avatar, name, bio, and social links.', starter: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    /* Style your profile card here */\n  </style>\n</head>\n<body>\n  <!-- Build your profile card here -->\n</body>\n</html>\n' },
      { title: '📱 Responsive Nav', desc: 'Build a responsive navigation bar with a hamburger menu.', starter: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    /* Style your navbar here */\n  </style>\n</head>\n<body>\n  <!-- Build your navbar here -->\n</body>\n</html>\n' },
    ],
    sql: [
      { title: '📊 Employee Query', desc: 'Create an employee table and query employees earning above average.', starter: '-- Create and populate the employees table\nCREATE TABLE employees (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  department TEXT,\n  salary REAL\n);\n\n-- Insert data and write your queries below\n' },
    ],
  };

  let currentLang = 'python';
  let executionHistory = [];
  let isRunning = false;

  // ── Initialize ─────────────────────────────────────────────
  function init() {
    const lang = Storage.getProgLang() || 'python';
    switchLanguage(lang);
    renderChallenges();
    renderHistory();
  }

  // ── Switch Language ────────────────────────────────────────
  function switchLanguage(lang) {
    if (!LANG_META[lang]) lang = 'python';
    currentLang = lang;

    // Update active tab
    document.querySelectorAll('.cp-lang-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.lang === lang);
    });

    // Update editor label
    const labelEl = document.getElementById('cp-lang-label');
    if (labelEl) {
      const meta = LANG_META[lang];
      labelEl.innerHTML = `${meta.icon} ${meta.name}`;
    }

    // Load saved code or starter
    const savedCode = localStorage.getItem(`edulearn_code_${lang}`);
    const editor = document.getElementById('cp-editor');
    if (editor) {
      editor.value = savedCode || STARTER_CODE[lang] || '// Write your code here';
    }

    // Clear output
    clearOutput();
    renderChallenges();

    // Show/hide HTML preview panel
    const previewPanel = document.getElementById('cp-preview-panel');
    const outputPanel = document.getElementById('cp-output-panel');
    if (previewPanel) previewPanel.style.display = lang === 'html' ? 'block' : 'none';
    if (outputPanel) outputPanel.style.display = 'flex';
  }

  // ── Save code on edit ──────────────────────────────────────
  function onEditorInput() {
    const editor = document.getElementById('cp-editor');
    if (editor) {
      localStorage.setItem(`edulearn_code_${currentLang}`, editor.value);
    }
  }

  // ── Run Code ───────────────────────────────────────────────
  async function runCode() {
    if (isRunning) return;
    const editor = document.getElementById('cp-editor');
    const code = editor?.value || '';
    if (!code.trim()) { appendOutput('⚠️ Editor is empty. Write some code first!', 'error'); return; }

    // HTML special case — render in preview iframe
    if (currentLang === 'html') {
      runHTML(code);
      return;
    }

    // JavaScript — run client-side in sandboxed iframe
    if (currentLang === 'javascript') {
      runJavaScript(code);
      return;
    }

    // Other languages — use Gemini AI to analyze & simulate
    isRunning = true;
    updateRunButton(true);
    clearOutput();
    appendOutput('⏳ Running your code via AI engine...', 'info');

    const stdinEl = document.getElementById('cp-stdin');
    const stdin = stdinEl?.value || '';

    try {
      const result = await executeWithAI(code, stdin);
      clearOutput();
      if (result.error) {
        appendOutput(result.error, 'error');
      } else if (result.output) {
        appendOutput(result.output, 'success');
      } else {
        appendOutput('✅ Program executed successfully with no output.', 'info');
      }
      addToHistory(code, { run: { stdout: result.output || '', stderr: result.error || '', code: result.error ? 1 : 0 } });
    } catch (err) {
      clearOutput();
      appendOutput(`❌ Error: ${err.message}`, 'error');
    } finally {
      isRunning = false;
      updateRunButton(false);
    }
  }

  // ── JavaScript — client-side sandboxed execution ───────────
  function runJavaScript(code) {
    isRunning = true;
    updateRunButton(true);
    clearOutput();

    const stdinEl = document.getElementById('cp-stdin');
    const stdinVal = stdinEl?.value || '';

    try {
      // Create a sandboxed iframe for safe execution
      const sandbox = document.createElement('iframe');
      sandbox.style.display = 'none';
      sandbox.sandbox = 'allow-scripts';
      document.body.appendChild(sandbox);

      const logs = [];
      const errors = [];

      // Inject code into the iframe
      const wrappedCode = `
        <script>
          const __logs = [];
          const __errors = [];
          const __stdinLines = ${JSON.stringify(stdinVal.split('\n'))};
          let __stdinIdx = 0;

          // Override console methods
          const origConsole = { log: console.log, error: console.error, warn: console.warn, info: console.info };
          console.log = (...args) => __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          console.error = (...args) => __errors.push(args.map(a => String(a)).join(' '));
          console.warn = (...args) => __logs.push('⚠️ ' + args.map(a => String(a)).join(' '));
          console.info = (...args) => __logs.push('ℹ️ ' + args.map(a => String(a)).join(' '));

          // Simple prompt/readline simulation
          window.prompt = (msg) => { const v = __stdinLines[__stdinIdx] || ''; __stdinIdx++; return v; };

          try {
            ${code}
          } catch (e) {
            __errors.push(e.toString());
          }

          parent.postMessage({ type: 'code-result', logs: __logs, errors: __errors }, '*');
        <\/script>
      `;

      // Listen for result
      const handler = (e) => {
        if (e.data?.type === 'code-result') {
          window.removeEventListener('message', handler);
          sandbox.remove();
          clearOutput();

          const { logs: resultLogs, errors: resultErrors } = e.data;
          if (resultLogs.length) {
            appendOutput(resultLogs.join('\n'), 'success');
          }
          if (resultErrors.length) {
            appendOutput(resultErrors.join('\n'), 'error');
          }
          if (!resultLogs.length && !resultErrors.length) {
            appendOutput('✅ Program executed successfully with no output.', 'info');
          }

          addToHistory(code, {
            run: {
              stdout: resultLogs.join('\n'),
              stderr: resultErrors.join('\n'),
              code: resultErrors.length ? 1 : 0,
            }
          });

          isRunning = false;
          updateRunButton(false);
        }
      };

      window.addEventListener('message', handler);
      sandbox.srcdoc = wrappedCode;

      // Timeout safety
      setTimeout(() => {
        if (isRunning) {
          window.removeEventListener('message', handler);
          sandbox.remove();
          clearOutput();
          appendOutput('⏱️ Execution timed out (5s limit).', 'warning');
          isRunning = false;
          updateRunButton(false);
        }
      }, 5000);
    } catch (err) {
      clearOutput();
      appendOutput(`❌ Error: ${err.message}`, 'error');
      isRunning = false;
      updateRunButton(false);
    }
  }

  // ── AI-Powered execution for Python/Java/C++/SQL ───────────
  async function executeWithAI(code, stdin = '') {
    const apiKey = Storage.getApiKey();
    if (!apiKey) {
      return {
        output: '',
        error: '🔑 No API key configured.\n\nTo run Python, Java, C++, and SQL code, add your Gemini API key in Settings.\n\n💡 JavaScript and HTML run directly in the browser — try switching to those languages!\n\nAlternatively, copy your code to an online compiler like:\n• replit.com\n• onlinegdb.com\n• programiz.com',
      };
    }

    const langName = LANG_META[currentLang]?.name || currentLang;
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
        return { output: '', error: '🔑 Add your Gemini API key in Settings to run this language.\n\n💡 JavaScript and HTML run directly — no API key needed!' };
      }
      return { output: '', error: `AI execution error: ${err.message}` };
    }
  }

  // ── HTML Preview ───────────────────────────────────────────
  function runHTML(code) {
    clearOutput();
    appendOutput('✅ HTML rendered in preview panel below.', 'success');

    const previewPanel = document.getElementById('cp-preview-panel');
    const iframe = document.getElementById('cp-preview-iframe');
    if (previewPanel) previewPanel.style.display = 'block';
    if (iframe) {
      iframe.srcdoc = code;
    }
    addToHistory(code, { run: { stdout: '[HTML Preview Rendered]', code: 0 } });
  }

  // ── Output helpers ─────────────────────────────────────────
  function clearOutput() {
    const output = document.getElementById('cp-output');
    if (output) output.innerHTML = '';
  }

  function appendOutput(text, type = 'default') {
    const output = document.getElementById('cp-output');
    if (!output) return;
    const line = document.createElement('div');
    line.className = `cp-output-line cp-output-${type}`;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function updateRunButton(running) {
    const btn = document.getElementById('cp-run-btn');
    if (btn) {
      btn.disabled = running;
      btn.innerHTML = running
        ? '<div class="spinner-sm"></div> Running...'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run Code';
    }
  }

  // ── Challenges ─────────────────────────────────────────────
  function renderChallenges() {
    const grid = document.getElementById('cp-challenges-grid');
    if (!grid) return;
    const challenges = CHALLENGES[currentLang] || [];
    if (!challenges.length) {
      grid.innerHTML = '<p class="text-muted">No challenges yet for this language.</p>';
      return;
    }
    grid.innerHTML = challenges.map((ch, i) => `
      <div class="cp-challenge-card glass-card" onclick="CodePractice.loadChallenge(${i})">
        <h4>${ch.title}</h4>
        <p>${ch.desc}</p>
      </div>
    `).join('');
  }

  function loadChallenge(index) {
    const challenges = CHALLENGES[currentLang] || [];
    if (!challenges[index]) return;
    const editor = document.getElementById('cp-editor');
    if (editor) {
      editor.value = challenges[index].starter;
      onEditorInput();
    }
    clearOutput();
    appendOutput(`📋 Challenge loaded: ${challenges[index].title}`, 'info');
    appendOutput(challenges[index].desc, 'info');
    // Scroll to editor
    document.getElementById('cp-editor-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  // ── History ────────────────────────────────────────────────
  function addToHistory(code, result) {
    executionHistory.unshift({
      lang: currentLang,
      code: code.slice(0, 200),
      output: (result.run?.stdout || result.run?.stderr || '').slice(0, 100),
      success: !result.run?.stderr && result.run?.code === 0,
      timestamp: Date.now(),
    });
    executionHistory = executionHistory.slice(0, 10);
    renderHistory();
  }

  function renderHistory() {
    const list = document.getElementById('cp-history-list');
    if (!list) return;
    if (!executionHistory.length) {
      list.innerHTML = '<div class="empty-state"><p>Run some code to see your history!</p></div>';
      return;
    }
    list.innerHTML = executionHistory.map(h => {
      const meta = LANG_META[h.lang];
      const time = timeAgo(h.timestamp);
      return `<div class="cp-history-item ${h.success ? 'success' : 'error'}">
        <div class="cp-hist-header">
          <span>${meta?.icon || '💻'} ${meta?.name || h.lang}</span>
          <span class="cp-hist-time">${time}</span>
        </div>
        <code class="cp-hist-code">${escapeHtml(h.code.slice(0, 80))}${h.code.length > 80 ? '...' : ''}</code>
        <div class="cp-hist-output">${h.success ? '✅' : '❌'} ${escapeHtml(h.output.slice(0, 60))}</div>
      </div>`;
    }).join('');
  }

  // ── Reset editor ───────────────────────────────────────────
  function resetCode() {
    const editor = document.getElementById('cp-editor');
    if (editor) {
      editor.value = STARTER_CODE[currentLang] || '';
      onEditorInput();
    }
    clearOutput();
    appendOutput('🔄 Editor reset to starter code.', 'info');
  }

  // ── Helpers ────────────────────────────────────────────────
  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return {
    init,
    switchLanguage,
    onEditorInput,
    runCode,
    resetCode,
    loadChallenge,
  };
})();
