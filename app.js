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
const ROLE_ORDER = ['tank', 'damage', 'support'];

const state = {
  players: 5,
  banned: new Set(JSON.parse(localStorage.getItem('owRouletteBans') || '[]')),
  results: Array(6).fill(null),
  roles: ['tank', 'damage', 'damage', 'support', 'support', 'all'],
  names: Array.from({ length: 6 }, (_, i) => `PLAYER ${i + 1}`),
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
  if (window.crypto?.getRandomValues) {
    const limit = Math.floor(0x100000000 / max) * max;
    const array = new Uint32Array(1);
    do window.crypto.getRandomValues(array); while (array[0] >= limit);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function pickRandom(list) { return list[randomInt(list.length)]; }
function roleHeroes(role) { return HEROES.filter(h => role === 'all' || h.role === role); }

function candidatesFor(playerIndex, excludeCurrentPlayer = false) {
  const used = new Set(
    state.results
      .slice(0, state.players)
      .map((r, i) => (excludeCurrentPlayer && i === playerIndex) ? null : r?.id)
      .filter(Boolean)
  );

  return roleHeroes(state.roles[playerIndex])
    .filter(h => !state.banned.has(h.id) && !used.has(h.id));
}

function renderPlayers() {
  els.playerGrid.innerHTML = '';

  for (let i = 0; i < state.players; i++) {
    const fragment = els.template.content.cloneNode(true);
    const card = fragment.querySelector('.player-card');
    const number = fragment.querySelector('.player-card__number');
    const nameInput = fragment.querySelector('.player-name');
    const roleSelect = fragment.querySelector('.role-select');
    const reroll = fragment.querySelector('.reroll-button');

    number.textContent = String(i + 1).padStart(2, '0');
    nameInput.value = state.names[i];
    roleSelect.value = state.roles[i];

    nameInput.addEventListener('input', e => {
      state.names[i] = e.target.value || `PLAYER ${i + 1}`;
    });

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
  els.playerGrid.style.setProperty('--player-count', state.players);
}

function updateCard(card, hero, spinningHero = null) {
  const shown = spinningHero || hero;
  const stage = card.querySelector('.result-stage');
  const emblem = card.querySelector('.hero-emblem span');
  const roleLabel = card.querySelector('.role-label');
  const heroName = card.querySelector('.hero-name');
  const heroSub = card.querySelector('.hero-sub');
  const selectedRole = card.querySelector('.role-select')?.value || 'all';

  stage.classList.remove('role-all', 'role-tank', 'role-damage', 'role-support');

  if (!shown) {
    stage.classList.add(`role-${selectedRole}`);
    emblem.textContent = '?';
    roleLabel.textContent = selectedRole === 'all' ? 'FLEX' : ROLE_LABELS[selectedRole];
    heroName.textContent = '—';
    heroSub.textContent = 'WAITING';
    return;
  }

  stage.classList.add(`role-${shown.role}`);
  emblem.textContent = shown.icon;
  roleLabel.textContent = ROLE_LABELS[shown.role];
  heroName.textContent = shown.name;
  heroSub.textContent = hero ? 'LOCKED IN' : 'SELECTING...';
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
  document.querySelectorAll('.preset-btn')
    .forEach(b => b.classList.toggle('active', b.dataset.preset === type));

  renderPlayers();
}

function clearPresetHighlight() {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}

function animateCard(card, pool, duration = 700) {
  return new Promise(resolve => {
    const stage = card.querySelector('.result-stage');
    stage.classList.add('spinning');

    const interval = setInterval(() => {
      updateCard(card, null, pickRandom(pool));
    }, 58);

    setTimeout(() => {
      clearInterval(interval);
      stage.classList.remove('spinning');
      resolve();
    }, duration);
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
  await animateCard(card, pool, 680);

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

  const animations = cards.slice(0, state.players).map((card, i) => {
    const pool = roleHeroes(state.roles[i]).filter(h => !state.banned.has(h.id));
    return pool.length ? animateCard(card, pool, 620 + i * 55) : Promise.resolve();
  });

  await Promise.all(animations);

  for (let i = 0; i < state.players; i++) {
    const pool = candidatesFor(i, false);
    if (!pool.length) {
      flashNoCandidate(cards[i]);
      continue;
    }

    const chosen = pickRandom(pool);
    state.results[i] = chosen;
    updateCard(cards[i], chosen);
  }

  state.spinning = false;
  lockControls(false);
}

function flashNoCandidate(card) {
  card.querySelector('.hero-emblem span').textContent = '!';
  card.querySelector('.hero-name').textContent = 'NO HERO';
  card.querySelector('.hero-sub').textContent = 'CHECK BAN / ROLE';
}

function lockControls(value) {
  els.spinAllBtn.disabled = value;
  els.minusPlayer.disabled = value;
  els.plusPlayer.disabled = value;

  document
    .querySelectorAll('.reroll-button, .role-select, .preset-btn')
    .forEach(el => el.disabled = value);
}

function clearResults() {
  state.results = Array(6).fill(null);
  renderPlayers();
}

function visibleBanHeroes() {
  const q = els.heroSearch.value.trim().toLowerCase();
  return HEROES.filter(hero => !q || hero.name.toLowerCase().includes(q));
}

function createHeroTile(hero) {
  const btn = document.createElement('button');
  const isBanned = state.banned.has(hero.id);

  btn.type = 'button';
  btn.className = `hero-tile${isBanned ? ' banned' : ''}`;
  btn.setAttribute('aria-pressed', String(isBanned));
  btn.innerHTML = `
    <span class="hero-tile__portrait">
      <span class="hero-tile__icon">${hero.icon}</span>
      <span class="hero-tile__slash"></span>
    </span>
    <strong>${hero.name}</strong>
    <small>${isBanned ? 'BANNED' : 'AVAILABLE'}</small>
  `;

  btn.addEventListener('click', () => {
    if (state.banned.has(hero.id)) {
      state.banned.delete(hero.id);
    } else {
      state.banned.add(hero.id);
    }

    persistBans();
    renderBanGrid();
    updateCounts();
  });

  return btn;
}

function renderBanGrid() {
  els.banHeroGrid.innerHTML = '';
  const visible = visibleBanHeroes();

  ROLE_ORDER.forEach(role => {
    const heroes = visible.filter(hero => hero.role === role);
    if (!heroes.length) return;

    const group = document.createElement('section');
    group.className = `hero-role-group role-group--${role}`;

    const heading = document.createElement('header');
    heading.className = 'hero-role-group__header';
    heading.innerHTML = `
      <span class="role-diamond"></span>
      <strong>${ROLE_LABELS[role]}</strong>
      <small>${heroes.length} HEROES</small>
    `;

    const grid = document.createElement('div');
    grid.className = 'hero-role-grid';
    heroes.forEach(hero => grid.append(createHeroTile(hero)));

    group.append(heading, grid);
    els.banHeroGrid.append(group);
  });

  updateCounts();
}

function persistBans() {
  localStorage.setItem('owRouletteBans', JSON.stringify([...state.banned]));
}

function updateCounts() {
  els.banCount.textContent = state.banned.size;
  els.modalBanCount.textContent = state.banned.size;
  els.availableCount.textContent = HEROES.length - state.banned.size;
}

els.minusPlayer.addEventListener('click', () => setPlayers(state.players - 1));
els.plusPlayer.addEventListener('click', () => setPlayers(state.players + 1));
els.spinAllBtn.addEventListener('click', spinAll);
els.clearResultsBtn.addEventListener('click', clearResults);

els.openBanBtn.addEventListener('click', () => {
  renderBanGrid();
  els.banDialog.showModal();
});

els.heroSearch.addEventListener('input', renderBanGrid);

els.clearBanBtn.addEventListener('click', () => {
  state.banned.clear();
  persistBans();
  renderBanGrid();
  updateCounts();
});

els.banVisibleBtn.addEventListener('click', () => {
  visibleBanHeroes().forEach(h => state.banned.add(h.id));
  persistBans();
  renderBanGrid();
  updateCounts();
});

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
});

updateCounts();
renderPlayers();
