import { BigNumber } from 'bignumber.js';
import { getValuesFromInternalTransactions } from '..';
import { CombinedTransaction } from '../combineTransactions';

export const getTotalTransactionValue = (combinedTransaction: CombinedTransaction) => {
  const transaction = combinedTransaction.transaction;

  const { netInternalValue } = getValuesFromInternalTransactions(combinedTransaction);

  if (transaction) {
    return netInternalValue.plus(transaction.value);
  }

  return netInternalValue;
};
