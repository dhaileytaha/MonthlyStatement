import dayjs from 'dayjs';
import { coinGeckoGet } from './base';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
}

export const getAllCoins = () => coinGeckoGet<Coin[]>('/coins/list');

// Note the response returns more data, we only typed the data that we actually need
export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: {
    small: string;
    thumb: string;
  };
  market_data: {
    current_price: {
      usd: number;
      eur: number;
      // more available
    };
    market_cap: {
      usd: number;
      eur: number;
      // more available
    };
    total_volume: {
      usd: number;
      eur: number;
      // more available
    };
  };
}

export const getCoinHistoric = (id: string, date: Date) => {
  const dateString = dayjs(date).format('DD-MM-YYYY');

  return coinGeckoGet<CoinDetail>(`/coins/${id}/history`, {
    date: dateString,
    localization: false,
  });
};

type CoinPriceTuple = [number, number];
export interface MarketChart {
  prices: CoinPriceTuple[];
  market_caps: CoinPriceTuple[];
  total_volumes: CoinPriceTuple[];
}

export const getCoinMarketChart = (id: string, from: Date, to: Date) => {
  const fromString = dayjs(from).unix();
  const toString = dayjs(to).unix();

  return coinGeckoGet<MarketChart>(`/coins/${id}/market_chart/range`, {
    from: fromString,
    to: toString,
    vs_currency: 'usd',
  });
};
