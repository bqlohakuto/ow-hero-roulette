const HEROES = [
  { id: 'dmon', name: 'D.Mon', role: 'tank', icon: '⚔' },
  { id: 'ana', name: 'Ana', role: 'support', icon: '◎' },
  { id: 'anran', name: 'Anran', role: 'damage', icon: '🔥' },
  { id: 'ashe', name: 'Ashe', role: 'damage', icon: '♠' },
  { id: 'baptiste', name: 'Baptiste', role: 'support', icon: '✚' },
  { id: 'bastion', name: 'Bastion', role: 'damage', icon: '⚙' },
  { id: 'brigitte', name: 'Brigitte', role: 'support', icon: '⬡' },
  { id: 'cassidy', name: 'Cassidy', role: 'damage', icon: '★' },
  { id: 'dva', name: 'D.Va', role: 'tank', icon: '🐰' },
  { id: 'domina', name: 'Domina', role: 'tank', icon: '◆' },
  { id: 'doomfist', name: 'Doomfist', role: 'tank', icon: '✊' },
  { id: 'echo', name: 'Echo', role: 'damage', icon: '◇' },
  { id: 'emre', name: 'Emre', role: 'damage', icon: '⬢' },
  { id: 'freja', name: 'Freja', role: 'damage', icon: '➹' },
  { id: 'genji', name: 'Genji', role: 'damage', icon: '✦' },
  { id: 'hanzo', name: 'Hanzo', role: 'damage', icon: '➶' },
  { id: 'hazard', name: 'Hazard', role: 'tank', icon: '✹' },
  { id: 'illari', name: 'Illari', role: 'support', icon: '☀' },
  { id: 'jetpack-cat', name: 'Jetpack Cat', role: 'support', icon: '🐈' },
  { id: 'junker-queen', name: 'Junker Queen', role: 'tank', icon: '♛' },
  { id: 'junkrat', name: 'Junkrat', role: 'damage', icon: '💥' },
  { id: 'juno', name: 'Juno', role: 'support', icon: '🪐' },
  { id: 'kiriko', name: 'Kiriko', role: 'support', icon: '🦊' },
  { id: 'lifeweaver', name: 'Lifeweaver', role: 'support', icon: '🌸' },
  { id: 'lucio', name: 'Lúcio', role: 'support', icon: '♫' },
  { id: 'mauga', name: 'Mauga', role: 'tank', icon: '🌋' },
  { id: 'mei', name: 'Mei', role: 'damage', icon: '❄' },
  { id: 'mercy', name: 'Mercy', role: 'support', icon: '✧' },
  { id: 'mizuki', name: 'Mizuki', role: 'support', icon: '☂' },
  { id: 'moira', name: 'Moira', role: 'support', icon: '◉' },
  { id: 'orisa', name: 'Orisa', role: 'tank', icon: '♜' },
  { id: 'pharah', name: 'Pharah', role: 'damage', icon: '🚀' },
  { id: 'ramattra', name: 'Ramattra', role: 'tank', icon: '☯' },
  { id: 'reaper', name: 'Reaper', role: 'damage', icon: '☠' },
  { id: 'reinhardt', name: 'Reinhardt', role: 'tank', icon: '🔨' },
  { id: 'roadhog', name: 'Roadhog', role: 'tank', icon: '🪝' },
  { id: 'shion', name: 'Shion', role: 'damage', icon: '鬼' },
  { id: 'sierra', name: 'Sierra', role: 'damage', icon: '⌖' },
  { id: 'sigma', name: 'Sigma', role: 'tank', icon: 'Σ' },
  { id: 'sojourn', name: 'Sojourn', role: 'damage', icon: 'ϟ' },
  { id: 'soldier-76', name: 'Soldier: 76', role: 'damage', icon: '76' },
  { id: 'sombra', name: 'Sombra', role: 'damage', icon: '⌁' },
  { id: 'symmetra', name: 'Symmetra', role: 'damage', icon: '◈' },
  { id: 'torbjorn', name: 'Torbjörn', role: 'damage', icon: '🔧' },
  { id: 'tracer', name: 'Tracer', role: 'damage', icon: '◷' },
  { id: 'vendetta', name: 'Vendetta', role: 'damage', icon: '⚔' },
  { id: 'venture', name: 'Venture', role: 'damage', icon: '⛏' },
  { id: 'widowmaker', name: 'Widowmaker', role: 'damage', icon: '🕷' },
  { id: 'winston', name: 'Winston', role: 'tank', icon: '🦍' },
  { id: 'wrecking-ball', name: 'Wrecking Ball', role: 'tank', icon: '🐹' },
  { id: 'wuyang', name: 'Wuyang', role: 'support', icon: '💧' },
  { id: 'zarya', name: 'Zarya', role: 'tank', icon: '⬤' },
  { id: 'zenyatta', name: 'Zenyatta', role: 'support', icon: '☸' }
];

