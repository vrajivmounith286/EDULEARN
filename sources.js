/* ============================================================
   EDULEARN — Sources Module
   YouTube video recommendations via Gemini AI + Disclaimer
   ============================================================ */
const Sources = (() => {
  const CACHE_KEY = 'edulearn_sources_cache';
  let isLoading = false;

  // ── Disclaimer text ──────────────────────────────────────
  const DISCLAIMER = `<div class="sources-disclaimer glass-card">
    <div class="disclaimer-icon">⚠️</div>
    <div class="disclaimer-text">
      <strong>Disclaimer:</strong> These videos are publicly available on YouTube. EDULEARN only redirects users to the original content for educational purposes.
      No content is copied, hosted, or owned by EDULEARN or its administrators. All credit belongs to the respective content creators and channel owners.
    </div>
  </div>`;

  // ── Init ─────────────────────────────────────────────────
  function init() {
    renderSourcesPage();
  }

  // ── Render main page ─────────────────────────────────────
  function renderSourcesPage() {
    const container = document.getElementById('sources-content');
    if (!container) return;

    const user = Storage.getUser();
    const subjects = user?.subjects || ['mathematics', 'science', 'english', 'programming'];
    const topicData = typeof Learning !== 'undefined' ? Learning.getSubTopics() : {};

    // ── Search bar ──────────────────────────────────────────
    let html = `<div class="sources-search-bar glass-card" style="padding:16px;margin-bottom:20px;display:flex;gap:12px;align-items:center;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="sources-search-input" placeholder="Search topics for video resources..." onkeyup="Sources.filterTopics(this.value)" style="flex:1;border:none;background:transparent;outline:none;color:var(--text-primary);font-size:14px;">
    </div>`;

    // ── Subjects ────────────────────────────────────────────
    subjects.forEach(sub => {
      const subMeta = getSubjectMeta(sub);
      const subTopics = topicData[sub] || {};
      if (Object.keys(subTopics).length === 0) return;

      html += `<div class="sources-subject-section" data-subject="${sub}">
        <h3 class="sources-subject-title">${subMeta.icon} ${subMeta.label}</h3>`;

      // ── Sub-course heading then its topics ───────────────
      Object.entries(subTopics).forEach(([sc, topics]) => {
        const scName = getSubCourseName(sc);
        html += `<div class="sources-subcourse-section">
          <div class="sources-subcourse-heading">
            <span class="sources-subcourse-label">${scName}</span>
            <span class="sources-subcourse-count">${topics.length} topics</span>
          </div>
          <div class="sources-topics-grid">`;

        topics.forEach(topic => {
          const cacheKey = `sources_${sub}_${sc}_${topic}`;
          const cached = getCached(cacheKey);
          html += `
            <div class="sources-topic-card glass-card" data-topic="${topic.toLowerCase()}" data-sub="${sub}">
              <div class="sources-topic-head">
                <div class="sources-topic-name">${topic}</div>
                <button class="btn btn-primary btn-sm" onclick="Sources.findVideos('${sub}','${sc}','${topic.replace(/'/g, "\\'")}')">
                  ${cached ? '🔄 Refresh' : '🔍 Find Videos'}
                </button>
              </div>
              <div class="sources-videos-list" id="sources-${sub}-${sc}-${topic.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}">
                ${cached ? renderVideoCards(cached) : '<div style="padding:10px;font-size:13px;color:var(--text-muted)">Click "Find Videos" to discover YouTube resources</div>'}
              </div>
            </div>`;
        });

        html += `</div></div>`; // close topics-grid + subcourse-section
      });

      html += `</div>`; // close subject-section
    });

    // ── Disclaimer ONLY at bottom ────────────────────────────
    html += `<div style="margin-top:24px;">${DISCLAIMER}</div>`;
    container.innerHTML = html;
  }

  // ── Find videos for a topic ──────────────────────────────
  async function findVideos(subject, subCourse, topic) {
    const containerId = `sources-${subject}-${subCourse}-${topic.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
    const container = document.getElementById(containerId);
    if (!container || isLoading) return;

    isLoading = true;
    container.innerHTML = `<div class="lesson-loading" style="padding:20px;"><div class="spinner"></div><p>Finding YouTube resources...</p></div>`;

    const cacheKey = `sources_${subject}_${subCourse}_${topic}`;

    if (!Storage.getApiKey()) {
      const fallbackVideos = generateFallbackVideos(topic, subject, subCourse);
      saveToCacheStore(cacheKey, fallbackVideos);
      container.innerHTML = renderVideoCards(fallbackVideos);
      isLoading = false;
      return;
    }

    try {
      const user = Storage.getUser();
      const board = user?.board || '';
      const grade = user?.grade || '';
      const boardName = getBoardName(board);

      const prompt = `Find 4-5 popular educational YouTube videos for learning "${topic}" (part of ${getSubCourseName(subCourse)} in ${getSubjectMeta(subject).label}).

Student context: ${boardName} ${grade ? 'Class/Level ' + grade : ''}, ${user?.learningStyle || 'visual'} learner.

Return a JSON array of objects with these exact fields:
[
  {
    "title": "Video title",
    "channel": "Channel name",
    "description": "One-line description of what the video covers",
    "searchQuery": "exact search query to find this video on YouTube",
    "duration": "approx duration like 15 min"
  }
]

Requirements:
- Suggest real, well-known educational channels (Khan Academy, Organic Chemistry Tutor, 3Blue1Brown, CS Dojo, Fireship, Code With Harry, Apna College, Jenny's Lectures, etc.)
- Make search queries specific enough to find the exact video
- Return ONLY the JSON array, nothing else`;

      const systemPrompt = 'You are a helpful assistant that recommends YouTube educational videos. Return ONLY valid JSON arrays.';
      const response = await Gemini.generate(prompt, systemPrompt);

      let videos = [];
      try {
        const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        videos = JSON.parse(cleaned);
      } catch {
        videos = generateFallbackVideos(topic, subject, subCourse);
      }

      videos = videos.map(v => ({
        ...v,
        youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(v.searchQuery || v.title + ' tutorial')}`,
        thumbnail: null,
      }));

      saveToCacheStore(cacheKey, videos);
      container.innerHTML = renderVideoCards(videos, topic, subject, subCourse);
      Storage.addActivity({ type: 'sources', title: `Found videos: ${topic}`, subject });
    } catch (err) {
      const fallback = generateFallbackVideos(topic, subject, subCourse);
      saveToCacheStore(cacheKey, fallback);
      container.innerHTML = renderVideoCards(fallback, topic, subject, subCourse);
    }

    isLoading = false;
  }

  // ── Render video cards ───────────────────────────────────
  function renderVideoCards(videos, topic, subject, subCourse) {
    if (!videos || videos.length === 0) {
      return '<div style="padding:10px;color:var(--text-muted);font-size:13px;">No videos found. Try again later.</div>';
    }

    return `<div class="sources-video-grid">
      ${videos.map(v => {
        const dTitle = v.title || 'Educational Video';
        return `
        <div class="source-video-card glass-card" onclick="Sources.openVideoSummary('${encodeURIComponent(topic)}', '${subject}', '${subCourse}', '${encodeURIComponent(dTitle)}', '${encodeURIComponent(v.youtubeUrl)}', '${encodeURIComponent(v.description || '')}')">
          <div class="source-video-thumb">
            <div class="source-thumb-icon">▶</div>
            <span class="source-duration">${v.duration || '~10 min'}</span>
          </div>
          <div class="source-video-info">
            <div class="source-video-title">${dTitle}</div>
            <div class="source-video-channel">${v.channel || 'YouTube'}</div>
            <div class="source-video-desc">${v.description || ''}</div>
          </div>
          <div class="source-watch-btn" style="color: var(--color-primary);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Learn & Quiz
          </div>
        </div>
      `}).join('')}
    </div>`;
  }

  // ── Open Video Summary & Quiz Modal ─────────────────────────
  async function openVideoSummary(encTopic, sub, sc, encTitle, encUrl, encDesc) {
    const topic = decodeURIComponent(encTopic);
    const title = decodeURIComponent(encTitle);
    const url = decodeURIComponent(encUrl);
    const desc = decodeURIComponent(encDesc);
    
    // Create overlay
    let viewer = document.getElementById('note-viewer-overlay');
    if (!viewer) {
      viewer = document.createElement('div');
      viewer.id = 'note-viewer-overlay';
      viewer.className = 'note-viewer-overlay';
      document.body.appendChild(viewer);
    }
    
    viewer.innerHTML = `
      <div class="note-viewer glass-card">
        <div class="note-viewer-header">
          <h2>📺 ${title}</h2>
          <div class="note-viewer-actions">
            <a href="${url}" target="_blank" class="btn btn-primary btn-sm">Watch on YouTube</a>
            <button class="icon-btn" onclick="document.getElementById('note-viewer-overlay').style.display = 'none'; document.body.style.overflow = '';">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div class="note-viewer-body" id="video-viewer-content">
          <div class="lesson-loading"><div class="spinner"></div><p>Generating summary and quiz...</p></div>
        </div>
      </div>
    `;
    viewer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Fetch Summary & Quiz
    const cacheKey = `video_ai_${sub}_${sc}_${topic}_${title}`;
    const cached = getCached(cacheKey);
    const contentBox = document.getElementById('video-viewer-content');
    
    if (cached) {
      renderSummaryAndQuiz(cached.summary, cached.quiz, contentBox);
      return;
    }
    
    if (!Storage.getApiKey()) {
      contentBox.innerHTML = `<div class="course-alert error"><div class="alert-icon">⚠️</div><div class="alert-content">Please enter your API Key in Settings to generate Video Summaries & Quizzes.</div></div>`;
      return;
    }
    
    try {
      const prompt = `Generate a comprehensive text summary of the key educational concepts that would be covered in an educational video titled "${title}" about "${topic}" (for ${getSubCourseName(sc)} in ${getSubjectMeta(sub).label}).
      
After the summary, provide a multiple-choice quiz based on the summary. Dynamically adjust the number of questions (between 3 to 7 questions) based on the topic's size and complexity. For more complex or advanced topics, generate more questions to ensure better understanding.

Return the response STRICTLY as a JSON object with this exact structure:
{
  "summary": "Markdown formatted summary text. Include headings, bullet points, etc.",
  "quiz": [
    {
      "q": "Question 1 text?",
      "opts": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "c": 0
    }
  ]
}
Note: 'c' is the 0-based index of the correct option. Return ONLY the JSON object.`;

      const response = await Gemini.generate(prompt, 'You are an educational assistant. Return strictly valid JSON with no markdown wrapping or extra text outside the JSON.');
      let parsed;
      try {
        const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (e) {
        throw new Error('Could not parse JSON. AI returned: ' + response.slice(0,100));
      }
      
      saveToCacheStore(cacheKey, parsed);
      renderSummaryAndQuiz(parsed.summary, parsed.quiz, contentBox);
    } catch (e) {
      contentBox.innerHTML = `<div class="course-alert error"><div class="alert-icon">❌</div><div class="alert-content">Failed to generate summary: ${e.message}</div></div>`;
    }
  }

  function renderSummaryAndQuiz(summaryHtml, quizData, container) {
    if (!container) return;
    window.currentVideoQuizData = quizData; 
    let quizHtml = '<div class="quiz-section"><h3>📚 Check Your Understanding</h3><p style="color:var(--text-muted);font-size:13px;margin-bottom:16px">Take this quick quiz based on the video summary to test your knowledge.</p>';
    
    quizData.forEach((q, i) => {
      quizHtml += `
        <div class="video-quiz-q" id="vquiz_${i}" style="margin-bottom:20px;">
          <p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>
          <div class="vquiz-options">
            ${q.opts.map((opt, optIdx) => `
              <button class="quiz-option" onclick="Sources.selectQuizOption(${i}, ${optIdx})" id="vopt_${i}_${optIdx}">${opt}</button>
            `).join('')}
          </div>
          <div id="vfeedback_${i}" style="margin-top:8px;font-size:13px;display:none;"></div>
        </div>
      `;
    });
    quizHtml += '</div>';
    
    container.innerHTML = `
      <div class="video-summary-wrapper lesson-content">
        ${marked.parse(summaryHtml)}
      </div>
      ${quizHtml}
    `;
  }

  function selectQuizOption(qIndex, selectedIndex) {
    const qData = window.currentVideoQuizData[qIndex];
    if (!qData) return;
    
    const isCorrect = (selectedIndex === qData.c);
    const feedback = document.getElementById(`vfeedback_${qIndex}`);
    if(feedback) {
       feedback.style.display = 'block';
       feedback.style.color = isCorrect ? 'var(--color-success)' : 'var(--color-error)';
       feedback.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect. Try again!';
    }
    
    // Clear previous selection
    for(let i = 0; i < qData.opts.length; i++) {
       const btn = document.getElementById(`vopt_${qIndex}_${i}`);
       if(btn) {
         btn.classList.remove('correct', 'wrong');
         // highlight correct if they got it right or wrong
         if (i === qData.c && (isCorrect || i === selectedIndex)) {
             btn.classList.add('correct');
         } else if (i === selectedIndex && !isCorrect) {
             btn.classList.add('wrong');
         }
       }
    }
  }

  // ── Fallback videos (when no API key) ────────────────────
  function generateFallbackVideos(topic, subject, subCourse) {
    const encodedTopic = encodeURIComponent(`${topic} ${getSubjectMeta(subject).label} tutorial`);
    const encodedBasic = encodeURIComponent(`${topic} explained simply`);
    const encodedPractice = encodeURIComponent(`${topic} practice problems solved`);
    const encodedAdvanced = encodeURIComponent(`${topic} advanced concepts`);

    return [
      {
        title: `${topic} — Complete Tutorial`,
        channel: 'YouTube Education',
        description: `Comprehensive tutorial covering all aspects of ${topic}`,
        duration: '~15 min',
        youtubeUrl: `https://www.youtube.com/results?search_query=${encodedTopic}`,
      },
      {
        title: `${topic} Explained Simply`,
        channel: 'YouTube Education',
        description: `Easy-to-understand explanation of ${topic} for beginners`,
        duration: '~10 min',
        youtubeUrl: `https://www.youtube.com/results?search_query=${encodedBasic}`,
      },
      {
        title: `${topic} — Practice Problems`,
        channel: 'YouTube Education',
        description: `Step-by-step solved problems on ${topic}`,
        duration: '~20 min',
        youtubeUrl: `https://www.youtube.com/results?search_query=${encodedPractice}`,
      },
      {
        title: `${topic} — Advanced Concepts`,
        channel: 'YouTube Education',
        description: `Deep dive into advanced ${topic} concepts`,
        duration: '~12 min',
        youtubeUrl: `https://www.youtube.com/results?search_query=${encodedAdvanced}`,
      },
    ];
  }

  // ── Search filter ────────────────────────────────────────
  function filterTopics(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.sources-topic-card').forEach(card => {
      const topic = card.getAttribute('data-topic') || '';
      card.style.display = topic.includes(q) ? '' : 'none';
    });
  }

  // ── Cache management ─────────────────────────────────────
  function getCached(key) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      return cache[key] || null;
    } catch { return null; }
  }

  function saveToCacheStore(key, data) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      const keys = Object.keys(cache);
      if (keys.length > 30) delete cache[keys[0]];
      cache[key] = data;
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) { console.warn('Sources cache error:', e.message); }
  }

  // ── Helpers ──────────────────────────────────────────────
  function getSubjectMeta(sub) {
    const meta = {
      mathematics: { icon: '🔢', label: 'Mathematics' },
      science:     { icon: '🔬', label: 'Science' },
      english:     { icon: '📖', label: 'English' },
      history:     { icon: '🏛️', label: 'History' },
      programming: { icon: '💻', label: 'Programming' },
      aiml:        { icon: '🤖', label: 'AI & Machine Learning' },
      fullstack:   { icon: '🚀', label: 'Full Stack Web Dev' },
    };
    return meta[sub] || { icon: '📚', label: sub };
  }

  function getSubCourseName(sc) {
    const names = {
      algebra:'Algebra', geometry:'Geometry', calculus:'Calculus', statistics:'Statistics', trigonometry:'Trigonometry',
      physics:'Physics', chemistry:'Chemistry', biology:'Biology',
      literature:'Literature', grammar:'Grammar', writing:'Writing',
      ancient:'Ancient', medieval:'Medieval', modern:'Modern',
      python:'Python', javascript:'JavaScript', java:'Java', cpp:'C/C++', html:'HTML/CSS', sql:'SQL', r:'R',
      machine_learning:'ML', deep_learning:'Deep Learning', nlp:'NLP',
      frontend:'Frontend', backend:'Backend', devops:'DevOps',
    };
    return names[sc] || sc;
  }

  function getBoardName(board) {
    const names = { ap: 'AP Board', cbse: 'CBSE', icse: 'ICSE', ug: 'B.Tech' };
    return names[board] || '';
  }

  return { init, findVideos, filterTopics, openVideoSummary, selectQuizOption };
})();
