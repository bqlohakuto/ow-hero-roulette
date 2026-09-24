(() => {
  'use strict';

  const AUTO_KEY = 'talkCoachTwitchAutoPost';
  let els = null;

  function autoPostEnabled() {
    return localStorage.getItem(AUTO_KEY) !== 'false';
  }

  function createUi() {
    const panel = document.querySelector('#talkCoachPanel');
    if (!panel || document.querySelector('#talkCoachTopicBox')) return;

    const box = document.createElement('section');
    box.id = 'talkCoachTopicBox';
    box.className = 'talk-coach__topic-box';
    box.innerHTML = [
      '<div class="talk-coach__topic-head">',
        '<span class="talk-coach__label">TOPIC CARD</span>',
        '<span id="talkCoachTopicCategory">READY</span>',
      '</div>',
      '<div class="talk-coach__pool-row">',
        '<label for="talkCoachTopicPool">話題プール</label>',
        '<select id="talkCoachTopicPool" aria-label="話題プール"></select>',
        '<small id="talkCoachPoolCount"></small>',
      '</div>',
      '<strong id="talkCoachTopicText">30秒無言で話題を提示します。</strong>',
      '<div class="talk-coach__topic-actions">',
        '<button id="talkCoachNextTopic" class="talk-coach__button" type="button">次の話題</button>',
        '<label class="talk-coach__check"><input id="talkCoachAutoPost" type="checkbox">30秒 / 60秒でTwitchへ自動投稿</label>',
      '</div>'
    ].join('');

    const message = panel.querySelector('#talkCoachMessage');
    message.insertAdjacentElement('afterend', box);

    els = {
      box,
      category: box.querySelector('#talkCoachTopicCategory'),
      text: box.querySelector('#talkCoachTopicText'),
      pool: box.querySelector('#talkCoachTopicPool'),
      poolCount: box.querySelector('#talkCoachPoolCount'),
      next: box.querySelector('#talkCoachNextTopic'),
      autoPost: box.querySelector('#talkCoachAutoPost')
    };

    const topicApi = window.TalkCoachTopics;
    if (topicApi?.pools) {
      Object.entries(topicApi.pools).forEach(([id, pool]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = pool.label;
        els.pool.append(option);
      });

      const currentPool = topicApi.getPool();
      els.pool.value = currentPool.id;
      els.poolCount.textContent = currentPool.size + '枚';

      els.pool.addEventListener('change', () => {
        if (!topicApi.setPool(els.pool.value)) return;
        const selected = topicApi.getPool();
        els.poolCount.textContent = selected.size + '枚';
        els.category.textContent = selected.label;
        els.text.textContent = '話題プールを「' + selected.label + '」に切り替えました。';
      });
    }

    els.autoPost.checked = autoPostEnabled();
    els.autoPost.addEventListener('change', () => {
      localStorage.setItem(AUTO_KEY, String(els.autoPost.checked));
    });

    els.next.addEventListener('click', async () => {
      const topic = window.TalkCoachTopics?.next();
      if (!topic) return;
      renderTopic(topic);

      if (window.TalkCoachTwitch?.isConnected()) {
        try {
          await window.TalkCoachTwitch.sendTopic(topic, 'manual');
        } catch (_) {}
      }
    });
  }

  function renderTopic(topic) {
    if (!els || !topic) return;
    els.category.textContent = topic.category;
    els.text.textContent = topic.text;
  }

  async function handleWarning(event) {
    const level = event.detail?.level;
    if (level !== 30 && level !== 60) return;

    const topic = window.TalkCoachTopics?.next();
    if (!topic) return;

    renderTopic(topic);

    if (!autoPostEnabled() || !window.TalkCoachTwitch?.isConnected()) return;

    try {
      await window.TalkCoachTwitch.sendTopic(
        topic,
        String(level),
        event.detail?.warningCount || 0
      );
    } catch (_) {}
  }

  window.addEventListener('talkcoach:ready', createUi);
  window.addEventListener('talkcoach:topic', event => renderTopic(event.detail));
  window.addEventListener('talkcoach:poolchange', event => {
    if (!els) return;
    els.pool.value = event.detail.id;
    els.poolCount.textContent = event.detail.size + '枚';
  });
  window.addEventListener('talkcoach:warning', handleWarning);
})();