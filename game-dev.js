(() => {
  'use strict';

  const STATE_KEY = 'quickDeckGameDevStateV1';
  const PUBLIC_KEY = 'quickDeckGameDevPublicV1';
  const CHANNEL_NAME = 'quickdeck-game-dev-v1';
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;

  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const nowIso = () => new Date().toISOString();

  const initialState = {
    projectName: '最後の謎が解けるまで',
    sectionName: '第5章',
    streamEnabled: true,
    messages: [],
    reviews: [],
    tasks: [],
    settings: [],
    scenarios: [],
    lastReviewConfirmedCount: 0
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
      return saved ? { ...initialState, ...saved } : structuredClone(initialState);
    } catch {
      return structuredClone(initialState);
    }
  }

  let state = loadState();
  let typingDraft = false;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const els = {
    projectName: $('#projectName'), sectionName: $('#sectionName'), streamEnabled: $('#streamEnabled'),
    saveState: $('#saveState'), progressText: $('#progressText'), progressBar: $('#progressBar'),
    chatList: $('#chatList'), chatForm: $('#chatForm'), chatInput: $('#chatInput'), chatHidden: $('#chatHidden'),
    reviewList: $('#reviewList'), reviewForm: $('#reviewForm'), reviewInput: $('#reviewInput'), reviewHidden: $('#reviewHidden'), generateReviewBtn: $('#generateReviewBtn'),
    taskForm: $('#taskForm'), taskInput: $('#taskInput'), taskHidden: $('#taskHidden'), todoList: $('#todoList'), doneList: $('#doneList'), taskCountBadge: $('#taskCountBadge'),
    settingForm: $('#settingForm'), settingCategory: $('#settingCategory'), settingLabel: $('#settingLabel'), settingValue: $('#settingValue'), settingHidden: $('#settingHidden'), settingsList: $('#settingsList'),
    scenarioForm: $('#scenarioForm'), scenarioTitle: $('#scenarioTitle'), scenarioBody: $('#scenarioBody'), scenarioHidden: $('#scenarioHidden'), scenarioList: $('#scenarioList'),
    sideSection: $('#sideSection'), sideTodo: $('#sideTodo'), sideDone: $('#sideDone'), sideConfirmed: $('#sideConfirmed'), miniPreview: $('#miniPreview')
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function save() {
    els.saveState.textContent = '保存中…';
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    publishPublic();
    requestAnimationFrame(() => { els.saveState.textContent = '保存済み'; });
  }

  function progress() {
    if (!state.tasks.length) return 0;
    const done = state.tasks.filter(t => t.done).length;
    return Math.round(done / state.tasks.length * 100);
  }

  function makeMask(seed, lines = 3) {
    const widths = [72, 54, 83, 46, 66, 58];
    const offset = Math.abs(Number(seed) || 0) % widths.length;
    return Array.from({ length: lines }, (_, i) => widths[(offset + i) % widths.length]);
  }

  function messagePublicShape(message, index) {
    if (message.streamHidden) return null;
    return {
      id: message.id,
      author: message.author,
      confirmed: !!message.confirmed,
      mask: makeMask(index + message.text.length, message.author === 'assistant' ? 3 : 2)
    };
  }

  function publicSnapshot() {
    const visibleMessages = state.messages
      .slice(-14)
      .map(messagePublicShape)
      .filter(Boolean);

    const visibleReviews = state.reviews
      .filter(r => !r.streamHidden)
      .slice(-3)
      .map(r => ({ id: r.id, text: r.text, createdAt: r.createdAt }));

    const visibleTasks = state.tasks
      .filter(t => !t.streamHidden)
      .slice()
      .sort((a, b) => Number(a.done) - Number(b.done) || a.createdAt.localeCompare(b.createdAt))
      .slice(0, 8)
      .map(t => ({ id: t.id, text: t.text, done: !!t.done }));

    return {
      version: 1,
      projectName: state.projectName,
      sectionName: state.sectionName,
      streamEnabled: !!state.streamEnabled,
      progress: progress(),
      messages: visibleMessages,
      reviews: visibleReviews,
      tasks: visibleTasks,
      typing: typingDraft && !els.chatHidden?.checked,
      updatedAt: nowIso()
    };
  }

  function publishPublic() {
    const snapshot = publicSnapshot();
    localStorage.setItem(PUBLIC_KEY, JSON.stringify(snapshot));
    channel?.postMessage({ type: 'public-state', payload: snapshot });
    renderMiniPreview(snapshot);
  }

  function renderAll() {
    els.projectName.value = state.projectName;
    els.sectionName.value = state.sectionName;
    els.streamEnabled.checked = state.streamEnabled;
    renderChat(); renderReviews(); renderTasks(); renderSettings(); renderScenarios(); renderStats();
    publishPublic();
  }

  function renderChat() {
    if (!state.messages.length) {
      els.chatList.innerHTML = '<div class="gd-empty">まだ制作ログはありません。ここで会話を始めると、配信側には伏せ字として動きが表示されます。</div>';
      return;
    }
    els.chatList.innerHTML = state.messages.map(m => `
      <article class="gd-message ${m.author === 'assistant' ? 'assistant' : 'user'} ${m.streamHidden ? 'hidden-from-stream' : ''}">
        <header><strong>${m.author === 'assistant' ? 'AI' : '白兎'}</strong><span>${m.confirmed ? '◆ 確定' : ''}${m.streamHidden ? ' 🔒' : ''}</span></header>
        <p>${escapeHtml(m.text).replaceAll('\n', '<br>')}</p>
        <footer>
          <button type="button" data-action="confirm-message" data-id="${m.id}">${m.confirmed ? '確定解除' : '確定事項にする'}</button>
          <button type="button" data-action="hide-message" data-id="${m.id}">${m.streamHidden ? '配信除外を解除' : '配信から除外'}</button>
          <button type="button" data-action="delete-message" data-id="${m.id}">削除</button>
        </footer>
      </article>`).join('');
    els.chatList.scrollTop = els.chatList.scrollHeight;
  }

  function renderReviews() {
    if (!state.reviews.length) {
      els.reviewList.innerHTML = '<div class="gd-empty">確定事項やタスクの進捗から、安全なレビューを生成できます。</div>';
      return;
    }
    els.reviewList.innerHTML = state.reviews.slice().reverse().map(r => `
      <article class="gd-review ${r.streamHidden ? 'hidden-from-stream' : ''}">
        <header><strong>開発レビュー</strong><span>${r.streamHidden ? '🔒 配信非表示' : '配信表示'}</span></header>
        <p>${escapeHtml(r.text).replaceAll('\n', '<br>')}</p>
        <footer><button type="button" data-action="hide-review" data-id="${r.id}">${r.streamHidden ? '配信表示にする' : '配信非表示'}</button><button type="button" data-action="delete-review" data-id="${r.id}">削除</button></footer>
      </article>`).join('');
  }

  function renderTasks() {
    const todo = state.tasks.filter(t => !t.done);
    const done = state.tasks.filter(t => t.done);
    const renderTask = t => `
      <article class="gd-list-item ${t.streamHidden ? 'hidden-from-stream' : ''}">
        <label><input type="checkbox" data-action="toggle-task" data-id="${t.id}" ${t.done ? 'checked' : ''} /><span>${escapeHtml(t.text)}</span></label>
        <div><button type="button" data-action="hide-task" data-id="${t.id}">${t.streamHidden ? '🔒' : '👁'}</button><button type="button" data-action="delete-task" data-id="${t.id}">×</button></div>
      </article>`;
    els.todoList.innerHTML = todo.length ? todo.map(renderTask).join('') : '<div class="gd-empty gd-empty--small">残りタスクなし</div>';
    els.doneList.innerHTML = done.length ? done.map(renderTask).join('') : '<div class="gd-empty gd-empty--small">完了タスクなし</div>';
    els.taskCountBadge.textContent = todo.length;
  }

  function renderSettings() {
    els.settingsList.innerHTML = state.settings.length ? state.settings.slice().reverse().map(s => `
      <article class="gd-info-card ${s.streamHidden ? 'hidden-from-stream' : ''}">
        <header><span>${escapeHtml(s.category || '設定')}</span><b>${s.streamHidden ? '🔒' : '👁'}</b></header>
        <h3>${escapeHtml(s.label)}</h3><p>${escapeHtml(s.value).replaceAll('\n', '<br>')}</p>
        <footer><button type="button" data-action="hide-setting" data-id="${s.id}">${s.streamHidden ? '配信除外中' : '配信可能'}</button><button type="button" data-action="delete-setting" data-id="${s.id}">削除</button></footer>
      </article>`).join('') : '<div class="gd-empty">確定したキャラクター設定・世界観・演出ルールなどを保存します。</div>';
  }

  function renderScenarios() {
    els.scenarioList.innerHTML = state.scenarios.length ? state.scenarios.slice().reverse().map(s => `
      <article class="gd-info-card ${s.streamHidden ? 'hidden-from-stream' : ''}">
        <header><span>SCENARIO</span><b>${s.streamHidden ? '🔒' : '👁'}</b></header>
        <h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.body || '（本文なし）').replaceAll('\n', '<br>')}</p>
        <footer><button type="button" data-action="hide-scenario" data-id="${s.id}">${s.streamHidden ? '配信除外中' : '配信可能'}</button><button type="button" data-action="delete-scenario" data-id="${s.id}">削除</button></footer>
      </article>`).join('') : '<div class="gd-empty">確定したシーンを章ごとに保存できます。初期状態では配信非表示です。</div>';
  }

  function renderStats() {
    const todo = state.tasks.filter(t => !t.done).length;
    const done = state.tasks.filter(t => t.done).length;
    const confirmed = state.messages.filter(m => m.confirmed).length;
    const pct = progress();
    els.progressText.textContent = `${pct}%`;
    els.progressBar.style.width = `${pct}%`;
    els.sideSection.textContent = state.sectionName || '制作中';
    els.sideTodo.textContent = todo;
    els.sideDone.textContent = done;
    els.sideConfirmed.textContent = confirmed;
  }

  function renderMiniPreview(snapshot) {
    if (!snapshot.streamEnabled) {
      els.miniPreview.innerHTML = '<span class="gd-mini-off">配信同期 OFF</span>';
      return;
    }
    const last = snapshot.messages.slice(-2);
    const lines = last.map(m => `<div><b>${m.author === 'assistant' ? 'AI' : '白兎'}</b>${m.mask.map(w => `<i style="width:${w}%"></i>`).join('')}</div>`).join('');
    const review = snapshot.reviews.at(-1)?.text || '評価待ち';
    els.miniPreview.innerHTML = `${lines || '<small>制作チャット待機中</small>'}<p>${escapeHtml(review)}</p>`;
  }

  function workspaceSnapshot() {
    return {
      projectName: state.projectName,
      sectionName: state.sectionName,
      messages: state.messages.map(m => ({ ...m })),
      reviews: state.reviews.map(r => ({ ...r })),
      tasks: state.tasks.map(t => ({ ...t })),
      settings: state.settings.map(s => ({ ...s })),
      scenarios: state.scenarios.map(s => ({ ...s }))
    };
  }

  function normalizeText(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function addWorkspaceMessage(author, text, streamHidden = false) {
    const item = { id: uid(), author: author === 'assistant' ? 'assistant' : 'user', text: String(text || '').trim(), streamHidden: !!streamHidden, confirmed: false, organized: false, createdAt: nowIso() };
    if (!item.text) return null;
    state.messages.push(item);
    save(); renderChat(); renderStats();
    return item;
  }

  function addWorkspaceReview(text, streamHidden = false, auto = true) {
    const item = { id: uid(), text: String(text || '').trim(), streamHidden: !!streamHidden, createdAt: nowIso(), auto: !!auto };
    if (!item.text) return null;
    state.reviews.push(item);
    save(); renderReviews(); renderStats();
    return item;
  }

  function applyOrganizedData(data = {}) {
    const tasks = Array.isArray(data.tasks) ? data.tasks : [];
    const completedTasks = Array.isArray(data.completedTasks) ? data.completedTasks : [];
    const settings = Array.isArray(data.settings) ? data.settings : [];
    const scenarios = Array.isArray(data.scenarios) ? data.scenarios : [];

    const taskKeys = new Set(state.tasks.map(t => normalizeText(t.text)));
    for (const t of tasks) {
      const text = String(t?.text || '').trim();
      const key = normalizeText(text);
      if (!text || taskKeys.has(key)) continue;
      state.tasks.push({ id: uid(), text, done: false, streamHidden: !!t.streamHidden, createdAt: nowIso() });
      taskKeys.add(key);
    }

    for (const t of completedTasks) {
      const text = String(t?.text || '').trim();
      if (!text) continue;
      const key = normalizeText(text);
      const existing = state.tasks.find(item => normalizeText(item.text) === key);
      if (existing) {
        existing.done = true;
        if (t.streamHidden) existing.streamHidden = true;
      } else {
        state.tasks.push({ id: uid(), text, done: true, streamHidden: !!t.streamHidden, createdAt: nowIso() });
      }
    }

    const settingKeys = new Set(state.settings.map(s => normalizeText([s.category, s.label, s.value].join('|'))));
    for (const s of settings) {
      const category = String(s?.category || '\u8a2d\u5b9a').trim();
      const label = String(s?.label || '').trim();
      const value = String(s?.value || '').trim();
      const key = normalizeText([category, label, value].join('|'));
      if (!label || !value || settingKeys.has(key)) continue;
      state.settings.push({ id: uid(), category, label, value, streamHidden: s.streamHidden !== false, createdAt: nowIso() });
      settingKeys.add(key);
    }

    const scenarioKeys = new Set(state.scenarios.map(s => normalizeText([s.title, s.body].join('|'))));
    for (const s of scenarios) {
      const title = String(s?.title || '').trim();
      const body = String(s?.body || '').trim();
      const key = normalizeText([title, body].join('|'));
      if (!title || !body || scenarioKeys.has(key)) continue;
      state.scenarios.push({ id: uid(), title, body, streamHidden: s.streamHidden !== false, createdAt: nowIso() });
      scenarioKeys.add(key);
    }

    save(); renderTasks(); renderSettings(); renderScenarios(); renderStats();
  }

  function markMessageOrganized(id) {
    const item = state.messages.find(m => m.id === id);
    if (!item) return;
    item.organized = true;
    save(); renderChat();
  }

  window.GameDevWorkspace = {
    getState: workspaceSnapshot,
    addMessage: addWorkspaceMessage,
    addReview: addWorkspaceReview,
    applyOrganized: applyOrganizedData,
    markMessageOrganized,
    publish: publishPublic
  };

  function generateReview() {
    const confirmed = state.messages.filter(m => m.confirmed).length;
    const newConfirmed = Math.max(0, confirmed - (state.lastReviewConfirmedCount || 0));
    const todo = state.tasks.filter(t => !t.done).length;
    const done = state.tasks.filter(t => t.done).length;
    const pct = progress();
    let lead = '制作内容の整理が進んでいます。';
    if (newConfirmed >= 3) lead = `前回以降に確定事項が${newConfirmed}件増え、シーンの具体化が進みました。`;
    else if (newConfirmed > 0) lead = `新しい確定事項が${newConfirmed}件追加され、制作内容が一段階具体化しました。`;
    else if (done > 0) lead = '大きな確定事項の追加はありませんが、既存タスクの消化が進んでいます。';

    const tail = todo === 0 && state.tasks.length
      ? '現在登録されているタスクはすべて完了しています。次の制作単位へ移れる状態です。'
      : `現在のタスク進捗は${pct}%です。残り${todo}件を中心に作業を続けられます。`;

    state.reviews.push({ id: uid(), text: `${lead}\n${tail}`, streamHidden: false, createdAt: nowIso(), auto: true });
    state.lastReviewConfirmedCount = confirmed;
    save(); renderReviews(); renderStats();
  }

  els.chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = els.chatInput.value.trim();
    if (!text) return;
    addWorkspaceMessage('user', text, els.chatHidden.checked);
    els.chatInput.value = ''; els.chatHidden.checked = false; typingDraft = false;
    publishPublic();
  });

  els.chatInput.addEventListener('input', () => {
    typingDraft = !!els.chatInput.value;
    publishPublic();
  });
  els.chatHidden.addEventListener('change', publishPublic);
  els.chatInput.addEventListener('blur', () => { typingDraft = false; publishPublic(); });

  els.reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = els.reviewInput.value.trim(); if (!text) return;
    state.reviews.push({ id: uid(), text, streamHidden: els.reviewHidden.checked, createdAt: nowIso(), auto: false });
    els.reviewInput.value = ''; els.reviewHidden.checked = false;
    save(); renderReviews();
  });
  els.generateReviewBtn.addEventListener('click', generateReview);

  els.taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = els.taskInput.value.trim(); if (!text) return;
    state.tasks.push({ id: uid(), text, done: false, streamHidden: els.taskHidden.checked, createdAt: nowIso() });
    els.taskInput.value = ''; els.taskHidden.checked = false;
    save(); renderTasks(); renderStats();
  });

  els.settingForm.addEventListener('submit', e => {
    e.preventDefault();
    const label = els.settingLabel.value.trim(); const value = els.settingValue.value.trim();
    if (!label || !value) return;
    state.settings.push({ id: uid(), category: els.settingCategory.value.trim(), label, value, streamHidden: els.settingHidden.checked, createdAt: nowIso() });
    els.settingCategory.value = ''; els.settingLabel.value = ''; els.settingValue.value = ''; els.settingHidden.checked = true;
    save(); renderSettings();
  });

  els.scenarioForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = els.scenarioTitle.value.trim(); if (!title) return;
    state.scenarios.push({ id: uid(), title, body: els.scenarioBody.value.trim(), streamHidden: els.scenarioHidden.checked, createdAt: nowIso() });
    els.scenarioTitle.value = ''; els.scenarioBody.value = ''; els.scenarioHidden.checked = true;
    save(); renderScenarios();
  });

  els.projectName.addEventListener('input', e => { state.projectName = e.target.value; save(); });
  els.sectionName.addEventListener('input', e => { state.sectionName = e.target.value; save(); renderStats(); });
  els.streamEnabled.addEventListener('change', e => { state.streamEnabled = e.target.checked; save(); });

  document.addEventListener('click', e => {
    const tab = e.target.closest('.gd-tab');
    if (tab) {
      $$('.gd-tab').forEach(b => b.classList.toggle('active', b === tab));
      $$('.gd-panel').forEach(p => p.classList.toggle('active', p.dataset.panelContent === tab.dataset.panel));
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const { action, id } = actionEl.dataset;
    const find = list => list.find(x => x.id === id);
    const remove = list => list.filter(x => x.id !== id);

    if (action === 'confirm-message') {
      const item = find(state.messages);
      if (item) {
        item.confirmed = !item.confirmed;
        if (!item.confirmed) item.organized = false;
        if (item.confirmed) setTimeout(() => window.GameDevAI?.organizeMessage?.(item), 0);
      }
    }
    if (action === 'hide-message') { const item = find(state.messages); if (item) item.streamHidden = !item.streamHidden; }
    if (action === 'delete-message') state.messages = remove(state.messages);
    if (action === 'hide-review') { const item = find(state.reviews); if (item) item.streamHidden = !item.streamHidden; }
    if (action === 'delete-review') state.reviews = remove(state.reviews);
    if (action === 'hide-task') { const item = find(state.tasks); if (item) item.streamHidden = !item.streamHidden; }
    if (action === 'delete-task') state.tasks = remove(state.tasks);
    if (action === 'hide-setting') { const item = find(state.settings); if (item) item.streamHidden = !item.streamHidden; }
    if (action === 'delete-setting') state.settings = remove(state.settings);
    if (action === 'hide-scenario') { const item = find(state.scenarios); if (item) item.streamHidden = !item.streamHidden; }
    if (action === 'delete-scenario') state.scenarios = remove(state.scenarios);

    save(); renderChat(); renderReviews(); renderTasks(); renderSettings(); renderScenarios(); renderStats();
  });

  document.addEventListener('change', e => {
    const input = e.target.closest('[data-action="toggle-task"]');
    if (!input) return;
    const item = state.tasks.find(t => t.id === input.dataset.id);
    if (!item) return;
    item.done = input.checked;
    save(); renderTasks(); renderStats();
  });

  window.addEventListener('storage', e => {
    if (e.key === STATE_KEY && e.newValue) {
      try { state = { ...initialState, ...JSON.parse(e.newValue) }; renderAll(); } catch {}
    }
  });

  renderAll();
})();
