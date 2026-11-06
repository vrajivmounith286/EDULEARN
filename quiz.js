/* ============================================================
   EDULEARN — Quiz Module (with Overall Progress Quiz)
   ============================================================ */
const Quiz = (() => {
  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let timerInterval = null;
  let timerSeconds = 0;
  let answered = false;
  let quizConfig = {};
  let answersLog = [];

  // ---- SAMPLE OFFLINE QUESTIONS ----
  const SAMPLE_QUESTIONS = {
    mathematics: [
      { question: "What is the derivative of x²?", options: ["x", "2x", "x²", "2"], correct: 1, explanation: "The power rule states d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x." },
      { question: "What is the value of π (pi) approximately?", options: ["2.14", "3.14", "4.14", "1.14"], correct: 1, explanation: "Pi (π) is approximately 3.14159..." },
      { question: "Solve: 2x + 5 = 15", options: ["x=3", "x=5", "x=7", "x=10"], correct: 1, explanation: "2x = 15-5 = 10, so x = 5." },
      { question: "What is the area of a circle with radius 7?", options: ["49π", "14π", "7π", "21π"], correct: 0, explanation: "Area = πr² = π×7² = 49π." },
      { question: "What is 15% of 200?", options: ["20", "25", "30", "35"], correct: 2, explanation: "15% of 200 = 0.15 × 200 = 30." },
    ],
    science: [
      { question: "What is photosynthesis?", options: ["Breaking down food", "Making food using sunlight", "Breathing process", "Reproduction"], correct: 1, explanation: "Photosynthesis is the process by which plants use sunlight, water, and CO₂ to produce glucose and oxygen." },
      { question: "What is Newton's First Law?", options: ["F=ma", "Law of inertia", "Action-reaction", "Law of gravity"], correct: 1, explanation: "Newton's First Law (Law of Inertia) states an object remains at rest or in motion unless acted upon by a force." },
      { question: "What is the chemical formula for water?", options: ["CO₂", "H₂O", "O₂", "NaCl"], correct: 1, explanation: "Water is H₂O — two hydrogen atoms bonded to one oxygen atom." },
      { question: "Which organelle is the 'powerhouse of the cell'?", options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"], correct: 2, explanation: "Mitochondria produce ATP energy through cellular respiration." },
      { question: "What is the speed of light?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 1, explanation: "The speed of light in vacuum is approximately 3×10⁸ m/s." },
    ],
    english: [
      { question: "What is a metaphor?", options: ["A comparison using 'like' or 'as'", "A direct comparison without 'like' or 'as'", "Repetition of sounds", "An exaggeration"], correct: 1, explanation: "A metaphor makes a direct comparison: 'Life is a journey.'" },
      { question: "What is the past tense of 'go'?", options: ["Goed", "Went", "Gone", "Goes"], correct: 1, explanation: "'Went' is the irregular past tense of 'go'." },
      { question: "What does 'protagonist' mean?", options: ["The villain", "The main character", "A supporting character", "The narrator"], correct: 1, explanation: "The protagonist is the main character or hero of a story." },
      { question: "What literary device is 'The wind whispered'?", options: ["Alliteration", "Metaphor", "Personification", "Simile"], correct: 2, explanation: "Personification gives human qualities (whispered) to non-human things (wind)." },
      { question: "What is an adjective?", options: ["Action word", "Naming word", "Describing word", "Connecting word"], correct: 2, explanation: "An adjective describes or modifies a noun. E.g., 'beautiful flower'." },
    ],
    history: [
      { question: "When did World War II end?", options: ["1943", "1944", "1945", "1946"], correct: 2, explanation: "World War II ended in 1945, with Germany surrendering in May and Japan in September." },
      { question: "Who was the first President of the United States?", options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], correct: 2, explanation: "George Washington was the first President of the United States (1789-1797)." },
      { question: "In which year did India gain independence?", options: ["1945", "1947", "1950", "1942"], correct: 1, explanation: "India gained independence from British rule on August 15, 1947." },
      { question: "Who wrote the Magna Carta?", options: ["King John", "King Henry VIII", "Oliver Cromwell", "William the Conqueror"], correct: 0, explanation: "King John of England signed the Magna Carta in 1215." },
      { question: "What was the Renaissance?", options: ["Industrial revolution", "Cultural rebirth in Europe", "A war", "Scientific discovery"], correct: 1, explanation: "The Renaissance was a cultural and intellectual movement in Europe from the 14th-17th centuries." },
    ],
    programming: [
      { question: "What does HTML stand for?", options: ["Hyper Text Machine Language", "Hyper Text Markup Language", "High Text Markup Language", "Hyper Transfer Markup Language"], correct: 1, explanation: "HTML stands for HyperText Markup Language, the standard language for creating web pages." },
      { question: "Which of these is a JavaScript framework?", options: ["Django", "Flask", "React", "Laravel"], correct: 2, explanation: "React is a popular JavaScript library/framework for building UIs, developed by Facebook." },
      { question: "What is a variable?", options: ["A function", "A named storage location", "A loop", "A condition"], correct: 1, explanation: "A variable is a named storage location that holds a value." },
      { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Coded Style Sheets"], correct: 1, explanation: "CSS stands for Cascading Style Sheets, used to style HTML elements." },
      { question: "What is a loop in programming?", options: ["A data type", "Code that runs infinitely", "Code that repeats", "A function"], correct: 2, explanation: "A loop is a programming construct that repeats a block of code a number of times." },
    ],
    aiml: [
      { question: "What does NLP stand for in AI?", options: ["Natural Language Processing", "Neural Language Program", "New Learning Protocol", "Network Layer Pattern"], correct: 0, explanation: "NLP stands for Natural Language Processing, dealing with interactions between computers and humans using natural language." },
      { question: "Which algorithm is used for classifying data into categories?", options: ["Linear Regression", "Logistic Regression", "K-Means", "PCA"], correct: 1, explanation: "Logistic Regression is a supervised learning algorithm used primarily for classification tasks." },
      { question: "What is a Neural Network?", options: ["A computer network", "A biological brain", "A model inspired by the brain", "A storage device"], correct: 2, explanation: "Artificial Neural Networks are computing systems inspired by the biological neural networks that constitute animal brains." },
      { question: "What is Reinforcement Learning?", options: ["Learning with labels", "Learning without labels", "Learning via rewards/punishments", "Learning from text"], correct: 2, explanation: "Reinforcement learning trains models to make sequences of decisions by rewarding desired behaviors." },
      { question: "Which Python library is widely used for Data Manipulation?", options: ["TensorFlow", "Pandas", "Keras", "PyTorch"], correct: 1, explanation: "Pandas is a fast, powerful, flexible and easy to use open source data analysis and manipulation tool." },
    ],
    fullstack: [
      { question: "Which of these is a Backend framework?", options: ["React", "Vue", "Express", "Angular"], correct: 2, explanation: "Express is a minimal and flexible Node.js web application framework for the backend." },
      { question: "What does an API do?", options: ["Styles a webpage", "Connects frontend and backend", "Stores data permanently", "Runs javascript in browser"], correct: 1, explanation: "An API (Application Programming Interface) allows different software applications to communicate with each other." },
      { question: "What database type uses tables with rows and columns?", options: ["NoSQL", "Graph Database", "Relational (SQL) Database", "Document Database"], correct: 2, explanation: "Relational databases like PostgreSQL and MySQL organize data into tables." },
      { question: "What is JWT used for?", options: ["Styling text", "User Authentication", "Database queries", "Server deployment"], correct: 1, explanation: "JWT (JSON Web Token) is commonly used for secure data exchange and user authentication." },
      { question: "What does CRUD stand for?", options: ["Create, Read, Update, Delete", "Copy, Run, User, Data", "Code, React, Use, Deploy", "Compile, Run, Upload, Download"], correct: 0, explanation: "CRUD refers to the four basic operations of persistent storage." },
    ],
  };

  // ---- UPDATE OVERALL QUIZ BANNER ----
  function updateOverallQuizBanner() {
    const progress = Storage.getProgress();
    const subjects = ['mathematics','science','english','history','programming','aiml','fullstack'];
    let totalTopics = 0;
    let studiedTopics = 0;
    const studiedSubjects = [];

    subjects.forEach(sub => {
      const lessons = progress[sub]?.lessons || {};
      const count = Object.keys(lessons).length;
      if (count > 0) {
        studiedTopics += count;
        studiedSubjects.push(capitalize(sub));
      }
      totalTopics += 10;
    });

    const descEl = document.getElementById('oq-desc');
    const btn    = document.getElementById('overall-quiz-btn');
    const banner = document.getElementById('overall-quiz-banner');

    if (studiedTopics === 0) {
      if (descEl)  descEl.textContent = 'Complete at least one lesson to unlock the Overall Quiz!';
      if (btn)     btn.disabled = true;
      if (banner)  banner.classList.add('locked');
    } else {
      if (descEl)  descEl.textContent = `${studiedTopics} topics studied across: ${studiedSubjects.join(', ')} — test your knowledge!`;
      if (btn)     btn.disabled = false;
      if (banner)  banner.classList.remove('locked');
    }
  }

  // ---- OVERALL PROGRESS QUIZ ----
  async function startOverallQuiz() {
    const progress  = Storage.getProgress();
    const subjects  = ['mathematics','science','english','history','programming','aiml','fullstack'];
    const user      = Storage.getUser();

    // Gather all studied subjects + topics
    const studiedSubjects = [];
    subjects.forEach(sub => {
      const lessons = Object.keys(progress[sub]?.lessons || {});
      if (lessons.length > 0) studiedSubjects.push({ subject: sub, topics: lessons });
    });

    if (studiedSubjects.length === 0) {
      App.showToast('Complete at least one lesson first!', 'warning');
      return;
    }

    // Calculate count: min 15, max 30, ~3 questions per studied topic
    const totalTopics = studiedSubjects.reduce((acc, s) => acc + s.topics.length, 0);
    const count = Math.min(30, Math.max(15, totalTopics * 2));

    quizConfig = {
      subject: 'overall',
      topic:   `Overall (${studiedSubjects.map(s => capitalize(s.subject)).join(', ')})`,
      difficulty: 'intermediate',
      count,
    };
    questions     = [];
    currentIndex  = 0;
    score         = 0;
    answersLog    = [];

    document.getElementById('quiz-setup').style.display  = 'none';
    document.getElementById('quiz-active').style.display = 'block';
    document.getElementById('quiz-results').style.display= 'none';

    // Show loading
    document.getElementById('quiz-question').textContent = 'Building your Overall Progress Quiz…';
    document.getElementById('quiz-options').innerHTML    = '<div class="lesson-loading"><div class="spinner"></div><p>Gathering questions from all your studied topics…</p></div>';

    if (Storage.getApiKey()) {
      // Try to generate AI questions covering all studied subjects
      try {
        const allGenerated = [];
        for (const { subject, topics } of studiedSubjects) {
          const perSubject = Math.ceil(count / studiedSubjects.length);
          const topicHint  = topics.slice(0, 3).join(', ');
          const askedPrev  = Storage.getAskedQuestions(subject).slice(-60);
          const level = typeof Assessment !== 'undefined' ? Assessment.getUnderstandingLevel(subject) : 'intermediate';
          const generated  = await Gemini.generateQuiz(subject, topicHint, level, perSubject, user, askedPrev);
          generated.forEach(q => {
            allGenerated.push({ ...q, _subject: subject });
            Storage.addAskedQuestion(subject, q.question);
          });
        }
        questions = shuffleArray(allGenerated).slice(0, count);
        if (questions.length < 10) throw new Error('Not enough questions generated');
      } catch (err) {
        App.showToast('Using offline questions: ' + err.message, 'warning');
        questions = buildOverallOfflineQuestions(studiedSubjects, count);
      }
    } else {
      questions = buildOverallOfflineQuestions(studiedSubjects, count);
    }

    // Ensure minimum 15
    while (questions.length < 15) {
      questions = [...questions, ...questions].slice(0, 15);
    }

    quizConfig.count = questions.length;
    showQuestion();
    startTimer();
  }

  function buildOverallOfflineQuestions(studiedSubjects, count) {
    const allQ = [];
    const perSubject = Math.ceil(count / studiedSubjects.length);
    studiedSubjects.forEach(({ subject }) => {
      const pool = SAMPLE_QUESTIONS[subject] || SAMPLE_QUESTIONS.mathematics;
      const shuffled = shuffleArray([...pool]);
      shuffled.slice(0, perSubject).forEach(q => allQ.push({ ...q, _subject: subject }));
    });
    return shuffleArray(allQ).slice(0, count);
  }

  // ---- STANDARD QUIZ ----
  async function startQuiz() {
    const subject    = document.getElementById('quiz-subject').value;
    const topic      = document.getElementById('quiz-topic').value.trim();
    const difficulty = document.getElementById('quiz-difficulty').value;
    const count      = parseInt(document.getElementById('quiz-count').value);
    const langEl     = document.getElementById('quiz-prog-lang');
    const progLang   = langEl ? langEl.value : '';
    const user       = Storage.getUser();

    const effectiveTopic = (subject === 'programming' && progLang)
      ? (topic ? `${topic} in ${progLang}` : progLang)
      : topic;

    quizConfig   = { subject, topic: effectiveTopic || subject, difficulty, count };
    questions    = [];
    currentIndex = 0;
    score        = 0;
    answersLog   = [];

    document.getElementById('quiz-setup').style.display  = 'none';
    document.getElementById('quiz-active').style.display = 'block';
    document.getElementById('quiz-results').style.display= 'none';

    if (!Storage.getApiKey()) {
      const samples = SAMPLE_QUESTIONS[subject] || SAMPLE_QUESTIONS.mathematics;
      const asked = Storage.getAskedQuestions(subject);
      // Filter out already-asked questions
      let available = samples.filter(q => !asked.includes(q.question) && !asked.includes(hashQuestion(q.question)));
      if (available.length < count) {
        Storage.clearAskedQuestions(subject);
        available = [...samples];
      }
      questions = shuffleArray(available).slice(0, count);
      questions.forEach(q => Storage.addAskedQuestion(subject, q.question));
      if (questions.length < count) questions = [...questions, ...shuffleArray([...samples])].slice(0, count);
      showQuestion();
      startTimer();
      return;
    }

    document.getElementById('quiz-question').textContent  = 'AI is generating your quiz...';
    document.getElementById('quiz-options').innerHTML     = '<div class="lesson-loading"><div class="spinner"></div></div>';

    try {
      const askedPrev = Storage.getAskedQuestions(subject).slice(-60);
      const level = typeof Assessment !== 'undefined' ? Assessment.getUnderstandingLevel(subject) : difficulty;
      let generated = await Gemini.generateQuiz(subject, effectiveTopic || topic, level, count, user, askedPrev);
      generated = generated.map(q => ({ ...q, explanation: q.explanation || 'Review this topic for a deeper understanding.' }));
      questions = generated.slice(0, count);
      questions.forEach(q => Storage.addAskedQuestion(subject, q.question));
      showQuestion();
      startTimer();
    } catch (err) {
      App.showToast('Using offline questions: ' + err.message, 'warning');
      const samples = SAMPLE_QUESTIONS[subject] || SAMPLE_QUESTIONS.mathematics;
      questions = shuffleArray([...samples]).slice(0, count);
      showQuestion();
      startTimer();
    }
  }

  function showQuestion() {
    if (currentIndex >= questions.length) { endQuiz(); return; }
    answered = false;

    const q            = questions[currentIndex];
    const counter      = document.getElementById('quiz-counter');
    const progressFill = document.getElementById('quiz-progress-fill');
    const questionEl   = document.getElementById('quiz-question');
    const optionsEl    = document.getElementById('quiz-options');
    const feedback     = document.getElementById('quiz-feedback');
    const nextBtn      = document.getElementById('quiz-next-btn');
    const submitBtn    = document.getElementById('quiz-submit-btn');

    if (counter)      counter.textContent       = `Question ${currentIndex + 1} of ${questions.length}`;
    if (progressFill) progressFill.style.width  = `${((currentIndex) / questions.length) * 100}%`;
    if (questionEl) {
      // Show subject label for overall quiz
      const subjectLabel = q._subject ? `<span class="q-subject-tag">${capitalize(q._subject)}</span>` : '';
      questionEl.innerHTML = subjectLabel + q.question;
    }
    if (feedback)  feedback.style.display  = 'none';
    if (nextBtn)   nextBtn.style.display   = 'none';
    if (submitBtn) submitBtn.style.display = 'none';

    const letters = ['A', 'B', 'C', 'D'];
    if (optionsEl) {
      optionsEl.innerHTML = q.options.map((opt, i) => `
        <button class="quiz-option" onclick="Quiz.selectAnswer(${i})" id="option-${i}">
          <span class="option-letter">${letters[i]}</span>
          <span>${opt}</span>
        </button>
      `).join('');
    }
  }

  let selectedIndex = -1;

  function selectAnswer(index) {
    if (answered) return;

    // Just highlight the selected option — don't grade yet
    selectedIndex = index;
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((btn, i) => {
      btn.classList.toggle('selected', i === index);
    });

    // Show the Submit button
    const submitBtn = document.getElementById('quiz-submit-btn');
    if (submitBtn) submitBtn.style.display = 'inline-flex';
  }

  function submitAnswer() {
    if (answered || selectedIndex === -1) return;
    answered = true;

    const q         = questions[currentIndex];
    const index     = selectedIndex;
    const isCorrect = index === q.correct;
    if (isCorrect) score++;

    answersLog.push({
      question:    q.question,
      selected:    index,
      correct:     q.correct,
      options:     q.options,
      isCorrect,
      explanation: q.explanation || 'Review this topic for more details.',
      subject:     q._subject || quizConfig.subject,
    });

    const options = document.querySelectorAll('.quiz-option');
    options.forEach((btn, i) => {
      btn.disabled = true;
      btn.classList.remove('selected');
      if (i === q.correct) btn.classList.add('correct');
      else if (i === index && !isCorrect) btn.classList.add('wrong');
    });

    const submitBtn = document.getElementById('quiz-submit-btn');
    if (submitBtn) submitBtn.style.display = 'none';

    const feedback = document.getElementById('quiz-feedback');
    if (feedback) {
      feedback.style.display = 'block';
      feedback.className     = `quiz-feedback ${isCorrect ? 'correct-feedback' : 'wrong-feedback'}`;
      feedback.innerHTML     = isCorrect
        ? `✅ <strong>Correct!</strong> ${q.explanation}`
        : `❌ <strong>Incorrect.</strong> The correct answer is: <strong>${q.options[q.correct]}</strong>. ${q.explanation}`;
    }

    const liveScore = document.getElementById('quiz-score-live');
    if (liveScore) liveScore.textContent = `Score: ${score}`;

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent   = currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results →';
    }
  }

  function nextQuestion() {
    currentIndex++;
    showQuestion();
  }

  function startTimer() {
    timerSeconds = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timerSeconds++;
      const m  = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
      const s  = String(timerSeconds % 60).padStart(2, '0');
      const el = document.getElementById('timer-text');
      if (el) el.textContent = `${m}:${s}`;
    }, 1000);
  }

  function endQuiz() {
    clearInterval(timerInterval);
    const pct  = Math.round((score / questions.length) * 100);
    const time = timerSeconds;

    Storage.addQuizResult({
      subject:    quizConfig.subject,
      topic:      quizConfig.topic || quizConfig.subject,
      difficulty: quizConfig.difficulty,
      correct:    score,
      total:      questions.length,
      score:      pct,
      time,
    });
    Storage.addActivity({
      type:    'quiz',
      title:   `Quiz: ${capitalize(quizConfig.subject)} — ${pct}%`,
      subject: quizConfig.subject,
      score:   pct,
    });
    Storage.updateStreak();

    document.getElementById('quiz-active').style.display  = 'none';
    document.getElementById('quiz-results').style.display = 'block';

    document.getElementById('results-score').textContent   = pct + '%';
    document.getElementById('results-correct').textContent = score;
    document.getElementById('results-wrong').textContent   = questions.length - score;
    const m = String(Math.floor(time / 60)).padStart(2, '0');
    const s = String(time % 60).padStart(2, '0');
    document.getElementById('results-time').textContent    = `${m}:${s}`;

    const msg = pct >= 80
      ? '🎉 Excellent! Keep it up!'
      : pct >= 60
        ? '👍 Good job! Review the wrong answers.'
        : '💪 Keep practicing! You\'ll get better!';

    document.getElementById('results-title').textContent   = pct >= 80 ? 'Outstanding! 🌟' : pct >= 60 ? 'Good Work! 👏' : 'Keep Practicing! 💪';
    document.getElementById('results-message').textContent = msg;

    const ring = document.getElementById('score-ring');
    if (ring) {
      const circumference = 339.292;
      const offset        = circumference - (pct / 100) * circumference;
      ring.style.strokeDashoffset = offset;
      ring.style.stroke           = pct >= 80 ? '#00C9A7' : pct >= 60 ? '#FFB347' : '#FF6B6B';
      ring.style.transition       = 'stroke-dashoffset 1.5s ease, stroke 0.5s';
    }

    if (pct >= 70) Confetti.fire();

    // Answer Key
    const review  = document.getElementById('results-review');
    if (review) {
      const letters = ['A', 'B', 'C', 'D'];
      review.innerHTML = `
        <div class="answer-key-header">
          <h3>📋 Answer Key & Explanations</h3>
          <p style="font-size:13px;color:var(--text-muted)">Review all ${questions.length} questions with correct answers</p>
        </div>
        ${answersLog.map((a, i) => `
          <div class="answer-key-item ${a.isCorrect ? 'ak-correct' : 'ak-wrong'}">
            <div class="ak-question">
              <span class="ak-num">${i+1}</span>
              <span>${a.question}</span>
              ${a.subject && quizConfig.subject === 'overall' ? `<span class="q-subject-tag small">${capitalize(a.subject)}</span>` : ''}
              ${a.isCorrect ? '<span class="ak-badge correct-badge">✅ Correct</span>' : '<span class="ak-badge wrong-badge">❌ Wrong</span>'}
            </div>
            <div class="ak-options">
              ${a.options.map((opt, oi) => {
                let cls = '';
                if (oi === a.correct) cls = 'ak-opt-correct';
                else if (oi === a.selected && !a.isCorrect) cls = 'ak-opt-wrong';
                return `<div class="ak-opt ${cls}">
                  <span class="ak-letter">${letters[oi]}</span>
                  <span>${opt}</span>
                  ${oi === a.correct ? '<span class="ak-tick">✓ Correct Answer</span>' : ''}
                  ${oi === a.selected && !a.isCorrect ? '<span class="ak-cross">✗ Your Answer</span>' : ''}
                </div>`;
              }).join('')}
            </div>
            <div class="ak-explanation">
              <span class="ak-exp-icon">💡</span>
              <span><strong>Explanation:</strong> ${a.explanation || questions[i]?.explanation || 'Review this topic in more detail.'}</span>
            </div>
          </div>
        `).join('')}
      `;
    }
    renderQuizHistory();
    updateOverallQuizBanner();
    Dashboard.refresh();
  }

  function retryQuiz() {
    document.getElementById('quiz-results').style.display = 'none';
    currentIndex  = 0;
    score         = 0;
    answersLog    = [];
    selectedIndex = -1;
    questions     = shuffleArray(questions);
    document.getElementById('quiz-active').style.display = 'block';
    showQuestion();
    startTimer();
  }

  function newQuiz() {
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-setup').style.display   = 'grid';
    selectedIndex = -1;
    renderQuizHistory();
    updateOverallQuizBanner();
  }

  function renderQuizHistory() {
    const list = document.getElementById('quiz-history-list');
    if (!list) return;
    const history = Storage.getQuizHistory();
    if (!history.length) {
      list.innerHTML = `<div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/></svg>
        <p>No quizzes taken yet. Start your first quiz!</p>
      </div>`;
      return;
    }
    list.innerHTML = history.slice(0, 8).map(h => {
      const scoreClass = h.score >= 80 ? 'good' : h.score >= 60 ? 'average' : 'poor';
      const date       = new Date(h.timestamp).toLocaleDateString();
      const isOverall  = h.subject === 'overall';
      return `
        <div class="quiz-history-item ${isOverall ? 'overall-result' : ''}">
          <div class="qh-info">
            <span class="qh-subject">${isOverall ? '🏆 Overall' : capitalize(h.subject)}</span>
            <span class="qh-meta">${h.topic || h.subject} · ${h.difficulty || 'mixed'} · ${date}</span>
          </div>
          <span class="qh-score ${scoreClass}">${h.score}%</span>
        </div>
      `;
    }).join('');
  }

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Simple hash for question tracking (non-repeatable)
  function hashQuestion(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function init() {
    renderQuizHistory();
    updateOverallQuizBanner();
  }

  return { startQuiz, startOverallQuiz, selectAnswer, submitAnswer, nextQuestion, retryQuiz, newQuiz, init };
})();
