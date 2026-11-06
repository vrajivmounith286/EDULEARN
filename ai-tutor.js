/* ============================================================
   EDULEARN — AI Tutor Module
   ============================================================ */
const AiTutor = (() => {
  let subject = 'general';
  let chatHistory = [];
  let isLoading = false;

  function setSubject(val) {
    subject = val;
  }

  function handleKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  async function send() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || isLoading) return;

    input.value = '';
    input.style.height = 'auto';
    appendMessage('user', text);
    chatHistory.push({ role: 'user', content: text });

    if (!Storage.getApiKey()) {
      appendMessage('bot', `👋 Hello! I'm EduBot, your AI tutor. To chat with me, please add your **Google Gemini API key** in ⚙️ **Settings**.\n\nYou can get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey). Once added, I can help you with any subject!`);
      return;
    }

    isLoading = true;
    const sendBtn = document.getElementById('chat-send-btn');
    if (sendBtn) sendBtn.disabled = true;

    const typingId = showTyping();
    const user = Storage.getUser();

    try {
      const systemPrompt = Gemini.buildChatSystem(user, subject);
      const contextPrompt = buildContextPrompt(text);

      const msgEl = prepareStreamMessage(typingId);

      let fullResponse = '';
      try {
        for await (const chunk of Gemini.generateStream(contextPrompt, systemPrompt)) {
          fullResponse += chunk;
          msgEl.innerHTML = marked.parse(fullResponse);
          scrollToBottom();
        }
      } catch {
        // Fallback to non-streaming
        fullResponse = await Gemini.generate(contextPrompt, systemPrompt);
        msgEl.innerHTML = marked.parse(fullResponse);
      }

      chatHistory.push({ role: 'bot', content: fullResponse });
      Storage.addActivity({ type: 'lesson', title: `AI Tutor: ${text.slice(0, 40)}...`, subject });

    } catch (err) {
      removeTyping(typingId);
      appendMessage('bot', `❌ Error: ${err.message}. Please check your API key in Settings.`);
    } finally {
      isLoading = false;
      if (sendBtn) sendBtn.disabled = false;
      scrollToBottom();
    }
  }

  function buildContextPrompt(userMessage) {
    // Include last 3 exchanges for context
    const context = chatHistory.slice(-6).map(m =>
      `${m.role === 'user' ? 'Student' : 'EduBot'}: ${m.content}`
    ).join('\n\n');
    return context ? `Previous conversation:\n${context}\n\nStudent: ${userMessage}` : userMessage;
  }

  function appendMessage(role, text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    // Remove welcome screen
    const welcome = container.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const user = Storage.getUser();
    const initials = user ? user.name.charAt(0).toUpperCase() : 'S';

    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `
      <div class="message-avatar">${role === 'bot' ? '🤖' : initials}</div>
      <div class="message-bubble">${marked.parse(text)}</div>
    `;
    container.appendChild(div);
    scrollToBottom();
    return div;
  }

  function showTyping() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const welcome = container.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'message bot';
    div.id = id;
    div.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    container.appendChild(div);
    scrollToBottom();
    return id;
  }

  function prepareStreamMessage(typingId) {
    const typing = document.getElementById(typingId);
    if (!typing) return null;
    const bubble = typing.querySelector('.message-bubble');
    if (bubble) bubble.innerHTML = '';
    return bubble;
  }

  function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }

  function sendQuick(text) {
    const input = document.getElementById('chat-input');
    if (input) { input.value = text; send(); }
  }

  function clearChat() {
    const container = document.getElementById('chat-messages');
    chatHistory = [];
    if (container) {
      container.innerHTML = `
        <div class="chat-welcome">
          <div class="welcome-icon">🤖</div>
          <h2>Hello! I'm your AI Tutor</h2>
          <p>Ask me anything about your subjects. I'll explain concepts, solve problems step-by-step, and help you understand better!</p>
          <div class="quick-prompts">
            <button class="quick-prompt" onclick="AiTutor.sendQuick('Explain photosynthesis in simple terms')">🌱 Explain photosynthesis</button>
            <button class="quick-prompt" onclick="AiTutor.sendQuick('How do I solve quadratic equations?')">📐 Quadratic equations</button>
            <button class="quick-prompt" onclick="AiTutor.sendQuick('What is a variable in programming?')">💻 What is a variable?</button>
            <button class="quick-prompt" onclick="AiTutor.sendQuick('Explain World War 2 briefly')">🏛️ World War 2</button>
          </div>
        </div>
      `;
    }
  }

  // Auto-resize textarea
  function initTextarea() {
    const ta = document.getElementById('chat-input');
    if (ta) {
      ta.addEventListener('input', () => {
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
      });
    }
  }

  function init() { initTextarea(); }

  return { send, sendQuick, handleKey, setSubject, clearChat, init };
})();
