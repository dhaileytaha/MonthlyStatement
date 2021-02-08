import BigNumber from 'bignumber.js';
import { isSameAddress } from '../../../utils/isSameAddress';
import { CombinedTransaction } from '../combineTransactions/combineTransactions';
import { TransactionType } from '../combineTransactions/getTransactionType';

export const getFee = (combinedTransaction: CombinedTransaction) => {
  const { originAddress } = combinedTransaction;

  if (
    combinedTransaction.type === TransactionType.Deposit ||
    combinedTransaction.type === TransactionType.InternalOnlyBoth ||
    combinedTransaction.type === TransactionType.InternalOnlyDeposit ||
    combinedTransaction.type === TransactionType.InternalOnlyWithdraw ||
    combinedTransaction.type === TransactionType.ERC20Deposit
  ) {
    return null;
  }

  if (!combinedTransaction.transaction) {
    return null;
  }

  if (!isSameAddress(combinedTransaction.transaction.from, originAddress)) {
    return null;
  }

  const gasValue = new BigNumber(
    Number(combinedTransaction.transaction.gasPrice) *
      Number(combinedTransaction.transaction.gasUsed)
  );

  return gasValue;
};
