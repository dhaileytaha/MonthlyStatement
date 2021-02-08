import { validate } from '../../../utils/validate';
import { RunningBalances } from '../../assets/getAssetsFromTransactions';
import { formatValue } from '../../tokens/formatValue';
import { CombinedTransaction } from '../combineTransactions/combineTransactions';
import { getCreditToken } from './getCreditToken';
import { SymbolData } from './types';

export const getCreditTokenRunningBalance = (
  combinedTransaction: CombinedTransaction,
  runningBalances?: RunningBalances
): SymbolData | null => {
  const { date } = combinedTransaction;
  const currentRunningBalances = validate(runningBalances, 'No runningBalances');

  const creditToken = getCreditToken(combinedTransaction);

  if (!creditToken) {
    return null;
  }

  const tokenRunningBalances = currentRunningBalances[creditToken.name];

  if (!tokenRunningBalances) {
    console.error(`No running balance for token ${tokenRunningBalances} found`);
    return null;
  }

  const tokenRunningBalancesAtDate = tokenRunningBalances[date.valueOf()];

  if (!tokenRunningBalancesAtDate) {
    console.error(
      `No running balance for token found for ${creditToken.name} at ${date.valueOf()}`
    );
    return null;
  }
  const decimals = tokenRunningBalancesAtDate.decimals;
  const value = tokenRunningBalancesAtDate.value;
  const valueInDecimals = formatValue(value, decimals, false);
  const valueInRoundedDecimals = formatValue(value, decimals);

  return {
    value,
    valueInDecimals,
    valueInRoundedDecimals,
    decimals,
    symbol: tokenRunningBalancesAtDate.symbol,
    name: tokenRunningBalancesAtDate.name,
  };
};
