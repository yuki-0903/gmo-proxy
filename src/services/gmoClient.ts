import axios, { AxiosInstance } from 'axios';
import { StatusResponse, TickerResponse, KlineResponse, SymbolResponse, KlineParams } from '../types';
import { createError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

export class GMOClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.GMO_API_ENDPOINT || 'https://forex-api.coin.z.com/public';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GMO-Proxy-Server/1.0.0'
      }
    });

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('GMO API Success', {
          url: response.config.url,
          status: response.status,
          method: response.config.method
        });
        return response;
      },
      (error) => {
        logger.error('GMO API Error', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
        
        if (error.response) {
          throw createError(
            `GMO API Error: ${error.response.status} - ${error.response.statusText}`,
            error.response.status
          );
        } else if (error.request) {
          throw createError('GMO API is not responding', 503);
        } else {
          throw createError('Failed to connect to GMO API', 500);
        }
      }
    );
  }

  async getStatus(): Promise<StatusResponse> {
    const response = await this.client.get<StatusResponse>('/v1/status');
    return response.data;
  }

  async getTicker(): Promise<TickerResponse> {
    const response = await this.client.get<TickerResponse>('/v1/ticker');
    return response.data;
  }

  async getKlines(params: KlineParams): Promise<KlineResponse> {
    const queryString = new URLSearchParams({
      symbol: params.symbol,
      priceType: params.priceType,
      interval: params.interval,
      date: params.date
    }).toString();

    const response = await this.client.get<KlineResponse>(`/v1/klines?${queryString}`);
    return response.data;
  }

  async getSymbols(): Promise<SymbolResponse> {
    const response = await this.client.get<SymbolResponse>('/v1/symbols');
    return response.data;
  }
}

export const gmoClient = new GMOClient();