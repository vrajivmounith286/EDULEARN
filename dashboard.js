/* ============================================================
   EDULEARN — Dashboard Module
   ============================================================ */
const Dashboard = (() => {
  let subjectChart = null;
  let weeklyChart = null;

  function init() {
    const user = Storage.getUser();
    if (!user) return;

    updateGreeting(user.name);
    updateStats();
    updateStreak();
    renderActivity();
    renderWeakAreas();
    renderCharts();
  }

  function updateGreeting(name) {
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    const el = document.getElementById('greeting-text');
    if (el) el.textContent = `${greet}, ${name}! 👋`;
  }

  function updateStats() {
    const lessons = Storage.getLessonCount();
    const quizzes = Storage.getQuizCount();
    const avg = Storage.getAvgScore();
    const time = Storage.getTotalStudyTime();

    animateNumber('total-lessons', lessons);
    animateNumber('total-quizzes', quizzes);
    animateNumber('avg-score', avg, '%');
    animateNumber('total-time', time, 'h');
  }

  function animateNumber(id, target, suffix = '') {
    const el = document.getElementById(id);
    if (!el) return;
    const start = 0;
    const duration = 700;
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    el.classList.add('count-up');
  }

  function updateStreak() {
    const streak = Storage.getStreak();
    const el = document.getElementById('streak-count');
    if (el) el.textContent = `${streak.count} Day Streak`;
  }

  function renderActivity() {
    const list = document.getElementById('activity-list');
    if (!list) return;
    const activity = Storage.getActivity();

    if (!activity.length) {
      list.innerHTML = `<div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        <p>Start learning to see your activity!</p>
      </div>`;
      return;
    }

    const icons = { lesson: '📚', quiz: '📝', career: '🎓' };
    list.innerHTML = activity.slice(0, 5).map(a => `
      <div class="activity-item card-entrance">
        <span class="activity-icon">${icons[a.type] || '📘'}</span>
        <div class="activity-info">
          <div class="activity-title">${a.title}</div>
          <div class="activity-meta">${timeAgo(a.timestamp)}</div>
        </div>
        ${a.score !== undefined ? `<span class="activity-score">${a.score}%</span>` : ''}
      </div>
    `).join('');
  }

  function renderWeakAreas() {
    const list = document.getElementById('weak-areas-list');
    if (!list) return;
    const weak = Storage.getWeakAreas();

    if (!weak.length) {
      list.innerHTML = `<div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <p>Take quizzes to identify areas to improve!</p>
      </div>`;
      return;
    }

    list.innerHTML = weak.map(w => `
      <div class="weak-item card-entrance">
        <span class="weak-label">${capitalize(w.subject)}</span>
        <div class="weak-bar"><div class="weak-bar-fill" style="width:${w.score}%"></div></div>
        <span class="weak-score">${w.score}%</span>
      </div>
    `).join('');
  }

  function renderCharts() {
    renderSubjectChart();
    renderWeeklyChart();
  }

  function renderSubjectChart() {
    const ctx = document.getElementById('subject-chart');
    if (!ctx) return;
    if (subjectChart) subjectChart.destroy();

    const scores = Storage.getSubjectScores();
    const labels = Object.keys(scores).map(capitalize);
    const data = Object.values(scores);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    subjectChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Performance %',
          data,
          backgroundColor: 'rgba(108,99,255,0.15)',
          borderColor: '#6C63FF',
          borderWidth: 2,
          pointBackgroundColor: '#6C63FF',
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { display: false },
            grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
            pointLabels: { color: isDark ? '#A0A0C0' : '#444466', font: { size: 12 } },
          }
        },
        plugins: { legend: { display: false } },
      }
    });
  }

  function renderWeeklyChart() {
    const ctx = document.getElementById('weekly-chart');
    if (!ctx) return;
    if (weeklyChart) weeklyChart.destroy();

    const weekly = Storage.getWeeklyData();
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    weeklyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: weekly.labels,
        datasets: [{
          label: 'Activities',
          data: weekly.data,
          backgroundColor: 'rgba(108,99,255,0.6)',
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: isDark ? '#A0A0C0' : '#444466' } },
          y: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: isDark ? '#A0A0C0' : '#444466', stepSize: 1 } },
        },
        plugins: { legend: { display: false } },
      }
    });
  }

  function refresh() {
    updateStats();
    renderActivity();
    renderWeakAreas();
    if (subjectChart) subjectChart.destroy(), subjectChart = null;
    if (weeklyChart) weeklyChart.destroy(), weeklyChart = null;
    renderCharts();
  }

  function timeAgo(ts) {
    const seconds = Math.floor((Date.now() - ts) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  return { init, refresh };
})();
