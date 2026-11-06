/* ============================================================
   EDULEARN — Roadmap Module
   Visual Roadmap + Weekly Schedule + Course Suggestions
   ============================================================ */
const Roadmap = (() => {

  // ── Data ────────────────────────────────────────────────────
  const META = {
    mathematics: { icon:'🔢', color:'#6C63FF', label:'Mathematics' },
    science:     { icon:'🔬', color:'#00C9A7', label:'Science' },
    english:     { icon:'📖', color:'#FF6B6B', label:'English' },
    history:     { icon:'🏛️', color:'#FFA726', label:'History' },
    programming: { icon:'💻', color:'#845EC2', label:'Programming' },
    aiml:        { icon:'🤖', color:'#E040FB', label:'AI & Machine Learning' },
    fullstack:   { icon:'🚀', color:'#00BCD4', label:'Full Stack Web Dev' },
  };

  const SUGGESTION_RELATIONS = {
    mathematics: { next:'programming', reason:'Programming relies heavily on math logic.' },
    science:     { next:'mathematics', reason:'Science is deeply mathematical.' },
    english:     { next:'history',     reason:'History texts sharpen your English.' },
    history:     { next:'english',     reason:'English analysis deepens historical understanding.' },
    programming: { next:'mathematics', reason:'Math strengthens your algorithm skills.' },
    aiml:        { next:'programming', reason:'Programming skills power your AI models.' },
    fullstack:   { next:'programming', reason:'Programming fundamentals boost your full stack skills.' },
  };

  // Sub-course display names & icons (mirrors Learning module)
  const SUB_NAMES = {
    algebra:'Algebra', geometry:'Geometry', calculus:'Calculus', statistics:'Statistics', trigonometry:'Trigonometry',
    physics:'Physics', chemistry:'Chemistry', biology:'Biology',
    literature:'Literature', grammar:'Grammar', writing:'Writing',
    ancient:'Ancient History', medieval:'Medieval History', modern:'Modern History',
    python:'Python', javascript:'JavaScript', java:'Java', cpp:'C / C++', html:'HTML & CSS', sql:'SQL', r:'R Language',
    machine_learning:'Machine Learning', deep_learning:'Deep Learning', nlp:'Natural Language Processing',
    frontend:'Frontend Dev', backend:'Backend Dev', devops:'DevOps & Deployment',
  };
  const SUB_ICONS = {
    algebra:'📐', geometry:'📏', calculus:'∫', statistics:'📊', trigonometry:'📈',
    physics:'⚛️', chemistry:'🧪', biology:'🧬',
    literature:'📖', grammar:'✏️', writing:'🖊️',
    ancient:'🏺', medieval:'⚔️', modern:'🌍',
    python:'🐍', javascript:'🌐', java:'☕', cpp:'⚙️', html:'🎨', sql:'🗄️', r:'📊',
    machine_learning:'🧠', deep_learning:'🧪', nlp:'💬',
    frontend:'🎨', backend:'⚙️', devops:'☁️',
  };

  // All sub-course topics (mirrored from Learning for reliability)
  const SUB_TOPICS = {
    mathematics: {
      algebra:      ['Linear Equations','Quadratic Equations','Polynomials','Inequalities','Systems of Equations','Matrices & Determinants','Sequences & Series','Logarithms','Complex Numbers','Algebraic Proofs'],
      geometry:     ['Points Lines & Angles','Triangles','Circles','Polygons','Coordinate Geometry','Transformations','Area & Perimeter','Volume & Surface Area','Constructions','Geometric Proofs'],
      calculus:     ['Limits','Derivatives','Differentiation Rules','Applications of Derivatives','Integration','Definite Integrals','Applications of Integration','Differential Equations','Series Expansions','Multivariable Basics'],
      statistics:   ['Data Collection','Mean Median Mode','Standard Deviation','Probability Basics','Distributions','Hypothesis Testing','Correlation & Regression','Sampling Methods','Data Visualization','Statistical Inference'],
      trigonometry: ['Trigonometric Ratios','Unit Circle','Trigonometric Identities','Graphs of Trig Functions','Inverse Trig Functions','Law of Sines','Law of Cosines','Applications of Trigonometry','Polar Coordinates','Complex Numbers & Trig'],
    },
    science: {
      physics:   ['Motion & Kinematics',"Newton's Laws",'Work Energy & Power','Gravitation','Waves & Sound','Optics & Light','Electricity','Magnetism','Thermodynamics','Modern Physics'],
      chemistry: ['Atomic Structure','Chemical Bonding','Periodic Table','States of Matter','Chemical Reactions','Acids Bases & Salts','Electrochemistry','Organic Chemistry Basics','Environmental Chemistry','Stoichiometry'],
      biology:   ['Cell Biology','Genetics & DNA','Plant Biology','Human Anatomy','Ecology & Ecosystems','Evolution','Microbiology','Reproduction','Nervous System','Biotechnology'],
    },
    english: {
      literature: ['Prose Analysis','Poetry Analysis','Drama & Plays','Novel Studies','Short Stories','Literary Devices','Author Studies','Comparative Literature','World Literature','Critical Thinking'],
      grammar:    ['Parts of Speech','Sentence Structure','Tenses','Active & Passive Voice','Direct & Indirect Speech','Punctuation','Subject-Verb Agreement','Clauses & Phrases','Common Errors','Advanced Grammar'],
      writing:    ['Essay Writing','Creative Writing','Descriptive Writing','Argumentative Writing','Narrative Writing','Letter & Email Writing','Report Writing','Summary Writing','Editing & Proofreading','Research Writing'],
    },
    history: {
      ancient:  ['Ancient Civilizations','Mesopotamia & Egypt','Ancient Greece','Ancient Rome','Ancient India','Ancient China','Bronze Age','Iron Age Empires','Ancient Trade Routes','Fall of Ancient Empires'],
      medieval: ['The Renaissance','Medieval Europe','Islamic Golden Age','Crusades','Feudal System','Mughal Empire','Byzantine Empire','Viking Age','Mongol Empire','Medieval Trade'],
      modern:   ['Industrial Revolution','French Revolution','World War I','World War II','Cold War Era','Indian Independence','Civil Rights Movements','Space Race','Fall of Communism','Modern Global Issues'],
    },
    programming: {
      python:     ['Variables & Data Types','Control Flow & Loops','Functions & Scope','Lists & Tuples','Dictionaries & Sets','File Handling','OOP in Python','Error Handling','Modules & Packages','Python for Data Science'],
      javascript: ['Variables & Hoisting','Functions & Closures','DOM Manipulation','Arrays & Objects','Async JS & Promises','ES6+ Features','Event Handling','Fetch API & REST','Node.js Basics','JavaScript Algorithms'],
      java:       ['Java Syntax & Variables','OOP Concepts','Inheritance & Polymorphism','Interfaces & Abstract Classes','Collections Framework','Exception Handling','File I/O in Java','Multithreading','Java 8 Features','Build a Java App'],
      cpp:        ['C++ Syntax & Basics','Pointers & Memory','Arrays & Strings','OOP in C++','STL Containers','Templates','File Handling','Dynamic Memory','Recursion & Algorithms','Competitive Programming'],
      html:       ['HTML Document Structure','Headings Tags & Text','Links & Images','Lists & Tables','HTML Forms','Semantic HTML5','CSS Box Model','Flexbox Layout','CSS Grid','Responsive Design'],
      sql:        ['Introduction to SQL','SELECT Queries','WHERE & Filtering','JOINs Explained','GROUP BY & Aggregates','INSERT UPDATE DELETE','Subqueries','Indexes & Performance','Transactions','Database Design'],
      r:          ['R Syntax & Basics','Data Types & Structures','Data Frames & Tibbles','Data Visualization with ggplot2','Data Wrangling with dplyr','Statistical Analysis in R','Hypothesis Testing','Regression in R','R Markdown & Reports','Machine Learning with R'],
    },
    aiml: {
      machine_learning: ['Introduction to AI & ML','Python for ML','Data Preprocessing','Linear Regression','Classification Algorithms','Decision Trees & Random Forests','Ensemble Methods','Clustering & Unsupervised','Model Evaluation & Tuning','ML Project Pipeline'],
      deep_learning:    ['Neural Networks Basics','Activation Functions','Backpropagation','CNNs for Image Recognition','RNNs & LSTMs','Transfer Learning','GANs Basics','Deep Learning with TensorFlow','Deep Learning with PyTorch','Model Deployment'],
      nlp:              ['Text Preprocessing','Tokenization & Embeddings','Bag of Words & TF-IDF','Sentiment Analysis','Named Entity Recognition','Sequence to Sequence Models','Transformers & Attention','BERT & GPT Overview','Chatbot Development','NLP Project'],
    },
    fullstack: {
      frontend:  ['HTML & CSS Fundamentals','JavaScript ES6+','React.js Basics','React Hooks & State','Component Design Patterns','CSS Frameworks & Tailwind','Responsive & Mobile Design','API Integration','Testing Frontend Apps','Frontend Performance'],
      backend:   ['Node.js & Express','RESTful API Design','Database Design & SQL','MongoDB & NoSQL','Authentication & JWT','Middleware & Error Handling','File Uploads & Storage','WebSockets & Real-time','API Security Best Practices','Backend Project'],
      devops:    ['Git & Version Control','Docker Basics','CI/CD Pipelines','Cloud Deployment (AWS/GCP)','Environment Variables & Config','Nginx & Reverse Proxy','Monitoring & Logging','SSL & HTTPS','Scaling & Load Balancing','Full Stack Project Deployment'],
    },
  };

  // Fallback generic topics (shown when no sub-course selected)
  const GENERIC_TOPICS = {
    mathematics: ['Introduction to Algebra','Linear Equations','Quadratic Equations','Geometry Basics','Trigonometry','Statistics & Probability','Calculus Fundamentals','Number Theory','Set Theory','Coordinate Geometry'],
    science:     ['Cell Biology','Photosynthesis',"Newton's Laws of Motion",'Chemical Reactions','Periodic Table','Ecosystems','Electricity & Magnetism','Genetics & DNA','Waves & Optics','Atomic Structure'],
    english:     ['Grammar Fundamentals','Essay Writing','Poetry Analysis','Reading Comprehension','Vocabulary Building','Descriptive Writing','Argumentative Writing','Literature Analysis','Public Speaking','Creative Writing'],
    history:     ['Ancient Civilizations','The Renaissance','Industrial Revolution','World War I','World War II','Cold War Era','Indian Independence','Modern World History','Ancient Rome & Greece','The French Revolution'],
    programming: ['Variables & Basics','Control Flow','Functions','Data Structures','OOP Concepts','File Handling','Error Handling','Algorithms','Web Fundamentals','Project Building'],
    aiml:        ['Intro to AI','Machine Learning Basics','Data Preprocessing','Supervised Learning','Unsupervised Learning','Neural Networks','Deep Learning','NLP Basics','Model Evaluation','AI Project'],
    fullstack:   ['HTML & CSS','JavaScript','Frontend Frameworks','Node.js Basics','APIs','Databases','Authentication','Deployment','Testing','Full Stack Project'],
  };

  // ── Init ────────────────────────────────────────────────────
  function init() {
    renderWeeklySchedule();
    renderSuggestions();
    renderRoadmap();
  }

  // ────────────────────────────────────────────────────────────
  // 1. WEEKLY SCHEDULE
  // ────────────────────────────────────────────────────────────
  function renderWeeklySchedule() {
    const grid    = document.getElementById('weekly-grid');
    const weekLbl = document.getElementById('week-label');
    if (!grid) return;

    const today = new Date();
    const dow    = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dow === 0 ? 7 : dow) - 1));

    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });

    const fmt = d => d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
    if (weekLbl) weekLbl.textContent = `${fmt(dates[0])} — ${fmt(dates[6])}`;

    const daySlots  = [2, 2, 2, 2, 2, 1, 0];
    const dayNames  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const todayStr  = today.toDateString();

    const pending   = getPendingTopics();
    const completed = getRecentlyCompleted();
    const schedule  = buildSchedule(pending, completed, dates, daySlots, today);

    grid.innerHTML = dayNames.map((name, i) => {
      const date    = dates[i];
      const isToday = date.toDateString() === todayStr;
      const isPast  = date < today && !isToday;
      const tasks   = schedule[i] || [];

      return `
        <div class="wd-col ${isToday ? 'wd-today' : ''} ${isPast ? 'wd-past' : ''}">
          <div class="wd-header">
            <span class="wd-name">${name}</span>
            <span class="wd-date">${date.getDate()}</span>
            ${isToday ? '<span class="wd-today-badge">Today</span>' : ''}
          </div>
          <div class="wd-tasks">
            ${daySlots[i] === 0
              ? '<div class="wd-rest">😌 Rest Day</div>'
              : tasks.length === 0
                ? '<div class="wd-empty">Free slot</div>'
                : tasks.map(t => `
                    <div class="wd-task ${t.done ? 'wd-done' : ''}">
                      <span class="wd-task-icon">${META[t.subject]?.icon || '📚'}</span>
                      <span class="wd-task-text">${t.topic}</span>
                      ${t.done ? '<span class="wd-check">✓</span>' : ''}
                    </div>
                  `).join('')
            }
          </div>
        </div>
      `;
    }).join('');
  }

  function getPendingTopics() {
    const progress = Storage.getProgress();
    const result   = [];
    const subjects = ['mathematics','science','english','history','programming','aiml','fullstack'];

    // Get understanding levels to prioritize weak areas
    const levels = typeof Assessment !== 'undefined' ? Assessment.getAllLevels() : {};

    subjects.forEach(sub => {
      const studiedSubs = Storage.getStudiedSubCourses(sub);
      const done = progress[sub]?.lessons || {};
      studiedSubs.forEach(sc => {
        const scTopics = SUB_TOPICS[sub]?.[sc] || [];
        scTopics.forEach(topic => {
          if (!done[topic]) {
            const lvl = levels[sub] || 'intermediate';
            // weight: beginner=3, intermediate=2, advanced=1
            const weight = lvl === 'beginner' ? 3 : lvl === 'intermediate' ? 2 : 1;
            result.push({ subject: sub, topic, done: false, weight });
          }
        });
      });
    });

    // Sort descending by weight (weakest subjects first)
    return result.sort((a, b) => b.weight - a.weight);
  }

  function getRecentlyCompleted() {
    const progress = Storage.getProgress();
    const result   = [];
    ['mathematics','science','english','history','programming','aiml','fullstack'].forEach(sub => {
      const done = progress[sub]?.lessons || {};
      Object.entries(done)
        .sort((a, b) => (b[1].completedAt || 0) - (a[1].completedAt || 0))
        .slice(0, 4)
        .forEach(([topic]) => result.push({ subject: sub, topic, done: true }));
    });
    return result;
  }

  function buildSchedule(pending, completed, dates, daySlots, today) {
    const schedule = Array.from({ length: 7 }, () => []);
    const todayIdx = dates.findIndex(d => d.toDateString() === today.toDateString());

    let pi = 0;
    for (let i = Math.max(todayIdx, 0); i < 7 && pi < pending.length; i++) {
      for (let j = 0; j < daySlots[i] && pi < pending.length; j++) {
        schedule[i].push(pending[pi++]);
      }
    }
    let ci = 0;
    for (let i = todayIdx - 1; i >= 0 && ci < completed.length; i--) {
      const slots = Math.min(daySlots[i], 2);
      for (let j = 0; j < slots && ci < completed.length; j++) {
        schedule[i].push(completed[ci++]);
      }
    }
    return schedule;
  }

  // ────────────────────────────────────────────────────────────
  // 2. COURSE SUGGESTIONS
  // ────────────────────────────────────────────────────────────
  function renderSuggestions() {
    const grid = document.getElementById('suggestions-grid');
    if (!grid) return;

    const cards = buildSuggestions();
    if (!cards.length) {
      grid.innerHTML = `<div class="empty-state"><p>Complete at least one lesson to get personalized suggestions!</p></div>`;
      return;
    }
    grid.innerHTML = cards.map(card => `
      <div class="sug-card glass-card">
        <div class="sug-badge sug-${card.type}">${card.badge}</div>
        <div class="sug-icon">${card.icon}</div>
        <h3 class="sug-title">${card.title}</h3>
        <p class="sug-desc">${card.desc}</p>
        <div class="sug-score-row">
          ${card.score !== null
            ? `<div class="sug-score-bar"><div class="sug-score-fill" style="width:${card.score}%;background:${card.barColor}"></div></div>
               <span class="sug-score-val" style="color:${card.barColor}">${card.score}%</span>`
            : '<span class="sug-new-label">New!</span>'
          }
        </div>
        <button class="btn btn-primary btn-sm sug-btn" onclick="Roadmap.handleSuggestion('${card.subject}','${card.action}')">
          ${card.btnText}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    `).join('');
  }

  function buildSuggestions() {
    const scores   = Storage.getSubjectScores();
    const progress = Storage.getProgress();
    const subjects = ['mathematics','science','english','history','programming','aiml','fullstack'];
    const cards    = [];

    subjects.forEach(sub => {
      const score   = scores[sub] || 0;
      const done    = Object.keys(progress[sub]?.lessons || {}).length;
      const meta    = META[sub];

      if (done === 0) return;

      if (score >= 78) {
        cards.push({
          type:'advance', badge:'🚀 Level Up', icon: meta.icon,
          title: `Master ${meta.label}`,
          desc:  `You're crushing ${meta.label} at ${score}%! Push to the next level with harder challenges.`,
          score, barColor:'#00C9A7', subject: sub, action:'learn',
          btnText:'Continue Learning',
        });
      } else if (score >= 55) {
        cards.push({
          type:'practice', badge:'💪 Practice More', icon: meta.icon,
          title: `Strengthen ${meta.label}`,
          desc:  `${score}% in ${meta.label} — you're almost there! A few focused quizzes will push you over the edge.`,
          score, barColor:'#FFB347', subject: sub, action:'quiz',
          btnText:'Practice Quiz',
        });
      } else if (score > 0) {
        cards.push({
          type:'review', badge:'🔄 Needs Review', icon: meta.icon,
          title: `Review ${meta.label} Basics`,
          desc:  `${score}% in ${meta.label}. Let's revisit the fundamentals and build a stronger foundation.`,
          score, barColor:'#FF6B6B', subject: sub, action:'learn',
          btnText:'Review & Practice',
        });
      }
    });

    const notStarted = subjects.filter(s => Object.keys(progress[s]?.lessons || {}).length === 0);
    const strongSubs = subjects.filter(s => (scores[s] || 0) >= 60);

    notStarted.slice(0, 2).forEach(sub => {
      const rel    = SUGGESTION_RELATIONS[strongSubs[0]];
      const isBest = rel?.next === sub;
      const meta   = META[sub];
      cards.push({
        type:'new', badge:'✨ New Course', icon: meta.icon,
        title: `Explore ${meta.label}`,
        desc:  isBest
          ? `Based on your performance in ${capitalize(strongSubs[0])}, ${meta.label} will take your skills further!`
          : `A fresh subject to broaden your knowledge. Start your first lesson today!`,
        score: null, barColor: null, subject: sub, action:'learn',
        btnText:'Start This Course',
      });
    });

    return cards.slice(0, 4);
  }

  function handleSuggestion(subject, action) {
    if (action === 'learn') {
      App.navigate('learn');
      setTimeout(() => Learning.selectSubject(subject), 150);
    } else if (action === 'quiz') {
      App.navigate('quiz');
      setTimeout(() => {
        const sel = document.getElementById('quiz-subject');
        if (sel) { sel.value = subject; sel.dispatchEvent(new Event('change')); }
      }, 150);
    }
  }

  // ────────────────────────────────────────────────────────────
  // 3. LEARNING ROADMAP
  // ────────────────────────────────────────────────────────────

  /* ── Card builder (shared by all subjects & sub-course cards) ── */
  function buildRoadmapCard(sub, meta, topics, done, displayLabel, subBadge, subCourse) {
    const doneN   = Object.keys(done).filter(t => topics.includes(t)).length;
    const total   = topics.length;
    const pct     = total ? Math.round((doneN / total) * 100) : 0;
    const started = doneN > 0;
    const current = topics.find(t => !done[t]);
    const scArg   = subCourse ? ",'" + subCourse + "'" : '';
    const startLabel = subCourse ? (SUB_NAMES[subCourse] || subCourse) : meta.label;

    // Build start button onclick
    let startOnclick;
    if (subCourse) {
      startOnclick = "App.navigate('learn');setTimeout(()=>{Learning.selectSubject('" + sub + "');setTimeout(()=>Learning.selectSubCourse('" + sub + "','" + subCourse + "'),200)},150)";
    } else {
      startOnclick = "App.navigate('learn');setTimeout(()=>Learning.selectSubject('" + sub + "'),150)";
    }

    return `
      <div class="rm-card glass-card ${!started ? 'rm-locked' : ''}">
        <div class="rm-header">
          <div class="rm-icon-wrap" style="background:${meta.color}22;border-color:${meta.color}44">
            <span class="rm-icon">${subCourse ? (SUB_ICONS[subCourse] || meta.icon) : meta.icon}</span>
          </div>
          <div class="rm-info">
            <h3>${displayLabel}${subBadge}</h3>
            <div class="rm-bar-row">
              <div class="rm-bar"><div class="rm-bar-fill" style="width:${pct}%;background:${meta.color}"></div></div>
              <span class="rm-pct-text">${doneN}/${total} · ${pct}%</span>
            </div>
          </div>
          <div class="rm-status">
            ${pct === 100
              ? '<span class="rm-badge rm-badge-done">🎓 Completed</span>'
              : started
                ? '<span class="rm-badge rm-badge-active">In Progress</span>'
                : '<span class="rm-badge rm-badge-locked">Not Started</span>'}
          </div>
        </div>

        ${!started ? `
          <div class="rm-start-prompt">
            <span>Ready to begin your ${startLabel} journey?</span>
            <button class="btn btn-primary btn-sm" onclick="${startOnclick}">
              Start ${startLabel} →
            </button>
          </div>
        ` : `
          <div class="rm-topic-legend" style="display:flex;gap:14px;margin:0 0 6px 0;padding:0 8px;font-size:0.78rem;">
            <span style="color:var(--color-success);">✅ ${doneN} Completed</span>
            <span style="color:var(--text-secondary);">⏳ ${total - doneN} Remaining</span>
          </div>

          <div class="rm-path-scroll">
            <div class="rm-path">
              ${topics.map((topic, idx) => {
                const isDone    = !!done[topic];
                const isCurrent = topic === current;
                const topicEsc  = topic.replace(/'/g, "\\'");
                return `
                  <div class="rm-step">
                    <div class="rm-node-wrap ${idx < topics.length - 1 ? 'has-line' : ''}">
                      <div class="rm-node ${isDone ? 'rm-done' : isCurrent ? 'rm-current' : 'rm-pending'}"
                           onclick="Roadmap.goToTopic('${sub}','${topicEsc}'${scArg})"
                           title="${isDone ? '✅ Completed' : isCurrent ? '▶ Start now' : '🔒 Upcoming'}: ${topic}">
                        ${isDone
                          ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
                          : isCurrent
                            ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
                            : '<span>' + (idx + 1) + '</span>'
                        }
                      </div>
                      ${idx < topics.length - 1 ? '<div class="rm-line ' + (isDone ? 'rm-line-done' : '') + '"></div>' : ''}
                    </div>
                    <div class="rm-label ${isDone ? 'rm-label-done' : isCurrent ? 'rm-label-current' : ''}">${topic}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          ${current ? `
            <div class="rm-continue-bar">
              <span class="rm-continue-label">📍 Next up: <strong>${current}</strong></span>
              <button class="btn btn-sm btn-primary" onclick="Roadmap.goToTopic('${sub}','${current.replace(/'/g, "\\'")}'${scArg})">
                Continue →
              </button>
            </div>
          ` : `
            <div class="rm-continue-bar rm-all-done">
              <span>🎉 All topics completed!</span>
              <button class="btn btn-sm btn-outline" onclick="App.navigate('quiz');setTimeout(()=>Quiz.startOverallQuiz(),200)">Take Final Quiz</button>
            </div>
          `}
        `}
      </div>
    `;
  }

  /* ── Main render function ── */
  function renderRoadmap() {
    const list = document.getElementById('roadmap-list');
    if (!list) return;

    const progress = Storage.getProgress();
    const subjects = ['mathematics','science','english','history','programming','aiml','fullstack'];
    let html = '';

    subjects.forEach(sub => {
      const meta = META[sub];
      const studiedSubs = Storage.getStudiedSubCourses(sub);
      const done = progress[sub]?.lessons || {};

      if (studiedSubs.length === 0) {
        // No sub-courses studied yet — show generic card
        const genericTopics = GENERIC_TOPICS[sub] || [];
        html += buildRoadmapCard(sub, meta, genericTopics, done, meta.label, '');
      } else {
        // One card per studied sub-course
        html += studiedSubs.map(sc => {
          const scTopics = SUB_TOPICS[sub]?.[sc];
          if (!scTopics) return ''; // Skip invalid/migrated entries
          
          const scName   = SUB_NAMES[sc] || sc;
          const scBadge  = '<span class="rm-lang-badge" style="background:' + meta.color + '22;color:' + meta.color + ';border:1px solid ' + meta.color + '44;padding:2px 10px;border-radius:12px;font-size:0.78rem;margin-left:8px;font-weight:600;">' + (SUB_ICONS[sc] || '📚') + ' ' + scName + '</span>';
          return buildRoadmapCard(sub, meta, scTopics, done, meta.label, scBadge, sc);
        }).join('');
      }
    });

    list.innerHTML = html;
  }

  // ── Topic navigation (with optional sub-course) ─────────────
  function goToTopic(subject, topic, subCourse) {
    App.navigate('learn');
    setTimeout(() => {
      Learning.selectSubject(subject);
      if (subCourse) {
        setTimeout(() => {
          Learning.selectSubCourse(subject, subCourse);
          setTimeout(() => Learning.startLesson(topic), 350);
        }, 200);
      } else {
        setTimeout(() => Learning.startLesson(topic), 350);
      }
    }, 150);
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  return { init, renderRoadmap, renderWeeklySchedule, renderSuggestions, handleSuggestion, goToTopic };
})();
