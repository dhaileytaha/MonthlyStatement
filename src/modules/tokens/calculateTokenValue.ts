import { BigNumber } from 'bignumber.js';

export const calculateTokenValue = (amount: BigNumber, decimals: number, price?: number) => {
  const value = price ? amount.multipliedBy(price).dividedBy(10 ** decimals) : null;

  return value?.toNumber();
};