const ROLE_LABELS = { all: 'ALL', tank: 'TANK', damage: 'DAMAGE', support: 'SUPPORT' };
const state = {
  players: 5,
  banned: new Set(JSON.parse(localStorage.getItem('owRouletteBans') || '[]')),
  results: Array(6).fill(null),
  roles: ['tank', 'damage', 'damage', 'support', 'support', 'all'],
  names: Array.from({ length: 6 }, (_, i) => `PLAYER ${i + 1}`),
  filterRole: 'all',
  spinning: false
};

const els = {
  playerGrid: document.querySelector('#playerGrid'),
  playerCount: document.querySelector('#playerCount'),
  minusPlayer: document.querySelector('#minusPlayer'),
  plusPlayer: document.querySelector('#plusPlayer'),
  spinAllBtn: document.querySelector('#spinAllBtn'),
  clearResultsBtn: document.querySelector('#clearResultsBtn'),
  openBanBtn: document.querySelector('#openBanBtn'),
  banDialog: document.querySelector('#banDialog'),
  banHeroGrid: document.querySelector('#banHeroGrid'),
  heroSearch: document.querySelector('#heroSearch'),
  clearBanBtn: document.querySelector('#clearBanBtn'),
  banVisibleBtn: document.querySelector('#banVisibleBtn'),
  banCount: document.querySelector('#banCount'),
  modalBanCount: document.querySelector('#modalBanCount'),
  availableCount: document.querySelector('#availableCount'),
  heroTotal: document.querySelector('#heroTotal'),
  template: document.querySelector('#playerCardTemplate')
};

els.heroTotal.textContent = HEROES.length;

function randomInt(max) {
  if (max <= 0) return 0;
  if (crypto?.getRandomValues) {
    const limit = Math.floor(0x100000000 / max) * max;
    const array = new Uint32Array(1);
    do crypto.getRandomValues(array); while (array[0] >= limit);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function pickRandom(list) { return list[randomInt(list.length)]; }
function roleHeroes(role) { return HEROES.filter(h => role === 'all' || h.role === role); }
function candidatesFor(playerIndex, excludeCurrentPlayer = false) {
  const used = new Set(state.results.slice(0, state.players).map((r, i) => (excludeCurrentPlayer && i === playerIndex) ? null : r?.id).filter(Boolean));
  return roleHeroes(state.roles[playerIndex]).filter(h => !state.banned.has(h.id) && !used.has(h.id));
}

function renderPlayers() {
  els.playerGrid.innerHTML = '';
  for (let i = 0; i < state.players; i++) {
    const fragment = els.template.content.cloneNode(true);
    const card = fragment.querySelector('.player-card');
    const nameInput = fragment.querySelector('.player-name');
    const roleSelect = fragment.querySelector('.role-select');
    const reroll = fragment.querySelector('.reroll-button');

    nameInput.value = state.names[i];
    roleSelect.value = state.roles[i];
    nameInput.addEventListener('input', e => { state.names[i] = e.target.value || `PLAYER ${i + 1}`; });
    roleSelect.addEventListener('change', e => {
      state.roles[i] = e.target.value;
      state.results[i] = null;
      updateCard(card, null);
      clearPresetHighlight();
    });
    reroll.addEventListener('click', () => spinOne(i, card));
    updateCard(card, state.results[i]);
    els.playerGrid.append(fragment);
  }
  els.playerCount.textContent = state.players;
}

function updateCard(card, hero, spinningHero = null) {
  const shown = spinningHero || hero;
  const stage = card.querySelector('.result-stage');
  const emblem = card.querySelector('.hero-emblem span');
  const roleLabel = card.querySelector('.role-label');
  const heroName = card.querySelector('.hero-name');
  const heroSub = card.querySelector('.hero-sub');
  stage.classList.remove('role-all', 'role-tank', 'role-damage', 'role-support');

  if (!shown) {
    stage.classList.add(`role-${card.querySelector('.role-select')?.value || 'all'}`);
    emblem.textContent = '?'; roleLabel.textContent = 'READY'; heroName.textContent = '—'; heroSub.textContent = 'SPIN TO PICK';
    return;
  }
  stage.classList.add(`role-${shown.role}`);
  emblem.textContent = shown.icon;
  roleLabel.textContent = ROLE_LABELS[shown.role];
  heroName.textContent = shown.name;
  heroSub.textContent = hero ? 'LOCKED IN' : 'ROULETTE...';
}

function setPlayers(count) {
  const next = Math.min(6, Math.max(1, count));
  if (next === state.players) return;
  state.players = next;
  state.results = state.results.map((v, i) => i < next ? v : null);
  clearPresetHighlight();
  renderPlayers();
}

function applyPreset(type) {
  if (type === '5v5') {
    state.players = 5;
    state.roles = ['tank', 'damage', 'damage', 'support', 'support', 'all'];
  } else if (type === '6v6') {
    state.players = 6;
    state.roles = ['tank', 'tank', 'damage', 'damage', 'support', 'support'];
  } else {
    state.roles = Array(6).fill('all');
  }
  state.results = Array(6).fill(null);
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === type));
  renderPlayers();
}

