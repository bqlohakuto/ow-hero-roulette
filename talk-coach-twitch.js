(() => {
  'use strict';

  const KEYS = {
    clientId: 'talkCoachTwitchClientId',
    broadcaster: 'talkCoachTwitchBroadcaster',
    token: 'talkCoachTwitchAccessToken',
    oauthState: 'talkCoachTwitchOAuthState'
  };

  const SCOPES = ['user:read:chat', 'user:write:chat'];
  const WS_URL = 'wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=30';

  const state = {
    connected: false,
    connecting: false,
    socket: null,
    clientId: '',
    accessToken: '',
    broadcasterLogin: '',
    broadcaster: null,
    sender: null,
    commandCooldownUntil: 0,
    reconnectTimer: null,
    oauthError: ''
  };

  let els = null;

  function redirectUri() {
    return window.location.origin + window.location.pathname;
  }

  function randomState() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  function parseOAuthCallback() {
    if (!window.location.hash) return;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get('access_token');
    const returnedState = params.get('state');
    const error = params.get('error_description') || params.get('error');

    if (error) {
      state.oauthError = decodeURIComponent(error);
      history.replaceState(null, '', redirectUri());
      return;
    }

    if (!token) return;

    const expectedState = sessionStorage.getItem(KEYS.oauthState);
    if (!expectedState || expectedState !== returnedState) {
      state.oauthError = 'Twitch認証のstate検証に失敗しました。もう一度認証してください。';
      history.replaceState(null, '', redirectUri());
      return;
    }

    sessionStorage.setItem(KEYS.token, token);
    sessionStorage.removeItem(KEYS.oauthState);
    history.replaceState(null, '', redirectUri());
  }

  function setStatus(text, mode = 'idle') {
    if (!els) return;
    els.status.textContent = text;
    els.status.dataset.mode = mode;
  }

  function setConnectedUi() {
    if (!els) return;
    els.connect.disabled = state.connecting;
    els.auth.disabled = state.connecting;
    els.test.disabled = !state.connected;
    els.disconnect.disabled = !state.connected;
    els.connect.textContent = state.connected ? '再接続' : '接続';
  }

  function saveSettings() {
    state.clientId = els.clientId.value.trim();
    state.broadcasterLogin = els.broadcaster.value.trim().replace(/^@/, '').toLowerCase();

    if (state.clientId) localStorage.setItem(KEYS.clientId, state.clientId);
    else localStorage.removeItem(KEYS.clientId);

    if (state.broadcasterLogin) localStorage.setItem(KEYS.broadcaster, state.broadcasterLogin);
    else localStorage.removeItem(KEYS.broadcaster);
  }

  function startOAuth() {
    saveSettings();

    if (!state.clientId) {
      setStatus('Client IDを入力してください。', 'error');
      return;
    }

    const csrfState = randomState();
    sessionStorage.setItem(KEYS.oauthState, csrfState);

    const url = new URL('https://id.twitch.tv/oauth2/authorize');
    url.searchParams.set('response_type', 'token');
    url.searchParams.set('client_id', state.clientId);
    url.searchParams.set('redirect_uri', redirectUri());
    url.searchParams.set('scope', SCOPES.join(' '));
    url.searchParams.set('state', csrfState);
    url.searchParams.set('force_verify', 'true');

    window.location.assign(url.toString());
  }

  async function twitchFetch(url, options = {}) {
    if (!state.accessToken || !state.clientId) {
      throw new Error('Twitch認証が必要です。');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', 'Bearer ' + state.accessToken);
    headers.set('Client-Id', state.clientId);

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let message = 'Twitch API ' + response.status;
      try {
        const data = await response.json();
        if (data?.message) message += ': ' + data.message;
      } catch (_) {}
      throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async function validateToken() {
    const response = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: { Authorization: 'OAuth ' + state.accessToken }
    });

    if (!response.ok) throw new Error('Twitch認証の有効期限が切れています。再認証してください。');
    const data = await response.json();

    const missing = SCOPES.filter(scope => !data.scopes?.includes(scope));
    if (missing.length) {
      throw new Error('必要な権限が不足しています: ' + missing.join(', '));
    }

    return data;
  }

  async function resolveUsers() {
    const selfData = await twitchFetch('https://api.twitch.tv/helix/users');
    state.sender = selfData.data?.[0] || null;
    if (!state.sender) throw new Error('認証ユーザーを取得できませんでした。');

    if (!state.broadcasterLogin) {
      state.broadcaster = state.sender;
      state.broadcasterLogin = state.sender.login;
      if (els) els.broadcaster.value = state.broadcasterLogin;
      localStorage.setItem(KEYS.broadcaster, state.broadcasterLogin);
      return;
    }

    const channelData = await twitchFetch(
      'https://api.twitch.tv/helix/users?login=' + encodeURIComponent(state.broadcasterLogin)
    );
    state.broadcaster = channelData.data?.[0] || null;
    if (!state.broadcaster) {
      throw new Error('指定したTwitchチャンネルが見つかりません。');
    }
  }

  async function createChatSubscription(sessionId) {
    const body = {
      type: 'channel.chat.message',
      version: '1',
      condition: {
        broadcaster_user_id: state.broadcaster.id,
        user_id: state.sender.id
      },
      transport: {
        method: 'websocket',
        session_id: sessionId
      }
    };

    await twitchFetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }

  function closeSocket() {
    clearTimeout(state.reconnectTimer);
    state.reconnectTimer = null;

    if (state.socket) {
      state.socket.onclose = null;
      try { state.socket.close(); } catch (_) {}
      state.socket = null;
    }
  }

  function openSocket(url = WS_URL, subscribeOnWelcome = true) {
    closeSocket();

    const socket = new WebSocket(url);
    state.socket = socket;

    socket.onopen = () => setStatus('EventSubへ接続しています。', 'working');

    socket.onmessage = async event => {
      let packet;
      try {
        packet = JSON.parse(event.data);
      } catch (_) {
        return;
      }

      const type = packet?.metadata?.message_type;

      if (type === 'session_welcome') {
        try {
          if (subscribeOnWelcome) {
            await createChatSubscription(packet.payload.session.id);
          }
          state.connected = true;
          state.connecting = false;
          setConnectedUi();
          setStatus(
            '接続中: @' + state.sender.login + ' → #' + state.broadcaster.login,
            'connected'
          );
        } catch (error) {
          state.connected = false;
          state.connecting = false;
          setConnectedUi();
          setStatus(error.message, 'error');
          closeSocket();
        }
        return;
      }

      if (type === 'notification' && packet?.payload?.subscription?.type === 'channel.chat.message') {
        handleChatMessage(packet.payload.event);
        return;
      }

      if (type === 'session_reconnect') {
        const reconnectUrl = packet?.payload?.session?.reconnect_url;
        if (reconnectUrl) {
          setStatus('EventSubへ再接続しています。', 'working');
          openSocket(reconnectUrl, false);
        }
      }
    };

    socket.onerror = () => {
      setStatus('EventSub接続でエラーが発生しました。', 'error');
    };

    socket.onclose = () => {
      if (!state.connected && !state.connecting) return;
      state.connected = false;
      setConnectedUi();
      setStatus('EventSub接続が切断されました。再接続します。', 'working');
      state.reconnectTimer = setTimeout(() => openSocket(WS_URL, true), 3000);
    };
  }

  async function connect() {
    if (state.connecting) return;

    saveSettings();
    state.accessToken = sessionStorage.getItem(KEYS.token) || '';

    if (!state.clientId) {
      setStatus('Client IDを入力してください。', 'error');
      return;
    }

    if (!state.accessToken) {
      setStatus('先にTwitch認証を行ってください。', 'error');
      return;
    }

    state.connecting = true;
    state.connected = false;
    setConnectedUi();
    setStatus('Twitch接続を確認しています。', 'working');

    try {
      await validateToken();
      await resolveUsers();
      openSocket();
    } catch (error) {
      state.connecting = false;
      state.connected = false;
      setConnectedUi();
      setStatus(error.message, 'error');
    }
  }

  function disconnect({ clearToken = false } = {}) {
    state.connected = false;
    state.connecting = false;
    closeSocket();

    if (clearToken) {
      sessionStorage.removeItem(KEYS.token);
      state.accessToken = '';
    }

    setConnectedUi();
    setStatus(clearToken ? 'Twitch認証を解除しました。' : 'Twitchから切断しました。', 'idle');
  }

  async function sendMessage(message) {
    if (!state.connected || !state.broadcaster || !state.sender) {
      throw new Error('Twitchチャットに接続されていません。');
    }

    const safeMessage = String(message).slice(0, 500);
    const data = await twitchFetch('https://api.twitch.tv/helix/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        broadcaster_id: state.broadcaster.id,
        sender_id: state.sender.id,
        message: safeMessage
      })
    });

    const result = data?.data?.[0];
    if (result && result.is_sent === false) {
      throw new Error(result.drop_reason?.message || 'チャット投稿に失敗しました。');
    }

    return result;
  }

  function topicText(topic) {
    return topic?.text || String(topic || '');
  }

  async function sendTopic(topic, source = 'manual', warningCount = 0) {
    const text = topicText(topic);
    if (!text) return;

    let message = '話題を提示します。「' + text + '」';

    if (source === '30') {
      message = '無言状態が継続しています。話題を提示します。「' + text + '」';
    } else if (source === '60') {
      message = '発話不足を検出しました。警告回数は' + warningCount + '回です。話題を提示します。「' + text + '」';
    }

    try {
      await sendMessage(message);
      setStatus('チャットへ投稿しました。', 'connected');
    } catch (error) {
      setStatus(error.message, 'error');
      throw error;
    }
  }

  async function handleChatMessage(event) {
    const text = event?.message?.text?.trim().toLowerCase();
    if (text !== '!topic') return;

    if (event.chatter_user_id === state.sender?.id) return;

    const now = Date.now();
    if (now < state.commandCooldownUntil) return;
    state.commandCooldownUntil = now + 10000;

    const topic = window.TalkCoachTopics?.next();
    if (!topic) return;

    try {
      await sendTopic(topic, 'command');
    } catch (_) {}
  }

  function createUi() {
    const panel = document.querySelector('#talkCoachPanel');
    if (!panel || document.querySelector('#talkCoachTwitch')) return;

    const section = document.createElement('section');
    section.id = 'talkCoachTwitch';
    section.className = 'talk-coach__phase2';
    section.innerHTML = [
      '<div class="talk-coach__phase2-head">',
        '<div>',
          '<span class="talk-coach__label">PHASE 2 / TWITCH CHAT</span>',
          '<strong>Twitch Bot</strong>',
        '</div>',
        '<span id="talkCoachTwitchStatus" class="talk-coach__connection">未接続</span>',
      '</div>',
      '<div class="talk-coach__settings-grid">',
        '<label><span>Client ID</span><input id="talkCoachTwitchClientId" type="text" autocomplete="off" placeholder="Twitch Developer Client ID"></label>',
        '<label><span>配信チャンネル</span><input id="talkCoachTwitchBroadcaster" type="text" autocomplete="off" placeholder="チャンネル名"></label>',
      '</div>',
      '<div class="talk-coach__redirect">',
        '<span>OAuth Redirect URL</span>',
        '<code id="talkCoachRedirectUri"></code>',
      '</div>',
      '<div class="talk-coach__phase2-actions">',
        '<button id="talkCoachTwitchAuth" class="talk-coach__button talk-coach__button--primary" type="button">Twitch認証</button>',
        '<button id="talkCoachTwitchConnect" class="talk-coach__button" type="button">接続</button>',
        '<button id="talkCoachTwitchTest" class="talk-coach__button" type="button" disabled>テスト投稿</button>',
        '<button id="talkCoachTwitchDisconnect" class="talk-coach__button" type="button" disabled>認証解除</button>',
      '</div>',
      '<p class="talk-coach__note">専用Botアカウントを使う場合は「Twitch認証」でそのアカウントにログインしてください。アクセストークンはsessionStorageにのみ保持し、永続保存しません。</p>'
    ].join('');

    panel.append(section);

    els = {
      root: section,
      status: section.querySelector('#talkCoachTwitchStatus'),
      clientId: section.querySelector('#talkCoachTwitchClientId'),
      broadcaster: section.querySelector('#talkCoachTwitchBroadcaster'),
      redirect: section.querySelector('#talkCoachRedirectUri'),
      auth: section.querySelector('#talkCoachTwitchAuth'),
      connect: section.querySelector('#talkCoachTwitchConnect'),
      test: section.querySelector('#talkCoachTwitchTest'),
      disconnect: section.querySelector('#talkCoachTwitchDisconnect')
    };

    state.clientId = localStorage.getItem(KEYS.clientId) || '';
    state.broadcasterLogin = localStorage.getItem(KEYS.broadcaster) || '';
    state.accessToken = sessionStorage.getItem(KEYS.token) || '';

    els.clientId.value = state.clientId;
    els.broadcaster.value = state.broadcasterLogin;
    els.redirect.textContent = redirectUri();

    els.clientId.addEventListener('change', saveSettings);
    els.broadcaster.addEventListener('change', saveSettings);
    els.auth.addEventListener('click', startOAuth);
    els.connect.addEventListener('click', connect);
    els.test.addEventListener('click', async () => {
      try {
        await sendMessage('Talk Coach 接続テストです。');
        setStatus('テストメッセージを投稿しました。', 'connected');
      } catch (error) {
        setStatus(error.message, 'error');
      }
    });
    els.disconnect.addEventListener('click', () => disconnect({ clearToken: true }));

    setConnectedUi();

    if (state.oauthError) {
      setStatus(state.oauthError, 'error');
    } else if (state.accessToken) {
      setStatus('認証情報を確認しました。「接続」を押してください。', 'working');
    }
  }

  parseOAuthCallback();

  window.TalkCoachTwitch = {
    connect,
    disconnect,
    sendMessage,
    sendTopic,
    isConnected: () => state.connected,
    getState: () => ({
      connected: state.connected,
      sender: state.sender,
      broadcaster: state.broadcaster
    })
  };

  window.addEventListener('talkcoach:ready', createUi);
})();