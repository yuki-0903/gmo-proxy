# GMO Proxy Server

GMO為替データAPIのプロキシサーバーです。GMOのFX APIを中継し、クライアントアプリケーションに為替レート情報を提供します。

## 🚀 デプロイ済みURL

https://gmo-proxy.vercel.app

## 📋 利用可能なエンドポイント

### 基本情報
- **GET /** - サーバー情報とエンドポイント一覧
- **GET /health** - ヘルスチェック

### GMO API プロキシ
- **GET /api/v1/status** - GMO FX稼働状態
- **GET /api/v1/ticker** - 全銘柄の最新レート
- **GET /api/v1/symbols** - 取引ルールと銘柄情報
- **GET /api/v1/klines** - K線データ（四本値）

#### K線データのクエリパラメータ
```
GET /api/v1/klines?symbol=USD_JPY&priceType=ASK&interval=1min&date=20231028
```

| パラメータ | 型 | 必須 | 説明 | 利用可能な値 |
|-----------|---|------|------|--------------|
| symbol | string | ✓ | 通貨ペア | USD_JPY, EUR_JPY など |
| priceType | string | ✓ | 価格タイプ | BID, ASK |
| interval | string | ✓ | 時間間隔 | 1min, 5min, 10min, 15min, 30min, 1hour, 4hour, 8hour, 12hour, 1day, 1week, 1month |
| date | string | ✓ | 日付 | YYYYMMDD or YYYY |

## 🛠️ 開発環境

### 技術スタック
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Build Tool**: Vite
- **Deployment**: Vercel

### 依存関係
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

## 🔧 ローカル開発

### 1. リポジトリのクローン
```bash
git clone https://github.com/yuki-0903/gmo-proxy.git
cd gmo-proxy
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
cp .env.example .env
```

`.env`ファイル：
```env
PORT=3000
GMO_API_ENDPOINT=https://forex-api.coin.z.com/public
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

ローカルサーバー: http://localhost:3000

### 5. ビルド
```bash
npm run build
```

### 6. 型チェック
```bash
npm run typecheck
```

## 📁 プロジェクト構造

```
gmo-proxy/
├── src/
│   ├── routes/          # APIルート定義
│   │   └── gmo.ts       # GMO APIプロキシエンドポイント
│   ├── services/        # 外部API連携
│   │   └── gmoClient.ts # GMO APIクライアント
│   ├── types/           # TypeScript型定義
│   │   ├── gmo.ts       # GMO APIレスポンス型
│   │   └── index.ts     # 型エクスポート
│   ├── utils/           # ユーティリティ
│   │   ├── errorHandler.ts # エラーハンドリング
│   │   └── logger.ts    # ログ機能
│   ├── app.ts           # Expressアプリケーション設定
│   └── index.ts         # エントリーポイント
├── vercel.json          # Vercelデプロイ設定
├── tsconfig.json        # TypeScript設定
├── package.json         # プロジェクト設定
└── README.md            # このファイル
```

## 🌐 Vercel デプロイ

### 自動デプロイ
- GitHubの`main`ブランチへのプッシュで自動デプロイ
- プレビューデプロイ: プルリクエスト作成時

### 手動デプロイ
```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel --prod
```

### 環境変数（Vercel）
Vercelダッシュボードで以下の環境変数を設定：
- `GMO_API_ENDPOINT`: https://forex-api.coin.z.com/public

## 📖 API レスポンス例

### ステータス確認
```bash
curl https://gmo-proxy.vercel.app/api/v1/status
```

```json
{
  "status": 0,
  "data": {
    "status": "OPEN"
  },
  "responsetime": "2019-03-19T02:15:06.001Z"
}
```

### 最新レート
```bash
curl https://gmo-proxy.vercel.app/api/v1/ticker
```

```json
{
  "status": 0,
  "data": [
    {
      "ask": "137.644",
      "bid": "137.632",
      "symbol": "USD_JPY",
      "timestamp": "2018-03-30T12:34:56.789671Z",
      "status": "OPEN"
    }
  ],
  "responsetime": "2019-03-19T02:15:06.014Z"
}
```

## 🔒 エラーハンドリング

- **400 Bad Request**: 必須パラメータ不足
- **500 Internal Server Error**: サーバーエラー
- **503 Service Unavailable**: GMO API接続エラー

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

---

📊 **GMO為替データAPI公式ドキュメント**: https://forex-api.coin.z.com/