/* ============================================================
   EDULEARN — Learning Module (with Topic Quiz & Next Topic Flow)
   ============================================================ */
const Learning = (() => {
  // ── Sub-course topics for EVERY subject ─────────────────────
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

  // Back-compat aliases
  const PROG_TOPICS = SUB_TOPICS.programming;

  // Fallback generic topics (not really used anymore, kept for safety)
  const TOPICS = {
    mathematics: [], science: [], english: [], history: [],
    programming: [], aiml: [], fullstack: [],
  };

  const SUBJECT_ICONS = { mathematics:'🔢', science:'🔬', english:'📖', history:'🏛️', programming:'💻', aiml:'🤖', fullstack:'🚀' };

  // Sub-course display metadata
  const SUB_NAMES = {
    // Mathematics
    algebra:'Algebra', geometry:'Geometry', calculus:'Calculus', statistics:'Statistics', trigonometry:'Trigonometry',
    // Science
    physics:'Physics', chemistry:'Chemistry', biology:'Biology',
    // English
    literature:'Literature', grammar:'Grammar', writing:'Writing',
    // History
    ancient:'Ancient History', medieval:'Medieval History', modern:'Modern History',
    // AI & ML
    machine_learning:'Machine Learning', deep_learning:'Deep Learning', nlp:'Natural Language Processing',
    // Full Stack
    frontend:'Frontend Dev', backend:'Backend Dev', devops:'DevOps & Deployment',
    // Programming
    python:'Python', javascript:'JavaScript', java:'Java', cpp:'C / C++', html:'HTML & CSS', sql:'SQL', r:'R Language',
  };
  const SUB_ICONS = {
    algebra:'📐', geometry:'📏', calculus:'∫', statistics:'📊', trigonometry:'📈',
    physics:'⚛️', chemistry:'🧪', biology:'🧬',
    literature:'📖', grammar:'✏️', writing:'🖊️',
    ancient:'🏺', medieval:'⚔️', modern:'🌍',
    machine_learning:'🧠', deep_learning:'🧪', nlp:'💬',
    frontend:'🎨', backend:'⚙️', devops:'☁️',
    python:'🐍', javascript:'🌐', java:'☕', cpp:'⚙️', html:'🎨', sql:'🗄️', r:'📊',
  };
  const SUB_TAGS = {
    algebra:'Core', geometry:'Core', calculus:'Advanced', statistics:'Applied', trigonometry:'Core',
    physics:'Core', chemistry:'Core', biology:'Core',
    literature:'Core', grammar:'Core', writing:'Applied',
    ancient:'Foundational', medieval:'Intermediate', modern:'Contemporary',
    machine_learning:'Core', deep_learning:'Advanced', nlp:'Advanced',
    frontend:'Core', backend:'Core', devops:'Advanced',
    python:'Beginner Friendly', javascript:'Intermediate', java:'Intermediate', cpp:'Advanced', html:'Beginner Friendly', sql:'Beginner Friendly', r:'Intermediate',
  };

  // Offline sample questions per subject (used when no API key)
  const OFFLINE_QUESTIONS = {
    mathematics: [
      { question:"What is the derivative of x²?", options:["x","2x","x²","2"], correct:1, explanation:"Power rule: d/dx(xⁿ)=nxⁿ⁻¹, so d/dx(x²)=2x." },
      { question:"Solve: 2x + 5 = 15", options:["x=3","x=5","x=7","x=10"], correct:1, explanation:"2x=10, so x=5." },
      { question:"What is the value of π?", options:["2.14","3.14","4.14","1.14"], correct:1, explanation:"Pi ≈ 3.14159." },
      { question:"Area of a circle with radius 7?", options:["49π","14π","7π","21π"], correct:0, explanation:"Area=πr²=49π." },
      { question:"What is 15% of 200?", options:["20","25","30","35"], correct:2, explanation:"0.15×200=30." },
      { question:"What is the quadratic formula?", options:["x=(-b±√(b²-4ac))/2a","x=b/a","x=-b/a","x=√b/a"], correct:0, explanation:"The quadratic formula solves ax²+bx+c=0." },
      { question:"sin(90°) equals?", options:["0","1","-1","0.5"], correct:1, explanation:"sin(90°)=1 by definition." },
      { question:"What is the slope formula?", options:["m=(y₂-y₁)/(x₂-x₁)","m=x/y","m=y+x","m=(x₂-x₁)/(y₂-y₁)"], correct:0, explanation:"Slope m=(Δy)/(Δx)." },
      { question:"Factorial of 5?", options:["20","60","120","24"], correct:2, explanation:"5!=5×4×3×2×1=120." },
      { question:"What is the Pythagorean theorem?", options:["a+b=c","a²+b²=c²","a²-b²=c","ab=c²"], correct:1, explanation:"In a right triangle, a²+b²=c²." },
      { question:"A prime number is divisible by?", options:["1 and itself","2 only","any number","itself only"], correct:0, explanation:"Primes are only divisible by 1 and themselves." },
      { question:"What is the GCF of 12 and 18?", options:["3","6","9","12"], correct:1, explanation:"GCF(12,18)=6." },
      { question:"What is 2³?", options:["6","8","9","16"], correct:1, explanation:"2³=2×2×2=8." },
      { question:"Sum of angles in a triangle?", options:["90°","180°","270°","360°"], correct:1, explanation:"Interior angles of a triangle always sum to 180°." },
      { question:"What is the median of [3,5,7,9,11]?", options:["5","7","9","3"], correct:1, explanation:"The middle value in sorted order is 7." },
    ],
    science: [
      { question:"What is photosynthesis?", options:["Breaking down food","Making food using sunlight","Breathing","Reproduction"], correct:1, explanation:"Plants use sunlight, CO₂ and water to make glucose." },
      { question:"Newton's First Law?", options:["F=ma","Law of inertia","Action-reaction","Law of gravity"], correct:1, explanation:"Objects remain at rest/motion unless a force acts on them." },
      { question:"Chemical formula for water?", options:["CO₂","H₂O","O₂","NaCl"], correct:1, explanation:"Water = 2 hydrogen + 1 oxygen." },
      { question:"Powerhouse of the cell?", options:["Nucleus","Ribosome","Mitochondria","Chloroplast"], correct:2, explanation:"Mitochondria produce ATP via cellular respiration." },
      { question:"Speed of light?", options:["3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s","3×10⁴ m/s"], correct:1, explanation:"~3×10⁸ m/s in vacuum." },
      { question:"What gas do plants absorb in photosynthesis?", options:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], correct:2, explanation:"Plants absorb CO₂ during photosynthesis." },
      { question:"Unit of electric current?", options:["Volt","Watt","Ampere","Ohm"], correct:2, explanation:"Electric current is measured in Amperes (A)." },
      { question:"DNA stands for?", options:["Deoxyribonucleic Acid","Diribonucleic Acid","Dynamic Nuclear Acid","Double Nuclear Acid"], correct:0, explanation:"DNA = Deoxyribonucleic Acid." },
      { question:"Which planet is closest to the Sun?", options:["Venus","Mars","Mercury","Earth"], correct:2, explanation:"Mercury is the closest planet to the Sun." },
      { question:"What does a herbivore eat?", options:["Meat","Plants","Both","Insects"], correct:1, explanation:"Herbivores eat only plants." },
      { question:"Boiling point of water at sea level?", options:["90°C","95°C","100°C","105°C"], correct:2, explanation:"Water boils at 100°C (212°F) at sea level." },
      { question:"Atomic number of Carbon?", options:["4","6","8","12"], correct:1, explanation:"Carbon has atomic number 6." },
      { question:"Newton's Second Law?", options:["F=ma","Every action has reaction","Objects at rest stay at rest","Energy cannot be created"], correct:0, explanation:"F=ma: Force equals mass times acceleration." },
      { question:"What is the nucleus of an atom made of?", options:["Electrons","Protons & Neutrons","Quarks only","Photons"], correct:1, explanation:"The nucleus contains protons and neutrons." },
      { question:"What type of wave is light?", options:["Mechanical","Transverse","Longitudinal","Sound"], correct:1, explanation:"Light is an electromagnetic transverse wave." },
    ],
    english: [
      { question:"What is a metaphor?", options:["Comparison using 'like'/'as'","Direct comparison","Repetition of sounds","Exaggeration"], correct:1, explanation:"Metaphor: direct comparison without 'like' or 'as'." },
      { question:"Past tense of 'go'?", options:["Goed","Went","Gone","Goes"], correct:1, explanation:"'Went' is the irregular past tense of 'go'." },
      { question:"Protagonist means?", options:["The villain","Main character","Supporting character","The narrator"], correct:1, explanation:"Protagonist = main character/hero." },
      { question:"'The wind whispered' is?", options:["Alliteration","Metaphor","Personification","Simile"], correct:2, explanation:"Giving human qualities to non-human things = Personification." },
      { question:"What is an adjective?", options:["Action word","Naming word","Describing word","Connecting word"], correct:2, explanation:"Adjective describes or modifies a noun." },
      { question:"What is a simile?", options:["Comparison using 'like' or 'as'","Direct comparison","Sound repetition","Exaggeration"], correct:0, explanation:"Simile uses 'like' or 'as': 'fast as lightning'." },
      { question:"What is the plural of 'mouse'?", options:["Mouses","Mice","Mouse","Mooses"], correct:1, explanation:"Irregular plural: mouse → mice." },
      { question:"What is hyperbole?", options:["Comparing two things","Extreme exaggeration","Giving life to objects","Sound imitation"], correct:1, explanation:"Hyperbole = extreme overstatement for emphasis." },
      { question:"What is the subject in: 'The dog runs fast'?", options:["fast","runs","The dog","dog runs"], correct:2, explanation:"'The dog' is the subject performing the action." },
      { question:"Antonym of 'happy'?", options:["Glad","Joyful","Sad","Excited"], correct:2, explanation:"Antonym = opposite. Opposite of happy is sad." },
      { question:"What is alliteration?", options:["Repetition of initial consonant sounds","Rhyming words","Opposite words","Long description"], correct:0, explanation:"Alliteration repeats the same starting consonant sound." },
      { question:"Shakespeare wrote?", options:["Oliver Twist","Romeo and Juliet","Pride and Prejudice","Jane Eyre"], correct:1, explanation:"Romeo and Juliet is Shakespeare's famous play." },
      { question:"A word that sounds like what it describes?", options:["Metaphor","Simile","Onomatopoeia","Alliteration"], correct:2, explanation:"Onomatopoeia: buzz, hiss, crash — words that imitate sounds." },
      { question:"What is a verb?", options:["Describing word","Action/state word","Naming word","Connecting word"], correct:1, explanation:"A verb expresses action or state of being." },
      { question:"What is a synonym?", options:["Opposite word","Same/similar meaning word","Rhyming word","Derived word"], correct:1, explanation:"Synonym = word with same or similar meaning." },
    ],
    history: [
      { question:"When did World War II end?", options:["1943","1944","1945","1946"], correct:2, explanation:"WWII ended in 1945." },
      { question:"First US President?", options:["Lincoln","Jefferson","Washington","Adams"], correct:2, explanation:"George Washington was first President (1789-1797)." },
      { question:"India's independence year?", options:["1945","1947","1950","1942"], correct:1, explanation:"India gained independence August 15, 1947." },
      { question:"Magna Carta was signed by?", options:["King John","Henry VIII","Cromwell","William the Conqueror"], correct:0, explanation:"King John signed the Magna Carta in 1215." },
      { question:"What was the Renaissance?", options:["Industrial revolution","Cultural rebirth in Europe","A war","Scientific discovery"], correct:1, explanation:"Renaissance = cultural and intellectual revival in Europe." },
      { question:"French Revolution began in?", options:["1776","1789","1799","1815"], correct:1, explanation:"The French Revolution began in 1789." },
      { question:"First man on the Moon?", options:["Buzz Aldrin","Yuri Gagarin","Neil Armstrong","John Glenn"], correct:2, explanation:"Neil Armstrong was first to walk on the Moon in 1969." },
      { question:"World War I started in?", options:["1912","1914","1916","1918"], correct:1, explanation:"WWI started in 1914 after Archduke Franz Ferdinand's assassination." },
      { question:"Who was Napoleon Bonaparte?", options:["British king","French emperor","Russian czar","Italian general"], correct:1, explanation:"Napoleon was Emperor of France from 1804 to 1815." },
      { question:"Ancient Rome's famous structure?", options:["Eiffel Tower","Colosseum","Parthenon","Big Ben"], correct:1, explanation:"The Colosseum is Rome's iconic amphitheater." },
      { question:"Cold War was between?", options:["US and China","USSR and UK","US and USSR","Germany and Japan"], correct:2, explanation:"Cold War: US (capitalism) vs USSR (communism), 1947-1991." },
      { question:"Industrial Revolution started in?", options:["France","USA","Britain","Germany"], correct:2, explanation:"Industrial Revolution began in Britain in the 1760s." },
      { question:"Martin Luther King Jr was famous for?", options:["Scientific discoveries","Civil rights movement","Military leadership","Political revolution"], correct:1, explanation:"MLK led the American Civil Rights Movement." },
      { question:"The Berlin Wall fell in?", options:["1987","1988","1989","1991"], correct:2, explanation:"The Berlin Wall fell on November 9, 1989." },
      { question:"Ancient Egypt is known for?", options:["Pyramids & Pharaohs","Democracy","Renaissance art","Colonialism"], correct:0, explanation:"Ancient Egypt is famous for pyramids, pharaohs, and hieroglyphs." },
    ],
    programming: [
      { question:"HTML stands for?", options:["Hyper Text Machine Language","Hyper Text Markup Language","High Text Markup Language","Hyper Transfer Markup Language"], correct:1, explanation:"HTML = HyperText Markup Language." },
      { question:"JavaScript framework?", options:["Django","Flask","React","Laravel"], correct:2, explanation:"React is a JavaScript UI library by Facebook." },
      { question:"What is a variable?", options:["A function","Named storage location","A loop","A condition"], correct:1, explanation:"Variable = named storage that holds a value." },
      { question:"CSS stands for?", options:["Computer Style Sheets","Cascading Style Sheets","Creative Style System","Coded Style Sheets"], correct:1, explanation:"CSS = Cascading Style Sheets." },
      { question:"What is a loop?", options:["A data type","Infinite code","Repeating code block","A function"], correct:2, explanation:"Loops repeat a block of code multiple times." },
      { question:"What does 'if' statement do?", options:["Loops code","Makes decisions","Defines functions","Imports libraries"], correct:1, explanation:"'if' executes code only when a condition is true." },
      { question:"Python is?", options:["Only a snake","A programming language","An operating system","A database"], correct:1, explanation:"Python is a high-level programming language." },
      { question:"What is a function?", options:["A variable","Reusable block of code","A loop","A data type"], correct:1, explanation:"Functions are reusable blocks of code." },
      { question:"What does SQL stand for?", options:["Structured Query Language","Simple Query Language","System Query Logic","Structured Quick Language"], correct:0, explanation:"SQL = Structured Query Language for databases." },
      { question:"Which symbol is used for comments in Python?", options:["//","/*","#","--"], correct:2, explanation:"In Python, # is used for single-line comments." },
      { question:"What is an array?", options:["A single variable","Collection of values","A condition","A loop type"], correct:1, explanation:"An array stores multiple values in a single variable." },
      { question:"What is OOP?", options:["Online Open Program","Object Oriented Programming","Ordered Output Processing","Output Only Program"], correct:1, explanation:"OOP organizes code using objects and classes." },
      { question:"What does '==' do in programming?", options:["Assigns a value","Compares for equality","Checks type","Adds values"], correct:1, explanation:"'==' compares if two values are equal." },
      { question:"What is a class in OOP?", options:["A variable","A blueprint for objects","A function","A module"], correct:1, explanation:"A class is a template/blueprint for creating objects." },
      { question:"What is the internet protocol for web pages?", options:["FTP","SMTP","HTTP","SSH"], correct:2, explanation:"HTTP (HyperText Transfer Protocol) is used for web pages." },
    ],
  };

  let currentSubject    = null;
  let currentLang       = null;   // kept for back-compat (programming)
  let currentSubCourse  = null;   // generalized sub-course key
  let currentDifficulty = 'intermediate';
  let currentTopic      = null;
  let currentSpeech     = null;

  // Topic Quiz State
  let tqQuestions   = [];
  let tqIndex       = 0;
  let tqScore       = 0;
  let tqAnswered    = false;
  let tqAnswersLog  = [];
  let tqState       = 'idle'; // 'loading' | 'active' | 'results'
  let tqSelectedIndex = -1;

  // ── Subject card click ─────────────────────────────────────
  function selectSubject(subject) {
    currentSubject = subject;
    hide('learn-subjects');
    hide('learn-language');
    hide('learn-topics');
    hide('learn-lesson');

    // ALL subjects now show a sub-course picker
    renderSubCoursePicker(subject);
    show('learn-language');
  }

  // ── Render sub-course picker (generic for all subjects) ────
  function renderSubCoursePicker(subject) {
    const headerEl = document.querySelector('#learn-language .topics-header h2');
    const descEl   = document.querySelector('#learn-language .topics-header p');
    const gridEl   = document.getElementById('lang-grid');
    if (!gridEl) return;

    const subCourses = SUB_TOPICS[subject] || {};
    let subjectLabel = capitalize(subject);
    if (subject === 'aiml') subjectLabel = 'AI & Machine Learning';
    if (subject === 'fullstack') subjectLabel = 'Full Stack Web Dev';
    
    if (headerEl) headerEl.textContent = `${SUBJECT_ICONS[subject] || '📚'} Choose a ${subjectLabel} Course`;
    if (descEl)   descEl.textContent   = `Select the ${subjectLabel} track you want to study`;

    gridEl.innerHTML = Object.keys(subCourses).map(key => {
      const name = SUB_NAMES[key] || capitalize(key);
      const icon = SUB_ICONS[key] || '📚';
      const tag  = SUB_TAGS[key]  || '';
      const tagClass = tag.includes('Beginner') || tag === 'Core' || tag === 'Foundational' ? 'beginner'
                     : tag.includes('Advanced') ? 'advanced' : 'intermediate';
      return `<div class="lang-card glass-card" onclick="Learning.selectSubCourse('${subject}','${key}')">
        <div class="lang-icon">${icon}</div>
        <h3>${name}</h3>
        <p>${subCourses[key].length} topics</p>
        <span class="lang-tag ${tagClass}">${tag}</span>
      </div>`;
    }).join('');
  }

  // ── Sub-course selection (works for ANY subject) ────────────
  function selectSubCourse(subject, subCourse) {
    currentSubject   = subject;
    currentSubCourse = subCourse;
    // Back-compat for programming
    if (subject === 'programming') {
      currentLang = subCourse;
      Storage.setProgLang(subCourse);
    }
    Storage.addStudiedSubCourse(subject, subCourse);
    const backBtn = document.querySelector('#learn-topics .btn-back');
    if (backBtn) backBtn.onclick = backToSubCoursePicker;
    showTopics();
  }

  // Keep selectLanguage for backward compatibility (roadmap calls it)
  function selectLanguage(lang) {
    selectSubCourse('programming', lang);
  }

  function showTopics() {
    hide('learn-subjects');
    hide('learn-language');
    show('learn-topics');
    hide('learn-lesson');

    const titleEl = document.getElementById('topic-subject-title');
    if (titleEl) {
      const courseName = SUB_NAMES[currentSubCourse] || capitalize(currentSubCourse || currentSubject);
      titleEl.textContent = `${SUB_ICONS[currentSubCourse] || SUBJECT_ICONS[currentSubject] || '📚'} ${courseName}`;
    }
    renderTopics();
  }

  function renderTopics() {
    const grid = document.getElementById('topics-grid');
    if (!grid) return;
    const topics = getCurrentTopicList();
    const progress = Storage.getProgress();
    const subjectProgress = progress[currentSubject] || { lessons: {} };

    grid.innerHTML = topics.map((topic, idx) => {
      const done = !!subjectProgress.lessons[topic];
      return `<div class="topic-card glass-card card-entrance" onclick="Learning.startLesson('${esc(topic)}')">
        <div class="topic-index">${idx + 1}</div>
        <div class="topic-main">
          <div class="topic-title">${topic}</div>
          <div class="topic-meta">
            <span>${capitalize(currentDifficulty)}</span>
            <span class="topic-status ${done?'done':'pending'}">${done?'✅ Done':'⏳ Start'}</span>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // ── Back buttons ────────────────────────────────────────────
  function backToSubjects() {
    show('learn-subjects');
    hide('learn-language');
    hide('learn-topics');
    hide('learn-lesson');
    stopSpeech();
    updateSubjectProgress();
    const backBtn = document.querySelector('#learn-topics .btn-back');
    if (backBtn) backBtn.onclick = backToSubjects;
  }

  function backToSubCoursePicker() {
    hide('learn-subjects');
    renderSubCoursePicker(currentSubject);
    show('learn-language');
    hide('learn-topics');
    hide('learn-lesson');
    stopSpeech();
  }

  // Keep for backward-compat
  function backToLanguage() { backToSubCoursePicker(); }

  function backToTopics() {
    hide('learn-lesson');
    show('learn-topics');
    stopSpeech();
    renderTopics(); // refresh to show updated completion
  }

  function setDifficulty(val) { currentDifficulty = val; renderTopics(); }

  // ── Get current topic list ──────────────────────────────────
  function getCurrentTopicList() {
    if (currentSubCourse && SUB_TOPICS[currentSubject]?.[currentSubCourse]) {
      return SUB_TOPICS[currentSubject][currentSubCourse];
    }
    return TOPICS[currentSubject] || [];
  }

  // ── Start lesson ────────────────────────────────────────────
  async function startLesson(topic) {
    currentTopic = topic;
    hide('learn-topics');
    show('learn-lesson');

    // Reset lesson UI
    const titleEl    = document.getElementById('lesson-title');
    const contentEl  = document.getElementById('lesson-content');
    const completeBtn = document.getElementById('complete-btn');
    const quizBtn    = document.getElementById('topic-quiz-btn');
    const tqPanel    = document.getElementById('topic-quiz-panel');
    const tqResults  = document.getElementById('tq-results');
    const tqBody     = document.getElementById('tq-question-body');
    const tqLoading  = document.getElementById('tq-loading');

    // Reset quiz panel
    if (tqPanel) tqPanel.style.display = 'none';
    if (tqResults) tqResults.style.display = 'none';
    if (tqBody) tqBody.style.display = 'none';
    if (tqLoading) tqLoading.style.display = 'flex';
    tqState = 'idle';

    const langLabel = currentSubject === 'programming' ? ` (${currentLang.toUpperCase()})` : '';
    if (titleEl) titleEl.textContent = topic + langLabel;
    if (contentEl) contentEl.innerHTML = `<div class="lesson-loading"><div class="spinner"></div><p>AI is generating your personalized lesson...</p></div>`;

    // Check if already completed
    const progress = Storage.getProgress();
    const lessonDone = !!(progress[currentSubject]?.lessons[topic]);

    if (completeBtn) {
      completeBtn.style.display = 'inline-flex';
      if (lessonDone) {
        completeBtn.textContent = '✅ Completed!';
        completeBtn.disabled = true;
      } else {
        completeBtn.textContent = 'Mark Complete';
        completeBtn.disabled = false;
      }
    }
    if (quizBtn) quizBtn.style.display = 'none';

    const user = Storage.getUser();
    const enrichedTopic = currentSubject === 'programming' ? `${topic} in ${currentLang}` : topic;

    if (!Storage.getApiKey()) {
      contentEl.innerHTML = buildOfflineLesson(topic, currentSubject);
      return;
    }
    try {
      const level = typeof Assessment !== 'undefined' ? Assessment.getUnderstandingLevel(currentSubject) : currentDifficulty;
      const text = await Gemini.generateLesson(currentSubject, enrichedTopic, level, user);
      contentEl.innerHTML = marked.parse(text);
    } catch (err) {
      contentEl.innerHTML = (err.message==='NO_KEY' ? '' : `<div class="api-notice">⚠️ ${err.message}</div>`) + buildOfflineLesson(topic, currentSubject);
    }
  }

  function buildOfflineLesson(topic, subject) {
    return `<div class="api-notice" style="margin-bottom:16px;">💡 <span>Add your Gemini API key in <strong>Settings</strong> to get AI-personalized lessons!</span></div>
      <h2>${topic}</h2>
      <p>This is a sample lesson on <strong>${topic}</strong>. Connect your Gemini API key for fully adaptive, AI-generated content tailored to your grade and learning style.</p>
      <h3>📌 What You'll Learn</h3><ul><li>Core concepts and fundamentals</li><li>Real-world applications</li><li>Step-by-step explanations</li><li>Key terminology</li></ul>
      <h3>💡 Key Takeaway</h3><blockquote>Practice consistently and don't hesitate to ask your AI Tutor questions!</blockquote>
      <h3>🤔 Think About It</h3><p>How does <em>${topic}</em> connect to real-world scenarios you encounter daily?</p>`;
  }

  // ── Mark Complete — then auto-launch topic quiz ─────────────
  function markComplete() {
    if (!currentTopic || !currentSubject) return;
    Storage.markLessonComplete(currentSubject, currentTopic);
    Storage.addActivity({ type:'lesson', title:`Completed: ${currentTopic}`, subject:currentSubject });
    Storage.updateStreak();
    App.showToast(`✅ "${currentTopic}" marked complete! Take the topic quiz below.`, 'success');
    Confetti.fire();

    const btn = document.getElementById('complete-btn');
    if (btn) { btn.textContent = '✅ Completed!'; btn.disabled = true; }

    const quizBtn = document.getElementById('topic-quiz-btn');
    if (quizBtn) quizBtn.style.display = 'none'; // hide manual button since we auto-launch

    updateSubjectProgress();
    Dashboard.refresh();

    // Auto-launch the topic quiz
    setTimeout(() => startTopicQuiz(), 500);
  }

  // ── Next Topic navigation ───────────────────────────────────
  function goNextTopic() {
    const topics = getCurrentTopicList();
    const idx = topics.indexOf(currentTopic);
    if (idx >= 0 && idx < topics.length - 1) {
      // There's a next topic
      const nextTopic = topics[idx + 1];
      App.showToast(`📚 Loading next topic: ${nextTopic}`, 'info');
      startLesson(nextTopic);
      // Scroll back to top
      const lessonPanel = document.getElementById('learn-lesson');
      if (lessonPanel) lessonPanel.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last topic — go back to topics list
      App.showToast(`🎉 You've completed all topics! Great work!`, 'success');
      Confetti.fire();
      backToTopics();
    }
  }

  // ── Topic Quiz ──────────────────────────────────────────────
  async function startTopicQuiz() {
    if (!currentTopic || !currentSubject) return;
    tqState = 'loading';
    tqQuestions = [];
    tqIndex = 0;
    tqScore = 0;
    tqAnswered = false;
    tqAnswersLog = [];

    const tqPanel   = document.getElementById('topic-quiz-panel');
    const tqLoading = document.getElementById('tq-loading');
    const tqBody    = document.getElementById('tq-question-body');
    const tqResults = document.getElementById('tq-results');
    const tqTitle   = document.getElementById('tq-title');
    const tqFill    = document.getElementById('tq-progress-fill');
    const tqCounter = document.getElementById('tq-counter');
    const tqLive    = document.getElementById('tq-score-live');

    if (tqPanel)   { tqPanel.style.display = 'block'; tqPanel.scrollIntoView({ behavior:'smooth', block:'start' }); }
    if (tqLoading) { tqLoading.style.display = 'flex'; tqLoading.querySelector('p').textContent = 'Generating 15 quiz questions on this topic...'; }
    if (tqBody)    tqBody.style.display = 'none';
    if (tqResults) tqResults.style.display = 'none';
    if (tqTitle)   tqTitle.textContent = `📝 Quiz: ${currentTopic}`;
    if (tqFill)    tqFill.style.width = '0%';
    if (tqCounter) tqCounter.textContent = 'Question 1 of 15';
    if (tqLive)    tqLive.textContent = 'Score: 0';

    // Try AI or fallback to offline questions
    if (Storage.getApiKey()) {
      try {
        const user = Storage.getUser();
        const enrichedTopic = currentSubject === 'programming' ? `${currentTopic} in ${currentLang}` : currentTopic;
        const askedPrev = Storage.getAskedQuestions(currentSubject).slice(-60);
        const level = typeof Assessment !== 'undefined' ? Assessment.getUnderstandingLevel(currentSubject) : currentDifficulty;
        let generated = await Gemini.generateQuiz(currentSubject, enrichedTopic, level, 15, user, askedPrev);
        generated = generated.map(q => ({ ...q, explanation: q.explanation || 'Review this topic.' }));
        tqQuestions = generated.slice(0, 15);
        if (typeof hashQuestion !== 'undefined') {
          tqQuestions.forEach(q => Storage.addAskedQuestion(currentSubject, q.question));
        }
      } catch (err) {
        App.showToast('Using offline questions: ' + err.message, 'warning');
        tqQuestions = getOfflineQuestions(15);
      }
    } else {
      tqQuestions = getOfflineQuestions(15);
    }

    // Ensure we have 15 questions
    while (tqQuestions.length < 15) {
      tqQuestions = [...tqQuestions, ...tqQuestions].slice(0, 15);
    }

    tqState = 'active';
    if (tqLoading) tqLoading.style.display = 'none';
    if (tqBody)    tqBody.style.display = 'block';
    tqShowQuestion();
  }

  function getOfflineQuestions(count) {
    const pool = OFFLINE_QUESTIONS[currentSubject] || OFFLINE_QUESTIONS.mathematics;
    const shuffled = shuffleArray([...pool]);
    let result = shuffled.slice(0, count);
    if (result.length < count) {
      result = [...result, ...shuffled].slice(0, count);
    }
    return result;
  }

  function tqShowQuestion() {
    if (tqIndex >= tqQuestions.length) { tqEndQuiz(); return; }
    tqAnswered = false;
    tqSelectedIndex = -1;

    const q         = tqQuestions[tqIndex];
    const counter   = document.getElementById('tq-counter');
    const fill      = document.getElementById('tq-progress-fill');
    const questionEl= document.getElementById('tq-question');
    const optionsEl = document.getElementById('tq-options');
    const feedback  = document.getElementById('tq-feedback');
    const nextBtn   = document.getElementById('tq-next-btn');
    const submitBtn = document.getElementById('tq-submit-btn');

    if (counter)   counter.textContent  = `Question ${tqIndex + 1} of ${tqQuestions.length}`;
    if (fill)      fill.style.width     = `${(tqIndex / tqQuestions.length) * 100}%`;
    if (questionEl) questionEl.textContent = q.question;
    if (feedback)  { feedback.style.display = 'none'; feedback.textContent = ''; }
    if (nextBtn)   nextBtn.style.display   = 'none';
    if (submitBtn) submitBtn.style.display = 'none';

    const letters = ['A','B','C','D'];
    if (optionsEl) {
      optionsEl.innerHTML = q.options.map((opt, i) =>
        `<button class="quiz-option" onclick="Learning.tqSelectAnswer(${i})" id="tq-opt-${i}">
          <span class="option-letter">${letters[i]}</span>
          <span>${opt}</span>
        </button>`
      ).join('');
    }
  }

  function tqSelectAnswer(index) {
    if (tqAnswered) return;

    // Just highlight — don't grade yet
    tqSelectedIndex = index;
    const options = document.querySelectorAll('#tq-options .quiz-option');
    options.forEach((btn, i) => {
      btn.classList.toggle('selected', i === index);
    });

    // Show submit button
    const submitBtn = document.getElementById('tq-submit-btn');
    if (submitBtn) submitBtn.style.display = 'inline-flex';
  }

  function tqSubmitAnswer() {
    if (tqAnswered || tqSelectedIndex === -1) return;
    tqAnswered = true;

    const index = tqSelectedIndex;
    const q = tqQuestions[tqIndex];
    const isCorrect = index === q.correct;
    if (isCorrect) tqScore++;

    tqAnswersLog.push({
      question: q.question,
      selected: index,
      correct:  q.correct,
      options:  q.options,
      isCorrect,
      explanation: q.explanation || 'Review this topic for more details.',
    });

    // Visual feedback on buttons
    const options = document.querySelectorAll('#tq-options .quiz-option');
    options.forEach((btn, i) => {
      btn.disabled = true;
      btn.classList.remove('selected');
      if (i === q.correct) btn.classList.add('correct');
      else if (i === index && !isCorrect) btn.classList.add('wrong');
    });

    // Hide submit button
    const submitBtn = document.getElementById('tq-submit-btn');
    if (submitBtn) submitBtn.style.display = 'none';

    const feedback = document.getElementById('tq-feedback');
    if (feedback) {
      feedback.style.display = 'block';
      feedback.className     = `tq-feedback ${isCorrect ? 'correct-feedback' : 'wrong-feedback'}`;
      feedback.innerHTML     = isCorrect
        ? `✅ <strong>Correct!</strong> ${q.explanation}`
        : `❌ <strong>Incorrect.</strong> Correct answer: <strong>${q.options[q.correct]}</strong>. ${q.explanation}`;
    }

    const live = document.getElementById('tq-score-live');
    if (live) live.textContent = `Score: ${tqScore}`;

    const nextBtn = document.getElementById('tq-next-btn');
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent   = tqIndex < tqQuestions.length - 1 ? 'Next Question →' : 'See Results →';
    }
  }

  function tqNext() {
    tqIndex++;
    tqShowQuestion();
  }

  function tqEndQuiz() {
    const pct = Math.round((tqScore / tqQuestions.length) * 100);

    // Save result to storage
    Storage.addQuizResult({
      subject:    currentSubject,
      topic:      currentTopic,
      difficulty: currentDifficulty,
      correct:    tqScore,
      total:      tqQuestions.length,
      score:      pct,
      type:       'topic-quiz',
    });
    Storage.addActivity({
      type:    'quiz',
      title:   `Topic Quiz: ${currentTopic} — ${pct}%`,
      subject: currentSubject,
      score:   pct,
    });

    if (pct >= 70) Confetti.fire();
    App.showToast(`Quiz done! You scored ${pct}%`, pct >= 70 ? 'success' : 'warning');

    // Show results panel
    const tqBody    = document.getElementById('tq-question-body');
    const tqResults = document.getElementById('tq-results');
    const fill      = document.getElementById('tq-progress-fill');
    const scoreEl   = document.getElementById('tq-score-pct');
    const msgEl     = document.getElementById('tq-result-msg');
    const correctEl = document.getElementById('tq-correct');
    const wrongEl   = document.getElementById('tq-wrong');
    const answerKey = document.getElementById('tq-answer-key');
    const nextTopicBtn = document.getElementById('next-topic-btn');

    if (tqBody)    tqBody.style.display    = 'none';
    if (tqResults) tqResults.style.display = 'block';
    if (fill)      fill.style.width        = '100%';
    if (scoreEl)   scoreEl.textContent     = pct + '%';
    scoreEl?.classList.remove('score-bad','score-ok','score-good');
    scoreEl?.classList.add(pct >= 80 ? 'score-good' : pct >= 60 ? 'score-ok' : 'score-bad');
    if (msgEl)     msgEl.textContent       = pct >= 80 ? '🎉 Outstanding! You\'ve mastered this topic!' : pct >= 60 ? '👍 Good work! Review the incorrect answers.' : '💪 Keep practicing! Review the topic and try again.';
    if (correctEl) correctEl.textContent   = tqScore;
    if (wrongEl)   wrongEl.textContent     = tqQuestions.length - tqScore;

    // Update Next Topic button label
    const topics = getCurrentTopicList();
    const idx    = topics.indexOf(currentTopic);
    if (nextTopicBtn) {
      if (idx >= 0 && idx < topics.length - 1) {
        nextTopicBtn.textContent = `➡️ Next Topic: ${topics[idx + 1]}`;
        nextTopicBtn.style.display = 'inline-flex';
      } else {
        nextTopicBtn.textContent = '🎓 All Topics Done!';
        nextTopicBtn.style.display = 'inline-flex';
      }
    }

    // Render answer key
    if (answerKey) {
      const letters = ['A','B','C','D'];
      answerKey.innerHTML = `
        <div class="answer-key-header">
          <h4>📋 Answer Key</h4>
        </div>
        ${tqAnswersLog.map((a, i) => `
          <div class="answer-key-item ${a.isCorrect ? 'ak-correct' : 'ak-wrong'}">
            <div class="ak-question">
              <span class="ak-num">${i+1}</span>
              <span>${a.question}</span>
              ${a.isCorrect ? '<span class="ak-badge correct-badge">✅</span>' : '<span class="ak-badge wrong-badge">❌</span>'}
            </div>
            <div class="ak-options">
              ${a.options.map((opt, oi) => {
                let cls = '';
                if (oi === a.correct) cls = 'ak-opt-correct';
                else if (oi === a.selected && !a.isCorrect) cls = 'ak-opt-wrong';
                return `<div class="ak-opt ${cls}">
                  <span class="ak-letter">${letters[oi]}</span>
                  <span>${opt}</span>
                  ${oi === a.correct ? '<span class="ak-tick">✓</span>' : ''}
                  ${oi === a.selected && !a.isCorrect ? '<span class="ak-cross">✗</span>' : ''}
                </div>`;
              }).join('')}
            </div>
            <div class="ak-explanation">
              <span class="ak-exp-icon">💡</span>
              <span>${a.explanation}</span>
            </div>
          </div>
        `).join('')}
      `;
    }

    tqState = 'results';
    Dashboard.refresh();
  }

  function retryTopicQuiz() {
    tqIndex       = 0;
    tqScore       = 0;
    tqAnswered    = false;
    tqAnswersLog  = [];
    tqSelectedIndex = -1;
    tqQuestions   = shuffleArray(tqQuestions);

    const tqBody    = document.getElementById('tq-question-body');
    const tqResults = document.getElementById('tq-results');
    if (tqBody)    tqBody.style.display    = 'block';
    if (tqResults) tqResults.style.display = 'none';

    tqState = 'active';
    tqShowQuestion();
  }

  // ── Subject progress bars ───────────────────────────────────
  function updateSubjectProgress() {
    ['mathematics','science','english','history','programming','aiml','fullstack'].forEach(sub => {
      const pct  = Storage.getSubjectProgress(sub);
      const fill = document.getElementById(`prog-${sub}`);
      const text = document.getElementById(`prog-text-${sub}`);
      if (fill) fill.style.width  = pct + '%';
      if (text) text.textContent  = `${pct}% Complete`;
    });
  }

  // ── Text-to-Speech ──────────────────────────────────────────
  function speakLesson() {
    const content = document.getElementById('lesson-content');
    if (!content) return;
    const settings = Storage.getSettings();
    if (!settings.tts) { App.showToast('Enable TTS in Settings.', 'info'); return; }
    if (currentSpeech && speechSynthesis.speaking) {
      speechSynthesis.cancel(); currentSpeech = null;
      document.getElementById('speak-btn')?.classList.remove('active');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(content.innerText.slice(0, 3000));
    utterance.rate  = 0.9;
    utterance.onend = () => document.getElementById('speak-btn')?.classList.remove('active');
    currentSpeech   = utterance;
    speechSynthesis.speak(utterance);
    document.getElementById('speak-btn')?.classList.add('active');
  }

  function stopSpeech() { if (speechSynthesis.speaking) speechSynthesis.cancel(); currentSpeech = null; }
  function init() { updateSubjectProgress(); }

  // ── Helpers ─────────────────────────────────────────────────
  function show(id) { const el=document.getElementById(id); if(el){el.style.display=el.tagName==='DIV'?'block':''; if(id==='learn-subjects')el.style.display='grid';} }
  function hide(id) { const el=document.getElementById(id); if(el)el.style.display='none'; }
  function capitalize(s) { return s?s.charAt(0).toUpperCase()+s.slice(1):s; }
  function esc(s) { return s.replace(/'/g,"\\'"); }
  function hashQuestion(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
  }
  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── Public accessors for Roadmap ─────────────────────────────
  function getProgTopics() { return PROG_TOPICS; }
  function getSubTopics()  { return SUB_TOPICS; }
  function getSelectedLang() { return currentLang || Storage.getProgLang(); }

  return {
    selectSubject, selectLanguage, selectSubCourse,
    backToSubjects, backToLanguage, backToSubCoursePicker, backToTopics,
    setDifficulty, startLesson, markComplete, speakLesson,
    startTopicQuiz, tqSelectAnswer, tqSubmitAnswer, tqNext, retryTopicQuiz, goNextTopic,
    getProgTopics, getSubTopics, getSelectedLang,
    init,
  };
})();
