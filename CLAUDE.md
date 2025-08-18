# GMO Proxy Project

## プロジェクト概要
このプロジェクトは GMO 為替データ API のプロキシサーバーの実装です。
GMO の為替レート情報を中継し、クライアントアプリケーションに提供します。

## 開発環境
- 言語: Node.js
- ビルドツール: Vite
- 型システム: TypeScript

## セットアップ
```bash
npm install
cp .env.example .env
```

## 実行方法
### 開発環境
```bash
npm run dev
```

### 本番環境（Vercel）
```bash
npm run build
```

## デプロイメント
- プラットフォーム: Vercel
- 自動デプロイ: GitHub連携

## テスト
[テスト実行方法を記載]

## 参考ドキュメント
### GMO 公式ドキュメント
Public API
外国為替FXステータス
Request example:

```
const axios = require('axios');

const endPoint = 'https://forex-api.coin.z.com/public';
const path     = '/v1/status';

axios.get(endPoint + path)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
```

Response example:
```
{
  "status": 0,
  "data": {
    "status": "OPEN"
  },
  "responsetime": "2019-03-19T02:15:06.001Z"
}
```
外国為替FXの稼動状態を取得します。

Request
GET /public/v1/status

Parameters
無し

Response
Property Name	Value	Description
status	string	外国為替FXステータス: MAINTENANCE CLOSE OPEN
最新レート
Request example:
```
const axios = require('axios');

const endPoint = 'https://forex-api.coin.z.com/public';
const path     = '/v1/ticker';

axios.get(endPoint + path)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
```

Response example:
```
{
  "status": 0,
  "data": [
    {
      "ask": "137.644",
      "bid": "137.632",
      "symbol": "USD_JPY",
      "timestamp": "2018-03-30T12:34:56.789671Z",
      "status": "OPEN"
    },
    {
      "symbol": "EUR_JPY",
      "ask": "149.221",
      "bid": "149.181",
      "timestamp": "2023-05-19T02:51:24.516493Z",
      "status": "OPEN"
    }
  ],
  "responsetime": "2019-03-19T02:15:06.014Z"
}
```
全銘柄分の最新レートを取得します。

Request
GET /public/v1/ticker

Parameters
無し

Response
Property Name	Value	Description
symbol	string	取扱銘柄はこちら
ask	string	現在の買値
bid	string	現在の売値
timestamp	string	現在レートのタイムスタンプ
status	string	外国為替FXステータス: CLOSE OPEN
KLine情報の取得

Request example:
```
const axios = require('axios');

const endPoint = 'https://forex-api.coin.z.com/public';
const path     = '/v1/klines?symbol=USD_JPY&priceType=ASK&interval=1min&date=20231028';

axios.get(endPoint + path)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
Response example:

{
  "status": 0,
  "data": [
    {
        "openTime":"1618588800000",
        "open":"141.365",
        "high":"141.368",
        "low":"141.360",
        "close":"141.362"
    },
    {
        "openTime":"1618588860000",
        "open":"141.362",
        "high":"141.369",
        "low":"141.361",
        "close":"141.365"
    }
  ],
  "responsetime": "2023-07-08T22:28:07.980Z"
}
```

指定した銘柄の四本値を取得します。

Request
GET /public/v1/klines

Parameters
Parameter type: query
Parameter	Type	Required	Available Values
symbol	string	
Required
取扱銘柄はこちら
priceType	string	
Required
BID ASKを指定
interval	string	
Required
1min 5min 10min 15min 30min 1hour 4hour 8hour 12hour 1day 1week 1month
date	string	
Required
指定可能な日付フォーマット: YYYYMMDD YYYY
YYYYMMDD で指定できるintervalの種類 : 1min 5min 10min 15min 30min 1hour
※20231028以降を指定可能
   日本時間朝6：00に新しい日付に切替
YYYY で指定できるintervalの種類 : 4hour 8hour 12hour 1day 1week 1month
※当社取扱開始年以降を指定可能
    取扱開始日はこちら
Response
Property Name	Value	Description
openTime	string	開始時刻のunixタイムスタンプ(ミリ秒)
open	string	始値
high	string	高値
low	string	安値
close	string	終値
取引ルール

Request example:
```
const axios = require('axios');

const endPoint = 'https://forex-api.coin.z.com/public';
const path     = '/v1/symbols';

axios.get(endPoint + path)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
Response example:

{
  "status": 0,
  "data": [
    {
      "symbol": "USD_JPY",
      "minOpenOrderSize": "10000",
      "maxOrderSize": "500000",
      "sizeStep": "1",
      "tickSize": "0.001"
    }
  ],
  "responsetime": "2022-12-15T19:22:23.792Z"
}
```

取引ルールを取得します。

Request
GET /public/v1/symbols

Parameters
無し

Response
Property Name	Value	Description
symbol	string	取扱銘柄はこちら
minOpenOrderSize	string	新規最小注文数量/回
maxOrderSize	string	最大注文数量/回
sizeStep	string	最小注文単位/回
tickSize	string	注文価格の呼値

## その他
[その他の情報を記載]