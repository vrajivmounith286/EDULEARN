/* ============================================================
   EDULEARN — Auth Module (Login + Register + Google)
   ============================================================ */
const Auth = (() => {

  // ── Show/hide tabs ──────────────────────────────────────────
  function showLogin() {
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('register-form').style.display = 'none';
    document.querySelectorAll('.auth-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
  }

  function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
    document.querySelectorAll('.auth-tab').forEach((t, i) => t.classList.toggle('active', i === 1));
  }

  // ── Login ───────────────────────────────────────────────────
  function login(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      App.showToast('Please enter your email and password.', 'error'); return;
    }

    const accounts = getAllAccounts();
    const found = accounts.find(a => a.email === email && a.password === password);

    if (!found) {
      App.showToast('Invalid email or password. Try creating an account first.', 'error');
      shake(document.querySelector('#login-form'));
      return;
    }

    const { password: _, ...safeUser } = found;
    Storage.setUser(safeUser);
    Storage.updateStreak();
    App.showToast(`Welcome back, ${safeUser.name}! 👋`, 'success');
    App.launch();
  }

  // ── Register ────────────────────────────────────────────────
  async function register(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPass = document.getElementById('reg-confirm').value;
    const grade = document.getElementById('reg-grade').value;
    const age = document.getElementById('reg-age').value;
    const learningStyle = document.getElementById('reg-learning-style').value;
    const subjects = [...document.querySelectorAll('#subject-chips input:checked')].map(c => c.value);
    const board = document.getElementById('reg-board')?.value || '';
    const branch = document.getElementById('reg-branch')?.value || '';
    const stream = document.getElementById('reg-stream')?.value || '';

    if (!name || !email || !password || !grade || !age || !learningStyle) {
      App.showToast('Please fill in all required fields.', 'error'); return;
    }
    if (password.length < 6) {
      App.showToast('Password must be at least 6 characters.', 'error'); return;
    }
    if (password !== confirmPass) {
      App.showToast('Passwords do not match.', 'error'); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      App.showToast('Please enter a valid email address.', 'error'); return;
    }

    const accounts = getAllAccounts();
    if (accounts.find(a => a.email === email)) {
      App.showToast('An account with this email already exists. Please sign in.', 'warning'); return;
    }

    const newUser = { name, email, password, grade, age: parseInt(age), learningStyle, subjects, board, branch, stream, createdAt: Date.now() };
    accounts.push(newUser);
    saveAllAccounts(accounts);

    const { password: _, ...safeUser } = newUser;
    Storage.setUser(safeUser);
    Storage.updateStreak();

    // Firebase: create user + sync
    if (FirebaseDB.isReady()) {
      try {
        const fbUser = await FirebaseDB.createWithEmail(email, password);
        if (fbUser) {
          FirebaseDB.setUID(fbUser.uid);
          FirebaseDB.saveUserProfile(safeUser);
        }
      } catch (e) { console.warn('Firebase registration:', e.message); }
    }

    App.showToast(`Account created! Welcome, ${name}! 🎉`, 'success');

    // Redirect to mandatory initial assessment
    if (typeof Assessment !== 'undefined' && !Assessment.isCompleted()) {
      Assessment.start();
    } else {
      App.launch();
    }
  }

  // ── Google Sign-In (Real Firebase or Simulated Fallback) ─────────────────
  async function googleSignIn() {
    if (typeof FirebaseDB !== 'undefined' && FirebaseDB.isReady()) {
      try {
        const fbUser = await FirebaseDB.signInWithGoogle();
        if (fbUser) {
          let profile = await FirebaseDB.loadUserProfile();
          if (!profile) {
            // New user via Google Auth
            profile = {
              name: fbUser.displayName || 'Google User',
              email: fbUser.email,
              grade: '10', // Default, can be updated in settings
              age: 18,
              learningStyle: 'visual',
              subjects: ['mathematics', 'science', 'programming'],
              provider: 'google',
              createdAt: Date.now()
            };
            await FirebaseDB.saveUserProfile(profile);
          }
          Storage.setUser(profile);
          await FirebaseDB.pullAllData();
          Storage.updateStreak();
          App.showToast(`Welcome, ${profile.name}! 🎉`, 'success');
          App.launch();
          return;
        }
      } catch (err) {
        console.warn('Firebase Google Auth canceled or failed:', err);
        // If the user cancelled the popup, we can just return
        if (err.code === 'auth/popup-closed-by-user') {
          return;
        }

        // Show actual Firebase errors so the user can debug their database connection
        App.showToast(`Google Auth Error: ${err.message}`, 'error');
        return;
      }
    }

    // Show the Google Sign-In modal overlay (Offline/Fallback)
    showGoogleModal();
  }

  function showGoogleModal() {
    // Remove existing modal if any
    const existing = document.getElementById('google-signin-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'google-signin-modal';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.75);
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(8px);
      animation: fadeIn 0.2s ease;
    `;

    overlay.innerHTML = `
      <div style="
        background: var(--bg-elevated);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        padding: 40px;
        max-width: 380px;
        width: 90%;
        text-align: center;
        box-shadow: 0 24px 64px rgba(0,0,0,0.6);
        animation: slideUp 0.3s ease;
      ">
        <div style="margin-bottom:24px;">
          <svg width="48" height="48" viewBox="0 0 48 48" style="margin:0 auto 16px;display:block;">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <h3 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text-primary)">Sign in with Google</h3>
          <p style="font-size:13px;color:var(--text-muted);line-height:1.5">Enter your name and email to continue with Google</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div class="form-group">
            <label for="g-name">Your Name</label>
            <input type="text" id="g-name" placeholder="" autocomplete="name">
          </div>
          <div class="form-group">
            <label for="g-email">Gmail Address</label>
            <input type="email" id="g-email" placeholder="" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="g-grade">Grade Level</label>
            <select id="g-grade">
              <option value="">Select grade</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
              <option value="ug">Undergraduate</option>
              <option value="pg">Postgraduate</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:20px;">
          <button onclick="document.getElementById('google-signin-modal').remove()" style="
            flex:1;padding:11px 16px;border-radius:10px;border:1.5px solid var(--glass-border);
            background:transparent;color:var(--text-secondary);font-weight:600;font-size:14px;cursor:pointer;
          ">Cancel</button>
          <button onclick="Auth._completeGoogleSignIn()" style="
            flex:2;padding:11px 16px;border-radius:10px;border:none;
            background:linear-gradient(135deg,#4285F4,#0F9D58);
            color:#fff;font-weight:600;font-size:14px;cursor:pointer;
          ">Continue with Google</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => { const el = document.getElementById('g-name'); if (el) el.focus(); }, 100);
  }

  function _completeGoogleSignIn() {
    const name = (document.getElementById('g-name')?.value || '').trim();
    const email = (document.getElementById('g-email')?.value || '').trim();
    const grade = (document.getElementById('g-grade')?.value || '10');

    if (!name) { App.showToast('Please enter your name.', 'error'); return; }
    if (!email || !email.includes('@')) { App.showToast('Please enter a valid email.', 'error'); return; }

    document.getElementById('google-signin-modal')?.remove();

    const accounts = getAllAccounts();
    let user = accounts.find(a => a.email === email);

    if (!user) {
      // Auto-create account for new Google users
      user = {
        name, email,
        password: '__google__' + Math.random().toString(36).slice(2),
        grade: grade || '10',
        age: 16,
        learningStyle: 'visual',
        subjects: [],
        provider: 'google',
        createdAt: Date.now()
      };
      accounts.push(user);
      saveAllAccounts(accounts);
      App.showToast(`Welcome to EduLearn, ${name}! 🎉`, 'success');
    } else {
      App.showToast(`Welcome back, ${user.name}! 👋`, 'success');
    }

    const { password: _, ...safeUser } = user;
    Storage.setUser(safeUser);
    Storage.updateStreak();
    App.launch();
  }

  // ── Logout ──────────────────────────────────────────────────
  function logout() {
    Storage.setUser(null);
    if (typeof App !== 'undefined') {
      document.getElementById('assessment-screen').style.display = 'none';
      document.getElementById('app').style.display = 'none';
      App.showScreen('auth');
    } else {
      window.location.reload();
    }
  }

  function isLoggedIn() { return !!Storage.getUser(); }

  // ── Helpers ─────────────────────────────────────────────────
  function getAllAccounts() {
    try { return JSON.parse(localStorage.getItem('edulearn_accounts') || '[]'); } catch { return []; }
  }
  function saveAllAccounts(arr) {
    localStorage.setItem('edulearn_accounts', JSON.stringify(arr));
  }
  function shake(el) {
    if (!el) return;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
  }

  return { showLogin, showRegister, login, register, googleSignIn, _completeGoogleSignIn, logout, isLoggedIn };
})();
