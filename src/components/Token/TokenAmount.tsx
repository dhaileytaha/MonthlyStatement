import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useDecimalValue } from '../../modules/tokens/useDecimalValue';

/**
 * Displays the token amount + symbol
 */
export function TokenAmount({
  value,
  symbol,
  decimals,
  precision,
  hideSymbol,
}: {
  value: BigNumber;
  symbol: string;
  decimals: number;
  precision?: number | false;
  hideSymbol?: boolean;
}) {
  const { roundedValue } = useDecimalValue({ value, decimals, precision });
  return (
    <span>
      {roundedValue}
      {hideSymbol ? null : ` ${symbol}`}
    </span>
  );
}
