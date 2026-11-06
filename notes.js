/* ============================================================
   EDULEARN — Notes Module
   Board/Class-specific AI-generated notes with PDF download
   ============================================================ */
const Notes = (() => {
  const CACHE_KEY = 'edulearn_notes_cache';
  let currentNote = null;

  // ── Board + Class to syllabus mapping ─────────────────────
  const BOARD_INFO = {
    'ap':    { name: 'Andhra Pradesh Board', classes: ['9','10','intermediate'] },
    'cbse':  { name: 'CBSE', classes: ['9','10','11','12'] },
    'icse':  { name: 'ICSE / ISC', classes: ['9','10','11','12'] },
    'ug':    { name: 'Undergraduate (B.Tech)', classes: ['btech'] },
  };

  const BTECH_BRANCHES = {
    cse:  'Computer Science & Engineering',
    ece:  'Electronics & Communication',
    eee:  'Electrical & Electronics',
    mech: 'Mechanical Engineering',
    civil:'Civil Engineering',
    it:   'Information Technology',
  };

  const AP_STREAMS = {
    mpc: 'MPC (Maths, Physics, Chemistry)',
    bipc:'BiPC (Biology, Physics, Chemistry)',
  };

  // ── Init ─────────────────────────────────────────────────
  function init() {
    renderNotesPage();
  }

  function getUserBoardInfo() {
    const user = Storage.getUser();
    return {
      board: user?.board || '',
      grade: user?.grade || '',
      branch: user?.branch || '',
      stream: user?.stream || '',
      subjects: user?.subjects || [],
    };
  }

  // ── Render notes page ────────────────────────────────────
  function renderNotesPage() {
    const container = document.getElementById('notes-content');
    if (!container) return;

    const { board, grade, branch, stream, subjects } = getUserBoardInfo();
    const boardName = BOARD_INFO[board]?.name || board?.toUpperCase() || 'Your Board';
    const gradeName = grade === 'intermediate' ? 'Intermediate' : grade === 'ug' ? 'B.Tech' : `Class ${grade}`;
    const branchName = branch ? (BTECH_BRANCHES[branch] || branch) : '';
    const streamName = stream ? (AP_STREAMS[stream] || stream) : '';
    const detail = branchName || streamName;

    // Build subject → sub-course → topic list from Learning module's SUB_TOPICS
    const allSubjects = subjects.length > 0 ? subjects : ['mathematics','science','english','programming'];

    let html = `
      <div class="notes-header-info glass-card" style="padding:20px;margin-bottom:20px;">
        <h3>📋 ${boardName} ${gradeName ? '— ' + gradeName : ''} ${detail ? '(' + detail + ')' : ''}</h3>
        <p style="color:var(--text-muted);font-size:13px;margin-top:6px;">Select a topic below to generate detailed study notes tailored to your board and class. Download as PDF anytime!</p>
      </div>
    `;

    // Get topic structure from Learning module
    const topicData = typeof Learning !== 'undefined' ? Learning.getSubTopics() : {};

    allSubjects.forEach(sub => {
      const subMeta = getSubjectMeta(sub);
      const subTopics = topicData[sub] || {};

      if (Object.keys(subTopics).length === 0) return;

      html += `<div class="notes-subject-section">
        <h3 class="notes-subject-title">${subMeta.icon} ${subMeta.label}</h3>`;

      // Group by sub-course with clear heading
      Object.entries(subTopics).forEach(([sc, topics]) => {
        const scName = getSubCourseName(sc);
        html += `<div class="notes-subcourse-section">
          <div class="notes-subcourse-heading">
            <span class="notes-subcourse-label">${scName}</span>
            <span class="notes-subcourse-count">${topics.length} topics</span>
          </div>
          <div class="notes-topics-grid">`;

        topics.forEach(topic => {
          const cacheKey = `${board}_${grade}_${sub}_${sc}_${topic}`;
          const cached = getNoteFromCache(cacheKey);
          html += `
            <div class="notes-topic-card glass-card" onclick="Notes.generateNote('${sub}','${sc}','${topic.replace(/'/g, "\\'")}')">
              <div class="notes-topic-head">
                <span class="notes-topic-name">${topic}</span>
              </div>
              <div class="notes-topic-actions">
                ${cached ? '<span class="notes-cached-badge">📄 Cached — Click to view PDF</span>' : '<span style="font-size:12px;color:var(--text-muted)">📝 Click to generate notes</span>'}
              </div>
            </div>`;
        });

        html += `</div></div>`; // close topics-grid + subcourse-section
      });

      html += `</div>`; // close subject-section
    });

    container.innerHTML = html;
  }

  // ── Generate notes for a topic ───────────────────────────
  async function generateNote(subject, subCourse, topic) {
    const { board, grade, branch, stream } = getUserBoardInfo();
    const cacheKey = `${board}_${grade}_${subject}_${subCourse}_${topic}`;
    const cached = getNoteFromCache(cacheKey);

    // Show notes viewer
    showNoteViewer(topic, cached ? cached : null);

    if (cached) return;

    const boardName = BOARD_INFO[board]?.name || 'General';
    const gradeName = grade === 'intermediate' ? 'Intermediate' : grade === 'ug' ? 'B.Tech' : `Class ${grade}`;
    const branchName = branch ? BTECH_BRANCHES[branch] || branch : '';
    const streamName = stream ? AP_STREAMS[stream] || stream : '';
    const extra = branchName || streamName;

    const viewerContent = document.getElementById('note-viewer-content');
    if (viewerContent) {
      viewerContent.innerHTML = `<div class="lesson-loading"><div class="spinner"></div><p>Generating detailed notes...</p></div>`;
    }

    if (!Storage.getApiKey()) {
      const fallback = generateOfflineNotes(topic, subject, boardName, gradeName);
      saveNoteToCache(cacheKey, fallback);
      if (viewerContent) viewerContent.innerHTML = marked.parse(fallback);
      return;
    }

    try {
      const user = Storage.getUser();
      const level = typeof Assessment !== 'undefined' ? Assessment.getUnderstandingLevel(subject) : 'intermediate';

      const prompt = `Generate comprehensive, detailed study notes for the topic "${topic}" under "${getSubCourseName(subCourse)}" in "${getSubjectMeta(subject).label}".

Context:
- Board/Curriculum: ${boardName} ${gradeName} ${extra ? '(' + extra + ')' : ''}
- Student Name: ${user?.name || 'Student'}
- Understanding Level: ${level}
- Learning Style: ${user?.learningStyle || 'visual'}

Requirements:
1. Start with a clear title and overview
2. Cover all key concepts with detailed explanations
3. Include definitions, formulas, theorems where applicable
4. Provide 2-3 solved examples
5. Include important points to remember
6. Add practice questions at the end (3-5 questions)
7. Use proper formatting with headings, bullet points, and bold for key terms
8. Make it appropriate for ${boardName} ${gradeName} syllabus
9. Keep it comprehensive but student-friendly
10. Include diagrams descriptions where helpful

Format the notes in clear Markdown.`;

      const systemPrompt = `You are an expert academic tutor creating detailed study notes for ${boardName} ${gradeName} students. Make the notes clear, thorough, and exam-oriented.`;

      const notes = await Gemini.generate(prompt, systemPrompt);
      saveNoteToCache(cacheKey, notes);
      if (viewerContent) viewerContent.innerHTML = marked.parse(notes);
      Storage.addActivity({ type: 'notes', title: `Generated notes: ${topic}`, subject });
      if (FirebaseDB.isReady()) FirebaseDB.syncInBackground();
    } catch (err) {
      const fallback = generateOfflineNotes(topic, subject, boardName, gradeName);
      saveNoteToCache(cacheKey, fallback);
      if (viewerContent) viewerContent.innerHTML = marked.parse(fallback);
    }
  }

  // ── Show note viewer overlay ─────────────────────────────
  function showNoteViewer(title, content) {
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
          <h2>📝 ${title}</h2>
          <div class="note-viewer-actions">
            <button class="btn btn-primary btn-sm" onclick="Notes.downloadPDF()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </button>
            <button class="icon-btn" onclick="Notes.closeViewer()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div class="note-viewer-body lesson-content" id="note-viewer-content">
          ${content ? marked.parse(content) : '<div class="lesson-loading"><div class="spinner"></div><p>Generating notes...</p></div>'}
        </div>
      </div>
    `;
    viewer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeViewer() {
    const viewer = document.getElementById('note-viewer-overlay');
    if (viewer) viewer.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ── Download as PDF ──────────────────────────────────────
  function downloadPDF() {
    const content = document.getElementById('note-viewer-content');
    if (!content) return;

    const printWin = window.open('', '_blank');
    printWin.document.write(`<!DOCTYPE html><html><head>
      <title>EduLearn Notes</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; line-height: 1.8; color: #1a1a2e; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 24px; border-bottom: 2px solid #6C63FF; padding-bottom: 8px; color: #6C63FF; }
        h2 { font-size: 20px; margin-top: 24px; color: #302b63; }
        h3 { font-size: 17px; margin-top: 18px; color: #444; }
        p  { margin-bottom: 12px; }
        ul, ol { padding-left: 24px; margin-bottom: 14px; }
        li { margin-bottom: 6px; }
        code { background: #f0f0ff; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 13px; }
        pre { background: #f5f5ff; border: 1px solid #ddd; border-radius: 8px; padding: 16px; overflow-x: auto; margin-bottom: 14px; }
        pre code { background: none; padding: 0; }
        blockquote { border-left: 3px solid #6C63FF; padding-left: 16px; color: #666; font-style: italic; margin: 14px 0; }
        strong { color: #1a1a2e; }
        table { border-collapse: collapse; width: 100%; margin: 14px 0; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
        th { background: #f0f0ff; font-weight: 600; }
        .watermark { text-align: center; color: #aaa; font-size: 11px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px; }
        @media print { body { padding: 20px; } }
      </style>
    </head><body>
      ${content.innerHTML}
      <div class="watermark">Generated by EduLearn — AI-Powered Learning Platform</div>
    </body></html>`);
    printWin.document.close();
    setTimeout(() => {
      printWin.print();
    }, 500);
  }

  // ── Cache management ─────────────────────────────────────
  function getNoteFromCache(key) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      return cache[key] || null;
    } catch { return null; }
  }

  function saveNoteToCache(key, content) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      // Keep only last 20 notes to save space
      const keys = Object.keys(cache);
      if (keys.length > 20) delete cache[keys[0]];
      cache[key] = content;
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) { console.warn('Notes cache full:', e.message); }
  }

  // ── Offline fallback notes ───────────────────────────────
  function generateOfflineNotes(topic, subject, board, grade) {
    return `# ${topic}

## Overview
This is an introductory note on **${topic}** for ${board} ${grade} students.

> **Note:** For detailed AI-generated notes, please add your Gemini API key in Settings. The AI will generate comprehensive, board-specific study material.

## Key Concepts
- ${topic} is an important topic in ${getSubjectMeta(subject).label}
- Understanding this concept is essential for your ${board} examinations
- Make sure to practice related problems regularly

## Important Points
1. Start by understanding the fundamental definitions
2. Work through textbook examples step by step
3. Practice previous year exam questions on this topic
4. Review and revise regularly

## Practice Questions
1. Define the key terms related to ${topic}
2. Explain the main concepts with examples
3. Solve practice problems from your textbook

---
*Add your Gemini API key in Settings for detailed, AI-generated study notes tailored to your ${board} ${grade} syllabus.*`;
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
    return meta[sub] || { icon: '📚', label: capitalize(sub) };
  }

  function getSubCourseName(sc) {
    const names = {
      algebra:'Algebra', geometry:'Geometry', calculus:'Calculus', statistics:'Statistics', trigonometry:'Trigonometry',
      physics:'Physics', chemistry:'Chemistry', biology:'Biology',
      literature:'Literature', grammar:'Grammar', writing:'Writing',
      ancient:'Ancient History', medieval:'Medieval History', modern:'Modern History',
      python:'Python', javascript:'JavaScript', java:'Java', cpp:'C/C++', html:'HTML & CSS', sql:'SQL', r:'R',
      machine_learning:'Machine Learning', deep_learning:'Deep Learning', nlp:'NLP',
      frontend:'Frontend', backend:'Backend', devops:'DevOps',
    };
    return names[sc] || sc;
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  return { init, generateNote, downloadPDF, closeViewer, renderNotesPage };
})();
