import { Router, Request, Response, NextFunction } from 'express';
import { gmoClient } from '../services/gmoClient';
import { KlineParams } from '../types';
import { createError } from '../utils/errorHandler';
import { memoryCache } from '../utils/cache';
import { persistentCache } from '../utils/persistentCache';
import { cacheControl } from '../utils/cacheControl';

export const gmoRoutes = Router();

gmoRoutes.get('/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCache = cacheControl.shouldUseCache(req);
    const cacheKey = cacheControl.generateCacheKey('status');

    if (useCache) {
      const cached = memoryCache.get(cacheKey);
      if (cached) {
        return res.json({
          ...cached,
          _cache: {
            hit: true,
            type: 'memory',
            ttl: cacheControl.getTTLSeconds('status')
          }
        });
      }
    }

    const data = await gmoClient.getStatus();
    
    if (useCache) {
      const ttl = cacheControl.getTTLSeconds('status');
      memoryCache.set(cacheKey, data, ttl);
    }
    
    res.json({
      ...data,
      _cache: {
        hit: false,
        type: useCache ? 'memory' : 'disabled'
      }
    });
  } catch (error) {
    next(error);
  }
});

gmoRoutes.get('/ticker', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCache = cacheControl.shouldUseCache(req);
    const cacheKey = cacheControl.generateCacheKey('ticker');

    if (useCache) {
      const cached = memoryCache.get(cacheKey);
      if (cached) {
        return res.json({
          ...cached,
          _cache: {
            hit: true,
            type: 'memory',
            ttl: cacheControl.getTTLSeconds('ticker')
          }
        });
      }
    }

    const data = await gmoClient.getTicker();
    
    if (useCache) {
      const ttl = cacheControl.getTTLSeconds('ticker');
      memoryCache.set(cacheKey, data, ttl);
    }
    
    res.json({
      ...data,
      _cache: {
        hit: false,
        type: useCache ? 'memory' : 'disabled'
      }
    });
  } catch (error) {
    next(error);
  }
});

gmoRoutes.get('/klines', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, priceType, interval, date } = req.query;

    if (!symbol || !priceType || !interval || !date) {
      throw createError('Missing required parameters: symbol, priceType, interval, date', 400);
    }

    const params: KlineParams = {
      symbol: symbol as string,
      priceType: priceType as 'BID' | 'ASK',
      interval: interval as any,
      date: date as string
    };

    const useCache = cacheControl.shouldUseCache(req);
    const isHistorical = persistentCache.isHistoricalDate(params.date);
    
    if (useCache && isHistorical) {
      // 過去データは永続キャッシュから確認
      const cacheKey = persistentCache.generateKlineKey(
        params.symbol, params.priceType, params.interval, params.date
      );
      const cached = await persistentCache.get(cacheKey);
      if (cached) {
        return res.json({
          ...cached,
          _cache: {
            hit: true,
            type: 'persistent',
            historical: true,
            date: params.date
          }
        });
      }
    }

    const data = await gmoClient.getKlines(params);
    
    if (useCache && isHistorical) {
      // 過去データのみ永続保存（当日データは保存しない）
      const cacheKey = persistentCache.generateKlineKey(
        params.symbol, params.priceType, params.interval, params.date
      );
      await persistentCache.set(cacheKey, data);
    }
    
    res.json({
      ...data,
      _cache: {
        hit: false,
        type: useCache && isHistorical ? 'persistent' : 'disabled',
        historical: isHistorical,
        date: params.date,
        reason: !isHistorical ? 'current_date' : undefined
      }
    });
  } catch (error) {
    next(error);
  }
});

gmoRoutes.get('/symbols', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCache = cacheControl.shouldUseCache(req);
    const symbolsKey = persistentCache.generateSymbolsKey();

    if (useCache) {
      // 永続キャッシュから確認
      const cached = await persistentCache.get(symbolsKey);
      if (cached) {
        return res.json({
          ...cached,
          _cache: {
            hit: true,
            type: 'persistent',
            ttl: cacheControl.getTTLSeconds('symbols')
          }
        });
      }
    }

    const data = await gmoClient.getSymbols();
    
    if (useCache) {
      // 取引ルールは変更頻度が低いので永続保存
      await persistentCache.set(symbolsKey, data);
    }
    
    res.json({
      ...data,
      _cache: {
        hit: false,
        type: useCache ? 'persistent' : 'disabled'
      }
    });
  } catch (error) {
    next(error);
  }
});