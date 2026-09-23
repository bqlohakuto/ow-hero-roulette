(() => {
  'use strict';

  const CONFIG = {
    warningMs: [15000, 30000, 60000],
    minSpeechMs: 400,
    positiveSpeechThreshold: 0.5,
    negativeSpeechThreshold: 0.35,
    redemptionMs: 700,
    model: 'v5',
    assetBase: 'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.31/dist/',
    onnxBase: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/'
  };

  const coach = {
    vad: null,
    enabled: false,
    paused: false,
    speaking: false,
    starting: false,
    lastSpeechEndAt: null,
    silenceStartedAt: null,
    warningFlags: [false, false, false],
    warningCount: 0,
    timerId: null,
    probability: 0
  };

  function createPanel() {
    const host = document.querySelector('.team-stage');
    if (!host || document.querySelector('#talkCoachPanel')) return;

    const panel = document.createElement('section');
    panel.id = 'talkCoachPanel';
    panel.className = 'talk-coach';
    panel.setAttribute('aria-label', 'Talk Coach');

    panel.innerHTML = [
      '<div class="talk-coach__header">',
        '<div>',
          '<p class="talk-coach__eyebrow">REALTIME AI COACHING</p>',
          '<h2>Talk Coach</h2>',
          '<p class="talk-coach__description">人声のみを検出し、無言時間を監視します。</p>',
        '</div>',
        '<div class="talk-coach__master">',
          '<span id="talkCoachStateDot" class="talk-coach__state-dot"></span>',
          '<strong id="talkCoachState">OFF</strong>',
        '</div>',
      '</div>',

      '<div class="talk-coach__grid">',
        '<div class="talk-coach__status-card">',
          '<span class="talk-coach__label">VOICE STATUS</span>',
          '<strong id="talkCoachVoiceState">待機中</strong>',
          '<div class="talk-coach__meter" aria-hidden="true">',
            '<span id="talkCoachMeter"></span>',
          '</div>',
          '<small id="talkCoachProbability">VOICE 0%</small>',
        '</div>',

        '<div class="talk-coach__status-card talk-coach__timer-card">',
          '<span class="talk-coach__label">SILENCE TIMER</span>',
          '<strong id="talkCoachSilence">00:00</strong>',
          '<small>15秒 / 30秒 / 60秒で警告</small>',
        '</div>',

        '<div class="talk-coach__status-card">',
          '<span class="talk-coach__label">WARNINGS</span>',
          '<strong id="talkCoachWarnings">0</strong>',
          '<button id="talkCoachResetWarnings" class="talk-coach__mini-btn" type="button">リセット</button>',
        '</div>',
      '</div>',

      '<div id="talkCoachMessage" class="talk-coach__message" aria-live="polite">',
        'Talk Coachは停止しています。',
      '</div>',

      '<div class="talk-coach__actions">',
        '<button id="talkCoachToggle" class="talk-coach__button talk-coach__button--primary" type="button">監視を開始</button>',
        '<button id="talkCoachPause" class="talk-coach__button" type="button" disabled>一時停止</button>',
      '</div>',

      '<p class="talk-coach__note">初回開始時にマイクの使用許可が必要です。音声データは文字起こしせず、端末内のVAD判定にのみ使用します。</p>'
    ].join('');

    host.parentNode.insertBefore(panel, host);
  }

  function getEls() {
    return {
      panel: document.querySelector('#talkCoachPanel'),
      stateDot: document.querySelector('#talkCoachStateDot'),
      state: document.querySelector('#talkCoachState'),
      voiceState: document.querySelector('#talkCoachVoiceState'),
      meter: document.querySelector('#talkCoachMeter'),
      probability: document.querySelector('#talkCoachProbability'),
      silence: document.querySelector('#talkCoachSilence'),
      warnings: document.querySelector('#talkCoachWarnings'),
      message: document.querySelector('#talkCoachMessage'),
      toggle: document.querySelector('#talkCoachToggle'),
      pause: document.querySelector('#talkCoachPause'),
      resetWarnings: document.querySelector('#talkCoachResetWarnings')
    };
  }

  let els;

  function setMessage(text, level) {
    if (!els) return;
    els.message.textContent = text;
    els.message.dataset.level = level || 'info';
  }

  function setState(label, mode) {
    els.state.textContent = label;
    els.panel.dataset.state = mode;
  }

  function setVoiceState(label) {
    els.voiceState.textContent = label;
  }

  function setProbability(value) {
    coach.probability = Math.max(0, Math.min(1, Number(value) || 0));
    const percent = Math.round(coach.probability * 100);
    els.meter.style.width = percent + '%';
    els.probability.textContent = 'VOICE ' + percent + '%';
  }

  function formatSilence(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  function resetSilenceCycle(startNow) {
    coach.warningFlags = [false, false, false];
    coach.silenceStartedAt = startNow ? performance.now() : null;
    els.silence.textContent = '00:00';
  }

  function markValidSpeech() {
    coach.speaking = true;
    coach.silenceStartedAt = null;
    coach.warningFlags = [false, false, false];
    setState('TALKING', 'talking');
    setVoiceState('発話を検出');
    els.silence.textContent = '00:00';
    setMessage('有効な発話を検出しました。無言タイマーをリセットします。', 'success');
  }

  function markSpeechEnd() {
    if (!coach.enabled || coach.paused) return;
    coach.speaking = false;
    coach.lastSpeechEndAt = performance.now();
    coach.silenceStartedAt = coach.lastSpeechEndAt;
    coach.warningFlags = [false, false, false];
    setState('MONITORING', 'monitoring');
    setVoiceState('無言を監視中');
  }

  function fireWarning(index) {
    if (coach.warningFlags[index]) return;
    coach.warningFlags[index] = true;

    if (index === 0) {
      setMessage('発話が15秒間検出されていません。配信中の発話を継続してください。', 'warning');
      return;
    }

    if (index === 1) {
      setMessage('無言状態が継続しています。現在の状況や思考内容を音声で説明してください。', 'warning');
      return;
    }

    coach.warningCount += 1;
    els.warnings.textContent = String(coach.warningCount);
    setMessage('発話不足を検出しました。警告回数を1加算します。', 'danger');
  }

  function tick() {
    if (!coach.enabled || coach.paused || coach.speaking || coach.silenceStartedAt === null) {
      return;
    }

    const elapsed = performance.now() - coach.silenceStartedAt;
    els.silence.textContent = formatSilence(elapsed);

    CONFIG.warningMs.forEach((threshold, index) => {
      if (elapsed >= threshold) fireWarning(index);
    });
  }

  async function buildVad() {
    if (!window.vad || !window.vad.MicVAD) {
      throw new Error('VADライブラリを読み込めませんでした。ネットワーク接続を確認してください。');
    }

    return window.vad.MicVAD.new({
      model: CONFIG.model,
      minSpeechMs: CONFIG.minSpeechMs,
      positiveSpeechThreshold: CONFIG.positiveSpeechThreshold,
      negativeSpeechThreshold: CONFIG.negativeSpeechThreshold,
      redemptionMs: CONFIG.redemptionMs,
      preSpeechPadMs: 300,
      submitUserSpeechOnPause: false,
      baseAssetPath: CONFIG.assetBase,
      onnxWASMBasePath: CONFIG.onnxBase,
      getStream: async () => navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true
        }
      }),
      onFrameProcessed: (probabilities) => {
        if (!coach.enabled || coach.paused) return;
        setProbability(probabilities.isSpeech);
      },
      onSpeechStart: () => {
        if (!coach.enabled || coach.paused) return;
        setVoiceState('音声候補を解析中');
      },
      onSpeechRealStart: () => {
        if (!coach.enabled || coach.paused) return;
        markValidSpeech();
      },
      onSpeechEnd: () => {
        if (!coach.enabled || coach.paused) return;
        markSpeechEnd();
      },
      onVADMisfire: () => {
        if (!coach.enabled || coach.paused) return;
        setVoiceState('短い音を除外');
      }
    });
  }

  async function startCoach() {
    if (coach.starting || coach.enabled) return;
    coach.starting = true;
    els.toggle.disabled = true;
    setState('STARTING', 'starting');
    setVoiceState('マイクを準備中');
    setMessage('マイク入力とVADモデルを初期化しています。', 'info');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('このブラウザはマイク入力に対応していません。');
      }

      if (!coach.vad) {
        coach.vad = await buildVad();
      }

      await Promise.resolve(coach.vad.start());
      coach.enabled = true;
      coach.paused = false;
      coach.speaking = false;
      resetSilenceCycle(true);

      setProbability(0);
      setState('MONITORING', 'monitoring');
      setVoiceState('無言を監視中');
      setMessage('Talk Coachを開始しました。発話監視を実行しています。', 'success');

      els.toggle.textContent = '監視を停止';
      els.pause.textContent = '一時停止';
      els.pause.disabled = false;
    } catch (error) {
      console.error('[Talk Coach]', error);
      coach.enabled = false;
      coach.paused = false;
      setState('ERROR', 'error');
      setVoiceState('開始できません');
      setMessage('Talk Coachを開始できませんでした。' + (error && error.message ? ' ' + error.message : ''), 'danger');
    } finally {
      coach.starting = false;
      els.toggle.disabled = false;
    }
  }

  async function stopCoach() {
    if (!coach.enabled && !coach.paused) return;

    try {
      if (coach.vad && coach.vad.listening) {
        await Promise.resolve(coach.vad.pause());
      }
    } catch (error) {
      console.warn('[Talk Coach] pause failed', error);
    }

    coach.enabled = false;
    coach.paused = false;
    coach.speaking = false;
    resetSilenceCycle(false);
    setProbability(0);
    setState('OFF', 'off');
    setVoiceState('待機中');
    setMessage('Talk Coachを停止しました。発話監視を停止します。', 'info');
    els.toggle.textContent = '監視を開始';
    els.pause.textContent = '一時停止';
    els.pause.disabled = true;
  }

  async function togglePause() {
    if (!coach.enabled || !coach.vad) return;

    els.pause.disabled = true;

    try {
      if (!coach.paused) {
        await Promise.resolve(coach.vad.pause());
        coach.paused = true;
        coach.speaking = false;
        coach.silenceStartedAt = null;
        setProbability(0);
        setState('PAUSED', 'paused');
        setVoiceState('一時停止中');
        setMessage('Talk Coachを一時停止しました。発話監視を停止します。', 'info');
        els.pause.textContent = '監視を再開';
      } else {
        await Promise.resolve(coach.vad.start());
        coach.paused = false;
        coach.speaking = false;
        resetSilenceCycle(true);
        setState('MONITORING', 'monitoring');
        setVoiceState('無言を監視中');
        setMessage('Talk Coachを再開しました。発話監視を開始します。', 'success');
        els.pause.textContent = '一時停止';
      }
    } catch (error) {
      console.error('[Talk Coach]', error);
      setState('ERROR', 'error');
      setMessage('マイク監視の切り替えに失敗しました。', 'danger');
    } finally {
      els.pause.disabled = !coach.enabled;
    }
  }

  function resetWarnings() {
    coach.warningCount = 0;
    els.warnings.textContent = '0';
    setMessage('警告回数をリセットしました。', 'info');
  }

  function bindEvents() {
    els.toggle.addEventListener('click', () => {
      if (coach.enabled || coach.paused) {
        stopCoach();
      } else {
        startCoach();
      }
    });

    els.pause.addEventListener('click', togglePause);
    els.resetWarnings.addEventListener('click', resetWarnings);
  }

  function init() {
    createPanel();
    els = getEls();
    if (!els.panel) return;

    bindEvents();
    coach.timerId = window.setInterval(tick, 200);
  }

  init();
})();