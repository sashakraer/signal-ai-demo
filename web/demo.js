/* ============================================
   Signal AI Visual Demo — Demo Logic
   Flow control, animations, use case rendering
   ============================================ */

// --- State ---
let currentUC = null;
let currentBeat = 0;
let fullDemoMode = false;
let fullDemoQueue = [];
let autoAdvanceTimer = null;

// --- DOM refs ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const screens = {
  landing: $('#landing'),
  demo: $('#demo')
};

// --- Password Gate ---
const PASS_HASH = '311d96cd0e5a6231365fe2c6acec2563cf878a3e6653c3a77b92de4662863e3b';

async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function initGate() {
  const gate = document.getElementById('gate');
  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-input');
  const error = document.getElementById('gate-error');

  // Skip gate if already authenticated this session
  if (sessionStorage.getItem('signal_auth') === '1') {
    gate.classList.add('hidden');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hash = await sha256(input.value.trim());
    if (hash === PASS_HASH) {
      sessionStorage.setItem('signal_auth', '1');
      gate.classList.add('hidden');
      error.textContent = '';
    } else {
      error.textContent = 'Incorrect code. Try again.';
      input.value = '';
      input.focus();
    }
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  // Password gate
  initGate();

  // Bind use-case cards
  $$('.uc-card').forEach(card => {
    card.addEventListener('click', () => {
      const uc = card.dataset.uc;
      startUseCase(uc);
    });
  });

  // Run All button
  $('#run-all-btn').addEventListener('click', startFullDemo);

  // Navigation
  $('#back-btn').addEventListener('click', goBack);
  $('#prev-beat').addEventListener('click', () => navigateBeat(-1));
  $('#next-beat').addEventListener('click', () => navigateBeat(1));

  // Nav dots
  $$('.nav-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const beat = parseInt(dot.dataset.beat);
      goToBeat(beat);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!screens.demo.classList.contains('active')) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      navigateBeat(dir);
    }
    if (e.key === 'Escape') goBack();
  });
});

// --- Screen management ---
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  screens[name].classList.add('screen-transition');
  setTimeout(() => screens[name].classList.remove('screen-transition'), 600);
}

// --- Use Case Flow ---
function startUseCase(ucKey) {
  currentUC = ucKey;
  currentBeat = 0;
  const data = DEMO_DATA[ucKey];

  // Set header
  const titles = {
    meetingPrep: 'Meeting Prep',
    collision: 'Collision Detection',
    risk: 'Risk Signal',
    salesIntel: 'Sales Intelligence'
  };
  const emojis = {
    meetingPrep: '⚠️',
    collision: '🤝',
    risk: '🚨',
    salesIntel: '🔎'
  };

  $('#demo-uc-emoji').textContent = emojis[ucKey];
  $('#demo-uc-title').textContent = titles[ucKey];
  $('#demo-account-badge').textContent = data.account;

  // Set accent color on demo screen
  const colors = {
    meetingPrep: '#3b82f6',
    collision: '#f59e0b',
    risk: '#ef4444',
    salesIntel: '#8b5cf6'
  };
  screens.demo.style.setProperty('--accent', colors[ucKey]);

  // Render all 3 beats
  renderProblem(ucKey, data);
  renderSignal(ucKey, data);
  renderImpact(ucKey, data);

  // Show demo screen and first beat
  showScreen('demo');
  goToBeat(0);
}

// --- Beat Navigation ---
function goToBeat(beat) {
  // Clear any pending auto-advance
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }

  currentBeat = beat;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update beats
  $$('.beat').forEach(b => b.classList.remove('active'));
  $(`#beat-${beat}`).classList.add('active');

  // Update dots
  $$('.nav-dot').forEach((d, i) => {
    d.classList.toggle('active', i === beat);
  });

  // Update nav buttons
  $('#prev-beat').disabled = (beat === 0);
  $('#next-beat').disabled = (beat === 2);
  $('#beat-num').textContent = beat + 1;

  // Special animation for beat 1 (message reveal)
  if (beat === 1) {
    playMessageAnimation();
  }

  // Auto-advance in full demo mode
  if (fullDemoMode && beat < 2) {
    const delay = beat === 1 ? 6000 : 4500;
    autoAdvanceTimer = setTimeout(() => {
      if (fullDemoMode && currentBeat === beat) {
        navigateBeat(1);
      }
    }, delay);
  } else if (fullDemoMode && beat === 2) {
    autoAdvanceTimer = setTimeout(() => {
      if (fullDemoMode) advanceFullDemo();
    }, 5000);
  }
}

