const btn = document.getElementById('chat-button');
const box = document.getElementById('chat-box');
const input = document.getElementById('chat-input');
const send = document.getElementById('chat-send');
const messagesDiv = document.getElementById('chat-messages');
const clearBtn = document.getElementById('chat-clear');

// Toggle chat box
btn.onclick = () => {
  box.style.display = box.style.display === 'flex' ? 'none' : 'flex';
};

// ── HISTORY ──
const MAX_HISTORY = 10;
let chatHistory = JSON.parse(localStorage.getItem('benpireChat') || '[]');

function saveHistory() {
  localStorage.setItem('benpireChat', JSON.stringify(chatHistory));
}

function trimHistory() {
  if (chatHistory.length > MAX_HISTORY) {
    chatHistory = chatHistory.slice(-MAX_HISTORY);
  }
}

// ── RENDER A MESSAGE ──
function addMessage(text, role) {
  const wrap = document.createElement('div');
  wrap.className = `chat-msg ${role}`;

  const sender = document.createElement('div');
  sender.className = 'chat-sender';
  sender.textContent = role === 'user' ? 'You' : 'Imperial Advisor';

  const body = document.createElement('div');
  body.className = 'chat-text';
  body.textContent = text;

  wrap.appendChild(sender);
  wrap.appendChild(body);
  messagesDiv.appendChild(wrap);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Load previous messages on page load
chatHistory.forEach(msg => {
  addMessage(msg.content, msg.role === 'user' ? 'user' : 'advisor');
});

// Clear history
clearBtn.onclick = () => {
  chatHistory = [];
  saveHistory();
  messagesDiv.innerHTML = '';
};

// ── FETCH LORE FROM JSON FILES ──
async function getLore() {
  try {
    const [eventsRes, membersRes] = await Promise.all([
      fetch('events.json', { cache: 'no-cache' }),
      fetch('members.json', { cache: 'no-cache' })
    ]);
    const events  = await eventsRes.json();
    const members = await membersRes.json();
    return `MEMBERS: ${JSON.stringify(members.members).slice(0, 600)}\nEVENTS: ${JSON.stringify(events.events).slice(0, 800)}`;
  } catch {
    return 'Imperial records unavailable.';
  }
}

// ── SEND MESSAGE ──
async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, 'user');
  input.value = '';

  chatHistory.push({ role: 'user', content: userText });
  trimHistory();
  saveHistory();

  // Loading indicator
  const loading = document.createElement('div');
  loading.className = 'chat-msg advisor';
  loading.innerHTML = '<div class="chat-sender">Imperial Advisor</div><div class="chat-text" style="opacity:0.5;">...</div>';
  messagesDiv.appendChild(loading);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  const lore = await getLore();

  const systemPrompt = `You are the Imperial Advisor of the Benpire, a school empire ruled by the Grand Benperor Ben.

Current imperial records:
${lore}

Specific Questions:
- If the user is wondering how to join, direct them to the Admission page.
- If there is anything else you don't know, DON'T MAKE IT UP!!! Tell them you don't know, and direct them to the Contact page to reach out.

Rules:
- Speak in a regal, medieval tone — immersive but not over the top
- Address the user as traveler or citizen
- Reference members, events, and locations naturally when relevant
- Remember the flow of the conversation and previous messages
- Keep responses concise (2-4 sentences max)
- Stay in character at all times
- If asked about something not in the records, respond with polite uncertainty befitting a royal advisor
- Occasionally use short medieval-style interjections sparingly (e.g., "By the crown!", "As decreed!")
- Encourage and guide the user politely when appropriate
- Content pages include "About (where they can learn about the empire), Members (list of all members), Events (list of all current events), Admission (where they can seek citizenship), and Contact (where they can get in contact with the right hand man for any more questions)" 
`;

  try {
    const res = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory
        ]
      })
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;

    loading.remove();
    addMessage(reply, 'advisor');

    chatHistory.push({ role: 'assistant', content: reply });
    trimHistory();
    saveHistory();

  } catch (err) {
    loading.remove();
    addMessage('The imperial archives are unreachable at this time...', 'advisor');
    console.error(err);
  }
}

// ── EVENTS ──
send.onclick = sendMessage;
input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
