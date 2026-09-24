(() => {
  'use strict';

  const root = document.querySelector('#overlay');
  const count = document.querySelector('#warningCount');
  const status = document.querySelector('#coachStatus');
  const bridge = window.TalkCoachBridge;

  function render(data = {}) {
    count.textContent = String(data.warningCount ?? 0);
    status.textContent = data.status || 'OFF';
    root.dataset.status = data.status || 'OFF';
  }

  render(bridge?.read?.() || {});

  if ('BroadcastChannel' in window && bridge?.channelName) {
    try {
      const channel = new BroadcastChannel(bridge.channelName);
      channel.onmessage = event => render(event.data);
    } catch (_) {}
  }

  window.addEventListener('storage', event => {
    if (event.key !== bridge?.storageKey || !event.newValue) return;
    try { render(JSON.parse(event.newValue)); } catch (_) {}
  });

  window.setInterval(() => render(bridge?.read?.() || {}), 1000);
})();