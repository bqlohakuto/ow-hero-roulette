(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const workspace = () => window.GameDevWorkspace;
  const AUTO_REVIEW_KEY = 'quickDeckGameDevAutoReviewV1';

  const els = {
    aiStatus: $('#aiStatus'),
    aiModelLabel: $('#aiModelLabel'),
    aiConnectionTitle: $('#aiConnectionTitle'),
    aiConnectionDetail: $('#aiConnectionDetail'),
    aiReconnectBtn: $('#aiReconnectBtn'),
    autoReviewToggle: $('#autoReviewToggle'),
    aiSendBtn: $('#aiSendBtn'),
    generateReviewBtn: $('#generateReviewBtn'),
    chatInput: $('#chatInput'),
    chatHidden: $('#chatHidden'),
    chatHint: $('#chatHint')
  };

  let status = {
    online: false,
    configured: false,
    model: null,
    checking: false
  };
  let sending = false;
  let reviewing = false;
  const organizing = new Set();

  function setStatus(message, tone = 'muted') {
    if (!els.aiStatus) return;
    els.aiStatus.textContent = message;
    els.aiStatus.dataset.tone = tone;
  }

  function renderConnection() {
    if (!els.aiConnectionTitle || !els.aiConnectionDetail) return;
    if (!status.online) {
      els.aiConnectionTitle.textContent = 'ローカルAI未接続';
      els.aiConnectionDetail.innerHTML = 'GitHub Pagesでは手動管理のみです。<br><code>start-game-dev.bat</code> から開くとAIを利用できます。';
      if (els.aiModelLabel) els.aiModelLabel.textContent = '手動モード';
      setStatus('AI OFFLINE', 'muted');
      return;
    }
    if (!status.configured) {
      els.aiConnectionTitle.textContent = 'APIキー未設定';
      els.aiConnectionDetail.innerHTML = '<code>.env</code> に OPENAI_API_KEY を設定してください。';
      if (els.aiModelLabel) els.aiModelLabel.textContent = 'APIキー未設定';
      setStatus('AI KEY REQUIRED', 'warn');
      return;
    }
    els.aiConnectionTitle.textContent = 'AI接続済み';
    els.aiConnectionDetail.textContent = 'Model: ' + (status.model || 'unknown') + ' / ローカル経由で安全に接続';
    if (els.aiModelLabel) els.aiModelLabel.textContent = status.model || 'AI接続済み';
    setStatus('AI ONLINE', 'ok');
  }

  async function checkStatus() {
    if (status.checking) return status;
    status.checking = true;
    setStatus('AI確認中…', 'muted');
    try {
      const response = await fetch('/api/game-dev/status', { cache: 'no-store' });
      if (!response.ok) throw new Error('offline');
      const data = await response.json();
      status.online = !!data.ok;
      status.configured = !!data.aiConfigured;
      status.model = data.model || null;
    } catch {
      status.online = false;
      status.configured = false;
      status.model = null;
    } finally {
      status.checking = false;
      renderConnection();
    }
    return status;
  }

  async function api(path, body) {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.error || ('Request failed: ' + response.status));
    }
    return data;
  }

  function projectPayload(state) {
    return {
      projectName: state.projectName,
      sectionName: state.sectionName,
      tasks: state.tasks,
      settings: state.settings,
      scenarios: state.scenarios
    };
  }

  async function sendChat() {
    if (sending) return;
    const ws = workspace();
    const text = els.chatInput?.value.trim();
    if (!ws || !text) return;

    if (!status.online || !status.configured) {
      await checkStatus();
      if (!status.online || !status.configured) {
        if (els.chatHint) els.chatHint.textContent = 'AI未接続です。start-game-dev.bat と .env を確認してください。';
        return;
      }
    }

    const hidden = !!els.chatHidden?.checked;
    ws.addMessage('user', text, hidden);
    if (els.chatInput) {
      els.chatInput.value = '';
      els.chatInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (els.chatHidden) els.chatHidden.checked = false;

    sending = true;
    if (els.aiSendBtn) {
      els.aiSendBtn.disabled = true;
      els.aiSendBtn.textContent = 'AI応答中…';
    }
    setStatus('AI THINKING', 'busy');
    if (els.chatHint) els.chatHint.textContent = 'AIが制作内容を確認しています。OBSには本文を送りません。';

    try {
      const current = ws.getState();
      const data = await api('/api/game-dev/chat', {
        project: projectPayload(current),
        messages: current.messages
      });
      ws.addMessage('assistant', data.reply || '（応答なし）', hidden);
      if (els.chatHint) els.chatHint.textContent = 'AI応答を追加しました。採用する内容は「確定事項にする」で整理できます。';
      setStatus('AI ONLINE', 'ok');
    } catch (error) {
      if (els.chatHint) els.chatHint.textContent = 'AIエラー: ' + error.message;
      setStatus('AI ERROR', 'warn');
    } finally {
      sending = false;
      if (els.aiSendBtn) {
        els.aiSendBtn.disabled = false;
        els.aiSendBtn.textContent = 'AIに送信';
      }
    }
  }

  async function organizeMessage(message) {
    if (!message?.id || message.organized || organizing.has(message.id)) return;
    if (!status.online || !status.configured) return;

    const ws = workspace();
    if (!ws) return;
    organizing.add(message.id);
    setStatus('整理中…', 'busy');

    try {
      const current = ws.getState();
      const data = await api('/api/game-dev/organize', {
        project: projectPayload(current),
        confirmedText: message.text
      });
      ws.applyOrganized(data.organized || {});
      ws.markMessageOrganized(message.id);
      setStatus('整理完了', 'ok');
      if (els.autoReviewToggle?.checked) await requestReview();
    } catch (error) {
      setStatus('整理エラー', 'warn');
      console.error('[GAME DEV organize]', error);
    } finally {
      organizing.delete(message.id);
      setTimeout(renderConnection, 900);
    }
  }

  async function requestReview() {
    if (reviewing) return;
    const ws = workspace();
    if (!ws) return;

    if (!status.online || !status.configured) {
      await checkStatus();
      if (!status.online || !status.configured) return;
    }

    reviewing = true;
    els.generateReviewBtn.disabled = true;
    els.generateReviewBtn.textContent = 'AI評価中…';
    setStatus('REVIEWING', 'busy');

    try {
      const current = ws.getState();
      const confirmed = current.messages.filter(m => m.confirmed).map(m => m.text);
      const data = await api('/api/game-dev/review', {
        project: projectPayload(current),
        confirmed
      });
      ws.addReview(data.review || '制作内容の評価を取得できませんでした。', false, true);
      setStatus('REVIEW UPDATED', 'ok');
    } catch (error) {
      setStatus('REVIEW ERROR', 'warn');
      console.error('[GAME DEV review]', error);
    } finally {
      reviewing = false;
      els.generateReviewBtn.disabled = false;
      els.generateReviewBtn.textContent = '現在の進捗を評価';
      setTimeout(renderConnection, 900);
    }
  }

  els.aiSendBtn?.addEventListener('click', sendChat);

  els.aiReconnectBtn?.addEventListener('click', checkStatus);

  if (els.autoReviewToggle) {
    const saved = localStorage.getItem(AUTO_REVIEW_KEY);
    els.autoReviewToggle.checked = saved === 'true';
    els.autoReviewToggle.addEventListener('change', () => {
      localStorage.setItem(AUTO_REVIEW_KEY, String(els.autoReviewToggle.checked));
    });
  }

  els.generateReviewBtn?.addEventListener('click', event => {
    if (!status.online || !status.configured) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    requestReview();
  }, true);

  window.GameDevAI = {
    checkStatus,
    sendChat,
    organizeMessage,
    requestReview,
    getStatus: () => ({ ...status })
  };

  renderConnection();
})();
