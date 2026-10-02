# OW HERO ROULETTE

Overwatchのヒーローピックをランダムに決める、ブラウザだけで動くファンメイドのルーレットです。

## 機能

- 1〜6人に対応
- プレイヤーごとに `ALL / TANK / DAMAGE / SUPPORT` を指定
- 5v5 / 6v6 / FREE のロールプリセット
- ヒーローBAN（検索・ロール絞り込み・一括BAN・全解除）
- BANしたヒーローを抽選対象から除外
- 同じ抽選内ではヒーロー重複なし
- 全員一括抽選 / 1枠だけ再抽選
- BAN設定はブラウザの `localStorage` に保存
- スマホ対応
- Talk Coach Phase 1: Silero VADで人声を検出し、15秒 / 30秒 / 60秒で警告
- Talk Coach Phase 2: 40枚の話題カード、Twitch Chat投稿、`!topic`、OBS警告カウンター
- ビルド不要（VAD / ONNX RuntimeはCDNから読み込み）

## ヒーローデータ

2026-09-18時点のOverwatch公式ヒーロー一覧をもとに、53ヒーローを収録しています。

公式: https://overwatch.blizzard.com/ja-jp/heroes/

キャラクター画像の転載は行わず、各ヒーローを連想するオリジナルの記号・絵文字モチーフをアイコンとして使用しています。

## GitHub Pages

1. このリポジトリをGitHubへPush
2. `Settings` → `Pages`
3. `Deploy from a branch`
4. `main` / `/ (root)` を選択して保存

ビルド作業なしで公開できます。

## ファイル

- `index.html` UI
- `styles.css` デザイン / レスポンシブ
- `app.js` ヒーローデータ / BAN / 抽選ロジック

## Talk Coach Phase 2

### Twitch連携

Talk CoachのTwitch Bot欄で以下を設定します。

1. Twitch Developer Consoleでアプリを作成
2. Quick Deckに表示される `OAuth Redirect URL` をアプリのOAuth Redirect URLへ登録
3. アプリの `Client ID` と配信チャンネル名をQuick Deckへ入力
4. `Twitch認証` を押し、Talk Coachとして投稿するTwitchアカウントで認証
5. Quick Deckへ戻ったら `接続` を押す
6. `テスト投稿` でチャット投稿を確認

必要なOAuth scopeは `user:read:chat` と `user:write:chat` です。
アクセストークンは `sessionStorage` にのみ保持し、永続保存しません。

30秒無言で話題カードを投稿し、60秒無言で警告回数と別の話題カードを投稿します。
視聴者が `!topic` と入力した場合も新しい話題カードを1枚投稿します（10秒クールダウン）。

### OBS表示

OBS Browser Sourceに `talk-coach-overlay.html` を指定すると、Talk Coachの警告回数と状態を小さく表示できます。

Quick DeckをOBSのCustom Browser Dockとして開く構成を想定しています。
同一オリジンの `BroadcastChannel` と `localStorage` を使って状態を同期します。

## Talk Coachファイル

- `talk-coach.js` VAD / 無言タイマー / 警告
- `talk-coach-topics.js` 40枚の話題カード / シャッフル管理
- `talk-coach-phase2.js` 30秒・60秒連動 / 手動話題
- `talk-coach-twitch.js` Twitch OAuth / Chat API / EventSub / `!topic`
- `talk-coach-bridge.js` OBS向け状態同期
- `talk-coach-overlay.html` OBS Browser Source
- `talk-coach-overlay.css` OBS表示デザイン
- `talk-coach-overlay.js` OBS状態反映


## Squat Penalty

Talk Coachの60秒警告1回につき、SQUAT BARへスクワット10回のペナルティを追加します。
未消化分は加算され、SQUAT BARの太もも自動計測で1回ずつ消化するとQuick DeckとOBSへリアルタイム反映されます。

### Firebase初期設定

1. Firebaseプロジェクトを作成
2. Realtime Databaseを作成
3. Firebase Authenticationで匿名認証（Anonymous）を有効化
4. Realtime DatabaseのRulesへ `firebase-database.rules.json` の内容を設定
5. Firebase Web Appを登録し、表示されたFirebase configをQuick Deckの「Firebase連携設定」へ貼り付け
6. 設定保存後、「スマホ用設定をコピー」で連携設定をコピー
7. iPhoneのSQUAT BAR → 設定 → Talk Coach連携へ貼り付けて保存

Firebase configには `databaseURL` が必要です。


## Game Dev Workspace

Quick Deckに、ゲーム制作と配信を同じデータで管理する `GAME DEV` を追加しています。

- `game-dev.html` 制作画面
- 制作チャットの本文はOBSへ送らず、伏せ字の形だけを公開
- 各メッセージ / タスク / 評価に配信除外フラグ
- タスク完了率から制作進捗を表示
- 設定リスト / シナリオ保管
- `BroadcastChannel` + `localStorage` でOBS表示と同期
- 公開用状態は `quickDeckGameDevPublicV1` に分離

### OBS表示

Quick DeckをOBSのCustom Browser Dockで開き、`game-dev.html` を制作画面として使用します。
Browser Sourceには同一オリジンの `game-dev-overlay.html` を指定します。

OBS表示には以下だけが出ます。

- 伏せ字化された制作チャット
- 公開可能な評価コメント
- 公開可能なタスク
- 章名と進捗率

`🔒 配信非表示` にした項目は公開用データから除外されます。


### 標準運用（API不要）

GAME DEVはAPIなしを標準にしています。GitHub Pagesを開くだけで以下を利用できます。

- 制作ログ
- ChatGPTで作った返答の貼り付け
- 確定事項マーク
- ローカルの進捗レビュー
- タスク / 設定 / シナリオ管理
- OBSへの伏せ字制作ログ・評価・タスク表示

普段の制作はChatGPTで行い、必要な返答を「ChatGPTから貼り付け」へコピーすると、GAME DEV側の制作チャットにAI発言として残せます。
APIキー、Node.js、追加課金は不要です。

### API制作チャット（任意）

API連携は任意の拡張機能です。利用する場合だけ、配信PC上のローカルサーバーからOpenAI Responses APIへ接続します。

1. Node.js 20以降をインストール
2. `.env.example` を `.env` にコピー
3. `.env` の `OPENAI_API_KEY` を設定
4. `start-game-dev.bat` を実行
5. 制作画面は `http://127.0.0.1:4173/game-dev.html`
6. OBS Browser Sourceは `http://127.0.0.1:4173/game-dev-overlay.html`

API機能は画面内の「API連携（任意）」から明示的に接続確認したときだけ使用します。
自動レビューも初期状態ではOFFです。

OpenAI APIの利用料金はChatGPTの契約とは別管理です。
