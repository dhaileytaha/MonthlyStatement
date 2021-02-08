import { CombinedTransaction } from '../combineTransactions/combineTransactions';

export const getTo = (combinedTransaction: CombinedTransaction): string | null => {
  return combinedTransaction.transaction?.to ?? null;
};
