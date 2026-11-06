/* ============================================================
   EDULEARN — Firebase Configuration & Database Module
   Uses compat CDN (global firebase namespace)
   ============================================================ */
const FirebaseDB = (() => {
  /* ── Firebase Configuration ─────────────────────────────────
     TODO: Fill in your Firebase project credentials from
     Firebase Console → Project Settings → Your apps → Web app
     ─────────────────────────────────────────────────────────── */
  const firebaseConfig = {
    apiKey: "AIzaSyAZiDTrrSGUXlFcm7Fxp-uivHKLokliVAc",
    authDomain: "edulearn-19e72.firebaseapp.com",
    projectId: "edulearn-19e72",
    storageBucket: "edulearn-19e72.firebasestorage.app",
    messagingSenderId: "808600959892",
    appId: "1:808600959892:web:a3630630a43cafeb82ed81",
    measurementId: "G-H860VD2Y1L"
  };

  let db = null;
  let auth = null;
  let ready = false;
  let currentUID = null;

  function init() {
    try {
      if (!firebaseConfig.apiKey || typeof firebase === 'undefined') {
        console.log('ℹ️ Firebase not configured — running in offline mode');
        return;
      }
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      auth = firebase.auth();
      ready = true;
      console.log('🔥 Firebase initialized successfully');
    } catch (e) {
      console.warn('Firebase init skipped:', e.message);
    }
  }

  function isReady() { return ready; }
  function getAuth() { return auth; }
  function getDB() { return db; }
  function getUID() { return currentUID; }
  function setUID(uid) { currentUID = uid; }

  // ── Generic Firestore helpers ─────────────────────────────
  async function setDoc(path, data) {
    if (!ready || !currentUID) return;
    try {
      await db.doc(path).set(data, { merge: true });
    } catch (e) { console.warn('Firestore write error:', e.message); }
  }

  async function getDoc(path) {
    if (!ready || !currentUID) return null;
    try {
      const doc = await db.doc(path).get();
      return doc.exists ? doc.data() : null;
    } catch (e) { console.warn('Firestore read error:', e.message); return null; }
  }

  // ── User-scoped data paths ────────────────────────────────
  function userPath(sub) { return `users/${currentUID}/${sub}`; }

  async function saveUserProfile(data) {
    await setDoc(`users/${currentUID}`, data);
  }
  async function loadUserProfile() {
    return getDoc(`users/${currentUID}`);
  }

  async function saveProgress(progress) {
    await setDoc(userPath('data/progress'), progress);
  }
  async function loadProgress() {
    return getDoc(userPath('data/progress'));
  }

  async function saveQuizHistory(history) {
    await setDoc(userPath('data/quizHistory'), { items: history });
  }
  async function loadQuizHistory() {
    const d = await getDoc(userPath('data/quizHistory'));
    return d ? d.items : null;
  }

  async function saveActivity(activity) {
    await setDoc(userPath('data/activity'), { items: activity });
  }
  async function loadActivity() {
    const d = await getDoc(userPath('data/activity'));
    return d ? d.items : null;
  }

  async function saveSettings(settings) {
    await setDoc(userPath('data/settings'), settings);
  }
  async function loadSettings() {
    return getDoc(userPath('data/settings'));
  }

  async function saveAssessment(assessmentData) {
    await setDoc(userPath('data/assessment'), assessmentData);
  }
  async function loadAssessment() {
    return getDoc(userPath('data/assessment'));
  }

  async function saveAskedQuestions(asked) {
    await setDoc(userPath('data/askedQuestions'), { items: asked });
  }
  async function loadAskedQuestions() {
    const d = await getDoc(userPath('data/askedQuestions'));
    return d ? d.items : null;
  }

  // ── Full sync: localStorage → Firestore ───────────────────
  async function pushAllData() {
    if (!ready || !currentUID) return;
    try {
      const user = Storage.getUser();
      if (user) await saveUserProfile(user);
      await saveProgress(Storage.getProgress());
      await saveQuizHistory(Storage.getQuizHistory());
      await saveActivity(Storage.getActivity());
      await saveSettings(Storage.getSettings());
      
      const askedStr = localStorage.getItem('edulearn_asked_questions');
      if (askedStr) {
        await saveAskedQuestions(JSON.parse(askedStr));
      }
      
      const assessmentStr = localStorage.getItem('edulearn_assessment');
      if (assessmentStr) {
        await saveAssessment(JSON.parse(assessmentStr));
      }
    } catch (e) { console.warn('Push sync error:', e.message); }
  }

  // ── Full sync: Firestore → localStorage ───────────────────
  async function pullAllData() {
    if (!ready || !currentUID) return;
    try {
      const profile = await loadUserProfile();
      if (profile) {
        const local = Storage.getUser();
        Storage.setUser({ ...local, ...profile });
      }
      const progress = await loadProgress();
      if (progress) Storage.setProgress(progress);

      const hist = await loadQuizHistory();
      if (hist) {
        try { localStorage.setItem('edulearn_quiz_history', JSON.stringify(hist)); } catch (e) { }
      }
      const act = await loadActivity();
      if (act) {
        try { localStorage.setItem('edulearn_activity', JSON.stringify(act)); } catch (e) { }
      }
      const settings = await loadSettings();
      if (settings) Storage.setSettings(settings);
      
      const asked = await loadAskedQuestions();
      if (asked) {
        try { localStorage.setItem('edulearn_asked_questions', JSON.stringify(asked)); } catch (e) { }
      }
      
      const assessment = await loadAssessment();
      if (assessment) {
        try { localStorage.setItem('edulearn_assessment', JSON.stringify(assessment)); } catch (e) { }
      }
    } catch (e) { console.warn('Pull sync error:', e.message); }
  }

  // ── Firebase Auth helpers ─────────────────────────────────
  async function signInWithGoogle() {
    if (!ready) return null;
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    currentUID = result.user.uid;
    return result.user;
  }

  async function signInWithEmail(email, password) {
    if (!ready) return null;
    const result = await auth.signInWithEmailAndPassword(email, password);
    currentUID = result.user.uid;
    return result.user;
  }

  async function createWithEmail(email, password) {
    if (!ready) return null;
    const result = await auth.createUserWithEmailAndPassword(email, password);
    currentUID = result.user.uid;
    return result.user;
  }

  async function signOut() {
    if (!ready) return;
    try { await auth.signOut(); } catch (e) { }
    currentUID = null;
  }

  // ── Background sync (call after any data mutation) ────────
  function syncInBackground() {
    if (!ready || !currentUID) return;
    setTimeout(() => pushAllData(), 500);
  }

  return {
    init, isReady, getAuth, getDB, getUID, setUID,
    saveUserProfile, loadUserProfile,
    saveProgress, loadProgress,
    saveQuizHistory, loadQuizHistory,
    saveActivity, loadActivity,
    saveSettings, loadSettings,
    saveAssessment, loadAssessment,
    saveAskedQuestions, loadAskedQuestions,
    pushAllData, pullAllData,
    signInWithGoogle, signInWithEmail, createWithEmail, signOut,
    syncInBackground,
  };
})();
