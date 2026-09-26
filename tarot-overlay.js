(() => {
  const root=document.querySelector('#tarotOverlay');
  const fields={user:document.querySelector('#tarotOverlayUser'),title:document.querySelector('#tarotOverlayTitle'),comment:document.querySelector('#tarotOverlayComment'),roman:document.querySelector('#tarotOverlayRoman'),name:document.querySelector('#tarotOverlayName'),japanese:document.querySelector('#tarotOverlayJapanese'),image:document.querySelector('#tarotOverlayImage'),fallback:document.querySelector('#tarotOverlayFallback')};
  function render(state={}) {
    root.dataset.stage=state.stage||'idle';
    if(state.card){const card=state.card;fields.user.textContent=state.user?`${state.user}さんのカード`:'';fields.title.textContent=`${card.en} / ${card.ja} ${state.orientation==='reversed'?'逆位置':'正位置'}`;fields.comment.textContent=state.comment||'';fields.roman.textContent=card.roman;fields.name.textContent=card.en;fields.japanese.textContent=card.ja;fields.image.src=card.image;fields.image.hidden=true;fields.fallback.hidden=false;fields.image.onload=()=>{fields.image.hidden=false;fields.fallback.hidden=true};fields.image.onerror=()=>{fields.image.hidden=true;fields.fallback.hidden=false};fields.image.style.transform=state.orientation==='reversed'?'rotate(180deg)':'';}
  }
  try{const saved=JSON.parse(localStorage.getItem('quickDeckTarotState')||'null');if(saved)render(saved)}catch(_){}
  try{const channel=new BroadcastChannel('quick-deck-tarot');channel.onmessage=e=>render(e.data)}catch(_){}
  addEventListener('storage',e=>{if(e.key==='quickDeckTarotState'&&e.newValue){try{render(JSON.parse(e.newValue))}catch(_){}}});
})();
