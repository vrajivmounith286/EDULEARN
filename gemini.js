/* ============================================================
   EDULEARN — Gemini AI Module (Gemma 3 27B)
   ============================================================ */
const Gemini = (() => {
  const MODEL = 'gemma-3-27b-it';
  const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

  function getKey() {
    return Storage.getApiKey();
  }

  async function generate(prompt, systemContext = '') {
    const key = getKey();
    if (!key) {
      throw new Error('NO_KEY');
    }

    const url = `${BASE_URL}/${MODEL}:generateContent?key=${key}`;
    let finalPrompt = prompt;
    if (systemContext) {
      finalPrompt = `System/Context Guidelines: ${systemContext}\n\nUser Prompt: ${prompt}`;
    }

    const body = {
      contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.9,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || `API Error ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from AI');
    return text;
  }

  // --- STREAM support (for chat) ---
  async function* generateStream(prompt, systemContext = '') {
    const key = getKey();
    if (!key) throw new Error('NO_KEY');

    const url = `${BASE_URL}/${MODEL}:streamGenerateContent?alt=sse&key=${key}`;
    let finalPrompt = prompt;
    if (systemContext) {
      finalPrompt = `System/Context Guidelines: ${systemContext}\n\nUser Prompt: ${prompt}`;
    }

    const body = {
      contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048, topP: 0.9 },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API Error ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const json = line.slice(6).trim();
          if (json === '[DONE]') return;
          try {
            const parsed = JSON.parse(json);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) yield text;
          } catch {}
        }
      }
    }
  }

  // --- Lesson Generation ---
  async function generateLesson(subject, topic, difficulty, userProfile) {
    const prompt = `Create a comprehensive, engaging lesson about "${topic}" in ${subject}.

Student Profile:
- Grade: ${userProfile.grade}
- Learning Style: ${userProfile.learningStyle}
- Difficulty: ${difficulty}

Instructions:
- Write in a friendly, encouraging tone appropriate for ${userProfile.grade} grade
- Use the ${userProfile.learningStyle} learning approach
- Include: Introduction, Key Concepts (3-5 points), Detailed Explanation, Real-world Examples, Summary
- Use markdown formatting with headers, bullet points, and **bold** for key terms
- Include a "💡 Key Takeaway" section at the end
- Make it interactive with "🤔 Think About It" questions
- For ${difficulty} level, adjust complexity accordingly
- Length: 400-600 words`;

    return generate(prompt);
  }

  // --- Quiz Generation ---
  async function generateQuiz(subject, topic, difficulty, count, userProfile, askedPrev) {
    const avoidBlock = (askedPrev && askedPrev.length > 0)
      ? `\n\nIMPORTANT: Do NOT repeat or rephrase any of these previously asked questions:\n${askedPrev.slice(-15).map((q, i) => `${i+1}. ${q}`).join('\n')}\n\nGenerate completely NEW and DISTINCT questions.`
      : '';

    const prompt = `Generate exactly ${count} multiple-choice quiz questions about ${topic || subject}.

Requirements:
- Subject: ${subject}
- Difficulty: ${difficulty} (adjust question complexity accordingly)
- Student Grade: ${userProfile.grade}
- Each question must have exactly 4 options (A, B, C, D)
- Include the correct answer and a brief explanation
- Questions must be unique, diverse, and not repetitive${avoidBlock}

Output ONLY a valid JSON array in this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Why this answer is correct..."
  }
]

Where "correct" is the 0-based index of the correct option.
Generate exactly ${count} questions. Return ONLY the JSON array, no other text.`;

    const text = await generate(prompt);
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid quiz format from AI');
    return JSON.parse(jsonMatch[0]);
  }

  // --- Career Recommendations ---
  async function generateCareerRecommendations(userProfile, subjectScores) {
    const scoresSummary = Object.entries(subjectScores)
      .map(([sub, score]) => `${sub}: ${score}%`)
      .join(', ');

    const prompt = `Based on a student's learning profile, provide 4 career recommendations.

Student Profile:
- Grade: ${userProfile.grade}
- Age: ${userProfile.age}
- Learning Style: ${userProfile.learningStyle}
- Preferred Subjects: ${(userProfile.subjects || []).join(', ')}
- Quiz Performance by Subject: ${scoresSummary || 'No quiz data yet'}
- Average Score: ${userProfile.avgScore || 0}%

Return ONLY a JSON array of 4 career recommendations:
[
  {
    "title": "Career Title",
    "icon": "emoji",
    "description": "2-3 sentence description of why this career fits",
    "matchScore": 85,
    "requiredSkills": ["skill1", "skill2", "skill3"],
    "roadmap": "Brief educational roadmap paragraph"
  }
]

Make recommendations relevant to the student's strengths. Return ONLY valid JSON.`;

    const text = await generate(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid career data');
    return JSON.parse(jsonMatch[0]);
  }

  // --- Study Recommendations ---
  async function generateStudyRecommendations(userProfile, weakAreas, avgScore) {
    const prompt = `Generate 4 personalized study recommendations for a student.

Profile:
- Grade: ${userProfile.grade}
- Learning Style: ${userProfile.learningStyle}
- Average Score: ${avgScore}%
- Weak Areas: ${weakAreas.map(w => `${w.subject} (${w.score}%)`).join(', ') || 'None identified yet'}

Return ONLY a JSON array:
[
  {
    "icon": "emoji",
    "title": "Short title",
    "description": "1-2 sentence actionable recommendation"
  }
]`;

    const text = await generate(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid recommendations');
    return JSON.parse(jsonMatch[0]);
  }

  // --- AI Tutor Chat ---
  function buildChatSystem(userProfile, subject) {
    return `You are EduBot, a friendly and knowledgeable AI tutor for EDULEARN platform.

Student Profile:
- Name: ${userProfile.name}
- Grade: ${userProfile.grade}
- Learning Style: ${userProfile.learningStyle}
- Current Subject Focus: ${subject}

Guidelines:
- Use a warm, encouraging, and patient tone
- Adapt explanations to Grade ${userProfile.grade} level
- Use the ${userProfile.learningStyle} learning approach
- Break down complex concepts into simple steps
- Use real-world examples and analogies
- Include emojis sparingly to make responses engaging
- When solving math/science problems, show step-by-step work
- Encourage the student and celebrate their efforts
- Format responses with clear structure using markdown
- Keep responses focused and not too long (200-300 words max unless complex topic)`;
  }

  return {
    generate,
    generateStream,
    generateLesson,
    generateQuiz,
    generateCareerRecommendations,
    generateStudyRecommendations,
    buildChatSystem,
  };
})();
