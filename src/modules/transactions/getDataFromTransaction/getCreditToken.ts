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
 * Get the credit token (the token that you send),based on the provided CombinedTransaction
 * When trading 10 POLS for 5 ETH, then ETH is the debit token
 * The result can be null, an ERC20 token or ETH
 */
export const getCreditToken = (combinedTransaction: CombinedTransaction): SymbolData | null => {
  const { originAddress, erc20Transactions } = combinedTransaction;

  if (combinedTransaction.type === TransactionType.Withdraw) {
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
    const tokenIsCreditToken = isSameAddress(originAddress, token.from);

    if (tokenIsCreditToken) {
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
    const creditToken = validate(
      erc20Transactions.find((transaction) => isSameAddress(transaction.from, originAddress)),
      'No creditToken'
    );

    const value = new BigNumber(creditToken.value);
    const decimals = Number(creditToken.tokenDecimal);
    const symbol = creditToken.tokenSymbol;
    const name = creditToken.tokenName;
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

  if (combinedTransaction.type === TransactionType.ERC20Withdraw) {
    const creditToken = validate(erc20Transactions[0], 'No creditToken');

    const value = new BigNumber(creditToken.value);
    const decimals = Number(creditToken.tokenDecimal);
    const symbol = creditToken.tokenSymbol;
    const name = creditToken.tokenName;
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
    const { outgoingInternalValue } = getValuesFromInternalTransactions(combinedTransaction);
    const valueInDecimals = formatValue(outgoingInternalValue, 18, false);
    const valueInRoundedDecimals = formatValue(outgoingInternalValue, 18);

    return {
      value: outgoingInternalValue,
      valueInDecimals,
      valueInRoundedDecimals,
      decimals: 18,
      symbol: 'ETH',
      name: 'Ethereum',
    };
  }

  return null;
};