function navigateBeat(dir) {
  const next = currentBeat + dir;
  if (next >= 0 && next <= 2) {
    goToBeat(next);
  }
}

function goBack() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  fullDemoMode = false;
  fullDemoQueue = [];
  showScreen('landing');
  window.scrollTo({ top: 0 });
}

// --- Full Demo Mode ---
function startFullDemo() {
  fullDemoMode = true;
  fullDemoQueue = ['meetingPrep', 'collision', 'risk', 'salesIntel'];
  advanceFullDemo();
}

function advanceFullDemo() {
  if (fullDemoQueue.length === 0) {
    fullDemoMode = false;
    goBack();
    return;
  }
  const next = fullDemoQueue.shift();
  startUseCase(next);
}

// --- Message Animation (all channels) ---
function playMessageAnimation() {
  const typing = $('#channel-typing');
  const message = $('#channel-message');
  if (!typing || !message) return;

  // Reset
  typing.classList.remove('show');
  message.classList.remove('show');

  // Show typing indicator
  setTimeout(() => {
    typing.classList.add('show');
  }, 300);

  // Hide typing, show message
  setTimeout(() => {
    typing.classList.remove('show');
    message.classList.add('show');
  }, 1800);
}

// ============================================
// RENDER: Beat 1 — Problem
// ============================================
function renderProblem(ucKey, data) {
  const container = $('#problem-content');
  container.innerHTML = '';

  if (ucKey === 'meetingPrep') {
    renderMeetingPrepProblem(container, data);
  } else if (ucKey === 'collision') {
    renderCollisionProblem(container, data);
  } else if (ucKey === 'risk') {
    renderRiskProblem(container, data);
  } else if (ucKey === 'salesIntel') {
    renderSalesIntelProblem(container, data);
  }
}

function renderMeetingPrepProblem(container, data) {
  // Info chips
  const chips = document.createElement('div');
  chips.className = 'info-chips';
  chips.innerHTML = `
    <span class="chip">${data.segment}</span>
    <span class="chip chip-accent">💰 ${data.contract}</span>
    <span class="chip chip-warn">📅 חידוש בעוד ${data.daysToRenewal} ימים</span>
    <span class="chip">👤 CSM: ${data.csm}</span>
  `;
  container.appendChild(chips);

  // Scenario text
  const scenario = document.createElement('div');
  scenario.className = 'problem-scenario rtl';
  scenario.innerHTML = `
    <strong>${data.csm}</strong> הולך לפגישת חידוש עם <strong>${data.account}</strong> מחר.
    <br>הוא לא יודע ש...
  `;
  container.appendChild(scenario);

  // Blind spots
  const blindSpots = document.createElement('div');
  blindSpots.className = 'blind-spots';
  data.blindSpots.forEach(bs => {
    const card = document.createElement('div');
    card.className = 'blind-spot-card rtl';
    card.innerHTML = `
      <span class="bs-icon">${bs.icon}</span>
      <div>
        <div class="bs-text">${bs.text}</div>
        <div class="bs-detail">${bs.detail}</div>
      </div>
    `;
    blindSpots.appendChild(card);
  });
  container.appendChild(blindSpots);
}

