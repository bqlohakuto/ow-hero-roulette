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
- 外部ライブラリ・ビルド不要

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
