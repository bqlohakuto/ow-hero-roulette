(() => {
  'use strict';

  const TOPICS = {
    OW: [
      '今使っているヒーローを選んだ理由は？',
      'このヒーローを使っていて一番楽しい瞬間は？',
      'このマップで好きな場所や苦手な場所は？',
      '相手チームで今一番気になっているヒーローは？',
      '今の試合で上手くできたことを一つ挙げるなら？',
      'このヒーローを使い始めたきっかけは？',
      '今の試合、どんな流れになっていると思う？',
      '味方に今ひとつだけお願いできるなら何をお願いする？',
      'このヒーローで一番好きなアビリティは？',
      '今の試合で「もう一回やるなら変えたいこと」は？'
    ],
    GAME: [
      '今ゲームを1本だけ人に勧めるなら何を選ぶ？',
      'ゲームで一番テンションが上がる瞬間は？',
      'ゲームをするとき、ストーリー・操作感・対戦のどれを重視する？',
      '最近気になっているゲームは？',
      'どんなジャンルのゲームが一番好き？',
      'ゲームを選ぶとき、何を一番重視する？',
      '今までで一番印象に残っているボス戦は？',
      'もう一度最初から遊びたいゲームは？',
      'ゲームで「これは苦手だな」と思う要素は？',
      '自分でゲームを作るなら、どんなゲームにしたい？'
    ],
    STREAM: [
      '今日の配信、今のところどう？',
      '今いちばん楽しいことは？',
      '今日の配信でやりたいことは？',
      '今ちょっと気になっていることは？',
      '今日ここまでで印象に残ったことは？',
      '今の気分を一言でいうと？',
      '最近配信で楽しかったことは？',
      '次にやってみたい配信は？',
      '今見ている人に一言話すなら？',
      '今日の配信、最後までどう過ごしたい？'
    ],
    CHAT: [
      '今日何食べた？',
      '今いちばん食べたいものは？',
      '最近ちょっと嬉しかったことは？',
      '最近よく見ているものは？',
      '今ほしいものはある？',
      '最近ハマっていることは？',
      '今日の天気、どう感じた？',
      '休みの日は何して過ごすことが多い？',
      '最近「これ便利だな」と思ったものは？',
      '今どこか行くなら、どこに行きたい？'
    ]
  };

  const ALL = Object.entries(TOPICS).flatMap(([category, items]) =>
    items.map((text, index) => ({ id: category + '-' + (index + 1), category, text }))
  );

  let bag = [];
  let current = null;

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function refill() {
    bag = shuffle(ALL);
    if (current && bag.length > 1 && bag[0].id === current.id) {
      [bag[0], bag[1]] = [bag[1], bag[0]];
    }
  }

  function next() {
    if (!bag.length) refill();
    current = bag.shift();
    window.dispatchEvent(new CustomEvent('talkcoach:topic', { detail: current }));
    return current;
  }

  function getCurrent() {
    return current;
  }

  window.TalkCoachTopics = {
    all: ALL,
    categories: TOPICS,
    next,
    getCurrent,
    reset: refill
  };
})();