/* ============================================================
   EDULEARN — Career Module
   ============================================================ */
const Career = (() => {
  let strengthsChart = null;

  function init() {
    const user = Storage.getUser();
    if (!user) return;

    updateProfile(user);
    renderStrengthsChart();
  }

  function updateProfile(user) {
    const scores = Storage.getSubjectScores();
    const strongest = Storage.getStrongestSubject();
    const weakAreas = Storage.getWeakAreas();
    const avgScore = Storage.getAvgScore();

    const styleEl = document.getElementById('profile-style');
    const strongEl = document.getElementById('profile-strongest');
    const weakEl = document.getElementById('profile-weakest');
    const avgEl = document.getElementById('profile-avg');

    if (styleEl) styleEl.textContent = capitalize(user.learningStyle);
    if (strongEl) strongEl.textContent = strongest === 'Not enough data' ? 'Not enough data' : capitalize(strongest);
    if (weakEl) weakEl.textContent = weakAreas.length ? capitalize(weakAreas[0].subject) : 'Not enough data';
    if (avgEl) avgEl.textContent = avgScore + '%';
  }

  function renderStrengthsChart() {
    const ctx = document.getElementById('strengths-chart');
    if (!ctx) return;
    if (strengthsChart) strengthsChart.destroy();

    const scores = Storage.getSubjectScores();
    const labels = Object.keys(scores).map(capitalize);
    const data = Object.values(scores);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    strengthsChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            'rgba(108,99,255,0.6)',
            'rgba(0,212,170,0.6)',
            'rgba(255,107,107,0.6)',
            'rgba(255,179,71,0.6)',
            'rgba(132,94,194,0.6)',
          ],
          borderColor: 'transparent',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { display: false },
            grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: isDark ? '#A0A0C0' : '#444466',
              padding: 12,
              font: { size: 12 },
            }
          }
        }
      }
    });
  }

  async function getRecommendations() {
    const user = Storage.getUser();
    const subjectScores = Storage.getSubjectScores();
    const avgScore = Storage.getAvgScore();
    const progress = Storage.getProgress();

    const recommendationsEl = document.getElementById('career-recommendations');
    if (!recommendationsEl) return;

    recommendationsEl.innerHTML = `<div class="career-loading"><div class="spinner"></div><p>AI is analyzing your profile...</p></div>`;

    const btn = document.getElementById('get-career-btn');
    if (btn) btn.disabled = true;

    // Gather actual learning analytics
    const learningData = {
      topicsStudied: {},
      totalLessons: 0,
      totalQuizzes: Storage.getQuizCount(),
      understandingLevels: typeof Assessment !== 'undefined' ? Assessment.getAllLevels() : {},
    };
    const subjects = ['mathematics','science','english','history','programming','aiml','fullstack'];
    subjects.forEach(sub => {
      const lessons = Object.keys(progress[sub]?.lessons || {});
      if (lessons.length > 0) {
        learningData.topicsStudied[sub] = lessons.slice(0, 5);
        learningData.totalLessons += lessons.length;
      }
    });

    if (!Storage.getApiKey()) {
      recommendationsEl.innerHTML = buildDynamicOfflineCareer(user, subjectScores, learningData);
      if (btn) btn.disabled = false;
      return;
    }

    try {
      const enrichedProfile = {
        ...user,
        avgScore,
        totalLessons: learningData.totalLessons,
        totalQuizzes: learningData.totalQuizzes,
        topicsStudied: learningData.topicsStudied,
        understandingLevels: learningData.understandingLevels,
      };
      const recs = await Gemini.generateCareerRecommendations(enrichedProfile, subjectScores);
      renderRecommendations(recs);
      Storage.addActivity({ type: 'career', title: 'Viewed AI career recommendations' });
    } catch (err) {
      App.showToast('Using default recommendations: ' + err.message, 'warning');
      recommendationsEl.innerHTML = buildDynamicOfflineCareer(user, subjectScores, learningData);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function renderRecommendations(recs) {
    const el = document.getElementById('career-recommendations');
    if (!el) return;

    el.innerHTML = recs.map(r => `
      <div class="career-card glass-card card-entrance">
        <div class="career-icon">${r.icon || '🎯'}</div>
        <div class="career-info">
          <h3>${r.title}</h3>
          <p>${r.description}</p>
          <div class="career-match">✅ ${r.matchScore || 80}% Match</div>
          <div class="career-skills">
            ${(r.requiredSkills || []).map(s => `<span class="career-skill-tag">${s}</span>`).join('')}
          </div>
          ${r.roadmap ? `<p style="margin-top:10px;font-size:13px;color:var(--text-muted);">📍 ${r.roadmap}</p>` : ''}
        </div>
      </div>
    `).join('');
  }

  function buildDynamicOfflineCareer(user, scores, learningData) {
    const subjectMap = {
      mathematics: [
        { icon: '📊', title: 'Data Scientist', match: 88, skills: ['Python', 'Statistics', 'Machine Learning'], desc: 'Analyze large datasets to extract insights and build predictive models.' },
        { icon: '💹', title: 'Financial Analyst', match: 82, skills: ['Mathematics', 'Excel', 'Finance'], desc: 'Evaluate financial data to guide investment and business decisions.' },
      ],
      programming: [
        { icon: '💻', title: 'Software Engineer', match: 92, skills: ['Algorithms', 'OOP', 'Problem Solving'], desc: 'Design, develop, and maintain software applications and systems.' },
        { icon: '🌐', title: 'Web Developer', match: 87, skills: ['HTML/CSS', 'JavaScript', 'React'], desc: 'Build interactive and responsive websites and web applications.' },
      ],
      science: [
        { icon: '🔬', title: 'Research Scientist', match: 85, skills: ['Research', 'Analysis', 'Lab Skills'], desc: 'Conduct experiments and research to advance scientific knowledge.' },
        { icon: '🏥', title: 'Medical Professional', match: 80, skills: ['Biology', 'Chemistry', 'Patient Care'], desc: 'Diagnose, treat, and care for patients in healthcare settings.' },
      ],
      english: [
        { icon: '✍️', title: 'Content Writer', match: 86, skills: ['Writing', 'SEO', 'Storytelling'], desc: 'Create engaging content for various platforms and audiences.' },
        { icon: '⚖️', title: 'Lawyer', match: 78, skills: ['Research', 'Argumentation', 'Writing'], desc: 'Represent clients and provide legal guidance in various matters.' },
      ],
      history: [
        { icon: '🏛️', title: 'Historian/Researcher', match: 83, skills: ['Research', 'Writing', 'Analysis'], desc: 'Study and document historical events, culture, and civilizations.' },
        { icon: '🌍', title: 'Diplomat/Foreign Affairs', match: 79, skills: ['Languages', 'Communication', 'History'], desc: 'Represent and advance a country\'s interests internationally.' },
      ],
      aiml: [
        { icon: '🤖', title: 'AI/ML Engineer', match: 95, skills: ['Python', 'TensorFlow', 'Deep Learning'], desc: 'Build and train machine learning models and AI systems.' },
      ],
      fullstack: [
        { icon: '🚀', title: 'Full Stack Architect', match: 94, skills: ['React', 'Node.js', 'System Design'], desc: 'Design and build end-to-end scalable web applications.' },
      ],
    };

    // Pick top subject based on actual lessons completed or fallback to preference
    let topSub = (user.subjects || ['programming'])[0];
    let maxL = 0;
    Object.entries(learningData.topicsStudied).forEach(([sub, topics]) => {
      if (topics.length > maxL) {
        maxL = topics.length;
        topSub = sub;
      }
    });

    const level = learningData.understandingLevels[topSub] || 'beginner';
    const levelMatchBonus = level === 'advanced' ? 5 : level === 'intermediate' ? 2 : 0;

    const careers = subjectMap[topSub] || subjectMap.programming;
    const defaults = [
      { icon: '🚀', title: 'Entrepreneur', match: 75 + levelMatchBonus, skills: ['Leadership', 'Innovation', 'Business'], desc: 'Launch and grow your own business leveraging your unique skill set.' },
      { icon: '🎨', title: 'Creative Director', match: 72 + levelMatchBonus, skills: ['Creativity', 'Design', 'Management'], desc: 'Lead creative teams to develop compelling visual and digital experiences.' }
    ];

    const all = [...careers.map(c => ({...c, match: c.match + levelMatchBonus})), ...defaults];
    
    let html = `<div style="margin-bottom: 20px; padding: 15px; background: rgba(108, 99, 255, 0.1); border-left: 4px solid var(--primary); border-radius: 4px;">
      <h4 style="margin:0 0 5px 0;">Career Insights based on your learning</h4>
      <p style="margin:0; font-size:13px; color:var(--text-muted);">
        You've completed ${learningData.totalLessons} lessons and taking ${learningData.totalQuizzes} quizzes.
        Based on your focus in <strong>${capitalize(topSub)}</strong> (Level: ${capitalize(level)}), here are your top matches:
      </p>
    </div>`;

    html += all.map(r => `
      <div class="career-card glass-card card-entrance">
        <div class="career-icon">${r.icon}</div>
        <div class="career-info">
          <h3>${r.title}</h3>
          <p>${r.desc}</p>
          <div class="career-match">✅ ${Math.min(99, r.match)}% Match</div>
          <div class="career-skills">
            ${r.skills.map(s => `<span class="career-skill-tag">${s}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
    
    return html;
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  return { init, getRecommendations };
})();
