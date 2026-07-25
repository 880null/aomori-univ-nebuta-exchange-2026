# aomori-univ-nebuta-exchange-2026 プロジェクト方針

## プロジェクト概要

- 対象：青森大学の国際交流プロジェクト。留学生TA・留学生・学生の共同開発。
  留学生・海外観光客向けの多言語ねぶたガイドWebアプリ。
- MVP：ねぶた小屋マップ（座標未確定のためC案＝全体1ピン＋小屋番号順リストで暫定運用）
  ＋23団体分の多言語解説（日本語／やさしい日本語／English／簡体中文／繁體中文／한국어）
  ＋タグ絞り込み（テーマ／メッセージ／シーン／時代の4軸）
- 技術構成：Next.js（静的書き出し）、GitHub Pages（basePath: `aomori-univ-nebuta-exchange-2026`）、
  Leaflet＋国土地理院タイル、PWA対応（オフライン利用）
- 除外機能：リアルタイムGPS運行、ログイン機能、管理画面（データ更新はスプレッドシート直編集）
- 締切：8/2 青森ねぶた祭り開幕（残り日数が非常に少ない前提で進める）
- 開発体制：隼真さん1人＋Claude（設計・指揮・レビュー）＋Codex/Sol（実装）

## 役割分担ルール

- Claude（自分）は要件定義・設計・Codexへの指示出し・進捗確認・方向性の調整・
  レビューを担当する。
- 実際のコード実装（ファイルの新規作成・編集）は必ず `/codex:rescue` でCodexに委任する。
- Codexへの委任時は、必ず `--model gpt-5.6-sol` を指定すること。
- 委任の粒度は「1コンポーネント／1機能」単位で細かく刻む。大きな機能をまとめて
  一度に投げない。
- 些細な1行修正であってもClaude自身がWrite/Editツールで直接コードを書くことは禁止。
  実装は基本的に全てCodexに委任すること。
- Codexへの委任時は、上記「プロジェクト概要」を要約して必ず文脈として渡す。
- Codexへの実装委任1回ごとに、UI/画面に関わる変更があった場合は `/impeccable audit` を
  実行し、デザイン品質を確認してから次のステップに進むこと。

### 実行環境の制約と作業分担

- Codexのサンドボックスは**npmレジストリに接続できない**（`ENOTFOUND registry.npmjs.org`）。
  そのためCodex自身は依存関係の導入ができない。
- 分担は次のとおり固定する:
  - **コードの新規作成・編集 → Codex**
  - **依存関係の導入（`npm install`）・ビルド検証（`npm run build`）→ Claude**
- Codexへ委任する際は「`npm install` は実行しないこと」を明示し、
  依存追加が必要な場合は package.json の編集のみを依頼してClaude側でインストールする。
- impeccableのフックは `Edit|Write|MultiEdit` を監視するが、実装はCodexが行うため発火しない。
  デザイン品質チェックはClaudeが明示的に `/impeccable audit` を実行して担保する。

## デザイン方針

- デザインの拠り所は `apple-design` スキル（`~/.claude/skills/apple-design/SKILL.md`）と
  `impeccable` スキルの2つ。
- 締切が近いため、apple-designは全17章のうち以下の3章を優先的に適用する:
  - **第1章 Response**（遅延の排除・pointer-downでの即時フィードバック）
    … 祭り会場は電波が混雑するため体感速度が特に重要
  - **第14章 Reduced motion & accessibility**（`prefers-reduced-motion` 対応）
    … アクセシビリティ要件として最初から組み込む
  - **第15章 Typography**（optical sizing / tracking / leading）
    … 6言語対応でCJKとラテン文字が混在するため行間・字間設計が読みやすさを左右する
- 第5章（velocity handoff）・第6章（momentum projection）は今回のスコープでは
  オーバースペックのため見送る。
- スマートフォンでの片手操作を前提に設計すること。

## 進捗確認・レビュー

- Codexへの委任1回ごとに、完了後は必ず日本語で要約報告する。
- Codexレビューゲートを有効化する。各タスク完了時、自動レビューを必ず通す。
- Codexからの出力は日本語に要約・翻訳してから報告すること。

## Git運用

- Codexの1タスクが完了しレビューを通過するたびに1コミットする。
- コミットメッセージは何を実装したか分かる簡潔な内容にする。
