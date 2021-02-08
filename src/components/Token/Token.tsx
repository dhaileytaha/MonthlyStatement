import React, { useMemo } from 'react';
import { useCoinContext } from '../../context/CoinContext';
import { useCoinDetails } from '../../modules/tokens/useCoinDetails';
import { findCoinGeckoTokenId } from '../../modules/tokens/findCoinGeckoTokenId';
import { BigNumber } from 'bignumber.js';
import { useDecimalValue } from '../../modules/tokens/useDecimalValue';
import { TokenAmount } from './TokenAmount';
import { TokenPrice } from './TokenPrice';

export interface TokenDefinition {
  decimals: number;
  symbol: string;
  name: string;
}

export interface Token extends TokenDefinition {
  value: BigNumber;
}

interface TokenProps extends Token {
  // When date is provided, the price of that date will be fetched and shown
  date?: Date;
  precision?: number | false;
}

/**
 * Fetch the token price, and display the amount and price
 */
export const Token = ({ value, name, decimals, symbol, date, precision }: TokenProps) => {
  const { coins } = useCoinContext();
  const coinGeckoTokenId = useMemo(() => {
    return findCoinGeckoTokenId(coins!, name, symbol);
  }, [coins, name, symbol]);
  const { decimalValue } = useDecimalValue({
    value,
    decimals,
    precision,
  });
  const { price, isFetching, error } = useCoinDetails(coinGeckoTokenId, date);
  const usdPrice = price;
  const valueInUsd = decimalValue != null ? decimalValue * (usdPrice ?? 0) : null;

  return (
    <span>
      <TokenAmount value={value} decimals={decimals} symbol={symbol} precision={precision} />
      {decimalValue != null && (
        <>
          {' '}
          (
          <TokenPrice
            decimalValue={decimalValue}
            symbol={symbol}
            usdPrice={usdPrice}
            valueInUsd={valueInUsd}
            isFetching={isFetching}
            error={error}
          />
          )
        </>
      )}
    </span>
  );
};
