# エンデューロレース情報ポータル

エンデューロレースの情報を確認できるポータルサイトです。レース一覧の表示、シリーズ別絞り込み、エントリー状況の確認ができます。

**注意**: エントリーシステム本体（frontend/、backend/）はプライベートリポジトリで開発しており、このリポジトリではポータル画面のみをOSSとして公開しています。エントリーシステムの利用をご希望の場合は、[Issue](https://github.com/your-repo/issues)にてお問い合わせください。

## 🌐 デモサイト

GitHub Pagesで公開中: **[https://your-username.github.io/enduro-portal/](https://your-username.github.io/enduro-portal/)**

## プロジェクト構成

```
race-entry-system/
├── portal/                    # レース情報ポータルサイト（React）
│   ├── public/
│   │   ├── data/              # レースデータファイル
│   │   │   ├── races.json     # 全日本・地方戦レース情報
│   │   │   └── races-jncc.json # JNCC・WEXレース情報
│   │   ├── config.json        # アプリケーション設定
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/        # ヘッダー・フッターコンポーネント
│   │   ├── data/
│   │   │   └── races.js       # レースデータ処理ロジック
│   │   ├── pages/
│   │   │   ├── HomePage.js           # ホームページ
│   │   │   ├── RaceSelectionPage.js  # レース一覧ページ
│   │   │   └── PrivacyPolicyPage.js  # プライバシーポリシー
│   │   ├── utils/
│   │   │   ├── seriesColors.js  # シリーズ別カラー設定
│   │   │   └── siteConfig.js    # サイト設定
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   └── theme.js           # MUIテーマ設定
│   ├── package.json
│   └── README.md
├── docs/                      # GitHub Pages用ビルド資源
├── .gitattributes
├── LICENSE
└── README.md
```

## 🚀 機能

### ポータルサイト（portal/）
レース情報を確認できる静的なポータルサイトです。

- **レース一覧表示**: 全日本・地方戦・JNCC・WEXの全レース情報
- **シリーズ別絞り込み**: 全日本、東日本、中日本、西日本、北海道、JNCC、WEX-East、WEX-West
- **エントリー状況確認**: エントリー受付中、締切、開始前などの状態表示
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応
- **相対パス対応**: サブディレクトリ配置可能（例: `/enduro-entry/`）

### 技術仕様
- **フレームワーク**: React 18.2
- **UIライブラリ**: Material-UI (MUI) v7.3
- **ルーティング**: React Router v7.8
- **ビルドツール**: Create React App
- **デプロイ**: GitHub Pages対応

### エントリーシステム（プライベートリポジトリ）
選手のエントリー機能と管理者の管理機能を提供します。利用をご希望の場合は[Issue](https://github.com/your-repo/issues)にてお問い合わせください。

## エントリーシステムとの連携

ポータルサイトは以下のJSONファイルを通じてエントリーシステムと連携します：

### データファイル

- **races.json**: レース情報（開催日、会場、エントリー期間、クラス情報など）
- **sites.json**: 本番環境のサイト設定（エントリーサイトのベースURL）
- **dev-sites.json**: 開発環境のサイト設定
- **config.json**: 各種設定を記載。上記の開発、本番のsites.json切り替えを設定

### 連携仕様

1. ポータルサイトは`races.json`からレース情報を読み込み表示
2. エントリーボタンクリック時は`sites.json`（または`dev-sites.json`）の設定に基づいてエントリーサイトにリダイレクト
3. 外部エントリーサイト（`entryUrl`が設定されているレース）は別タブで開く
4. 内部エントリーサイトは同一タブで遷移


## 技術スタック

### ポータルサイト
- React 18.2
- Material-UI (MUI) v7.3
- React Router v7.8

### エントリーシステム（プライベートリポジトリ）
- **フロントエンド**: React 18.2 + Redux Toolkit 2.8 + Material-UI v7.3
- **バックエンド**: Node.js + Express + DynamoDB
- **インフラ**: AWS Lambda + API Gateway + S3 + CloudFront

## クイックスタート

### 前提条件
- Node.js 18.x以上
- Git
- Git

### ポータルサイトを起動する方法

```bash
# リポジトリのクローン
git clone <repository-url>
cd race-entry-system/portal

# 依存関係のインストール
npm install

# 開発サーバー起動
npm start
```

ブラウザで http://localhost:3000 にアクセスしてください。

### ローカルでの本番環境テスト

開発用ビルドを作成してPythonサーバでテストする場合：

```bash
# 開発用ビルド（ルートパス / 前提）
cd portal
npm run build:dev

# Pythonサーバで起動
cd ../dev
python3 -m http.server 8000
```

ブラウザで http://localhost:8000 にアクセスしてください。

### GitHub Pagesでの公開

このプロジェクトはGitHub Pagesで公開できます。

#### 🚀 公開手順

1. **GitHub Pages用ビルド**:
   ```bash
   cd portal
   npm run build:docs
   ```

2. **GitHubリポジトリ設定**:
   - リポジトリの Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: "main" (または "master")
   - Folder: "/docs"

3. **コミット・プッシュ**:
   ```bash
   git add docs/
   git commit -m "docs: GitHub Pages用ビルドファイルを追加"
   git push
   ```

4. **アクセス**: `https://your-username.github.io/enduro-portal/`

#### 🔄 更新手順

レース情報やコードを更新した場合：

```bash
# 1. GitHub Pages用ビルド
cd portal
npm run build:docs

# 2. コミット・プッシュ
cd ..
git add docs/
git commit -m "docs: サイト更新"
git push
```

#### ⚙️ ビルドコマンドの使い分け

| コマンド | 出力先 | 用途 | パス設定 |
|---------|--------|------|----------|
| `npm run build:dev` | `../dev/` | ローカルテスト用 | `/` (ルート) |
| `npm run build:docs` | `../docs/` | GitHub Pages用 | `/enduro-portal` |

#### 📁 フォルダ構成

```
race-entry-system/
├── dev/          # 開発用ビルド（gitignore対象）
├── docs/         # GitHub Pages用ビルド
└── portal/       # ソースコード
```

## 開発ガイド

### データファイルの更新

レース情報を更新する場合は、以下のファイルを編集してください：

- `portal/public/data/races.json`: 全日本・地方戦レース情報
- `portal/public/data/races-jncc.json`: JNCC・WEXレース情報
- `portal/public/config.json`: アプリケーション設定

#### config.jsonの設定例

```json
{
  "environment": "dev",
  "siteName": "エンデューロ ポータル",
  "description": "環境設定: dev=開発環境(entryBaseUrlを使用), prod=本番環境(entryUrlを優先)",
  "entryBaseUrl": "http://entry.localhost:3006",
  "other-races": {
    "jncc-site": "http://entry.localhost:3005/races.json",
    "other-site": "http://entry.localhost:3007/races.json"
  }
}
```

**設定項目**:
- `environment`: 環境設定（`dev` または `prod`）
- `siteName`: サイト名
- `entryBaseUrl`: 開発環境でのエントリーサイトベースURL
- `other-races`: 外部レースデータのURL（オプション）
  - 外部のレースデータJSONを取得する場合に設定
  - 開発環境やテスト環境でのみ使用することを推奨

### ポート構成

| サービス | ポート | 用途 |
|---------|--------|------|
| ポータルサイト | 3000 | React開発サーバー |


### 目的

このソフトウェアは、日本のエンデューロ振興に寄与するため、mojaneko（GitHubアカウント名）が開発したものです。
非営利レース運営・イベント運営団体による利用を歓迎します。

営利団体の利用に関しては事前承認が必要です。契約に関するご質問はIssueに記載してください。

## サポート

このプロジェクトに関する質問や提案がある場合は、GitHubのissueを作成してください。
