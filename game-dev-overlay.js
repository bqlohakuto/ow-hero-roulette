(() => {
  'use strict';
  const PUBLIC_KEY = 'quickDeckGameDevPublicV1';
  const CHANNEL_NAME = 'quickdeck-game-dev-v1';
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;
  const $ = s => document.querySelector(s);

  const els = {
    project: $('#overlayProject'), section: $('#overlaySection'), progressText: $('#overlayProgressText'), progressBar: $('#overlayProgressBar'),
    chat: $('#overlayChat'), review: $('#overlayReview'), tasks: $('#overlayTasks'), taskCount: $('#overlayTaskCount'), live: $('#overlayLiveState')
  };

  function escapeHtml(value) {
    return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  }

  function maskLines(widths) {
    return widths.map(w => `<i class="mask-line" style="--w:${w}%"></i>`).join('');
  }

  function render(snapshot) {
    if (!snapshot) return;
    const enabled = snapshot.streamEnabled !== false;
    document.body.classList.toggle('stream-disabled', !enabled);
    els.live.textContent = enabled ? 'LIVE' : 'OFF';
    els.project.textContent = snapshot.projectName || 'GAME DEV';
    els.section.textContent = snapshot.sectionName || '制作中';
    const pct = Number(snapshot.progress || 0);
    els.progressText.textContent = `${pct}%`;
    els.progressBar.style.width = `${pct}%`;

    if (!enabled) {
      els.chat.innerHTML = '<div class="overlay-empty">STREAM SYNC OFF</div>';
      els.review.innerHTML = '<div class="overlay-empty">配信同期が停止されています</div>';
      els.tasks.innerHTML = '';
      els.taskCount.textContent = '0';
      return;
    }

    const messages = snapshot.messages || [];
    const typing = snapshot.typing ? [{ id:'typing', author:'user', mask:[64,48], typing:true }] : [];
    const rows = [...messages, ...typing].slice(-10);
    els.chat.innerHTML = rows.length ? rows.map(m => `
      <article class="overlay-message ${m.author === 'assistant' ? 'assistant' : 'user'} ${m.typing ? 'typing' : ''}">
        <header><strong>${m.author === 'assistant' ? 'AI' : '白兎'}</strong><span>${m.confirmed ? '◆ CONFIRMED' : m.typing ? 'INPUT…' : ''}</span></header>
        <div class="mask-stack">${maskLines(m.mask || [70,52])}</div>
      </article>`).join('') : '<div class="overlay-empty">制作チャット待機中</div>';
    els.chat.scrollTop = els.chat.scrollHeight;

    const latest = (snapshot.reviews || []).at(-1);
    els.review.innerHTML = latest ? `<p>${escapeHtml(latest.text).replaceAll('\n','<br>')}</p>` : '<div class="overlay-empty">評価待ち</div>';

    const tasks = snapshot.tasks || [];
    els.taskCount.textContent = String(tasks.filter(t => !t.done).length);
    els.tasks.innerHTML = tasks.length ? tasks.map(t => `<div class="overlay-task ${t.done ? 'done' : ''}"><span>${t.done ? '✓' : '□'}</span><p>${escapeHtml(t.text)}</p></div>`).join('') : '<div class="overlay-empty">公開タスクなし</div>';
  }

  function load() {
    try { render(JSON.parse(localStorage.getItem(PUBLIC_KEY) || 'null')); } catch {}
  }

  channel?.addEventListener('message', e => {
    if (e.data?.type === 'public-state') render(e.data.payload);
  });
  window.addEventListener('storage', e => { if (e.key === PUBLIC_KEY) load(); });
  load();
})();
