/* ============================================================
   EDULEARN — Progress Module
   ============================================================ */
const Progress = (() => {
  let timelineChart = null;
  let masteryChart = null;
  let performanceChart = null;

  function init() {
    renderCharts();
    renderMasteryList();
    renderRecommendations();
  }

  function renderCharts() {
    renderTimelineChart();
    renderMasteryChart();
    renderPerformanceChart();
  }

  function renderTimelineChart() {
    const ctx = document.getElementById('timeline-chart');
    if (!ctx) return;
    if (timelineChart) timelineChart.destroy();

    const history = Storage.getQuizHistory();
    const activity = Storage.getActivity();
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // Last 7 days data
    const labels = [];
    const quizData = [];
    const lessonData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      labels.push(d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }));

      const dayQuizzes = history.filter(h => new Date(h.timestamp).toDateString() === dateStr).length;
      const dayLessons = activity.filter(a => a.type === 'lesson' && new Date(a.timestamp).toDateString() === dateStr).length;
      quizData.push(dayQuizzes);
      lessonData.push(dayLessons);
    }

    timelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Quizzes',
            data: quizData,
            borderColor: '#6C63FF',
            backgroundColor: 'rgba(108,99,255,0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6C63FF',
            pointRadius: 4,
          },
          {
            label: 'Lessons',
            data: lessonData,
            borderColor: '#00C9A7',
            backgroundColor: 'rgba(0,201,167,0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00C9A7',
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: isDark ? '#A0A0C0' : '#444466', font: { size: 11 } }
          },
          y: {
            min: 0,
            grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: { color: isDark ? '#A0A0C0' : '#444466', stepSize: 1 }
          }
        },
        plugins: {
          legend: {
            labels: { color: isDark ? '#A0A0C0' : '#444466', font: { size: 12 } }
          }
        }
      }
    });
  }

  function renderMasteryChart() {
    const ctx = document.getElementById('mastery-chart');
    if (!ctx) return;
    if (masteryChart) masteryChart.destroy();

    const subjects = ['mathematics', 'science', 'english', 'history', 'programming'];
    const data = subjects.map(s => Storage.getSubjectProgress(s));
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    masteryChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: subjects.map(capitalize),
        datasets: [{
          label: 'Mastery %',
          data,
          backgroundColor: [
            'rgba(108,99,255,0.7)',
            'rgba(0,201,167,0.7)',
            'rgba(255,107,107,0.7)',
            'rgba(255,179,71,0.7)',
            'rgba(132,94,194,0.7)',
          ],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            min: 0,
            max: 100,
            grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: { color: isDark ? '#A0A0C0' : '#444466' }
          },
          y: {
            grid: { display: false },
            ticks: { color: isDark ? '#A0A0C0' : '#444466' }
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  function renderPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;
    if (performanceChart) performanceChart.destroy();

    const history = Storage.getQuizHistory();
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    if (!history.length) {
      ctx.parentElement.innerHTML = '<div class="empty-state" style="height:100%;"><p>Take quizzes to see performance trends!</p></div>';
      return;
    }

    const last10 = history.slice(0, 10).reverse();
    const labels = last10.map((_, i) => `Quiz ${i + 1}`);
    const data = last10.map(h => h.score);

    performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Score %',
          data,
          borderColor: '#FFB347',
          backgroundColor: 'rgba(255,179,71,0.15)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: data.map(s => s >= 80 ? '#00C9A7' : s >= 60 ? '#FFB347' : '#FF6B6B'),
          pointRadius: 5,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: isDark ? '#A0A0C0' : '#444466' } },
          y: {
            min: 0,
            max: 100,
            grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: { color: isDark ? '#A0A0C0' : '#444466', callback: v => v + '%' }
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  function renderMasteryList() {
    const list = document.getElementById('mastery-list');
    if (!list) return;
    const subjects = ['mathematics', 'science', 'english', 'history', 'programming'];
    const icons = { mathematics: '🔢', science: '🔬', english: '📖', history: '🏛️', programming: '💻' };
    const colors = {
      mathematics: '#6C63FF',
      science: '#00C9A7',
      english: '#FF6B6B',
      history: '#FFB347',
      programming: '#845EC2',
    };

    const items = subjects.map(s => ({ subject: s, pct: Storage.getSubjectProgress(s) }));
    const hasAny = items.some(i => i.pct > 0);

    if (!hasAny) {
      list.innerHTML = `<div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <p>Complete lessons to see your mastery levels!</p>
      </div>`;
      return;
    }

    list.innerHTML = items.map(({ subject, pct }) => `
      <div class="mastery-item">
        <span class="mastery-label">${icons[subject]} ${capitalize(subject)}</span>
        <div class="mastery-bar">
          <div class="mastery-bar-fill" style="width:${pct}%;background:${colors[subject]}80"></div>
        </div>
        <span class="mastery-pct" style="color:${colors[subject]}">${pct}%</span>
      </div>
    `).join('');
  }

  async function renderRecommendations() {
    const el = document.getElementById('study-recommendations');
    if (!el) return;

    const weakAreas = Storage.getWeakAreas();
    const avgScore = Storage.getAvgScore();
    const user = Storage.getUser();

    if (!Storage.getApiKey() || (!weakAreas.length && avgScore === 0)) {
      el.innerHTML = buildOfflineRecommendations(weakAreas, avgScore);
      return;
    }

    if (!weakAreas.length && avgScore === 0) {
      el.innerHTML = `<div class="empty-state"><p>Build more learning history for personalized recommendations!</p></div>`;
      return;
    }

    try {
      const recs = await Gemini.generateStudyRecommendations(user, weakAreas, avgScore);
      el.innerHTML = recs.map(r => `
        <div class="recommendation-item">
          <span class="rec-icon">${r.icon}</span>
          <div class="rec-text"><strong>${r.title}</strong><br>${r.description}</div>
        </div>
      `).join('');
    } catch {
      el.innerHTML = buildOfflineRecommendations(weakAreas, avgScore);
    }
  }

  function buildOfflineRecommendations(weakAreas, avgScore) {
    const recs = [
      { icon: '📅', title: 'Daily Practice', desc: 'Study for at least 30 minutes daily to build a consistent learning habit.' },
      { icon: '🎯', title: 'Focus on Weak Areas', desc: weakAreas.length ? `Spend extra time on ${weakAreas.map(w => capitalize(w.subject)).join(', ')}.` : 'Take more quizzes to identify your weak areas.' },
      { icon: '🔄', title: 'Spaced Repetition', desc: 'Review completed topics after 1, 3, and 7 days to improve long-term retention.' },
      { icon: '📝', title: 'Active Recall', desc: 'After each lesson, close your notes and try to recall key concepts from memory.' },
    ];

    return recs.map(r => `
      <div class="recommendation-item">
        <span class="rec-icon">${r.icon}</span>
        <div class="rec-text"><strong>${r.title}</strong><br>${r.desc}</div>
      </div>
    `).join('');
  }

  function exportData() {
    const data = {
      user: Storage.getUser(),
      progress: Storage.getProgress(),
      quizHistory: Storage.getQuizHistory(),
      activity: Storage.getActivity(),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edulearn-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    App.showToast('Progress data exported successfully!', 'success');
  }

  function refresh() {
    if (timelineChart) { timelineChart.destroy(); timelineChart = null; }
    if (masteryChart) { masteryChart.destroy(); masteryChart = null; }
    if (performanceChart) { performanceChart.destroy(); performanceChart = null; }
    renderCharts();
    renderMasteryList();
    renderRecommendations();
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  return { init, exportData, refresh };
})();
