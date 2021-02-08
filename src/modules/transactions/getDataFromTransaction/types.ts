import BigNumber from 'bignumber.js';

export interface SymbolData {
  value: BigNumber;
  valueInDecimals: number;
  valueInRoundedDecimals: number;
  decimals: number;
  symbol: string;
  name: string;
}
