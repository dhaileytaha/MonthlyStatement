import BigNumber from 'bignumber.js';
import { CombinedTransaction } from '../combineTransactions/combineTransactions';

/**
 * Get ETH values from internal transactions
 * The transaction can have multiple internal transactions.
 * The result will be the net value and the positive, and negative changes
 */
export const getValuesFromInternalTransactions = (transaction: CombinedTransaction) => {
  const positiveInternalTransactions = transaction.internalTransactions.filter(
    (internalTransaction) =>
      internalTransaction.to.toLowerCase() === transaction.originAddress.toLowerCase()
  );
  const negativeInternalTransactions = transaction.internalTransactions.filter(
    (internalTransaction) =>
      internalTransaction.from.toLowerCase() === transaction.originAddress.toLowerCase()
  );

  const incomingInternalValue = positiveInternalTransactions.reduce(
    (sum, current) => sum.plus(new BigNumber(current.value)),
    new BigNumber(0)
  );
  const outgoingInternalValue = negativeInternalTransactions.reduce(
    (sum, current) => sum.plus(new BigNumber(current.value)),
    new BigNumber(0)
  );

  const netInternalValue = incomingInternalValue.minus(outgoingInternalValue);

  return {
    incomingInternalValue,
    outgoingInternalValue,
    netInternalValue,
  };
};
