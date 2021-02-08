import { validate } from '../../../utils/validate';
import { CombinedTransaction } from '../combineTransactions/combineTransactions';
import { TransactionType } from '../combineTransactions/getTransactionType';
import { erc20TokensByContractAddress } from '../fetchTransactions';
import { getCreditToken } from './getCreditToken';
import { getDebitToken } from './getDebitToken';

/**
 * Get the title of the transaction
 */
export const getTitle = (combinedTransaction: CombinedTransaction): string | null => {
  if (
    combinedTransaction.type === TransactionType.Deposit ||
    combinedTransaction.type === TransactionType.ERC20Deposit ||
    combinedTransaction.type === TransactionType.InternalOnlyDeposit
  ) {
    const debitToken = validate(getDebitToken(combinedTransaction), 'No debittoken');

    return `Deposit ${debitToken.valueInRoundedDecimals} ${debitToken.symbol}`;
  }

  if (
    combinedTransaction.type === TransactionType.Withdraw ||
    combinedTransaction.type === TransactionType.ERC20Withdraw ||
    combinedTransaction.type === TransactionType.InternalOnlyWithdraw
  ) {
    const creditToken = validate(getCreditToken(combinedTransaction), 'No credittoken');

    return `Withdraw ${creditToken.valueInRoundedDecimals} ${creditToken.symbol}`;
  }

  if (
    combinedTransaction.type === TransactionType.SwapERC20WithEth ||
    combinedTransaction.type === TransactionType.Swap2ERC20 ||
    combinedTransaction.type === TransactionType.InternalOnlyBoth
  ) {
    const creditToken = validate(getCreditToken(combinedTransaction), 'No credittoken');
    const debitToken = validate(getDebitToken(combinedTransaction), 'No debittoken');

    return `Trade ${creditToken.valueInRoundedDecimals} ${creditToken.symbol} for ${debitToken.valueInRoundedDecimals} ${debitToken.symbol}`;
  }

  if (combinedTransaction.type === TransactionType.Approval) {
    const transaction = validate(combinedTransaction.transaction, 'No transaction');
    const token = erc20TokensByContractAddress.get(transaction.to);

    return `Approval of ${token ? `${token.name} (${token.symbol})` : 'unknown token'}`;
  }

  if (combinedTransaction.type === TransactionType.Execution) {
    return `Execute contract`;
  }

  if (combinedTransaction.type === TransactionType.TokenMigration) {
    const creditToken = validate(getCreditToken(combinedTransaction), 'No credittoken');
    const debitToken = validate(getDebitToken(combinedTransaction), 'No debittoken');

    return `${creditToken.valueInRoundedDecimals} ${creditToken.name} (${creditToken.symbol}) are now ${debitToken.valueInRoundedDecimals} ${debitToken.name} (${debitToken.symbol})`;
  }

  return null;
};
