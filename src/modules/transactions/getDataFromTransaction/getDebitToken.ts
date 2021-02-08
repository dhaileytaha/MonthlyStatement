import BigNumber from 'bignumber.js';
import { isSameAddress } from '../../../utils/isSameAddress';
import { validate } from '../../../utils/validate';
import { formatValue } from '../../tokens/formatValue';
import { CombinedTransaction } from '../combineTransactions/combineTransactions';
import { TransactionType } from '../combineTransactions/getTransactionType';
import { getTotalTransactionValue } from '../utils/getTotalTransactionValue';
import { getValuesFromInternalTransactions } from '../utils/getValuesFromInternalTransactions';
import { SymbolData } from './types';

/**
 * Get the debit token (the token that you get), based on the provided CombinedTransaction
 * When trading 10 POLS for 5 ETH, then ETH is the debit token
 * The result can be null, an ERC20 token or ETH
 */
export const getDebitToken = (combinedTransaction: CombinedTransaction): SymbolData | null => {
  const { originAddress, erc20Transactions } = combinedTransaction;

  if (combinedTransaction.type === TransactionType.Deposit) {
    const value = getTotalTransactionValue(combinedTransaction);
    const valueInDecimals = formatValue(value, 18, false);
    const valueInRoundedDecimals = formatValue(value, 18);

    return {
      value,
      valueInDecimals,
      valueInRoundedDecimals,
      decimals: 18,
      symbol: 'ETH',
      name: 'Ethereum',
    };
  }

  if (combinedTransaction.type === TransactionType.SwapERC20WithEth) {
    const token = validate(erc20Transactions[0], 'No erc20Transaction');
    const tokenIsDebitToken = isSameAddress(originAddress, token.to);

    if (tokenIsDebitToken) {
      const value = new BigNumber(token.value);
      const decimals = Number(token.tokenDecimal);
      const symbol = token.tokenSymbol;
      const name = token.tokenName;
      const valueInDecimals = formatValue(value, decimals, false);
      const valueInRoundedDecimals = formatValue(value, decimals);
  
      return {
        value,
        valueInDecimals,
        valueInRoundedDecimals,
        decimals,
        symbol,
        name,
      };
    }

    const value = getTotalTransactionValue(combinedTransaction);
    const valueInDecimals = formatValue(value, 18, false);
    const valueInRoundedDecimals = formatValue(value, 18);

    return {
      value,
      valueInDecimals,
      valueInRoundedDecimals,
      decimals: 18,
      symbol: 'ETH',
      name: 'Ethereum',
    };
  }

  if (
    combinedTransaction.type === TransactionType.Swap2ERC20 ||
    combinedTransaction.type === TransactionType.TokenMigration
  ) {
    const debitToken = validate(
      erc20Transactions.find((transaction) => isSameAddress(transaction.to, originAddress)),
      'No debitToken'
    );

    const value = new BigNumber(debitToken.value);
    const decimals = Number(debitToken.tokenDecimal);
    const symbol = debitToken.tokenSymbol;
    const name = debitToken.tokenName;
    const valueInDecimals = formatValue(value, decimals, false);
    const valueInRoundedDecimals = formatValue(value, decimals);

    return {
      value,
      valueInDecimals,
      valueInRoundedDecimals,
      decimals,
      symbol,
      name,
    };
  }

  if (combinedTransaction.type === TransactionType.ERC20Deposit) {
    const debitToken = validate(erc20Transactions[0], 'No debitToken');

    const value = new BigNumber(debitToken.value);
    const decimals = Number(debitToken.tokenDecimal);
    const symbol = debitToken.tokenSymbol;
    const name = debitToken.tokenName;
    const valueInDecimals = formatValue(value, decimals, false);
    const valueInRoundedDecimals = formatValue(value, decimals);

    return {
      value,
      valueInDecimals,
      valueInRoundedDecimals,
      decimals,
      symbol,
      name,
    };
  }

  if (
    combinedTransaction.type === TransactionType.InternalOnlyDeposit ||
    combinedTransaction.type === TransactionType.InternalOnlyBoth
  ) {
    const { incomingInternalValue } = getValuesFromInternalTransactions(combinedTransaction);
    const valueInDecimals = formatValue(incomingInternalValue, 18, false);
    const valueInRoundedDecimals = formatValue(incomingInternalValue, 18);

    return {
      value: incomingInternalValue,
      valueInDecimals,
      valueInRoundedDecimals,
      decimals: 18,
      symbol: 'ETH',
      name: 'Ethereum',
    };
  }

  return null;
};
