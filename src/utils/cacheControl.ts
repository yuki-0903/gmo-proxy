import { Request } from 'express';

export class CacheControl {
  static shouldUseCache(req: Request): boolean {
    // クエリパラメータでキャッシュ無効化
    if (req.query.cache === 'false' || req.query.realtime === 'true') {
      return false;
    }

    // HTTPヘッダーでキャッシュ無効化
    const cacheControl = req.headers['cache-control'];
    if (cacheControl?.includes('no-cache') || cacheControl?.includes('no-store')) {
      return false;
    }

    // カスタムヘッダーでキャッシュ無効化
    if (req.headers['x-force-refresh'] === 'true') {
      return false;
    }

    return true;
  }

  static getTTLSeconds(endpoint: string): number {
    switch (endpoint) {
      case 'status':
        return 30; // 30秒（システム状態）
      case 'ticker':
        return 5;  // 5秒（レート情報）
      case 'symbols':
        return 3600; // 1時間（取引ルール）
      default:
        return 60; // デフォルト1分
    }
  }

  static generateCacheKey(endpoint: string, params?: Record<string, any>): string {
    const baseKey = `gmo_${endpoint}`;
    if (!params) return baseKey;

    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, any>);

    const paramString = new URLSearchParams(sortedParams).toString();
    return paramString ? `${baseKey}_${paramString}` : baseKey;
  }
}

export const cacheControl = CacheControl;