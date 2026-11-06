/* ============================================================
   EDULEARN — Initial Assessment Module
   Mandatory first-login quiz to determine understanding level
   ============================================================ */
const Assessment = (() => {
  const STORAGE_KEY = 'edulearn_assessment';

  // ── Assessment question banks per subject ─────────────────
  const BANKS = {
    mathematics: [
      { q:"What is 25% of 200?", opts:["25","50","75","100"], c:1, lvl:'beginner' },
      { q:"Solve: 5x = 35", opts:["x=5","x=7","x=6","x=8"], c:1, lvl:'beginner' },
      { q:"What is the area of a rectangle with length 12 and width 5?", opts:["17","60","35","120"], c:1, lvl:'beginner' },
      { q:"What is the slope of y = 3x + 7?", opts:["7","3","10","1/3"], c:1, lvl:'intermediate' },
      { q:"If f(x) = x² + 3x, what is f(2)?", opts:["8","10","14","6"], c:1, lvl:'intermediate' },
      { q:"What is the sum of interior angles of a hexagon?", opts:["540°","720°","360°","900°"], c:1, lvl:'intermediate' },
      { q:"Find the derivative of 4x³ - 2x", opts:["12x²-2","12x³-2","4x²-2","8x-2"], c:0, lvl:'advanced' },
      { q:"What is log₁₀(1000)?", opts:["2","3","4","10"], c:1, lvl:'advanced' },
      { q:"Evaluate: ∫2x dx", opts:["x²+C","2x²+C","x+C","2+C"], c:0, lvl:'advanced' },
      { q:"What is the determinant of [[1,2],[3,4]]?", opts:["-2","2","10","-10"], c:0, lvl:'advanced' },
    ],
    science: [
      { q:"What gas do we breathe in?", opts:["CO₂","N₂","O₂","H₂"], c:2, lvl:'beginner' },
      { q:"How many planets are in our solar system?", opts:["7","8","9","10"], c:1, lvl:'beginner' },
      { q:"What is the chemical symbol for water?", opts:["O₂","H₂O","CO₂","NaCl"], c:1, lvl:'beginner' },
      { q:"What is the SI unit of force?", opts:["Watt","Joule","Newton","Pascal"], c:2, lvl:'intermediate' },
      { q:"What is the atomic number of Carbon?", opts:["4","6","8","12"], c:1, lvl:'intermediate' },
      { q:"Which vitamin is produced by sunlight?", opts:["Vitamin A","Vitamin B","Vitamin C","Vitamin D"], c:3, lvl:'intermediate' },
      { q:"What is Ohm's Law?", opts:["V=IR","F=ma","E=mc²","P=IV"], c:0, lvl:'advanced' },
      { q:"What is the speed of sound in air (approx)?", opts:["340 m/s","3×10⁸ m/s","1500 m/s","100 m/s"], c:0, lvl:'advanced' },
      { q:"What is the hybridization of methane (CH₄)?", opts:["sp","sp²","sp³","sp³d"], c:2, lvl:'advanced' },
      { q:"Which law states energy cannot be created or destroyed?", opts:["Newton's 1st","Thermodynamics 1st","Boyle's Law","Coulomb's Law"], c:1, lvl:'advanced' },
    ],
    english: [
      { q:"What is the past tense of 'run'?", opts:["Runned","Ran","Running","Runed"], c:1, lvl:'beginner' },
      { q:"What is a noun?", opts:["Action word","Describing word","Naming word","Connecting word"], c:2, lvl:'beginner' },
      { q:"Identify the adjective: 'The tall building'", opts:["The","tall","building","none"], c:1, lvl:'beginner' },
      { q:"'She sings beautifully' — what part of speech is 'beautifully'?", opts:["Adjective","Adverb","Verb","Noun"], c:1, lvl:'intermediate' },
      { q:"What is a synonym of 'enormous'?", opts:["Tiny","Huge","Average","Narrow"], c:1, lvl:'intermediate' },
      { q:"What figure of speech is 'The world is a stage'?", opts:["Simile","Metaphor","Personification","Hyperbole"], c:1, lvl:'intermediate' },
      { q:"Who wrote 'Hamlet'?", opts:["Dickens","Shakespeare","Austen","Brontë"], c:1, lvl:'advanced' },
      { q:"What is an oxymoron?", opts:["Repetition of sounds","Contradictory terms together","Extreme exaggeration","Sound imitation"], c:1, lvl:'advanced' },
      { q:"Identify the passive voice:", opts:["She wrote a letter","A letter was written by her","She will write","She is writing"], c:1, lvl:'advanced' },
      { q:"What is the subjunctive mood used for?", opts:["Commands","Hypothetical situations","Questions","Past events"], c:1, lvl:'advanced' },
    ],
    history: [
      { q:"Who discovered America?", opts:["Vasco da Gama","Columbus","Magellan","Drake"], c:1, lvl:'beginner' },
      { q:"In which year did India get independence?", opts:["1945","1947","1950","1942"], c:1, lvl:'beginner' },
      { q:"Who was the first President of the USA?", opts:["Lincoln","Jefferson","Washington","Adams"], c:2, lvl:'beginner' },
      { q:"When did World War I start?", opts:["1912","1914","1916","1918"], c:1, lvl:'intermediate' },
      { q:"The French Revolution began in which year?", opts:["1776","1789","1799","1815"], c:1, lvl:'intermediate' },
      { q:"Who built the Taj Mahal?", opts:["Akbar","Shah Jahan","Babur","Aurangzeb"], c:1, lvl:'intermediate' },
      { q:"The Treaty of Versailles ended which war?", opts:["WWII","WWI","Napoleonic Wars","Cold War"], c:1, lvl:'advanced' },
      { q:"Who was Chandragupta Maurya's teacher?", opts:["Vishnu Sharma","Chanakya","Valmiki","Aryabhata"], c:1, lvl:'advanced' },
      { q:"The Berlin Wall fell in which year?", opts:["1987","1989","1991","1985"], c:1, lvl:'advanced' },
      { q:"What was the Magna Carta?", opts:["A peace treaty","A charter of rights","A war declaration","A trade agreement"], c:1, lvl:'advanced' },
    ],
    programming: [
      { q:"What does HTML stand for?", opts:["Hyper Text Machine Language","Hyper Text Markup Language","High Text Language","Hyper Transfer Language"], c:1, lvl:'beginner' },
      { q:"Which symbol is used for comments in Python?", opts:["//","/*","#","--"], c:2, lvl:'beginner' },
      { q:"What is a variable?", opts:["A function","Named storage for data","A loop","A condition"], c:1, lvl:'beginner' },
      { q:"What does CSS stand for?", opts:["Computer Style Sheets","Cascading Style Sheets","Creative Style System","Coded Sheets"], c:1, lvl:'intermediate' },
      { q:"What is the output of: print(type(5.0))?", opts:["int","str","float","number"], c:2, lvl:'intermediate' },
      { q:"What is a loop used for?", opts:["Defining functions","Repeating code","Declaring variables","Error handling"], c:1, lvl:'intermediate' },
      { q:"What is OOP?", opts:["Online Open Program","Object Oriented Programming","Ordered Output Process","Open Operation Protocol"], c:1, lvl:'advanced' },
      { q:"What is the time complexity of binary search?", opts:["O(n)","O(n²)","O(log n)","O(1)"], c:2, lvl:'advanced' },
      { q:"What is a closure in JavaScript?", opts:["A loop","Function with access to outer scope","A class","An error handler"], c:1, lvl:'advanced' },
      { q:"What design pattern is Singleton?", opts:["Behavioral","Structural","Creational","Functional"], c:2, lvl:'advanced' },
    ],
    aiml: [
      { q:"What does AI stand for?", opts:["Auto Intelligence","Artificial Intelligence","Applied Intelligence","Advanced Info"], c:1, lvl:'beginner' },
      { q:"What is Machine Learning?", opts:["Robots","Computers learning from data","Internet","Database"], c:1, lvl:'beginner' },
      { q:"Python is commonly used for ML because:", opts:["It's fast","Rich libraries like sklearn","It's old","It's compiled"], c:1, lvl:'intermediate' },
      { q:"What is supervised learning?", opts:["No labels","Learning with labeled data","Reinforcement","Unsupervised"], c:1, lvl:'intermediate' },
      { q:"What does CNN stand for in Deep Learning?", opts:["Computer Neural Net","Convolutional Neural Network","Central Network","Coded Neural Net"], c:1, lvl:'advanced' },
    ],
    fullstack: [
      { q:"What does API stand for?", opts:["App Program Interface","Application Programming Interface","Auto Program Input","Applied Protocol"], c:1, lvl:'beginner' },
      { q:"Which is a frontend framework?", opts:["Django","Express","React","Flask"], c:2, lvl:'beginner' },
      { q:"What is REST?", opts:["A sleep mode","An architectural style for APIs","A database","A programming language"], c:1, lvl:'intermediate' },
      { q:"What does CRUD stand for?", opts:["Create Read Update Delete","Copy Run Upload Download","Code React Use Deploy","Compile Run Update Debug"], c:0, lvl:'intermediate' },
      { q:"What is Docker used for?", opts:["Styling","Containerization","Database","Testing"], c:1, lvl:'advanced' },
    ],
  };

  let assessmentData = null;
  let currentSubjects = [];
  let currentQuestions = [];
  let currentIndex = 0;
  let answers = {};
  let subjectIndex = 0;

  // ── Check if assessment is needed ─────────────────────────
  function isCompleted() {
    const data = getStoredData();
    return !!(data && data.completed);
  }

  function getStoredData() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }

  function getUnderstandingLevel(subject) {
    const data = getStoredData();
    if (!data || !data.levels) return 'intermediate'; // default
    return data.levels[subject] || 'intermediate';
  }

  function getAllLevels() {
    const data = getStoredData();
    return data?.levels || {};
  }

  // ── Start assessment flow ─────────────────────────────────
  function start() {
    const user = Storage.getUser();
    const userSubjects = user?.subjects || [];
    // Always assess at least these core subjects
    const core = ['mathematics', 'science', 'english'];
    const allSubs = [...new Set([...core, ...userSubjects])].filter(s => BANKS[s]);
    currentSubjects = allSubs;
    answers = {};
    subjectIndex = 0;
    currentIndex = 0;

    showScreen();
    loadSubjectQuestions();
  }

  function showScreen() {
    document.getElementById('assessment-screen').style.display = 'flex';
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').style.display = 'none';
  }

  async function loadSubjectQuestions() {
    if (subjectIndex >= currentSubjects.length) {
      finishAssessment();
      return;
    }
    const sub = currentSubjects[subjectIndex];
    const container = document.getElementById('assessment-body');
    if (container) {
      container.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100px;opacity:0.7;"><div class="spinner" style="margin-bottom:15px;border-color:var(--primary-color);border-top-color:transparent;"></div><div>Preparing unique assessment questions...</div></div>';
    }

    if (typeof Gemini !== 'undefined' && typeof Storage !== 'undefined' && Storage.getApiKey()) {
      try {
        const user = Storage.getUser() || { grade: '10' };
        // Passing an empty asked array, but Gemini generateQuiz randomly makes questions based on temperature.
        // To force uniqueness, we can inject a random salt topic
        const randomSalt = "Test unique aspects " + Math.random().toString(36).substring(7);
        let generated = await Gemini.generateQuiz(sub, `Core concepts and ${randomSalt}`, 'mixed', 5, user, []);
        
        if (generated && generated.length >= 3) {
          currentQuestions = generated.slice(0, 5).map(q => ({
            q: q.question,
            opts: q.options,
            c: q.correct,
            lvl: 'intermediate'
          }));
          currentIndex = 0;
          answers[sub] = { correct: 0, total: currentQuestions.length, byLevel: { beginner: 0, intermediate: 0, advanced: 0 } };
          renderQuestion();
          return;
        }
      } catch(e) {
        console.warn("AI Assessment generation failed, falling back to static banks", e);
      }
    }

    // --- FALLBACK STATIC BANK ---
    const bank = BANKS[sub] || [];
    // Pick 5 questions — mix of levels
    const beginner = bank.filter(q => q.lvl === 'beginner');
    const inter = bank.filter(q => q.lvl === 'intermediate');
    const adv = bank.filter(q => q.lvl === 'advanced');
    currentQuestions = [
      ...shuffleArr(beginner).slice(0, 2),
      ...shuffleArr(inter).slice(0, 2),
      ...shuffleArr(adv).slice(0, 1),
    ];
    if (currentQuestions.length < 3) currentQuestions = shuffleArr(bank).slice(0, 5);
    currentIndex = 0;
    answers[sub] = { correct: 0, total: currentQuestions.length, byLevel: { beginner: 0, intermediate: 0, advanced: 0 } };
    renderQuestion();
  }

  function renderQuestion() {
    const sub = currentSubjects[subjectIndex];
    const subName = capitalize(sub === 'aiml' ? 'AI & ML' : sub === 'fullstack' ? 'Full Stack' : sub);
    const total = currentSubjects.reduce((a, s) => a + (BANKS[s] ? Math.min(5, BANKS[s].length) : 0), 0);
    const done = currentSubjects.slice(0, subjectIndex).reduce((a, s) => a + (BANKS[s] ? Math.min(5, BANKS[s].length) : 0), 0) + currentIndex;
    const overallPct = Math.round((done / total) * 100);

    const container = document.getElementById('assessment-body');
    if (!container) return;

    if (currentIndex >= currentQuestions.length) {
      subjectIndex++;
      loadSubjectQuestions();
      return;
    }

    const q = currentQuestions[currentIndex];
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="assess-subject-badge">${subName} — Question ${currentIndex + 1}/${currentQuestions.length}</div>
      <div class="assess-progress-bar"><div class="assess-progress-fill" style="width:${overallPct}%"></div></div>
      <div class="assess-question">${q.q}</div>
      <div class="assess-options">
        ${q.opts.map((opt, i) => `
          <button class="quiz-option" onclick="Assessment.answer(${i})" id="assess-opt-${i}">
            <span class="option-letter">${letters[i]}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="assess-feedback" id="assess-feedback" style="display:none;"></div>
      <button class="btn btn-primary" id="assess-next-btn" onclick="Assessment.next()" style="display:none;">Next →</button>
    `;
  }

  function answer(idx) {
    const q = currentQuestions[currentIndex];
    const sub = currentSubjects[subjectIndex];
    const isCorrect = idx === q.c;

    if (isCorrect) {
      answers[sub].correct++;
      answers[sub].byLevel[q.lvl]++;
    }

    // Save so it doesn't repeat in AI quizzes
    if (typeof Storage !== 'undefined') {
      Storage.addAskedQuestion(sub, q.q);
    }

    // Visual feedback
    document.querySelectorAll('#assessment-body .quiz-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.c) btn.classList.add('correct');
      else if (i === idx && !isCorrect) btn.classList.add('wrong');
    });

    const fb = document.getElementById('assess-feedback');
    if (fb) {
      fb.style.display = 'block';
      fb.className = `assess-feedback ${isCorrect ? 'correct-feedback' : 'wrong-feedback'}`;
      fb.innerHTML = isCorrect ? '✅ Correct!' : `❌ Incorrect. The answer is: <strong>${q.opts[q.c]}</strong>`;
    }

    document.getElementById('assess-next-btn').style.display = 'inline-flex';
  }

  function next() {
    currentIndex++;
    renderQuestion();
  }

  function finishAssessment() {
    // Calculate understanding level per subject
    const levels = {};
    Object.entries(answers).forEach(([sub, data]) => {
      const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
      if (pct >= 75) levels[sub] = 'advanced';
      else if (pct >= 45) levels[sub] = 'intermediate';
      else levels[sub] = 'beginner';
    });

    const result = {
      completed: true,
      timestamp: Date.now(),
      levels,
      scores: answers,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));

    // Sync to Firebase
    if (FirebaseDB.isReady()) {
      FirebaseDB.saveAssessment(result);
    }

    // Show results briefly
    showResults(levels);
  }

  function showResults(levels) {
    const container = document.getElementById('assessment-body');
    if (!container) return;

    const cards = Object.entries(levels).map(([sub, lvl]) => {
      const icon = lvl === 'advanced' ? '🌟' : lvl === 'intermediate' ? '👍' : '📚';
      const color = lvl === 'advanced' ? '#00C9A7' : lvl === 'intermediate' ? '#FFB347' : '#6C63FF';
      const subName = capitalize(sub === 'aiml' ? 'AI & ML' : sub === 'fullstack' ? 'Full Stack' : sub);
      const score = answers[sub];
      return `<div class="assess-result-card" style="border-left:4px solid ${color}">
        <span class="assess-result-icon">${icon}</span>
        <div>
          <strong>${subName}</strong>
          <div style="font-size:13px;color:var(--text-muted)">${score.correct}/${score.total} correct — <span style="color:${color};font-weight:600">${capitalize(lvl)}</span></div>
        </div>
      </div>`;
    }).join('');

    container.innerHTML = `
      <div class="assess-results-wrap">
        <div class="assess-done-icon">🎓</div>
        <h2>Assessment Complete!</h2>
        <p style="color:var(--text-muted);margin-bottom:20px;">Your learning paths are now personalized based on your understanding level.</p>
        <div class="assess-results-grid">${cards}</div>
        <button class="btn btn-primary btn-full" onclick="Assessment.proceed()" style="margin-top:24px;">
          Start Learning →
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;
  }

  function proceed() {
    document.getElementById('assessment-screen').style.display = 'none';
    App.launch();
  }

  // ── Helpers ──────────────────────────────────────────────
  function shuffleArr(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  return { isCompleted, getUnderstandingLevel, getAllLevels, getStoredData, start, answer, next, proceed };
})();
