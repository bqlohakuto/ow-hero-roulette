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


const SILHOUETTE_BASE = `
  <path d="M30 91c2-17 10-26 20-28 10 2 18 11 20 28H30Z"/>
  <circle cx="50" cy="42" r="15"/>
`;

const SILHOUETTE_FEATURES = {
  'dmon': `<path d="M31 28 21 14l16 8 13-12 13 12 16-8-10 14-7-4-12-1-12 1-7 4Z"/><rect x="20" y="64" width="18" height="20" rx="4"/><rect x="62" y="64" width="18" height="20" rx="4"/>`,
  'ana': `<path d="M32 35c4-17 32-17 36 0l-7-3-5-9-6 5-7-5-5 9-6 3Z"/><rect x="13" y="68" width="42" height="5" rx="2" transform="rotate(-18 13 68)"/>`,
  'anran': `<path d="M34 30c-7-12 5-18 7-25 4 9 9 10 9 20 3-9 9-11 13-18 3 10 9 19 1 26l-30-3Z"/>`,
  'ashe': `<path d="M25 30h50l-8-10H55l-5-8-5 8H33l-8 10Z"/><rect x="58" y="63" width="35" height="5" rx="2" transform="rotate(-12 58 63)"/>`,
  'baptiste': `<rect x="34" y="28" width="32" height="8" rx="4"/><rect x="13" y="66" width="40" height="10" rx="3" transform="rotate(-12 13 66)"/><rect x="71" y="61" width="9" height="21" rx="2"/>`,
  'bastion': `<rect x="35" y="25" width="30" height="28" rx="4"/><circle cx="50" cy="39" r="6"/><rect x="22" y="52" width="56" height="35" rx="5"/><rect x="67" y="16" width="8" height="35" rx="3"/><rect x="74" y="12" width="15" height="7" rx="2"/>`,
  'brigitte': `<path d="M66 33c12 3 18 13 13 25l-9-6 3-9-7-10Z"/><rect x="11" y="63" width="28" height="22" rx="3"/><rect x="69" y="59" width="7" height="29" rx="3"/><circle cx="73" cy="57" r="7"/>`,
  'cassidy': `<path d="M22 30h56l-9-9H58l-8-8-8 8H31l-9 9Z"/><rect x="69" y="62" width="23" height="7" rx="2"/><rect x="83" y="66" width="5" height="11" rx="2"/>`,
  'dva': `<path d="M35 29 29 8l13 14h16L71 8l-6 21-10-4H45l-10 4Z"/><path d="M21 71 8 55l8-9 18 18-13 7Zm58 0 13-16-8-9-18 18 13 7Z"/>`,
  'domina': `<path d="M31 31 25 12l16 9 9-15 9 15 16-9-6 19-12-5H43l-12 5Z"/><path d="M23 72 9 58l7-10 21 17-14 7Zm54-1 14-13-7-10-21 17 14 6Z"/>`,
  'doomfist': `<path d="M66 62h24v26H65l-8-11 9-15Z"/><rect x="72" y="54" width="7" height="15" rx="3"/><rect x="81" y="52" width="7" height="17" rx="3"/>`,
  'echo': `<path d="M50 17 64 37 50 54 36 37 50 17Z"/><path d="M31 64 7 47l5 24 22 13-3-20Zm38 0 24-17-5 24-22 13 3-20Z"/>`,
  'emre': `<path d="M31 30h38l-6-9H37l-6 9Z"/><rect x="15" y="69" width="43" height="6" rx="2" transform="rotate(-8 15 69)"/><path d="M71 58h13l7 9-12 5-8-14Z"/>`,
  'freja': `<path d="M25 18c25 10 25 54 0 66 19-18 19-48 0-66Zm50 0c-25 10-25 54 0 66-19-18-19-48 0-66Z"/><rect x="48" y="13" width="4" height="75" rx="2"/>`,
  'genji': `<path d="M34 31 41 13l9 10 9-10 7 18-10-4H44l-10 4Z"/><rect x="70" y="20" width="6" height="64" rx="2" transform="rotate(38 70 20)"/>`,
  'hanzo': `<circle cx="50" cy="19" r="7"/><path d="M26 22c26 9 28 45 2 64 17-19 16-46-2-64Z"/><rect x="70" y="20" width="4" height="65" rx="2" transform="rotate(16 70 20)"/>`,
  'hazard': `<path d="M31 31 19 17l17 4 4-15 10 13L60 6l4 15 17-4-12 14-9-5H40l-9 5Z"/><path d="M18 74 7 61l9-6 14 15-12 4Zm64 0 11-13-9-6-14 15 12 4Z"/>`,
  'illari': `<circle cx="50" cy="17" r="8"/><path d="M50 2v8M50 24v8M35 17h8M57 17h8M39 6l6 6M55 22l6 6M61 6l-6 6M45 22l-6 6" stroke="currentColor" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="72" y="47" width="6" height="39" rx="3"/>`,
  'jetpack-cat': `<path d="M36 35 27 19l15 7 8-8 8 8 15-7-9 16-10-5h-8l-10 5Z"/><path d="M26 62H13v25h18V69h38v18h18V62H74l-8-9H34l-8 9Z"/>`,
  'junker-queen': `<path d="M37 27 42 7l8 14 8-14 5 20-9-4h-8l-9 4Z"/><path d="M78 58 92 73l-7 6-11-9-6 17-7-3 8-20 9-6Z"/>`,
  'junkrat': `<path d="M30 31 18 22l14-2-5-12 13 7 5-13 6 13 12-9-3 14 14 2-12 9-10-5H40l-10 5Z"/><circle cx="24" cy="74" r="14"/><circle cx="24" cy="74" r="6" fill="none" stroke="currentColor" stroke-width="5"/>`,
  'juno': `<circle cx="50" cy="40" r="19"/><path d="M26 40c4-25 44-32 55-7" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="80" cy="31" r="5"/><path d="M20 69 8 60l8-8 15 11-11 6Zm60 0 12-9-8-8-15 11 11 6Z"/>`,
  'kiriko': `<path d="M33 32 25 13l16 9 9-10 9 10 16-9-8 19-10-6H43l-10 6Z"/><path d="M76 56 91 70l-6 7-16-13 7-8Z"/>`,
  'lifeweaver': `<path d="M50 9 58 25 75 20 68 36 83 46 65 49 66 67 50 57 34 67 35 49 17 46 32 36 25 20 42 25 50 9Z"/>`,
  'lucio': `<path d="M31 33c-5-17 6-25 19-25s24 8 19 25l-7-2c2-10-3-15-12-15s-14 5-12 15l-7 2Z"/><path d="M28 35h9v20h-9V35Zm35 0h9v20h-9V35Z"/><path d="M31 48c-10 8-12 18-7 31M69 48c10 8 12 18 7 31" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`,
  'mauga': `<path d="M19 88c1-25 12-35 31-35s30 10 31 35H19Z"/><rect x="4" y="60" width="28" height="14" rx="4"/><rect x="68" y="60" width="28" height="14" rx="4"/><rect x="9" y="54" width="7" height="34" rx="3"/><rect x="84" y="54" width="7" height="34" rx="3"/>`,
  'mei': `<circle cx="50" cy="21" r="8"/><path d="M32 34c3-10 33-10 36 0l-8-2-10-7-10 7-8 2Z"/><rect x="68" y="61" width="21" height="10" rx="3"/><rect x="80" y="54" width="6" height="25" rx="3"/>`,
  'mercy': `<ellipse cx="50" cy="15" rx="13" ry="5" fill="none" stroke="currentColor" stroke-width="4"/><path d="M30 59 8 43l8 30 18 11-4-25Zm40 0 22-16-8 30-18 11 4-25Z"/>`,
  'mizuki': `<path d="M17 54c8-24 58-24 66 0-10-5-17-5-25 0-7-5-14-5-21 0-7-5-13-5-20 0Z"/><rect x="48" y="50" width="4" height="38" rx="2"/>`,
  'moira': `<path d="M31 33c3-18 35-18 38 0l-9-5-10-11-10 11-9 5Z"/><circle cx="19" cy="68" r="10"/><circle cx="81" cy="68" r="10"/><path d="M29 74 40 62M71 74 60 62" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`,
  'orisa': `<path d="M36 34 25 21l15 3 10-16 10 16 15-3-11 13-10-5H46l-10 5Z"/><path d="M25 62h50l10 26H64L58 72H42L36 88H15l10-26Z"/>`,
  'pharah': `<path d="M33 31 40 13h20l7 18-9-5H42l-9 5Z"/><path d="M28 59 6 45l9 34 18 8-5-28Zm44 0 22-14-9 34-18 8 5-28Z"/>`,
  'ramattra': `<path d="M35 31 29 14l15 7 6-12 6 12 15-7-6 17-10-5H45l-10 5Z"/><path d="M18 61h18v27H15l3-27Zm64 0H64v27h21l-3-27Z"/>`,
  'reaper': `<path d="M31 30 39 17h22l8 13-8 2-5 13H44l-5-13-8-2Z"/><path d="M16 64h27l-8 9H13l3-9Zm68 0H57l8 9h22l-3-9Z"/>`,
  'reinhardt': `<path d="M31 32 26 15l13 8 11-16 11 16 13-8-5 17-10-5H41l-10 5Z"/><rect x="76" y="27" width="9" height="55" rx="3"/><path d="M70 24h22v13H70z"/>`,
  'roadhog': `<path d="M18 89c1-30 14-41 32-41s31 11 32 41H18Z"/><circle cx="50" cy="39" r="17"/><path d="M65 63c15-13 28-4 21 9-4 7-13 8-19 2" fill="none" stroke="currentColor" stroke-width="6"/>`,
  'shion': `<path d="M31 32 24 15l16 8 10-14 10 14 16-8-7 17-12-6H43l-12 6Z"/><path d="M72 52 91 65l-5 8-20-12 6-9Z"/>`,
  'sierra': `<path d="M34 29h32l-5-11H39l-5 11Z"/><path d="M50 6v12M25 18l10 7M75 18l-10 7" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><rect x="72" y="55" width="18" height="8" rx="2"/>`,
  'sigma': `<path d="M33 32c4-18 30-18 34 0l-8-4-9-12-9 12-8 4Z"/><circle cx="19" cy="67" r="10"/><circle cx="81" cy="67" r="10"/>`,
  'sojourn': `<path d="M34 28h32l-6-10H40l-6 10Z"/><rect x="61" y="63" width="31" height="7" rx="3"/><path d="M72 56h9l4 7-10 3-3-10Z"/>`,
  'soldier-76': `<path d="M31 29h38l-4-10H35l-4 10Z"/><rect x="31" y="31" width="38" height="7" rx="3"/><rect x="61" y="63" width="31" height="8" rx="3"/>`,
  'sombra': `<path d="M31 31c2-18 36-18 38 0l-8-3-11-13-11 13-8 3Z"/><path d="M78 55 92 67l-7 8-14-13 7-7Z"/><circle cx="19" cy="70" r="7"/>`,
  'symmetra': `<path d="M34 32c3-17 29-18 32 0l-7-4-9-14-9 14-7 4Z"/><path d="M76 48 91 60 81 78 65 64 76 48Z"/>`,
  'torbjorn': `<path d="M29 31h42l-8-12H37l-8 12Z"/><path d="M30 47h40l-7 11H37l-7-11Z"/><rect x="72" y="57" width="8" height="31" rx="3"/><path d="M65 55h22v10H65z"/>`,
  'tracer': `<path d="M34 30h32l-7-12H41l-7 12Z"/><circle cx="50" cy="68" r="10"/><path d="M18 62 8 54l8-8 14 10-12 6Zm64 0 10-8-8-8-14 10 12 6Z"/>`,
  'vendetta': `<path d="M32 31 40 15h20l8 16-9-4H41l-9 4Z"/><rect x="72" y="19" width="6" height="69" rx="2" transform="rotate(28 72 19)"/>`,
  'venture': `<path d="M35 30 40 16h20l5 14-9-4H44l-9 4Z"/><path d="M68 52 90 61 83 79 61 69 68 52Z"/>`,
  'widowmaker': `<path d="M33 30 40 18h20l7 12-9-4H42l-9 4Z"/><path d="M50 8 56 18 50 25 44 18 50 8Z"/><rect x="62" y="61" width="31" height="5" rx="2"/>`,
  'winston': `<path d="M25 88c2-28 12-42 25-42s23 14 25 42H25Z"/><circle cx="50" cy="37" r="18"/><path d="M14 63h19v24H11l3-24Zm72 0H67v24h22l-3-24Z"/>`,
  'wrecking-ball': `<circle cx="50" cy="57" r="31"/><path d="M38 34 31 17l14 8 5-11 5 11 14-8-7 17-12-5-12 5Z"/><circle cx="50" cy="54" r="10"/>`,
  'wuyang': `<path d="M34 31c3-17 29-17 32 0l-7-4-9-12-9 12-7 4Z"/><path d="M50 55c10 11 12 19 0 31-12-12-10-20 0-31Z"/>`,
  'zarya': `<path d="M31 31c4-16 34-16 38 0l-9-4-10-10-10 10-9 4Z"/><rect x="66" y="57" width="27" height="17" rx="4"/><circle cx="80" cy="65" r="6"/>`,
  'zenyatta': `<circle cx="50" cy="39" r="14"/><circle cx="50" cy="14" r="5"/><circle cx="31" cy="20" r="5"/><circle cx="69" cy="20" r="5"/><circle cx="24" cy="39" r="5"/><circle cx="76" cy="39" r="5"/><circle cx="34" cy="58" r="5"/><circle cx="66" cy="58" r="5"/>`
};

const SILHOUETTE_FULL = new Set(['bastion', 'echo', 'jetpack-cat', 'lifeweaver', 'orisa', 'wrecking-ball', 'zenyatta']);

function silhouetteSvg(hero) {
  const detail = SILHOUETTE_FEATURES[hero.id] || '';
  const body = SILHOUETTE_FULL.has(hero.id) ? detail : SILHOUETTE_BASE + detail;
  return `<svg class="hero-silhouette" viewBox="0 0 100 100" aria-hidden="true">${body}</svg>`;
}

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
  emblem.innerHTML = silhouetteSvg(shown);
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
      <span class="hero-tile__icon">${silhouetteSvg(hero)}</span>
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
