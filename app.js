const HEROES = [
  { id: 'dmon', name: 'ディーモン', role: 'tank', icon: '⚔' },
  { id: 'ana', name: 'アナ', role: 'support', icon: '◎' },
  { id: 'anran', name: 'アンラン', role: 'damage', icon: '🔥' },
  { id: 'ashe', name: 'アッシュ', role: 'damage', icon: '♠' },
  { id: 'baptiste', name: 'バティスト', role: 'support', icon: '✚' },
  { id: 'bastion', name: 'バスティオン', role: 'damage', icon: '⚙' },
  { id: 'brigitte', name: 'ブリギッテ', role: 'support', icon: '⬡' },
  { id: 'cassidy', name: 'キャスディ', role: 'damage', icon: '★' },
  { id: 'dva', name: 'D.Va', role: 'tank', icon: '🐰' },
  { id: 'domina', name: 'ドミナ', role: 'tank', icon: '◆' },
  { id: 'doomfist', name: 'ドゥームフィスト', role: 'tank', icon: '✊' },
  { id: 'echo', name: 'エコー', role: 'damage', icon: '◇' },
  { id: 'emre', name: 'エムレ', role: 'damage', icon: '⬢' },
  { id: 'freja', name: 'フレイヤ', role: 'damage', icon: '➹' },
  { id: 'genji', name: 'ゲンジ', role: 'damage', icon: '✦' },
  { id: 'hanzo', name: 'ハンゾー', role: 'damage', icon: '➶' },
  { id: 'hazard', name: 'ハザード', role: 'tank', icon: '✹' },
  { id: 'illari', name: 'イラリー', role: 'support', icon: '☀' },
  { id: 'jetpack-cat', name: 'ジェットパック・キャット', role: 'support', icon: '🐈' },
  { id: 'junker-queen', name: 'ジャンカー・クイーン', role: 'tank', icon: '♛' },
  { id: 'junkrat', name: 'ジャンクラット', role: 'damage', icon: '💥' },
  { id: 'juno', name: 'ジュノ', role: 'support', icon: '🪐' },
  { id: 'kiriko', name: 'キリコ', role: 'support', icon: '🦊' },
  { id: 'lifeweaver', name: 'ライフウィーバー', role: 'support', icon: '🌸' },
  { id: 'lucio', name: 'ルシオ', role: 'support', icon: '♫' },
  { id: 'mauga', name: 'マウガ', role: 'tank', icon: '🌋' },
  { id: 'mei', name: 'メイ', role: 'damage', icon: '❄' },
  { id: 'mercy', name: 'マーシー', role: 'support', icon: '✧' },
  { id: 'mizuki', name: 'ミズキ', role: 'support', icon: '☂' },
  { id: 'moira', name: 'モイラ', role: 'support', icon: '◉' },
  { id: 'orisa', name: 'オリーサ', role: 'tank', icon: '♜' },
  { id: 'pharah', name: 'ファラ', role: 'damage', icon: '🚀' },
  { id: 'ramattra', name: 'ラマットラ', role: 'tank', icon: '☯' },
  { id: 'reaper', name: 'リーパー', role: 'damage', icon: '☠' },
  { id: 'reinhardt', name: 'ラインハルト', role: 'tank', icon: '🔨' },
  { id: 'roadhog', name: 'ロードホッグ', role: 'tank', icon: '🪝' },
  { id: 'shion', name: 'シオン', role: 'damage', icon: '鬼' },
  { id: 'sierra', name: 'シエラ', role: 'damage', icon: '⌖' },
  { id: 'sigma', name: 'シグマ', role: 'tank', icon: 'Σ' },
  { id: 'sojourn', name: 'ソジョーン', role: 'damage', icon: 'ϟ' },
  { id: 'soldier-76', name: 'ソルジャー76', role: 'damage', icon: '76' },
  { id: 'sombra', name: 'ソンブラ', role: 'damage', icon: '⌁' },
  { id: 'symmetra', name: 'シンメトラ', role: 'damage', icon: '◈' },
  { id: 'torbjorn', name: 'トールビョーン', role: 'damage', icon: '🔧' },
  { id: 'tracer', name: 'トレーサー', role: 'damage', icon: '◷' },
  { id: 'vendetta', name: 'ヴェンデッタ', role: 'damage', icon: '⚔' },
  { id: 'venture', name: 'ベンチャー', role: 'damage', icon: '⛏' },
  { id: 'widowmaker', name: 'ウィドウメイカー', role: 'damage', icon: '🕷' },
  { id: 'winston', name: 'ウィンストン', role: 'tank', icon: '🦍' },
  { id: 'wrecking-ball', name: 'レッキング・ボール', role: 'tank', icon: '🐹' },
  { id: 'wuyang', name: 'ウーヤン', role: 'support', icon: '💧' },
  { id: 'zarya', name: 'ザリア', role: 'tank', icon: '⬤' },
  { id: 'zenyatta', name: 'ゼニヤッタ', role: 'support', icon: '☸' }
];