function clearPresetHighlight() { document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active')); }

function animateCard(card, pool, duration = 780) {
  return new Promise(resolve => {
    const stage = card.querySelector('.result-stage');
    stage.classList.add('spinning');
    let ticks = 0;
    const interval = setInterval(() => {
      updateCard(card, null, pickRandom(pool));
      ticks++;
    }, 64);
    setTimeout(() => {
      clearInterval(interval);
      stage.classList.remove('spinning');
      resolve();
    }, duration + ticks * 2);
  });
}

async function spinOne(index, existingCard = null) {
  if (state.spinning) return;
  const card = existingCard || els.playerGrid.children[index];
  const pool = candidatesFor(index, true);
  if (!pool.length) {
    flashNoCandidate(card);
    return;
  }
  state.spinning = true;
  lockControls(true);
  await animateCard(card, pool, 720);
  const chosen = pickRandom(pool);
  state.results[index] = chosen;
  updateCard(card, chosen);
  state.spinning = false;
  lockControls(false);
}

async function spinAll() {
  if (state.spinning) return;
  state.spinning = true;
  state.results = Array(6).fill(null);
  lockControls(true);
  const cards = [...els.playerGrid.children];

  for (let i = 0; i < state.players; i++) {
    const pool = candidatesFor(i, false);
    if (!pool.length) {
      flashNoCandidate(cards[i]);
      continue;
    }
    await animateCard(cards[i], pool, 440 + i * 45);
    const chosen = pickRandom(pool);
    state.results[i] = chosen;
    updateCard(cards[i], chosen);
  }

  state.spinning = false;
  lockControls(false);
}

function flashNoCandidate(card) {
  const heroName = card.querySelector('.hero-name');
  const sub = card.querySelector('.hero-sub');
  heroName.textContent = 'NO HERO';
  sub.textContent = 'BAN / ROLE設定を確認';
}

function lockControls(value) {
  els.spinAllBtn.disabled = value;
  els.minusPlayer.disabled = value;
  els.plusPlayer.disabled = value;
  document.querySelectorAll('.reroll-button, .role-select, .preset-btn').forEach(el => el.disabled = value);
}

function clearResults() {
  state.results = Array(6).fill(null);
  renderPlayers();
}

function visibleBanHeroes() {
  const q = els.heroSearch.value.trim().toLowerCase();
  return HEROES.filter(hero => {
    const roleMatch = state.filterRole === 'all' || hero.role === state.filterRole;
    const nameMatch = !q || hero.name.toLowerCase().includes(q);
    return roleMatch && nameMatch;
  });
}

function renderBanGrid() {
  els.banHeroGrid.innerHTML = '';
  visibleBanHeroes().forEach(hero => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `ban-card${state.banned.has(hero.id) ? ' banned' : ''}`;
    btn.innerHTML = `<div class="ban-card__top"><span class="ban-card__icon">${hero.icon}</span><span class="ban-card__role">${ROLE_LABELS[hero.role]}</span></div><strong>${hero.name}</strong><small>${state.banned.has(hero.id) ? '抽選対象外' : 'クリックでBAN'}</small>`;
    btn.addEventListener('click', () => {
      if (state.banned.has(hero.id)) state.banned.delete(hero.id); else state.banned.add(hero.id);
      persistBans(); renderBanGrid(); updateCounts();
    });
    els.banHeroGrid.append(btn);
  });
  updateCounts();
}

function persistBans() { localStorage.setItem('owRouletteBans', JSON.stringify([...state.banned])); }
function updateCounts() {
  els.banCount.textContent = state.banned.size;
  els.modalBanCount.textContent = state.banned.size;
  els.availableCount.textContent = HEROES.length - state.banned.size;
}

els.minusPlayer.addEventListener('click', () => setPlayers(state.players - 1));
els.plusPlayer.addEventListener('click', () => setPlayers(state.players + 1));
els.spinAllBtn.addEventListener('click', spinAll);
els.clearResultsBtn.addEventListener('click', clearResults);
els.openBanBtn.addEventListener('click', () => { renderBanGrid(); els.banDialog.showModal(); });
els.heroSearch.addEventListener('input', renderBanGrid);
els.clearBanBtn.addEventListener('click', () => { state.banned.clear(); persistBans(); renderBanGrid(); updateCounts(); });
els.banVisibleBtn.addEventListener('click', () => { visibleBanHeroes().forEach(h => state.banned.add(h.id)); persistBans(); renderBanGrid(); updateCounts(); });
document.querySelectorAll('.role-filter-btn').forEach(btn => btn.addEventListener('click', () => {
  state.filterRole = btn.dataset.role;
  document.querySelectorAll('.role-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
  renderBanGrid();
}));
document.querySelectorAll('.preset-btn').forEach(btn => btn.addEventListener('click', () => applyPreset(btn.dataset.preset)));

updateCounts();
renderPlayers();
