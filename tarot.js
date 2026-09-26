(() => {
  'use strict';

  const STORE = 'quickDeckTarotSettingsV1';
  const HISTORY = 'quickDeckTarotHistoryV1';
  const CHANNEL = 'quick-deck-tarot';
  const BACK = 'assets/tarot/card-back.png';
  const DEFAULTS = [
    { id:'fool', arcana:0, roman:'0', en:'THE FOOL', ja:'愚者', image:'assets/tarot/fool.png', upright:'新しい一歩を踏み出す好機です。好奇心を信じ、軽やかに進みましょう。', reversed:'勢いだけで進まず、足元を確かめてから一歩を選びましょう。' },
    { id:'sun', arcana:19, roman:'XIX', en:'THE SUN', ja:'太陽', image:'assets/tarot/sun.png', upright:'明るい追い風が吹いています。喜びを分かち合い、自信を持って進みましょう。', reversed:'急ぎすぎず、休息と周囲への感謝を忘れないようにしましょう。' },
    { id:'star', arcana:17, roman:'XVII', en:'THE STAR', ja:'星', image:'assets/tarot/star.png', upright:'希望の光が見えています。焦らず、自分らしい願いを育てていきましょう。', reversed:'先が見えにくい時も、小さな回復の兆しを大切にしましょう。' },
    { id:'strength', arcana:8, roman:'VIII', en:'STRENGTH', ja:'力', image:'assets/tarot/strength.png', upright:'穏やかな粘り強さが力になります。自分を信じて一歩ずつ進みましょう。', reversed:'頑張りすぎのサインかもしれません。力を抜き、助けを受け取りましょう。' },
    { id:'tower', arcana:16, roman:'XVI', en:'THE TOWER', ja:'塔', image:'assets/tarot/tower.png', upright:'変化が流れを切り替えます。古い前提を見直し、新しい土台を整えましょう。', reversed:'小さな違和感を無視せず、落ち着いて変化に備えましょう。' }
  ];
  const defaultSettings = () => ({ cards: structuredClone(DEFAULTS).map(card => ({...card, enabled:true, uprightComment:card.upright, reversedComment:card.reversed})), reversedEnabled:true, reversedProbability:20, cooldownSeconds:60, obsEnabled:true, twitchEnabled:true });
  let settings = loadSettings();
  let history = loadHistory();
  let queue = [];
  let busy = false;
  let previewOrientation = 'upright';
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null;
  const $ = selector => document.querySelector(selector);

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      const base = defaultSettings();
      if (!saved || !Array.isArray(saved.cards)) return base;
      base.cards = base.cards.map(card => {
        const user = saved.cards.find(item => item.id === card.id);
        return user ? {...card, ...user, image:card.image} : card;
      });
      Object.assign(base, { reversedEnabled:saved.reversedEnabled !== false, reversedProbability:clamp(saved.reversedProbability,0,100,20), cooldownSeconds:clamp(saved.cooldownSeconds,0,86400,60), obsEnabled:saved.obsEnabled !== false, twitchEnabled:saved.twitchEnabled !== false });
      return base;
    } catch (_) { return defaultSettings(); }
  }
  function loadHistory() { try { return JSON.parse(localStorage.getItem(HISTORY) || '[]').slice(0,50); } catch (_) { return []; } }
  function save() { localStorage.setItem(STORE, JSON.stringify(settings)); }
  function clamp(value,min,max,fallback) { const n=Number(value); return Number.isFinite(n) ? Math.max(min,Math.min(max,n)) : fallback; }
  function esc(text) { return String(text).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function available() { return settings.cards.filter(card => card.enabled); }
  function selectedCard() { return settings.cards.find(card => card.id === $('#tarotPreviewSelect').value) || settings.cards[0]; }
  function comment(card, orientation) { return orientation === 'reversed' ? card.reversedComment : card.uprightComment; }
  function title(card) { return `${card.en} / ${card.ja}`; }

  function renderCard(card, orientation='upright') {
    const image = $('#tarotPreviewImage');
    const fallback = $('#tarotCardFallback');
    if (!card) return;
    $('#tarotPreviewCard').dataset.orientation = orientation;
    $('#tarotCardRoman').textContent = card.roman;
    $('#tarotCardTitle').textContent = card.en;
    $('#tarotCardJapanese').textContent = card.ja;
    $('#tarotResultTitle').textContent = `${title(card)} ${orientation === 'reversed' ? '逆位置' : '正位置'}`;
    $('#tarotResultComment').textContent = comment(card, orientation) || '';
    image.alt = title(card); image.hidden = false; fallback.hidden = true;
    image.onload = () => { image.hidden=false; fallback.hidden=true; };
    image.onerror = () => { image.hidden=true; fallback.hidden=false; };
    image.src = new URL(card.image, document.baseURI).href;
  }
  function renderCardList() {
    $('#tarotCardList').innerHTML = settings.cards.map(card => `<label class="tarot-card-toggle"><input type="checkbox" data-card-enabled="${card.id}" ${card.enabled?'checked':''}><span>${esc(card.roman)} · ${esc(title(card))}</span></label>`).join('');
  }
  function renderHistory() {
    $('#tarotHistory').innerHTML = history.length ? history.map(item => `<li><time>${new Date(item.at).toLocaleString('ja-JP')}</time><strong>${esc(item.user)}：${esc(title(item.card))} ${item.orientation === 'reversed'?'逆位置':'正位置'}</strong><span>${esc(item.comment)}</span></li>`).join('') : '<li class="tarot-empty">まだ履歴はありません。</li>';
  }
  function renderQueue() { $('#tarotQueueCount').textContent = `待機 ${queue.length}`; }
  function bindSelectedComments() {
    const card=selectedCard(); if(!card)return;
    $('#tarotUprightComment').value=card.uprightComment;
    $('#tarotReversedComment').value=card.reversedComment;
    renderCard(card,previewOrientation);
  }
  function renderAll() {
    $('#tarotObsEnabled').checked=settings.obsEnabled; $('#tarotTwitchEnabled').checked=settings.twitchEnabled;
    $('#tarotReversalEnabled').checked=settings.reversedEnabled; $('#tarotReversalProbability').value=settings.reversedProbability; $('#tarotCooldown').value=settings.cooldownSeconds;
    $('#tarotPreviewSelect').innerHTML=settings.cards.map(c=>`<option value="${c.id}">${esc(c.roman)} · ${esc(title(c))}</option>`).join('');
    renderCardList(); bindSelectedComments(); renderHistory(); renderQueue();
  }
  function publish(state) {
    if (!settings.obsEnabled) state = { stage:'idle', at:Date.now() };
    try { localStorage.setItem('quickDeckTarotState',JSON.stringify(state)); } catch (_) {}
    try { channel?.postMessage(state); } catch (_) {}
  }
  function addHistory(item) { history.unshift(item); history=history.slice(0,50); localStorage.setItem(HISTORY,JSON.stringify(history)); renderHistory(); }
  function draw({user='テスト', fixedCardId=null, fixedOrientation=null, twitch=false}={}) {
    const pool=available(); if(!pool.length){$('#tarotStatus').textContent='有効なカードがありません'; return null;}
    const card=fixedCardId ? settings.cards.find(c=>c.id===fixedCardId) : pool[Math.floor(Math.random()*pool.length)];
    if(!card || (!card.enabled && !fixedCardId))return null;
    const orientation=fixedOrientation || (settings.reversedEnabled && Math.random()*100<settings.reversedProbability ? 'reversed':'upright');
    const entry={id:crypto.randomUUID(),user:String(user).replace(/^@/,''),card:{...card},orientation,comment:comment(card,orientation),at:Date.now(),twitch};
    queue.push(entry); renderQueue();
    if(!busy) processQueue();
    return entry;
  }
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function processQueue() {
    const entry=queue.shift(); if(!entry)return;
    busy=true; renderQueue(); $('#tarotStatus').textContent=`${entry.user}さんのカードを準備中`;
    if(settings.obsEnabled) {
      publish({stage:'back',back:BACK,at:Date.now(),user:entry.user}); await delay(900);
      publish({stage:'shuffle',back:BACK,at:Date.now(),user:entry.user}); await delay(2200);
      publish({stage:'center',back:BACK,at:Date.now(),user:entry.user}); await delay(900);
      publish({stage:'flip',back:BACK,card:entry.card,orientation:entry.orientation,at:Date.now(),user:entry.user}); await delay(850);
    }
    renderCard(entry.card,entry.orientation);
    publish({stage:'result',card:entry.card,orientation:entry.orientation,comment:entry.comment,user:entry.user,at:Date.now()});
    $('#tarotStatus').textContent=`${entry.user}さんの結果を公開しました`;
    addHistory(entry);
    if(entry.twitch && settings.twitchEnabled && window.TalkCoachTwitch?.isConnected()) {
      const line=`${entry.user}さんのカードは「${title(entry.card)}」${entry.orientation==='reversed'?'逆位置':'正位置'}。${entry.comment}`;
      try { await window.TalkCoachTwitch.sendMessage(line); } catch(error) { $('#tarotStatus').textContent=`投稿失敗：${error.message}`; }
    }
    await delay(settings.obsEnabled ? 4500 : 600);
    publish({stage:'fade',at:Date.now()}); await delay(500); publish({stage:'idle',at:Date.now()});
    busy=false; renderQueue(); if(queue.length) processQueue(); else $('#tarotStatus').textContent='待機中';
  }
  function handleTwitchCommand(event) {
    if(!settings.twitchEnabled || !event || event.chatter_user_id === window.TalkCoachTwitch?.getState?.().sender?.id) return;
    const text=event.message?.text?.trim(); if(!/^!tarot(?:\s|$)/i.test(text||''))return;
    const login=(event.chatter_user_login||event.chatter_user_name||'').toLowerCase(); if(!login)return;
    const key='quickDeckTarotCooldowns'; let cooldowns={}; try{cooldowns=JSON.parse(localStorage.getItem(key)||'{}')}catch(_){}
    const now=Date.now(); if(now-(cooldowns[login]||0)<settings.cooldownSeconds*1000)return;
    if(!available().length)return;
    cooldowns[login]=now; localStorage.setItem(key,JSON.stringify(cooldowns));
    draw({user:event.chatter_user_name||event.chatter_user_login,twitch:true});
  }
  function init() {
    if(!$('#tarotPanel'))return;
    renderAll();
    $('#tarotPreviewSelect').addEventListener('change',bindSelectedComments);
    $('#tarotDraw').addEventListener('click',()=>draw());
    $('#tarotReversalEnabled').addEventListener('change',e=>{settings.reversedEnabled=e.target.checked;save()});
    $('#tarotReversalProbability').addEventListener('change',e=>{settings.reversedProbability=clamp(e.target.value,0,100,20);save();e.target.value=settings.reversedProbability});
    $('#tarotCooldown').addEventListener('change',e=>{settings.cooldownSeconds=clamp(e.target.value,0,86400,60);save();e.target.value=settings.cooldownSeconds});
    $('#tarotObsEnabled').addEventListener('change',e=>{settings.obsEnabled=e.target.checked;save();if(!settings.obsEnabled)publish({stage:'idle',at:Date.now()})});
    $('#tarotTwitchEnabled').addEventListener('change',e=>{settings.twitchEnabled=e.target.checked;save()});
    $('#tarotCardList').addEventListener('change',e=>{const id=e.target.dataset.cardEnabled;if(!id)return;settings.cards.find(c=>c.id===id).enabled=e.target.checked;save();renderCardList()});
    $('#tarotUprightComment').addEventListener('input',e=>{const c=selectedCard();c.uprightComment=e.target.value;save();renderCard(c,previewOrientation)});
    $('#tarotReversedComment').addEventListener('input',e=>{const c=selectedCard();c.reversedComment=e.target.value;save();renderCard(c,previewOrientation)});
    $('#tarotRestoreComments').addEventListener('click',()=>{const c=selectedCard(),d=DEFAULTS.find(x=>x.id===c.id);c.uprightComment=d.upright;c.reversedComment=d.reversed;save();bindSelectedComments()});
    $('#tarotClearHistory').addEventListener('click',()=>{history=[];localStorage.setItem(HISTORY,'[]');renderHistory()});
    window.addEventListener('twitch:chat-message',e=>handleTwitchCommand(e.detail));
    window.addEventListener('storage',e=>{if(e.key==='quickDeckTarotState'&&e.newValue){try{channel?.postMessage(JSON.parse(e.newValue))}catch(_){}}});
  }
  window.QuickDeckTarot={draw,settings:()=>settings};
  init();
})();
