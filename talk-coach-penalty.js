(() => {
  'use strict';

  const PENALTY_PER_WARNING = 10;
  let els = null;
  let previousRemaining = null;

  function parseFirebaseConfig(text) {
    const raw = String(text || '').trim();
    if (!raw) throw new Error('Firebase設定を入力してください。');

    try {
      return JSON.parse(raw);
    } catch (_) {}

    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Firebase設定を読み取れませんでした。');

    const jsonish = match[0]
      .replace(/([,{]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, '$1"$2"$3')
      .replace(/,\s*}/g, '}');

    try {
      return JSON.parse(jsonish);
    } catch (_) {
      throw new Error('Firebase設定をJSON形式で貼り付けてください。');
    }
  }

  function createUi() {
    const panel = document.querySelector('#talkCoachPanel');
    if (!panel || document.querySelector('#talkCoachPenalty')) return;

    const section = document.createElement('section');
    section.id = 'talkCoachPenalty';
    section.className = 'talk-coach__penalty';
    section.innerHTML = [
      '<div class="talk-coach__penalty-head">',
        '<div>',
          '<span class="talk-coach__label">PENALTY SYSTEM</span>',
          '<strong>Squat Penalty</strong>',
        '</div>',
        '<span id="talkCoachPenaltyStatus" class="talk-coach__connection">未設定</span>',
      '</div>',
      '<div class="talk-coach__penalty-grid">',
        '<div><span>達成</span><strong><b id="talkCoachPenaltyCompleted">0</b> / <b id="talkCoachPenaltyTarget">0</b></strong></div>',
        '<div><span>残り</span><strong id="talkCoachPenaltyRemaining">0</strong></div>',
        '<div><span>警告1回</span><strong>+10</strong></div>',
      '</div>',
      '<div class="talk-coach__penalty-bar"><span id="talkCoachPenaltyBar"></span></div>',
      '<div class="talk-coach__penalty-actions">',
        '<button id="talkCoachPenaltyReset" class="talk-coach__button" type="button">ペナルティをリセット</button>',
      '</div>',
      '<details class="talk-coach__penalty-settings">',
        '<summary>Firebase連携設定</summary>',
        '<label><span>Firebase config</span><textarea id="talkCoachFirebaseConfig" rows="6" placeholder=\'{"apiKey":"...","authDomain":"...","databaseURL":"...","projectId":"...","appId":"..."}\'></textarea></label>',
        '<label><span>連携コード</span><input id="talkCoachPenaltyRoom" type="text" autocomplete="off"></label>',
        '<div class="talk-coach__phase2-actions">',
          '<button id="talkCoachPenaltySave" class="talk-coach__button talk-coach__button--primary" type="button">設定を保存</button>',
          '<button id="talkCoachPenaltyCopy" class="talk-coach__button" type="button">スマホ用設定をコピー</button>',
        '</div>',
        '<small id="talkCoachPenaltySetupMessage" class="talk-coach__penalty-help">Firebase設定後、この連携設定をSQUAT BARへ貼り付けます。</small>',
      '</details>'
    ].join('');

    const twitch = panel.querySelector('#talkCoachTwitch');
    if (twitch) twitch.insertAdjacentElement('afterend', section);
    else panel.append(section);

    els = {
      status: section.querySelector('#talkCoachPenaltyStatus'),
      completed: section.querySelector('#talkCoachPenaltyCompleted'),
      target: section.querySelector('#talkCoachPenaltyTarget'),
      remaining: section.querySelector('#talkCoachPenaltyRemaining'),
      bar: section.querySelector('#talkCoachPenaltyBar'),
      reset: section.querySelector('#talkCoachPenaltyReset'),
      config: section.querySelector('#talkCoachFirebaseConfig'),
      room: section.querySelector('#talkCoachPenaltyRoom'),
      save: section.querySelector('#talkCoachPenaltySave'),
      copy: section.querySelector('#talkCoachPenaltyCopy'),
      setupMessage: section.querySelector('#talkCoachPenaltySetupMessage')
    };

    const config = window.PenaltySync?.getConfig();
    els.config.value = config ? JSON.stringify(config, null, 2) : '';
    els.room.value = window.PenaltySync?.getRoom() || window.PenaltySync?.generateRoom() || '';

    els.save.addEventListener('click', () => {
      try {
        const parsed = parseFirebaseConfig(els.config.value);
        window.PenaltySync.setSetup(parsed, els.room.value);
        els.setupMessage.textContent = '設定を保存しました。再読み込みします。';
        window.setTimeout(() => location.reload(), 450);
      } catch (error) {
        els.setupMessage.textContent = error.message;
      }
    });

    els.copy.addEventListener('click', async () => {
      const setup = window.PenaltySync?.exportSetup();
      if (!setup) {
        els.setupMessage.textContent = '先にFirebase設定を保存してください。';
        return;
      }
      try {
        await navigator.clipboard.writeText(setup);
        els.setupMessage.textContent = 'スマホ用の連携設定をコピーしました。';
      } catch (_) {
        els.setupMessage.textContent = 'コピーできませんでした。設定文字列を手動でコピーしてください。';
      }
    });

    els.reset.addEventListener('click', async () => {
      try {
        await window.PenaltySync.reset();
      } catch (error) {
        setStatus('ERROR', 'error');
        els.setupMessage.textContent = error.message;
      }
    });

    window.PenaltySync?.onChange(render);
    window.PenaltySync?.onStatus(({ status, message }) => {
      const labels = {
        connected: '同期中',
        connecting: '接続中',
        unconfigured: '未設定',
        error: 'ERROR'
      };
      setStatus(labels[status] || status.toUpperCase(), status);
      if (message) els.setupMessage.textContent = message;
    });
  }

  function setStatus(text, mode) {
    if (!els) return;
    els.status.textContent = text;
    els.status.dataset.mode = mode || 'idle';
  }

  function render(state) {
    if (!els) return;

    els.completed.textContent = String(state.completed ?? 0);
    els.target.textContent = String(state.target ?? 0);
    els.remaining.textContent = String(state.remaining ?? 0);
    const percent = state.target > 0 ? Math.min(100, (state.completed / state.target) * 100) : 0;
    els.bar.style.width = percent + '%';

    window.TalkCoachBridge?.publish({
      penaltyTarget: state.target ?? 0,
      penaltyCompleted: state.completed ?? 0,
      penaltyRemaining: state.remaining ?? 0
    });

    if (previousRemaining !== null && previousRemaining > 0 && state.remaining === 0 && state.target > 0) {
      if (window.TalkCoachTwitch?.isConnected()) {
        window.TalkCoachTwitch.sendMessage('スクワットペナルティの消化を確認しました。').catch(() => {});
      }
    }
    previousRemaining = state.remaining;
  }

  async function handleWarning(event) {
    if (event.detail?.level !== 60) return;

    try {
      const state = await window.PenaltySync.addPenalty(PENALTY_PER_WARNING);
      if (els) {
        els.setupMessage.textContent = '警告によりスクワット10回を追加しました。残り' + state.remaining + '回です。';
      }
    } catch (error) {
      if (els) {
        setStatus('未接続', 'error');
        els.setupMessage.textContent = 'スクワットを追加できませんでした。' + error.message;
      }
    }
  }

  window.addEventListener('talkcoach:ready', createUi);
  window.addEventListener('talkcoach:warning', handleWarning);
})();