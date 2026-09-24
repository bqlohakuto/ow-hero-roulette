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
