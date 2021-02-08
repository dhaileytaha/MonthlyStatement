import { CombinedTransaction } from '../combineTransactions/combineTransactions';

export const getHash = (combinedTransaction: CombinedTransaction): string | null => {
  return (
    combinedTransaction.transaction?.hash ??
    combinedTransaction.erc20Transactions[0]?.hash ??
    combinedTransaction.internalTransactions[0]?.hash ??
    null
  );
};
