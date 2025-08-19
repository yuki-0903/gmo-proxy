import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface PersistentCacheEntry<T> {
  data: T;
  timestamp: number;
  key: string;
}

export class PersistentCache {
  private cacheDir: string;

  constructor(cacheDir: string = './cache') {
    this.cacheDir = cacheDir;
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private generateFileName(key: string): string {
    const hash = crypto.createHash('md5').update(key).digest('hex');
    return `${hash}.json`;
  }

  private getFilePath(key: string): string {
    return path.join(this.cacheDir, this.generateFileName(key));
  }

  async set<T>(key: string, data: T): Promise<void> {
    const entry: PersistentCacheEntry<T> = {
      data,
      timestamp: Date.now(),
      key
    };

    const filePath = this.getFilePath(key);
    
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(entry, null, 2));
    } catch (error) {
      console.error('Failed to write cache file:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const filePath = this.getFilePath(key);

    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const content = await fs.promises.readFile(filePath, 'utf-8');
      const entry: PersistentCacheEntry<T> = JSON.parse(content);
      
      return entry.data;
    } catch (error) {
      console.error('Failed to read cache file:', error);
      return null;
    }
  }

  async has(key: string): Promise<boolean> {
    const filePath = this.getFilePath(key);
    return fs.existsSync(filePath);
  }

  async delete(key: string): Promise<void> {
    const filePath = this.getFilePath(key);
    
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error('Failed to delete cache file:', error);
    }
  }

  generateKlineKey(symbol: string, priceType: string, interval: string, date: string): string {
    return `kline_${symbol}_${priceType}_${interval}_${date}`;
  }

  generateSymbolsKey(): string {
    return 'symbols';
  }

  isHistoricalDate(date: string): boolean {
    // GMO FXの日付切り替えタイミング（日本時間朝6:00）を考慮
    const now = new Date();
    const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9 (JST)
    
    // GMOの取引日を計算（朝6時前は前日扱い）
    let gmoDate = new Date(jstNow);
    if (jstNow.getHours() < 6) {
      gmoDate.setDate(gmoDate.getDate() - 1);
    }
    
    const gmoToday = gmoDate.toISOString().slice(0, 10).replace(/-/g, '');
    
    // 当日は絶対にキャッシュしない（リアルタイムデータのため）
    if (date === gmoToday) return false;
    
    if (date.length === 4) {
      // 年指定の場合：現在年より前のみキャッシュ
      const year = parseInt(date);
      const currentYear = gmoDate.getFullYear();
      return year < currentYear;
    }
    
    if (date.length === 8) {
      // 日付指定の場合：GMO取引日の前日以前のみキャッシュ
      const inputDate = new Date(
        parseInt(date.substring(0, 4)),
        parseInt(date.substring(4, 6)) - 1,
        parseInt(date.substring(6, 8))
      );
      
      const gmoYesterday = new Date(gmoDate);
      gmoYesterday.setDate(gmoYesterday.getDate() - 1);
      gmoYesterday.setHours(23, 59, 59, 999);
      
      return inputDate <= gmoYesterday;
    }
    
    return false;
  }
}

export const persistentCache = new PersistentCache();