function renderCollisionProblem(container, data) {
  // Info chips
  const chips = document.createElement('div');
  chips.className = 'info-chips';
  chips.innerHTML = `
    <span class="chip">${data.segment}</span>
    <span class="chip chip-accent">💰 ${data.contract}</span>
    <span class="chip chip-danger">🤝 ${data.people.length} אנשים בקשר עם הלקוח</span>
  `;
  container.appendChild(chips);

  const scenario = document.createElement('div');
  scenario.className = 'problem-scenario rtl';
  scenario.innerHTML = `
    שלושה אנשים יצרו קשר עם <strong>${data.account}</strong> באותו שבוע — בלי לדעת אחד על השני
  `;
  container.appendChild(scenario);

  // Timeline
  const timeline = document.createElement('div');
  timeline.className = 'collision-timeline';

  data.people.forEach((person, i) => {
    person.actions.forEach(action => {
      const entry = document.createElement('div');
      entry.className = 'timeline-entry';
      entry.style.animationDelay = `${i * 0.3}s`;
      entry.innerHTML = `
        <div class="timeline-dot" style="background: ${person.color}"></div>
        <div class="timeline-body rtl">
          <div class="timeline-meta">
            <span class="timeline-name">${person.name}</span>
            <span class="timeline-role" style="background: ${person.color}22; color: ${person.color}">${person.role}</span>
            <span class="timeline-date">${action.date}</span>
          </div>
          <div class="timeline-text">${action.text}</div>
          <div class="timeline-detail">${action.detail}</div>
        </div>
      `;
      timeline.appendChild(entry);
    });
  });
  container.appendChild(timeline);

  // Customer noticed
  if (data.customerNoticed) {
    const noticed = document.createElement('div');
    noticed.className = 'customer-noticed rtl';
    noticed.innerHTML = `
      <div class="cn-label">⚠️ הלקוח שם לב</div>
      <div class="cn-quote">"${data.customerQuote}"</div>
    `;
    container.appendChild(noticed);
  }
}

function renderRiskProblem(container, data) {
  // Info chips
  const chips = document.createElement('div');
  chips.className = 'info-chips';
  chips.innerHTML = `
    <span class="chip">${data.segment} · ${data.industry}</span>
    <span class="chip chip-accent">💰 ${data.contract}</span>
    <span class="chip chip-warn">📅 חידוש בעוד ${data.daysToRenewal} ימים</span>
    <span class="chip">👤 CSM: ${data.csm}</span>
  `;
  container.appendChild(chips);

  // Risk meter
  const meter = document.createElement('div');
  meter.className = 'risk-meter';
  meter.innerHTML = `
    <div class="risk-score-circle">
      <div class="risk-score-number" id="risk-counter">0</div>
      <div class="risk-score-label">${data.riskLevel}</div>
    </div>
  `;
  container.appendChild(meter);

  // Animate counter
  setTimeout(() => animateCounter('risk-counter', data.riskScore), 300);

  // Score breakdown
  const breakdown = document.createElement('div');
  breakdown.className = 'risk-breakdown';
  data.scoreBreakdown.forEach(item => {
    const bar = document.createElement('div');
    bar.className = 'risk-bar';
    bar.innerHTML = `
      <span class="risk-bar-label">${item.label}</span>
      <div class="risk-bar-track">
        <div class="risk-bar-fill" style="width: 0%" data-width="${item.points}%"></div>
      </div>
      <span class="risk-bar-points">+${item.points}</span>
    `;
    breakdown.appendChild(bar);
  });
  container.appendChild(breakdown);

  // Animate bars
  setTimeout(() => {
    breakdown.querySelectorAll('.risk-bar-fill').forEach(fill => {
      fill.style.width = fill.dataset.width;
    });
  }, 500);

  // Risk signals list
  const signals = document.createElement('div');
  signals.className = 'blind-spots';
  data.signals.forEach(sig => {
    const card = document.createElement('div');
    card.className = 'blind-spot-card rtl';
    card.innerHTML = `
      <span class="bs-icon">${sig.icon}</span>
      <div>
        <div class="bs-text">${sig.type}</div>
        <div class="bs-detail">${sig.text}</div>
      </div>
    `;
    signals.appendChild(card);
  });
  container.appendChild(signals);
}