const SILHOUETTE_BASE = ``;

const SILHOUETTE_FEATURES = {
  'dmon': `<path d="M13 18h43v35c0 17-11 27-21 34-10-7-22-17-22-34V18Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="m67 10 14 14-27 48-11-11 24-51Z"/><path d="m42 62 19 19M39 72l13-13" stroke="currentColor" stroke-width="6"/>`,
  'ana': `<path d="M6 40h65l13 8-13 8H36l-8 12H17l6-12H6V40Z"/><path d="M67 70h17l7 7-7 7H67V70Z"/><path d="M75 62v30M60 77h30" stroke="currentColor" stroke-width="6"/>`,
  'anran': `<path d="M17 81 50 43l33 38H17Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M50 44v37M38 52l-8 29M62 52l8 29" stroke="currentColor" stroke-width="4"/><path d="M48 7c4 13 16 16 10 29 8-5 11-11 12-19 10 14 7 26-4 34H35c-13-13-8-29 5-40-1 8 2 14 8 19-3-10-2-16 0-23Z"/>`,
  'ashe': `<path d="M8 28h71l11 7-11 7H35L27 52H16l6-10H8V28Z"/><path d="M64 60h11v25H64zM78 65h9v20h-9z"/><path d="M69 57h13l4 8H65l4-8Z"/>`,
  'baptiste': `<path d="M10 50h68l12 8-12 8H42l-7 13H24l6-13H10V50Z"/><path d="M50 13v26M37 26h26" stroke="currentColor" stroke-width="8"/>`,
  'bastion': `<circle cx="40" cy="50" r="27" fill="none" stroke="currentColor" stroke-width="8"/><path d="M40 15v12M40 73v12M5 50h12M63 50h12M15 25l9 9M56 66l9 9M65 25l-9 9M24 66l-9 9" stroke="currentColor" stroke-width="7"/><path d="M46 40h39l10 10-10 10H46V40Z"/>`,
  'brigitte': `<path d="M12 24h38v31c0 15-10 25-19 31-9-6-19-16-19-31V24Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M67 17c14 4 20 14 15 25l-8-4c2-6-1-11-9-13l2-8Z"/><path d="M67 25 51 72" stroke="currentColor" stroke-width="7"/><circle cx="49" cy="77" r="8"/>`,
  'cassidy': `<path d="M15 32h70L72 19H59l-9-9-9 9H28L15 32Z"/><path d="M39 53h43l10 8-10 8H64l-6 13H47l4-13H39V53Z"/>`,
  'dva': `<path d="M25 58 18 14l24 24h16l24-24-7 44c-3 19-14 27-25 27S28 77 25 58Z" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="38" cy="56" r="4"/><circle cx="62" cy="56" r="4"/><path d="m44 67 6 4 6-4" fill="none" stroke="currentColor" stroke-width="4"/>`,
  'domina': `<path d="M11 18h46v34c0 17-12 27-23 34-11-7-23-17-23-34V18Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M17 33h34M23 20l-6 31M34 20v39M46 20l6 31" fill="none" stroke="currentColor" stroke-width="3"/><path d="M59 46h27l8 8-8 9H64l-5-17Z"/><rect x="75" y="61" width="7" height="15" rx="2"/>`,
  'doomfist': `<path d="M25 49V28c0-8 10-8 10 0v17-26c0-8 10-8 10 0v25-30c0-8 10-8 10 0v30-24c0-8 10-8 10 0v28l7-10c5-7 14-1 10 7L69 73c-5 10-12 14-23 14-14 0-24-10-24-25V49h3Z"/>`,
  'echo': `<path d="M50 16 65 39 50 57 35 39 50 16Z"/><path d="M31 51 7 35l8 40 20 10-4-34Zm38 0 24-16-8 40-20 10 4-34Z"/>`,
  'emre': `<path d="M8 54h62l14 8-14 8H36l-8 12H18l5-12H8V54Z"/><circle cx="80" cy="31" r="14" fill="none" stroke="currentColor" stroke-width="6"/><path d="M80 12v7M68 18l5 6" stroke="currentColor" stroke-width="5"/>`,
  'freja': `<path d="M16 50 47 22v56L16 50Zm68 0L53 22v56l31-28Z" fill="none" stroke="currentColor" stroke-width="6"/><rect x="47" y="13" width="6" height="74" rx="3"/><path d="M67 22c10 7 13 15 12 26-8-3-14-8-18-16l6-10Z"/>`,
  'genji': `<path d="m24 21 9 18 20-3-14 15 9 18-20-7-15 14 4-21L2 41l21 3 1-23Z"/><path d="M61 18 90 47 82 55 53 26l8-8Z"/>`,
  'hanzo': `<path d="M26 18c28 12 28 52 0 68 17-22 17-46 0-68Z" fill="none" stroke="currentColor" stroke-width="7"/><path d="M28 52h39M61 47l7 5-7 5" stroke="currentColor" stroke-width="5"/><path d="M66 25c16 1 22 12 13 22-5 6-12 4-15 10-3 6 3 12 12 11-8 11-25 5-25-8 0-13 14-14 18-21 4-7-2-12-3-14Z"/>`,
  'hazard': `<path d="m50 12 10 13 18-6-5 17 15 10-16 9 7 18-18-5-11 19-11-18-19 6 6-19-16-9 16-11-5-18 18 7 11-13Z"/><path d="m34 33 13-8 14 7 8 13-8 15-18 8-13-13 4-22Z" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3"/>`,
  'illari': `<circle cx="31" cy="30" r="13"/><path d="M31 5v12M31 43v12M6 30h12M44 30h12M13 12l9 9M40 39l9 9M49 12l-9 9M22 39l-9 9" stroke="currentColor" stroke-width="5"/><path d="M40 58h48l8 7-8 8H61l-7 12H44l5-12h-9V58Z"/>`,
  'jetpack-cat': `<path d="M31 42 23 17l18 11 9-8 9 8 18-11-8 25-12-7H43l-12 7Z"/><circle cx="42" cy="46" r="3"/><circle cx="58" cy="46" r="3"/><path d="M15 61h17v27H15zM68 61h17v27H68z"/>`,
  'junker-queen': `<path d="m17 77 29-51 10 6-29 51-10-6Z"/><path d="M37 18 64 8l-10 28-17-18Z"/><path d="m58 76 20-37 8 4-20 37-8-4Z"/><path d="m74 33 15 4-8 12-7-16Z"/>`,
  'junkrat': `<circle cx="46" cy="57" r="27" fill="none" stroke="currentColor" stroke-width="9"/><path d="M46 21v10M46 83v10M10 57h10M72 57h10M20 31l8 8M64 75l8 8M72 31l-8 8M28 75l-8 8" stroke="currentColor" stroke-width="7"/><path d="M75 15c2 9 11 11 7 20 6-4 8-8 8-14 8 11 4 23-7 28-11-5-14-17-8-26-1 5 0 8 4 11-2-8-3-13-4-19Z"/>`,
  'juno': `<circle cx="42" cy="43" r="23" fill="none" stroke="currentColor" stroke-width="6"/><path d="M12 44c17-19 43-25 66-10" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="79" cy="33" r="6"/><path d="M58 61h30l8 7-8 8H67l-5 10h-9l5-10V61Z"/>`,
  'kiriko': `<path d="M31 42 23 16l18 12 9-10 9 10 18-12-8 26-12-7H43l-12 7Z"/><path d="M14 70 27 55l8 7-13 15-8-7ZM64 56h20v29H64z"/>`,
  'lifeweaver': `<path d="M50 9 59 29 80 20 70 42 91 50 70 58 80 80 59 71 50 91 41 71 20 80 30 58 9 50 30 42 20 20 41 29 50 9Z"/>`,
  'lucio': `<circle cx="55" cy="57" r="18" fill="none" stroke="currentColor" stroke-width="7"/><path d="M28 37c-10 7-15 16-15 27M38 44c-6 4-9 10-9 19M73 25v25c0 8 13 8 13-1 0-7-8-9-13-5" fill="none" stroke="currentColor" stroke-width="6"/>`,
  'mauga': `<path d="M50 7c4 14 15 17 10 30 9-6 14-15 14-25 12 13 15 30 4 42H22c-11-13-6-30 9-43-1 12 3 20 11 26-3-13 5-20 8-30Z"/><rect x="7" y="57" width="36" height="20" rx="6"/><rect x="57" y="57" width="36" height="20" rx="6"/><path d="M13 61v12m8-12v12m8-12v12m8-12v12m27-12v12m8-12v12m8-12v12m8-12v12" stroke="#fff" stroke-opacity=".28" stroke-width="3"/>`,
  'mei': `<path d="M28 10v80M10 28l80 44M10 72l80-44M16 50h84" stroke="currentColor" stroke-width="5"/><path d="M61 58h27l8 7-8 8H63l-2-15Z"/>`,
  'mercy': `<ellipse cx="50" cy="16" rx="17" ry="6" fill="none" stroke="currentColor" stroke-width="5"/><path d="M34 47 8 31l9 38 20 14-3-36Zm32 0 26-16-9 38-20 14 3-36Z"/><path d="M50 35v52M43 87h14" stroke="currentColor" stroke-width="6"/>`,
  'mizuki': `<path d="M9 43c13-26 69-26 82 0-12-4-21-4-31 0-8-5-16-5-24 0-9-4-17-4-27 0Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M50 17v29" stroke="currentColor" stroke-width="5"/><path d="M37 63c14-17 32-20 46-12-4 26-20 37-42 37 15-7 24-18 25-30-11-2-19 2-25 10l-4-5Z"/><rect x="33" y="61" width="7" height="31" rx="3" transform="rotate(25 36 76)"/>`,
  'moira': `<circle cx="50" cy="34" r="12"/><path d="M13 84c2-18 11-28 24-31l7 13-14 21-17-3Zm74 0c-2-18-11-28-24-31l-7 13 14 21 17-3Z"/><path d="M50 10c6 8 15 11 11 21-4 8-14 8-18 1-4-8 3-14 7-22Z"/>`,
  'orisa': `<path d="M18 21h43v34c0 15-10 24-21 31-11-7-22-16-22-31V21Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M73 8v76M64 18l9-11 9 11M66 83h14" fill="none" stroke="currentColor" stroke-width="7"/>`,
  'pharah': `<path d="M50 10 62 35 55 75 50 90 45 75 38 35 50 10Z"/><path d="M37 43 13 28l8 39 20 12-4-36Zm26 0 24-15-8 39-20 12 4-36Z"/>`,
  'ramattra': `<path d="M20 18v67M12 20l8-12 8 12M11 84h18" fill="none" stroke="currentColor" stroke-width="7"/><path d="M59 48h25v28H58l-8-13 9-15Z"/><rect x="62" y="36" width="6" height="17" rx="3"/><rect x="71" y="34" width="6" height="19" rx="3"/><rect x="80" y="38" width="6" height="15" rx="3"/>`,
  'reaper': `<path d="M39 17h22l12 15-7 22-16 18-16-18-7-22 12-15Z"/><path d="M7 67h36l-8 10H7V67Zm86 0H57l8 10h28V67Z"/><rect x="16" y="74" width="7" height="15"/><rect x="77" y="74" width="7" height="15"/>`,
  'reinhardt': `<path d="M13 24h43v31c0 15-10 25-22 32-12-7-21-17-21-32V24Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M68 17h20v27H68z"/><rect x="75" y="42" width="7" height="43" rx="3"/><path d="M62 20h32v12H62z"/>`,
  'roadhog': `<path d="M16 19c14-14 34-7 37 7 3 15-11 21-22 15-10-5-8-18 2-24" fill="none" stroke="currentColor" stroke-width="7"/><path d="m16 18 11-8 7 10" fill="none" stroke="currentColor" stroke-width="7"/><circle cx="70" cy="53" r="22" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="61" cy="49" r="6"/><circle cx="79" cy="49" r="6"/><path d="M59 67h22l-4-12H63l-4 12ZM48 52h-8M92 52h-8" stroke="currentColor" stroke-width="6"/>`,
  'shion': `<path d="M8 26h31l9 7-9 8H23l-5 11H8l5-11H8V26Zm84 0H61l-9 7 9 8h16l5 11h10l-5-11h5V26Z"/><circle cx="31" cy="78" r="12" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="72" cy="78" r="12" fill="none" stroke="currentColor" stroke-width="6"/><path d="M31 78h41L60 61H45L31 78Z"/>`,
  'sierra': `<circle cx="36" cy="37" r="22" fill="none" stroke="currentColor" stroke-width="5"/><path d="M36 7v16M36 51v16M6 37h16M50 37h16" stroke="currentColor" stroke-width="5"/><path d="M39 61h51l7 7-7 7H62l-7 11H44l5-11H39V61Z"/>`,
  'sigma': `<path d="m50 15 17 10 5 19-12 18-23 4-16-13 3-21 10-14 16-3Z"/><path d="m34 28 13-5 14 9-4 17-17 8-11-11 5-18Z" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3"/><circle cx="14" cy="72" r="10"/><circle cx="86" cy="72" r="10"/>`,
  'sojourn': `<path d="M17 16h11l7 32-9 37H13l10-38-6-31Zm38 0h11l7 31 14 38H74L62 49l-7-33Z"/><path d="M33 55h55l8 7-8 8H59l-7 13H41l5-13H33V55Z"/>`,
  'soldier-76': `<path d="M23 20h54l-7 18H30l-7-18Z"/><path d="M12 56h70l12 8-12 8H45l-8 13H25l6-13H12V56Z"/>`,
  'sombra': `<path d="M36 20h28l11 14-8 26-17 18-17-18-8-26 11-14Z"/><path d="M79 23h7v7h-7zM87 32h6v6h-6zM75 39h5v5h-5zM84 49h9v9h-9zM72 57h7v7h-7z"/>`,
  'symmetra': `<path d="m50 14 30 52H20L50 14Z" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="50" cy="51" r="8"/><path d="M50 59v25M42 84h16" stroke="currentColor" stroke-width="6"/>`,
  'torbjorn': `<path d="M14 31h37v28H14z"/><rect x="24" y="20" width="17" height="12"/><path d="M32 59v23M17 82h30" stroke="currentColor" stroke-width="7"/><path d="M69 20h17v28H69z"/><rect x="74" y="45" width="7" height="40" rx="3"/><path d="M62 24h31v12H62z"/>`,
  'tracer': `<path d="M6 44h33l8 7-8 8H23l-5 11H8l5-11H6V44Zm88 0H61l-8 7 8 8h16l5 11h10l-5-11h7V44Z"/><path d="m49 9-12 29h12l-5 20 19-30H51l5-19h-7Z"/>`,
  'vendetta': `<path d="M50 7 66 30 58 65 50 92 42 65 34 30 50 7Z"/><path d="M20 58h60l-6 10H26l-6-10Z"/>`,
  'venture': `<path d="M49 9 72 32 55 82 46 91 37 82 20 32 49 9Z"/><path d="M31 30h37M35 42h29M39 54h21M43 66h13" stroke="#fff" stroke-opacity=".3" stroke-width="4"/><path d="M10 78 24 65l7 18-21-5Zm80 0L76 65l-7 18 21-5Z"/>`,
  'widowmaker': `<path d="M7 50h66l14 8-14 8H38l-7 13H18l6-13H7V50Z"/><circle cx="75" cy="26" r="8"/><circle cx="62" cy="37" r="5"/><circle cx="88" cy="37" r="5"/><path d="M75 34v20M68 35l-11-12M82 35l11-12M67 42l-14 1M83 42l14 1M67 50l-12 9M83 50l12 9" stroke="currentColor" stroke-width="4"/>`,
  'winston': `<path d="M27 31c7-18 39-18 46 0l-5 30c-3 17-12 25-18 25s-15-8-18-25l-5-30Z"/><rect x="29" y="43" width="18" height="11" rx="4" fill="none" stroke="#fff" stroke-width="4"/><rect x="53" y="43" width="18" height="11" rx="4" fill="none" stroke="#fff" stroke-width="4"/><path d="M47 49h6M42 68h16" stroke="#fff" stroke-width="4"/>`,
  'wrecking-ball': `<circle cx="50" cy="56" r="34" fill="none" stroke="currentColor" stroke-width="7"/><path d="M35 42 31 21l14 11 5-9 5 9 14-11-4 21-10-4H45l-10 4Z"/><circle cx="43" cy="49" r="3"/><circle cx="57" cy="49" r="3"/><path d="m44 58 6 4 6-4" fill="none" stroke="currentColor" stroke-width="3"/>`,
  'wuyang': `<path d="M30 14c15 17 16 29 0 43-16-14-15-26 0-43Z"/><path d="M12 72c17-10 34-10 51 0M10 84c19-9 39-9 58 0" fill="none" stroke="currentColor" stroke-width="5"/><path d="M75 12v74M66 20l9-10 9 10M67 84h16" fill="none" stroke="currentColor" stroke-width="6"/>`,
  'zarya': `<circle cx="31" cy="49" r="23" fill="none" stroke="currentColor" stroke-width="6"/><path d="M12 49h38M31 30v38M17 35l28 28M45 35 17 63" stroke="currentColor" stroke-width="2"/><path d="M56 53h19l8 7-8 8H58l-2-15Z"/><path d="m80 57 18-8v7l-15 5 15 5v7l-18-8"/>`,
  'zenyatta': `<path d="M38 36h24l8 10-5 20-15 13-15-13-5-20 8-10Z"/><circle cx="50" cy="13" r="6"/><circle cx="27" cy="20" r="6"/><circle cx="73" cy="20" r="6"/><circle cx="18" cy="43" r="6"/><circle cx="82" cy="43" r="6"/><circle cx="24" cy="69" r="6"/><circle cx="76" cy="69" r="6"/><circle cx="50" cy="88" r="6"/>`
};

