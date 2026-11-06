/* ============================================================
   EDULEARN — App Controller (Main)
   ============================================================ */
const App = (() => {
  let currentPage = 'dashboard';
  let isSidebarOpen = false;

  // ---- UTILS ----
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  // ---- INITIALIZATION ----
  function init() {
    // Init Firebase
    if (typeof FirebaseDB !== 'undefined') FirebaseDB.init();

    // Apply theme
    const theme = Storage.getTheme();
    document.documentElement.setAttribute('data-theme', theme);

    // Setup board/branch field visibility
    setupBoardBranchFields();

    // Splash → Auto-launch
    setTimeout(() => {
      document.body.classList.add('bg-grid');
      hideSplash();
    }, 2600);
  }

  function hideSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.transition = 'opacity 0.5s ease';
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.style.display = 'none';
        if (Auth.isLoggedIn()) {
          launch();
        } else {
          showScreen('auth');
        }
      }, 500);
    }
  }

  function launch() {
    // Check if initial assessment is needed
    if (typeof Assessment !== 'undefined' && !Assessment.isCompleted()) {
      Assessment.start();
      return;
    }

    showScreen('app');
    const user = Storage.getUser();
    if (user) {
      // Update user info in sidebar
      const nameEl = document.getElementById('user-name');
      const levelEl = document.getElementById('user-level');
      const avatarEl = document.getElementById('user-avatar');
      if (nameEl) nameEl.textContent = user.name;
      if (levelEl) levelEl.textContent = `Grade ${user.grade}`;
      if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();

      // Load settings
      const settings = Storage.getSettings();
      const apiKey = Storage.getApiKey();
      document.getElementById('api-key-input') && (document.getElementById('api-key-input').value = apiKey);
      document.getElementById('settings-name') && (document.getElementById('settings-name').value = user.name);
      document.getElementById('settings-grade') && (document.getElementById('settings-grade').value = user.grade);
      document.getElementById('tts-toggle') && (document.getElementById('tts-toggle').checked = settings.tts !== false);

      // Init all modules
      Dashboard.init();
      Learning.init();
      Quiz.init();
      AiTutor.init();
      Career.init();
      Roadmap.init();
      if (typeof Notes !== 'undefined') Notes.init();
      if (typeof Sources !== 'undefined') Sources.init();
      if (typeof CodePractice !== 'undefined') CodePractice.init();
      if (typeof TestsDashboard !== 'undefined') TestsDashboard.init();

      navigate('dashboard');
    }
  }

  function showScreen(screen) {
    const splash = document.getElementById('splash-screen');
    const auth = document.getElementById('auth-screen');
    const app = document.getElementById('app');
    const assess = document.getElementById('assessment-screen');
    if (splash) splash.style.display = 'none';
    if (auth) auth.style.display = screen === 'auth' ? 'block' : 'none';
    if (app) app.style.display = screen === 'app' ? 'block' : 'none';
    if (assess) assess.style.display = screen === 'assessment' ? 'flex' : 'none';
  }

  // ---- NAVIGATION ----
  function navigate(page) {
    currentPage = page;

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-page') === page);
    });

    // Show correct section
    document.querySelectorAll('.page-section').forEach(el => {
      const isActive = el.id === `page-${page}`;
      el.classList.toggle('active', isActive);
    });

    // Page-specific init
    if (page === 'dashboard') Dashboard.refresh();
    if (page === 'progress') Progress.init();
    if (page === 'career') Career.init();
    if (page === 'quiz') Quiz.init();
    if (page === 'roadmap') Roadmap.init();
    if (page === 'notes' && typeof Notes !== 'undefined') Notes.init();
    if (page === 'sources' && typeof Sources !== 'undefined') Sources.init();
    if (page === 'code-practice' && typeof CodePractice !== 'undefined') CodePractice.init();
    if (page === 'tests' && typeof TestsDashboard !== 'undefined') TestsDashboard.init();

    // Close mobile sidebar
    if (window.innerWidth <= 768) closeSidebar();
  }

  // ---- SIDEBAR ----
  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open', isSidebarOpen);
    overlay.classList.toggle('active', isSidebarOpen);
  }

  function closeSidebar() {
    isSidebarOpen = false;
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('active');
  }

  // ---- THEME ----
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    Storage.setTheme(next);

    // Update theme toggle icon
    const toggleBtns = document.querySelectorAll('#theme-toggle, .mobile-header .icon-btn');
    toggleBtns.forEach(btn => {
      const svg = btn.querySelector('svg');
      if (!svg) return;
      if (next === 'light') {
        svg.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
      } else {
        svg.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
      }
    });

    showToast(`Switched to ${next} mode`, 'info');
  }

  // ---- SETTINGS ----
  function showSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'flex';

    // Pre-fill
    const apiKey = Storage.getApiKey();
    const user = Storage.getUser();
    const settings = Storage.getSettings();
    if (document.getElementById('api-key-input')) document.getElementById('api-key-input').value = apiKey || '';
    if (document.getElementById('settings-name')) document.getElementById('settings-name').value = user?.name || '';
    if (document.getElementById('settings-grade')) {
      document.getElementById('settings-grade').value = user?.grade || '10';
    }
    if (document.getElementById('settings-board')) {
      document.getElementById('settings-board').value = user?.board || '';
    }
    if (document.getElementById('settings-stream')) {
      document.getElementById('settings-stream').value = user?.stream || '';
    }
    if (document.getElementById('settings-branch')) {
      document.getElementById('settings-branch').value = user?.branch || '';
    }
    if (document.getElementById('tts-toggle')) document.getElementById('tts-toggle').checked = settings.tts !== false;

    // Pre-tick subjects
    const chips = document.querySelectorAll('#settings-subject-chips input[type=checkbox]');
    const userSubjects = user?.subjects || [];
    chips.forEach(cb => { cb.checked = userSubjects.includes(cb.value); });

    // Show/hide conditional fields based on saved grade
    onSettingsGradeChange();
  }

  function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
  }

  function saveSettings() {
    const apiKey = document.getElementById('api-key-input').value.trim();
    const name   = document.getElementById('settings-name').value.trim();
    const grade  = document.getElementById('settings-grade').value;
    const board  = document.getElementById('settings-board')?.value || '';
    const stream = document.getElementById('settings-stream')?.value || '';
    const branch = document.getElementById('settings-branch')?.value || '';
    const tts    = document.getElementById('tts-toggle').checked;

    // Collect selected subjects
    const chips = document.querySelectorAll('#settings-subject-chips input[type=checkbox]:checked');
    const subjects = Array.from(chips).map(cb => cb.value);

    if (apiKey) Storage.setApiKey(apiKey);

    const user = Storage.getUser();
    if (user) {
      const gradeChanged   = user.grade    !== grade;
      const subjectsChanged = JSON.stringify(user.subjects || []) !== JSON.stringify(subjects);

      user.name    = name    || user.name;
      user.grade   = grade   || user.grade;
      user.board   = board   || user.board;
      user.stream  = stream  || user.stream;
      user.branch  = branch  || user.branch;
      if (subjects.length > 0) user.subjects = subjects;

      Storage.setUser(user);

      // Update sidebar
      const nameEl   = document.getElementById('user-name');
      const levelEl  = document.getElementById('user-level');
      const avatarEl = document.getElementById('user-avatar');
      if (nameEl)   nameEl.textContent   = user.name;
      if (levelEl)  levelEl.textContent  = `Grade ${user.grade}`;
      if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();

      // Refresh modules that depend on grade/subjects
      if (gradeChanged || subjectsChanged) {
        if (typeof Dashboard !== 'undefined') Dashboard.refresh();
        if (typeof Career    !== 'undefined') Career.init();
        if (typeof Roadmap   !== 'undefined') Roadmap.init();
        showToast(`✅ Profile updated! You're now on Grade ${user.grade} resources.`, 'success');
      } else {
        showToast('Settings saved!', 'success');
      }
    }

    Storage.setSettings({ tts, grade });
    closeSettings();
  }

  // ── Board/Stream/Branch dynamic fields in Settings ──────────
  function onSettingsGradeChange() {
    const gradeEl  = document.getElementById('settings-grade');
    const boardGrp = document.getElementById('settings-board-group');
    const streamGrp= document.getElementById('settings-stream-group');
    const branchGrp= document.getElementById('settings-branch-group');
    if (!gradeEl) return;

    const val      = gradeEl.value;
    const isSchool = ['9','10','11','12'].includes(val);
    const isUG     = val === 'ug';

    if (boardGrp)  boardGrp.style.display  = isSchool ? 'block' : 'none';
    if (branchGrp) branchGrp.style.display = isUG     ? 'block' : 'none';
    if (streamGrp) streamGrp.style.display = 'none'; // hidden until AP is selected

    // If grade changed to non-school, clear stream/board
    if (!isSchool && boardGrp) document.getElementById('settings-board').value = '';
    if (!isUG    && branchGrp) document.getElementById('settings-branch').value = '';

    onSettingsBoardChange();
  }

  function onSettingsBoardChange() {
    const gradeEl  = document.getElementById('settings-grade');
    const boardEl  = document.getElementById('settings-board');
    const streamGrp= document.getElementById('settings-stream-group');
    if (!gradeEl || !boardEl || !streamGrp) return;

    const grade = gradeEl.value;
    const board = boardEl.value;
    const isAPIntermediate = board === 'ap' && ['11','12'].includes(grade);
    streamGrp.style.display = isAPIntermediate ? 'block' : 'none';
  }

  function toggleApiKeyVisibility() {
    const input = document.getElementById('api-key-input');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  }

  function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  }

  function resetAllData() {
    if (confirm('⚠️ This will delete ALL your progress, quiz history, and settings. This cannot be undone. Are you sure?')) {
      Storage.resetAll();
      closeSettings();
      showScreen('auth');
      showToast('All data reset. You can create a new profile.', 'info');
    }
  }

  // ---- TOAST ----
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ---- KEYBOARD SHORTCUTS ----
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeSettings();
        closeSidebar();
      }
    });
    document.getElementById('settings-modal')?.addEventListener('click', e => {
      if (e.target === document.getElementById('settings-modal')) closeSettings();
    });
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
  }

  // ---- MOBILE SWIPE ----
  function initSwipe() {
    let touchStartX = 0;
    document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 60) {
        if (diff > 0 && touchStartX < 40) toggleSidebar();
        else if (diff < 0 && isSidebarOpen) closeSidebar();
      }
    }, { passive: true });
  }

  // ---- BOOT ----
  window.addEventListener('load', () => {
    init();
    initKeyboardShortcuts();
    initSwipe();
    // Particles on auth page
    createParticles();
  });

  function createParticles() {
    const container = document.querySelector('.auth-page');
    if (!container) return;
    const particles = document.createElement('div');
    particles.className = 'particles';
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 40 + 10;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      particles.appendChild(p);
    }
    container.prepend(particles);
  }

  return {
    init,
    launch,
    showScreen,
    navigate,
    toggleSidebar,
    closeSidebar,
    toggleTheme,
    showSettings,
    closeSettings,
    saveSettings,
    onSettingsGradeChange,
    onSettingsBoardChange,
    toggleApiKeyVisibility,
    togglePasswordVisibility,
    resetAllData,
    showToast,
  };

  // ── Board/Branch Field Visibility ─────────────────────────
  function setupBoardBranchFields() {
    const gradeEl = document.getElementById('reg-grade');
    if (!gradeEl) return;

    gradeEl.addEventListener('change', () => {
      const val = gradeEl.value;
      const row = document.getElementById('board-branch-row');
      const boardGroup = document.getElementById('board-group');
      const branchGroup = document.getElementById('branch-group');
      const streamGroup = document.getElementById('stream-group');
      if (!row) return;

      const isSchool = ['9','10','11','12'].includes(val);
      const isUG = val === 'ug';

      row.style.display = (isSchool || isUG) ? 'grid' : 'none';
      boardGroup.style.display = isSchool ? 'block' : 'none';
      branchGroup.style.display = isUG ? 'block' : 'none';
      streamGroup.style.display = 'none';
    });

    const boardEl = document.getElementById('reg-board');
    if (boardEl) {
      boardEl.addEventListener('change', () => {
        const gradeVal = gradeEl.value;
        const boardVal = boardEl.value;
        const streamGroup = document.getElementById('stream-group');
        if (!streamGroup) return;
        // Show AP Intermediate stream for AP Board with grade 11/12
        const isAPIntermediate = boardVal === 'ap' && ['11','12'].includes(gradeVal);
        streamGroup.style.display = isAPIntermediate ? 'block' : 'none';
      });
    }
  }
})();

// ---- CONFETTI ----
const Confetti = (() => {
  function fire() {
    const colors = ['#6C63FF', '#00D4AA', '#FFB347', '#FF6B6B', '#845EC2'];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      const size = Math.random() * 10 + 5;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${Math.random() * 100}vw;
        top: -10px;
        animation-duration: ${Math.random() * 2 + 1.5}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }
  return { fire };
})();