function renderSalesIntelProblem(container, data) {
  // Info chips
  const chips = document.createElement('div');
  chips.className = 'info-chips';
  chips.innerHTML = `
    <span class="chip">${data.segment} · ${data.industry}</span>
    <span class="chip chip-accent">💰 ${data.contract}</span>
    <span class="chip chip-warn">📈 הרחבה: ${data.expansion}</span>
    <span class="chip">👤 AE: ${data.ae}</span>
  `;
  container.appendChild(chips);

  const scenario = document.createElement('div');
  scenario.className = 'problem-scenario rtl';
  scenario.innerHTML = `
    <strong>${data.ae}</strong> מגיע לביקור אצל <strong>${data.account}</strong>.
    <br>הוא מכיר <strong style="color: var(--red)">2 מתוך 7</strong> מקבלי החלטות.
    <br>ה-CSM (<strong>${data.csm}</strong>) יודע הכל — אבל ה-AE לא רואה את זה.
  `;
  container.appendChild(scenario);

  // Contact map
  const map = document.createElement('div');
  map.className = 'contact-map';
  data.contacts.forEach((contact, i) => {
    const row = document.createElement('div');
    row.className = 'contact-row';
    row.style.animationDelay = `${i * 0.1}s`;
    const statusIcon = contact.aeKnows ? '✅' : '❌';
    const borderColor = contact.aeKnows ? 'var(--green)' : 'var(--red)';
    row.style.borderLeft = `3px solid ${borderColor}`;
    row.innerHTML = `
      <span class="contact-icon">${contact.icon}</span>
      <div class="contact-info">
        <div class="contact-name">${contact.name}</div>
        <div class="contact-title">${contact.title}</div>
      </div>
      <span class="contact-role-badge" style="background: var(--bg); border: 1px solid var(--border)">${contact.role}</span>
      <span class="contact-status">${statusIcon}</span>
    `;
    map.appendChild(row);
  });
  container.appendChild(map);

  // Hidden intel
  const intelSection = document.createElement('div');
  intelSection.className = 'hidden-intel';

  const intelTitle = document.createElement('div');
  intelTitle.className = 'problem-scenario rtl';
  intelTitle.style.marginTop = '16px';
  intelTitle.innerHTML = '🔒 <strong>מידע שקיים במערכת — אבל ה-AE לא רואה:</strong>';
  container.appendChild(intelTitle);

  data.hiddenIntel.forEach((intel, i) => {
    const card = document.createElement('div');
    card.className = 'intel-card rtl';
    card.style.animationDelay = `${0.8 + i * 0.2}s`;
    card.innerHTML = `
      <span class="intel-icon">${intel.icon}</span>
      <div>
        <span class="intel-type intel-type-${intel.type}">${intel.type}</span>
        <span class="intel-source"> · ${intel.source} (${intel.date})</span>
        <div class="intel-text">${intel.text}</div>
      </div>
    `;
    intelSection.appendChild(card);
  });
  container.appendChild(intelSection);
}

// ============================================
// RENDER: Beat 2 — Signal (Multi-Channel)
// ============================================

const RADAR_SVG_SM = `<svg viewBox="0 0 120 120" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="56" fill="#0c2d4a" stroke="#1e4d8a" stroke-width="2"/>
  <circle cx="60" cy="60" r="42" fill="none" stroke="#1e4d8a" stroke-width="1" opacity="0.4"/>
  <circle cx="60" cy="60" r="28" fill="none" stroke="#2563eb" stroke-width="1" opacity="0.5"/>
  <circle cx="60" cy="60" r="14" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.6"/>
  <line x1="60" y1="60" x2="60" y2="8" stroke="#3b82f6" stroke-width="2" opacity="0.8">
    <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="4s" repeatCount="indefinite"/>
  </line>
  <circle cx="60" cy="60" r="3" fill="#3b82f6"/>
  <circle cx="45" cy="38" r="3" fill="#60a5fa" opacity="0.8"/>
  <circle cx="78" cy="50" r="2.5" fill="#93c5fd" opacity="0.7"/>
</svg>`;

