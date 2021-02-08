import { CombinedTransaction } from '../combineTransactions/combineTransactions';
/**
 * Get the status of the transaction
 */
export const getStatus = (combinedTransaction: CombinedTransaction) => {
  return combinedTransaction.status;
};
