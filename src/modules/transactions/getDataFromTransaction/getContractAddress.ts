import { CombinedTransaction } from '../combineTransactions/combineTransactions';

export const getContractAddress = (combinedTransaction: CombinedTransaction): string | null => {
  return (
    combinedTransaction.transaction?.contractAddress ??
    combinedTransaction.erc20Transactions[0]?.contractAddress ??
    combinedTransaction.internalTransactions[0]?.contractAddress ??
    null
  );
};
