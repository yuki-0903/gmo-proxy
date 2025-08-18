export interface BaseResponse<T> {
  status: number;
  data: T;
  responsetime: string;
}

export interface StatusData {
  status: 'MAINTENANCE' | 'CLOSE' | 'OPEN';
}

export interface TickerData {
  symbol: string;
  ask: string;
  bid: string;
  timestamp: string;
  status: 'CLOSE' | 'OPEN';
}

export interface KlineData {
  openTime: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

export interface SymbolData {
  symbol: string;
  minOpenOrderSize: string;
  maxOrderSize: string;
  sizeStep: string;
  tickSize: string;
}

export type StatusResponse = BaseResponse<StatusData>;
export type TickerResponse = BaseResponse<TickerData[]>;
export type KlineResponse = BaseResponse<KlineData[]>;
export type SymbolResponse = BaseResponse<SymbolData[]>;

export interface KlineParams {
  symbol: string;
  priceType: 'BID' | 'ASK';
  interval: '1min' | '5min' | '10min' | '15min' | '30min' | '1hour' | '4hour' | '8hour' | '12hour' | '1day' | '1week' | '1month';
  date: string;
}