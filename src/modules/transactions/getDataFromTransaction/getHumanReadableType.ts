import { TransactionType } from '../combineTransactions';
import { CombinedTransaction } from '../combineTransactions/combineTransactions';

export const getHumanReadableType = (combinedTransaction: CombinedTransaction): string | null => {
  const { type } = combinedTransaction;

  if (
    type === TransactionType.Deposit ||
    type === TransactionType.ERC20Deposit ||
    type === TransactionType.InternalOnlyDeposit
  ) {
    return 'Deposit';
  }

  if (
    type === TransactionType.Withdraw ||
    type === TransactionType.ERC20Withdraw ||
    type === TransactionType.InternalOnlyWithdraw
  ) {
    return 'Withdraw';
  }

  if (type === TransactionType.Swap2ERC20 || type === TransactionType.SwapERC20WithEth) {
    return 'Trade';
  }

  if (type === TransactionType.Execution) {
    return 'Contract execution';
  }

  if (type === TransactionType.Approval) {
    return 'Approval';
  }

  return null;
};
