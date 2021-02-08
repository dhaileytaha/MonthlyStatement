import { CombinedTransaction } from '../combineTransactions/combineTransactions';

export const getFrom = (combinedTransaction: CombinedTransaction): string | null => {
  return (
    combinedTransaction.transaction?.from ??
    combinedTransaction.erc20Transactions[0]?.from ??
    combinedTransaction.internalTransactions[0]?.from ??
    null
  );
};
