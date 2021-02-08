import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { useCoinContext } from '../../context/CoinContext';
import { Assets, TokenValue } from './getAssetsFromTransactions';
import { useMultipleCoinDetails } from '../tokens/useCoinDetails';
import { notEmpty, sum } from '../../utils/array';
import { calculateTokenValue } from '../tokens/calculateTokenValue';
import { findCoinGeckoTokenId } from '../tokens/findCoinGeckoTokenId';

export interface TokensAndPrice {
  value: TokenValue;
  priceInUsd: number | undefined;
  tokenPrice: number | undefined;
}
export type TokensAndPrices = TokensAndPrice[] | null;

export const useAssetResults = (assets: Assets | null, date: Date) => {
  const { coins } = useCoinContext();

  const coinGeckoTokenIds = useMemo(() => {
    if (!assets) {
      return [];
    }

    return Object.values(assets).map((assets) => {
      const tokenId = findCoinGeckoTokenId(coins!, assets.name, assets.symbol);
      return tokenId;
    });
  }, [assets, coins]);

  const { coinPrices, isFetching, hasFetched, error } = useMultipleCoinDetails(
    coinGeckoTokenIds,
    date
  );

  const totalValueOfAllTokens = useMemo(() => {
    if (!assets) {
      return 0;
    }

    return Object.values(assets)
      .map((value, index) => {
        const tokenPrice = coinPrices[index];

        const priceInUsd = calculateTokenValue(value.value, value.decimals, tokenPrice);
        return priceInUsd;
      })
      .filter(notEmpty)
      .reduce(sum, 0);
  }, [assets, coinPrices]);

  const tokensAndPrices: TokensAndPrices = useMemo(() => {
    if (isFetching || !assets) {
      return null;
    }

    const coins = Object.values(assets).map((value, index) => {
      const tokenPrice = coinPrices[index];
      var priceInUsd = calculateTokenValue(value.value, value.decimals, tokenPrice);

      return { value, priceInUsd, tokenPrice };

    });

    return coins.sort(
      (a, b) =>
        (b.priceInUsd ?? 0) - (a.priceInUsd ?? 0)
    );
  }, [assets, coinPrices, isFetching]);
  
  return {
    error,
    isFetching,
    hasFetched,
    tokensAndPrices,
    totalValueOfAllTokens,
  };

};