function renderSignal(ucKey, data) {
  const container = $('#signal-content');
  container.innerHTML = '';
  const signal = data.signal;
  const channel = signal.channel || 'whatsapp';

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const mins = now.getMinutes().toString().padStart(2, '0');
  const timestamp = `${hours}:${mins}`;

  // Build message lines HTML (shared by all channels)
  const linesHTML = signal.message.lines.map(l =>
    `<div class="ch-msg-line"><span class="ch-msg-icon">${l.icon}</span><span>${l.text}</span></div>`
  ).join('');

  let frameHTML = '';

  if (channel === 'whatsapp') {
    frameHTML = `
      <div class="phone-frame channel-whatsapp">
        <div class="phone-notch"></div>
        <div class="ch-header ch-header-whatsapp">
          <div class="ch-avatar">${RADAR_SVG_SM}</div>
          <div class="ch-header-info">
            <div class="ch-header-name">Signal AI</div>
            <div class="ch-header-status">online</div>
          </div>
        </div>
        <div class="ch-body ch-body-whatsapp">
          <div class="ch-typing" id="channel-typing">
            <span></span><span></span><span></span>
          </div>
          <div class="ch-message ch-bubble-whatsapp" id="channel-message">
            <div class="ch-msg-title">${signal.message.title}</div>
            <div class="ch-msg-lines">${linesHTML}</div>
            <div class="ch-msg-time">${timestamp} ✓✓</div>
          </div>
        </div>
      </div>`;

  } else if (channel === 'email') {
    frameHTML = `
      <div class="phone-frame channel-email">
        <div class="phone-notch"></div>
        <div class="ch-header ch-header-email">
          <div class="ch-avatar ch-avatar-email">✉️</div>
          <div class="ch-header-info">
            <div class="ch-header-name">Outlook</div>
            <div class="ch-header-status">Inbox</div>
          </div>
        </div>
        <div class="ch-body ch-body-email">
          <div class="ch-typing" id="channel-typing">
            <span></span><span></span><span></span>
          </div>
          <div class="ch-message ch-email-card" id="channel-message">
            <div class="ch-email-meta">
              <div class="ch-email-from">
                <span class="ch-email-sender-avatar">${RADAR_SVG_SM}</span>
                <div>
                  <div class="ch-email-sender">Signal AI</div>
                  <div class="ch-email-addr">signal-ai@company.com</div>
                </div>
                <span class="ch-email-time">${timestamp}</span>
              </div>
              <div class="ch-email-to">To: ${signal.to}</div>
              <div class="ch-email-subject">${signal.message.title}</div>
            </div>
            <div class="ch-email-body">
              <div class="ch-msg-lines">${linesHTML}</div>
            </div>
          </div>
        </div>
      </div>`;

  } else if (channel === 'teams') {
    frameHTML = `
      <div class="phone-frame channel-teams">
        <div class="phone-notch"></div>
        <div class="ch-header ch-header-teams">
          <div class="ch-avatar ch-avatar-teams">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M19.19 8.77q-.46 0-.86-.17a2.2 2.2 0 0 1-.7-.47 2.2 2.2 0 0 1-.47-.7 2.15 2.15 0 0 1-.17-.86q0-.46.17-.86.18-.4.47-.7.3-.3.7-.47.4-.17.86-.17t.86.17q.4.18.7.47.3.3.47.7.17.4.17.86t-.17.86q-.18.4-.47.7-.3.3-.7.47-.4.17-.86.17Zm-3.24.48h5.48a1 1 0 0 1 1 1v4.46a2.73 2.73 0 0 1-2.73 2.73h-.02a2.73 2.73 0 0 1-2.73-2.73V10.25a1 1 0 0 1 1-1ZM9.44 7.56a2.78 2.78 0 1 0 0-5.56 2.78 2.78 0 0 0 0 5.56Zm3.78 2h-8.3a1.36 1.36 0 0 0-1.35 1.36v5.66a4.52 4.52 0 0 0 9.03 0v-5.66a1.36 1.36 0 0 0-1.35-1.36Z"/></svg>
          </div>
          <div class="ch-header-info">
            <div class="ch-header-name">Microsoft Teams</div>
            <div class="ch-header-status">Signal AI Bot</div>
          </div>
        </div>
        <div class="ch-body ch-body-teams">
          <div class="ch-typing" id="channel-typing">
            <span></span><span></span><span></span>
          </div>
          <div class="ch-message ch-teams-msg" id="channel-message">
            <div class="ch-teams-sender">
              <span class="ch-teams-bot-avatar">${RADAR_SVG_SM}</span>
              <span class="ch-teams-bot-name">Signal AI</span>
              <span class="ch-teams-time">${timestamp}</span>
            </div>
            <div class="ch-teams-card">
              <div class="ch-teams-card-accent"></div>
              <div class="ch-teams-card-body">
                <div class="ch-msg-title">${signal.message.title}</div>
                <div class="ch-msg-lines">${linesHTML}</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

  } else if (channel === 'slack') {
    frameHTML = `
      <div class="phone-frame channel-slack">
        <div class="phone-notch"></div>
        <div class="ch-header ch-header-slack">
          <div class="ch-avatar ch-avatar-slack">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M5.04 15.04a2.12 2.12 0 1 1-2.12-2.12h2.12v2.12zm1.07 0a2.12 2.12 0 1 1 4.24 0v5.32a2.12 2.12 0 1 1-4.24 0v-5.32zm2.12-10.08a2.12 2.12 0 1 1 2.12-2.12v2.12H8.23zm0 1.07a2.12 2.12 0 1 1 0 4.24H2.91a2.12 2.12 0 1 1 0-4.24h5.32zm10.08 2.12a2.12 2.12 0 1 1 2.12 2.12h-2.12V8.15zm-1.07 0a2.12 2.12 0 1 1-4.24 0V2.83a2.12 2.12 0 1 1 4.24 0v5.32zm-2.12 10.08a2.12 2.12 0 1 1-2.12 2.12v-2.12h2.12zm0-1.07a2.12 2.12 0 1 1 0-4.24h5.32a2.12 2.12 0 1 1 0 4.24h-5.32z"/></svg>
          </div>
          <div class="ch-header-info">
            <div class="ch-header-name"># signal-alerts</div>
            <div class="ch-header-status">Slack</div>
          </div>
        </div>
        <div class="ch-body ch-body-slack">
          <div class="ch-typing" id="channel-typing">
            <span></span><span></span><span></span>
          </div>
          <div class="ch-message ch-slack-msg" id="channel-message">
            <div class="ch-slack-sender">
              <span class="ch-slack-bot-avatar">${RADAR_SVG_SM}</span>
              <div>
                <span class="ch-slack-bot-name">Signal AI</span>
                <span class="ch-slack-badge">APP</span>
                <span class="ch-slack-time">${timestamp}</span>
              </div>
            </div>
            <div class="ch-slack-attachment">
              <div class="ch-slack-attach-accent"></div>
              <div class="ch-slack-attach-body">
                <div class="ch-msg-title">${signal.message.title}</div>
                <div class="ch-msg-lines">${linesHTML}</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  container.innerHTML = frameHTML;
}

// ============================================
// RENDER: Beat 3 — Impact
// ============================================
function renderImpact(ucKey, data) {
  const container = $('#impact-content');
  container.innerHTML = '';

  const impact = data.impact;
  const wrapper = document.createElement('div');
  wrapper.className = 'impact-container';

  // Before/After comparison
  const comparison = document.createElement('div');
  comparison.className = 'impact-comparison';
  comparison.innerHTML = `
    <div class="impact-box before">
      <div class="impact-box-label">❌ Before Signal AI</div>
      <div class="impact-box-text">${impact.before}</div>
    </div>
    <div class="impact-box after">
      <div class="impact-box-label">✅ After Signal AI</div>
      <div class="impact-box-text">${impact.after}</div>
    </div>
  `;
  wrapper.appendChild(comparison);

  // Metric
  const metric = document.createElement('div');
  metric.className = 'impact-metric';
  metric.innerHTML = `
    <div class="impact-metric-value">${impact.metric}</div>
    <div class="impact-metric-label">${impact.metricLabel}</div>
  `;
  wrapper.appendChild(metric);

  container.appendChild(wrapper);
}

// ============================================
// Utilities
// ============================================
function animateCounter(elementId, target) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let current = 0;
  const duration = 1500;
  const step = target / (duration / 16);

  function tick() {
    current += step;
    if (current >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.round(current);
    requestAnimationFrame(tick);
  }
  tick();
}
