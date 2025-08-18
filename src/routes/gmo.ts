import { Router, Request, Response, NextFunction } from 'express';
import { gmoClient } from '../services/gmoClient';
import { KlineParams } from '../types';
import { createError } from '../utils/errorHandler';

export const gmoRoutes = Router();

gmoRoutes.get('/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await gmoClient.getStatus();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

gmoRoutes.get('/ticker', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await gmoClient.getTicker();
    res.json(data);
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

    const data = await gmoClient.getKlines(params);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

gmoRoutes.get('/symbols', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await gmoClient.getSymbols();
    res.json(data);
  } catch (error) {
    next(error);
  }
});