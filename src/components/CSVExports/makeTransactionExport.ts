import dayjs from 'dayjs';
import { Coin } from '../../api/coingecko/coins';
import { RunningBalances } from '../../modules/assets/getAssetsFromTransactions';
import { CSVRows, exportToCSV } from '../../modules/csvExport/exportToCSV';
import { findCoinGeckoTokenId } from '../../modules/tokens/findCoinGeckoTokenId';
import { formatValue } from '../../modules/tokens/formatValue';
import { fetchCoinPriceFromCoinGecko } from '../../modules/tokens/useCoinDetails';
import {
  getContractAddress,
  getCreditToken,
  getCreditTokenRunningBalance,
  getDebitToken,
  getFee,
  getFrom,
  getHash,
  getHumanReadableType,
  getTitle,
  getTo,
} from '../../modules/transactions';
import { CombinedTransactions } from '../../modules/transactions/combineTransactions/combineTransactions';
import { getDebitTokenRunningBalance } from '../../modules/transactions/getDataFromTransaction/getDebitTokenRunningBalance';
import { getStatus } from '../../modules/transactions/getDataFromTransaction/getStatus';
import { formatUsd } from '../../utils/formatUsd';

export const makeTransactionExport = async (
  transactions: CombinedTransactions,
  startDate: Date,
  endDate: Date,
  coins: Coin[],
  runningBalances?: RunningBalances
) => {
  const headerRow = [
    'Date',
    'Title',
    'Type',
    'Status',
    'Fee ETH',
    'Fee USD',
    'Debit token symbol',
    'Debit Amount (Num tokens)',
    'Debit Amount (USD)',
    'Total Debit Token Holdings (Num Tokens)',
    'Total Debit Token Holdings (USD)',
    'Credit token Symbol',
    'Credit Amount (Num Tokens)',
    'Credit Amount (USD)',
    'Total Credit Token Holdings (Num Tokens)',
    'Total Credit Token Holdings (USD)',
    'Hash',
    'To',
    'From',
    'Contract address',
  ];

  const calculatePrice = (valueInDecimals?: number, price?: number) => {
    if (valueInDecimals == null || price == null) {
      return null;
    }

    if (valueInDecimals === 0 || price === 0) {
      return 0;
    }

    return valueInDecimals * price;
  };

  const transactionRowsRequests = transactions.map(async (transaction) => {
    const { date } = transaction;
    const title = getTitle(transaction);
    const type = getHumanReadableType(transaction);
    const status = getStatus(transaction);

    const debitToken = getDebitToken(transaction);
    const debitTokenId = debitToken
      ? findCoinGeckoTokenId(coins, debitToken.name, debitToken.symbol)
      : undefined;
    const debitTokenPrice = debitTokenId
      ? await fetchCoinPriceFromCoinGecko(debitTokenId, date)
      : undefined;
    const debitTokenRunningBalance = getDebitTokenRunningBalance(transaction, runningBalances);
    const debitTokenSymbol = debitToken?.symbol;
    const debitTokenValue = debitToken?.valueInDecimals;
    const debitTokenValueInUSD = formatUsd(calculatePrice(debitTokenValue, debitTokenPrice?.price));
    const debitTokenRunningBalanceValue = debitTokenRunningBalance?.valueInDecimals;
    const debitTokenRunningBalanceValueInUSD = formatUsd(
      calculatePrice(debitTokenRunningBalanceValue, debitTokenPrice?.price)
    );

    const creditToken = getCreditToken(transaction);
    const creditTokenId = creditToken
      ? findCoinGeckoTokenId(coins, creditToken.name, creditToken.symbol)
      : undefined;
    const creditTokenPrice = creditTokenId
      ? await fetchCoinPriceFromCoinGecko(creditTokenId, date)
      : undefined;

    const creditTokenRunningBalance = getCreditTokenRunningBalance(transaction, runningBalances);
    const creditTokenSymbol = creditToken?.symbol;
    const creditTokenValue = creditToken?.valueInDecimals;
    const creditTokenValueInUSD = formatUsd(
      calculatePrice(creditTokenValue, creditTokenPrice?.price)
    );
    const creditTokenRunningBalanceValue = creditTokenRunningBalance?.valueInDecimals;
    const creditTokenRunningBalanceValueInUSD = formatUsd(
      calculatePrice(creditTokenRunningBalanceValue, creditTokenPrice?.price)
    );

    const fee = getFee(transaction);
    const feeValue = fee ? formatValue(fee, 18, false) : undefined;
    const ethPrice = feeValue ? await fetchCoinPriceFromCoinGecko('ethereum', date) : undefined;
    const feeInUSD = formatUsd(calculatePrice(feeValue, ethPrice?.price));

    const hash = getHash(transaction);
    const to = getTo(transaction);
    const from = getFrom(transaction);
    const contractAddress = getContractAddress(transaction);

    return [
      date,
      title,
      type,
      status,
      feeValue,
      feeInUSD,
      debitTokenSymbol,
      debitTokenValue,
      debitTokenValueInUSD,
      debitTokenRunningBalanceValue,
      debitTokenRunningBalanceValueInUSD,
      creditTokenSymbol,
      creditTokenValue,
      creditTokenValueInUSD,
      creditTokenRunningBalanceValue,
      creditTokenRunningBalanceValueInUSD,
      hash,
      to,
      from,
      contractAddress,
    ];
  });

  const transactionRows = await Promise.all(transactionRowsRequests);

  const rows: CSVRows = [headerRow, ...transactionRows];

  const fileName = `transactions-${dayjs(startDate).format('DDMMYYYY')}-${dayjs(endDate).format(
    'DDMMYYYY'
  )}`;

  exportToCSV(fileName+".csv", rows);
};