const SILHOUETTE_FULL = new Set(['bastion', 'echo', 'jetpack-cat', 'lifeweaver', 'orisa', 'wrecking-ball', 'zenyatta']);

function silhouetteSvg(hero) {
  const detail = SILHOUETTE_FEATURES[hero.id] || '';
  const body = SILHOUETTE_FULL.has(hero.id) ? detail : SILHOUETTE_BASE + detail;
  return `<svg class="hero-silhouette" viewBox="0 0 100 100" aria-hidden="true">${body}</svg>`;
}

const ROLE_LABELS = { all: '全ロール', tank: 'タンク', damage: 'ダメージ', support: 'サポート' };
const ROLE_ORDER = ['tank', 'damage', 'support'];

const state = {
  players: 5,
  banned: new Set(JSON.parse(localStorage.getItem('owRouletteBans') || '[]')),
  results: Array(6).fill(null),
  roles: ['tank', 'damage', 'damage', 'support', 'support', 'all'],
  names: Array.from({ length: 6 }, (_, i) => `プレイヤー${i + 1}`),
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
      state.names[i] = e.target.value || `プレイヤー${i + 1}`;
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
    roleLabel.textContent = selectedRole === 'all' ? 'フリー' : ROLE_LABELS[selectedRole];
    heroName.textContent = '—';
    heroSub.textContent = '待機中';
    return;
  }

  stage.classList.add(`role-${shown.role}`);
  emblem.innerHTML = silhouetteSvg(shown);
  roleLabel.textContent = ROLE_LABELS[shown.role];
  heroName.textContent = shown.name;
  heroSub.textContent = hero ? '決定' : '抽選中…';
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
  card.querySelector('.hero-name').textContent = '候補なし';
  card.querySelector('.hero-sub').textContent = 'BAN / ロール確認';
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
    <small>${isBanned ? 'BAN中' : '使用可'}</small>
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
      <small>${heroes.length} ヒーロー</small>
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
