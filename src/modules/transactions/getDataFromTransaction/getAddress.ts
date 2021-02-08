import { CombinedTransaction } from '../combineTransactions/combineTransactions';

export const getAddress = (combinedTransaction: CombinedTransaction): string | null => {
  return combinedTransaction.originAddress;
};
