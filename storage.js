/* ============================================================
   EDULEARN — Storage Module
   Handles all localStorage persistence
   ============================================================ */
const Storage = (() => {
  const KEYS = {
    USER: 'edulearn_user',
    PROGRESS: 'edulearn_progress',
    QUIZ_HISTORY: 'edulearn_quiz_history',
    ACTIVITY: 'edulearn_activity',
    SETTINGS: 'edulearn_settings',
    CHAT: 'edulearn_chat',
    API_KEY: 'edulearn_api_key',
    THEME: 'edulearn_theme',
    STREAK: 'edulearn_streak',
    PROG_LANG: 'edulearn_prog_lang',
    STUDIED_LANGS: 'edulearn_studied_langs',
    STUDIED_SUBS: 'edulearn_studied_subs',
  };

  function get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }
  function set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) { console.error('Storage error', e); }
  }
  function remove(key) { localStorage.removeItem(key); }

  function getUser() { return get(KEYS.USER); }
  function setUser(user) {
    if (user === null) { localStorage.removeItem(KEYS.USER); return; }
    set(KEYS.USER, user);
  }

  // --- Progress ---
  function getProgress() {
    return get(KEYS.PROGRESS) || {
      mathematics: { lessons: {}, quizScores: [] },
      science: { lessons: {}, quizScores: [] },
      english: { lessons: {}, quizScores: [] },
      history: { lessons: {}, quizScores: [] },
      programming: { lessons: {}, quizScores: [] },
      aiml: { lessons: {}, quizScores: [] },
      fullstack: { lessons: {}, quizScores: [] },
    };
  }
  function setProgress(p) { set(KEYS.PROGRESS, p); }
  function markLessonComplete(subject, topic) {
    const p = getProgress();
    if (!p[subject]) p[subject] = { lessons: {}, quizScores: [] };
    p[subject].lessons[topic] = { completed: true, completedAt: Date.now() };
    setProgress(p);
    if (typeof FirebaseDB !== 'undefined') FirebaseDB.syncInBackground();
  }
  function addQuizScore(subject, score, total, topic) {
    const p = getProgress();
    if (!p[subject]) p[subject] = { lessons: {}, quizScores: [] };
    p[subject].quizScores.push({ score, total, topic, timestamp: Date.now() });
    setProgress(p);
  }
  function getLessonCount() {
    const p = getProgress();
    return Object.values(p).reduce((acc, sub) => acc + Object.keys(sub.lessons || {}).length, 0);
  }
  function getAvgScore() {
    const p = getProgress();
    let total = 0, count = 0;
    Object.values(p).forEach(sub => {
      (sub.quizScores || []).forEach(q => { total += (q.score / q.total) * 100; count++; });
    });
    return count ? Math.round(total / count) : 0;
  }
  function getSubjectScores() {
    const p = getProgress();
    const result = {};
    Object.entries(p).forEach(([sub, data]) => {
      const scores = data.quizScores || [];
      if (scores.length) {
        const avg = scores.reduce((a, s) => a + (s.score / s.total) * 100, 0) / scores.length;
        result[sub] = Math.round(avg);
      } else {
        result[sub] = 0;
      }
    });
    return result;
  }
  function getSubjectProgress(subject) {
    const p = getProgress();
    const sub = p[subject] || { lessons: {}, quizScores: [] };
    const lessonsDone = Object.keys(sub.lessons).length;
    const totalLessons = 10; // per subject
    return Math.min(Math.round((lessonsDone / totalLessons) * 100), 100);
  }
  function getWeakAreas() {
    const scores = getSubjectScores();
    return Object.entries(scores)
      .filter(([,s]) => s > 0)
      .sort(([,a],[,b]) => a - b)
      .slice(0, 3)
      .map(([sub, score]) => ({ subject: sub, score }));
  }
  function getStrongestSubject() {
    const scores = getSubjectScores();
    const filtered = Object.entries(scores).filter(([,s]) => s > 0);
    if (!filtered.length) return 'Not enough data';
    return filtered.sort(([,a],[,b]) => b - a)[0][0];
  }

  // --- Quiz History ---
  function getQuizHistory() { return get(KEYS.QUIZ_HISTORY) || []; }
  function addQuizResult(result) {
    const h = getQuizHistory();
    h.unshift({ ...result, timestamp: Date.now() });
    set(KEYS.QUIZ_HISTORY, h.slice(0, 20));
    addQuizScore(result.subject, result.correct, result.total, result.topic);
  }
  function getQuizCount() { return getQuizHistory().length; }

  // --- Activity ---
  function getActivity() { return get(KEYS.ACTIVITY) || []; }
  function addActivity(item) {
    const a = getActivity();
    a.unshift({ ...item, timestamp: Date.now() });
    set(KEYS.ACTIVITY, a.slice(0, 30));
  }

  // --- Settings ---
  function getSettings() {
    return get(KEYS.SETTINGS) || { tts: true, grade: '10', name: '' };
  }
  function setSettings(s) { set(KEYS.SETTINGS, s); }

  // --- API Key ---
  function getApiKey() {
    const adminKey = window.ADMIN_GEMINI_API_KEY;
    if (adminKey && adminKey !== "YOUR_GEMINI_API_KEY_HERE" && adminKey.trim() !== "") {
      return adminKey;
    }
    return localStorage.getItem(KEYS.API_KEY) || '';
  }
  function setApiKey(key) { localStorage.setItem(KEYS.API_KEY, key); }

  // --- Theme ---
  function getTheme() { return localStorage.getItem(KEYS.THEME) || 'dark'; }
  function setTheme(t) { localStorage.setItem(KEYS.THEME, t); }

  // --- Streak ---
  function getStreak() { return get(KEYS.STREAK) || { count: 0, lastDate: null }; }
  function updateStreak() {
    const s = getStreak();
    const today = new Date().toDateString();
    if (s.lastDate === today) return s.count;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (s.lastDate === yesterday) {
      s.count += 1;
    } else {
      s.count = 1;
    }
    s.lastDate = today;
    set(KEYS.STREAK, s);
    return s.count;
  }

  // --- Weekly Data ---
  function getWeeklyData() {
    const activity = getActivity();
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const counts = new Array(7).fill(0);
    activity.forEach(a => {
      const d = new Date(a.timestamp).getDay();
      counts[d]++;
    });
    return { labels: days, data: counts };
  }

  // --- Study Time ---
  function getTotalStudyTime() {
    const lessons = getLessonCount();
    const quizzes = getQuizCount();
    return Math.round((lessons * 8 + quizzes * 5) / 60 * 10) / 10;
  }

  // --- Reset ---
  function resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }

  // --- Programming Language ---
  function getProgLang() { return localStorage.getItem(KEYS.PROG_LANG) || null; }
  function setProgLang(lang) { localStorage.setItem(KEYS.PROG_LANG, lang); }

  // --- Studied Languages (tracks ALL languages the user has explored) ---
  function getStudiedLangs() { return get(KEYS.STUDIED_LANGS) || []; }
  function addStudiedLang(lang) {
    const langs = getStudiedLangs();
    if (!langs.includes(lang)) {
      langs.push(lang);
      set(KEYS.STUDIED_LANGS, langs);
    }
  }

  // --- Studied Sub-courses (generic for ALL subjects) ---
  function getStudiedSubCourses(subject) {
    const all = get(KEYS.STUDIED_SUBS) || {};
    return all[subject] || [];
  }
  function addStudiedSubCourse(subject, subCourse) {
    const all = get(KEYS.STUDIED_SUBS) || {};
    if (!all[subject]) all[subject] = [];
    if (!all[subject].includes(subCourse)) {
      all[subject].push(subCourse);
      set(KEYS.STUDIED_SUBS, all);
    }
    // Also update programming-specific storage for back-compat
    if (subject === 'programming') addStudiedLang(subCourse);
  }

  // --- Asked Questions Tracking (non-repeatable quizzes) ---
  function getAskedQuestions(subject) {
    const all = get('edulearn_asked_questions') || {};
    return all[subject] || [];
  }
  function addAskedQuestion(subject, questionHash) {
    const all = get('edulearn_asked_questions') || {};
    if (!all[subject]) all[subject] = [];
    if (!all[subject].includes(questionHash)) {
      all[subject].push(questionHash);
      // Keep only last 200 per subject
      if (all[subject].length > 200) all[subject] = all[subject].slice(-200);
      set('edulearn_asked_questions', all);
    }
  }
  function clearAskedQuestions(subject) {
    const all = get('edulearn_asked_questions') || {};
    if (subject) { all[subject] = []; }
    set('edulearn_asked_questions', all);
  }

  return {
    getUser, setUser,
    getProgress, setProgress, markLessonComplete, addQuizScore,
    getLessonCount, getAvgScore, getSubjectScores, getSubjectProgress,
    getWeakAreas, getStrongestSubject,
    getQuizHistory, addQuizResult, getQuizCount,
    getActivity, addActivity,
    getSettings, setSettings,
    getApiKey, setApiKey,
    getTheme, setTheme,
    getStreak, updateStreak,
    getWeeklyData,
    getTotalStudyTime,
    getProgLang, setProgLang,
    getStudiedLangs, addStudiedLang,
    getStudiedSubCourses, addStudiedSubCourse,
    getAskedQuestions, addAskedQuestion, clearAskedQuestions,
    resetAll,
  };
})();
