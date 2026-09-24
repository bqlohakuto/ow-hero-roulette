(() => {
  'use strict';

  const root = document.querySelector('#overlay');
  const count = document.querySelector('#warningCount');
  const status = document.querySelector('#coachStatus');
  const squatCompleted = document.querySelector('#squatCompleted');
  const squatTarget = document.querySelector('#squatTarget');
  const squatRemaining = document.querySelector('#squatRemaining');
  const bridge = window.TalkCoachBridge;

  function render(data = {}) {
    count.textContent = String(data.warningCount ?? 0);
    status.textContent = data.status || 'OFF';
    root.dataset.status = data.status || 'OFF';
    squatCompleted.textContent = String(data.penaltyCompleted ?? 0);
    squatTarget.textContent = String(data.penaltyTarget ?? 0);
    squatRemaining.textContent = String(data.penaltyRemaining ?? 0);
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