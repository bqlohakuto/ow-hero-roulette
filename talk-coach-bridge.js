(() => {
  'use strict';

  const CHANNEL = 'quick-deck-talk-coach';
  const STORAGE_KEY = 'quickDeckTalkCoachState';
  let channel = null;

  try {
    channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null;
  } catch (_) {
    channel = null;
  }

  function publish(patch) {
    const previous = read();
    const next = {
      ...previous,
      ...patch,
      updatedAt: Date.now()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) {}

    try {
      channel?.postMessage(next);
    } catch (_) {}

    return next;
  }

  function read() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  window.TalkCoachBridge = {
    channelName: CHANNEL,
    storageKey: STORAGE_KEY,
    publish,
    read
  };
})();