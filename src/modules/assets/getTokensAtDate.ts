import { CombinedTransactions } from '../transactions';
import { TokenValue, getAssetsFromTransactions } from './getAssetsFromTransactions';

/**
 * Check if the address has tokens at a certain date based on the given assets
 * TODO: refine this logic as it is really inefficient by calculating the assets over and over again for each date
 */
export const getTokensAtDate = (
  tokenName: string,
  date: Date,
  transactions: CombinedTransactions
): TokenValue | null => {
  const { assets } = getAssetsFromTransactions(date, transactions);
  const tokenAmount = assets[tokenName];

  return tokenAmount;
};
