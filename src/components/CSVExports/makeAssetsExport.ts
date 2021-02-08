import dayjs from 'dayjs';
import { Coin } from '../../api/coingecko/coins';
import { RunningBalances } from '../../modules/assets/getAssetsFromTransactions';
import { TokensAndPrice, TokensAndPrices } from '../../modules/assets/useAssetResults';
import { CSVRow, CSVRows, exportToCSV } from '../../modules/csvExport/exportToCSV';
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

export const makeAssetsExport = async (
  startTokenAndPrices: TokensAndPrices,
  endTokenAndPrices: TokensAndPrices,
  startTotalValue: number,
  endTotalValue: number,
  startDate: Date,
  endDate: Date
) => {
  if (!startTokenAndPrices || !endTokenAndPrices) {
    throw new Error('No startTokenAndPrices or endTokenAndPrices');
  }

  const startDateString = dayjs(startDate).format('DD-MM-YYYY');
  const endDatestring = dayjs(endDate).format('DD-MM-YYYY');

  const headerRows: CSVRows = [
    ['Start of period', startDateString, '', 'End of period', endDatestring, ''],
    [
      'Token symbol',
      'Amount (Num tokens)',
      'Amount (USD)',
      'Token symbol',
      'Amount (Num tokens)',
      'Amount (USD)',
    ],
  ];

  const assetsRowCount = Math.max(startTokenAndPrices.length, endTokenAndPrices.length);
  const assetRows: CSVRows = [];
  for (let i = 0; i < assetsRowCount; i++) {
    let row: CSVRow = [];

    const startAsset = startTokenAndPrices[i];
    if (startAsset) {
      const startAssetSymbol = startAsset.value.symbol;
      const startAssetValue = startAsset.value.value;
      const startAssetDecimals = startAsset.value.decimals;
      const startAssetValueInDecimals = formatValue(startAssetValue, startAssetDecimals);
      const startAssetPriceInUSD = formatUsd(startAsset.priceInUsd);

      row.push(...[startAssetSymbol, startAssetValueInDecimals, startAssetPriceInUSD]);
    } else {
      row.push(...['', '', ''])
    }

    const endAsset = endTokenAndPrices[i];
    if (endAsset) {
      const endAssetSymbol = endAsset.value.symbol;
      const endAssetValue = endAsset.value.value;
      const endAssetDecimals = endAsset.value.decimals;
      const endAssetValueInDecimals = formatValue(endAssetValue, endAssetDecimals);
      const endAssetPriceInUSD = formatUsd(endAsset.priceInUsd);

      row.push(...[endAssetSymbol, endAssetValueInDecimals, endAssetPriceInUSD]);
    } else {
      row.push(...['', '', ''])
    }

    assetRows.push(row);
  }

  const totalRow = [
    'Total (USD)',
    '',
    formatUsd(startTotalValue),
    'Total (USD)',
    '',
    formatUsd(endTotalValue),
  ];

  const rows: CSVRows = [...headerRows, ...assetRows, totalRow];

  const fileName = `assets-${dayjs(startDate).format('DDMMYYYY')}-${dayjs(endDate).format(
    'DDMMYYYY'
  )}`;

  exportToCSV(fileName+".csv", rows);
};
