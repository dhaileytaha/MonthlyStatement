import dayjs from 'dayjs';
import React from 'react';
import { useStatementContext } from '../context/StatementContext';
import { Assets } from '../modules/assets/getAssetsFromTransactions';
import { TokensAndPrices, useAssetResults } from '../modules/assets/useAssetResults';
import { Currency } from './Currency';
import { ErrorMessage } from './ErrorMessage';
import { InlineLoader } from './InlineLoader';
import { Loader } from './Loader';
import { TokenAmount, TokenPrice } from './Token';

export interface AssetData {
  assets: Assets | null;
  date: Date;
  error: Error | null;
  isFetching: boolean;
  hasFetched: boolean;
  tokensAndPrices: TokensAndPrices;
  totalValueOfAllTokens: number;
}

interface AssetsProps extends AssetData {}

export const AssetsResult = ({
  error,
  isFetching,
  tokensAndPrices,
  totalValueOfAllTokens,
  assets,
  date,
}: AssetsProps) => {
  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (isFetching || !tokensAndPrices || !assets) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h5>Value on {dayjs(date).format('D MMMM, YYYY')}</h5>
      <table className="table table-bordered" style={{ fontSize: '0.9em' }}>
        <thead>
          <tr>
            <td>
              <i>Name</i>
            </td>
            <td style={{ textAlign: 'right' }}>
              <i>Number</i>
            </td>
            <td style={{ textAlign: 'right' }}>
              <i>Value</i>
            </td>
          </tr>
        </thead>
        <tbody>
          {tokensAndPrices.map(({ value, tokenPrice, priceInUsd }) => {
            return (
              <tr key={value.symbol}>
                <td>{value.symbol}</td>
                <td style={{ textAlign: 'right' }}>
                  <TokenAmount
                    symbol={value.symbol}
                    value={value.value}
                    decimals={value.decimals}
                    hideSymbol
                  />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <TokenPrice
                    decimalValue={value.decimals}
                    symbol={value.symbol}
                    usdPrice={tokenPrice}
                    valueInUsd={priceInUsd ?? 0}
                    isFetching={isFetching}
                    error={error}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={2} style={{ width: '50%' }}>
              <b>Total Value of Assets</b>
            </th>
            <th style={{ textAlign: 'right' }}>
              {totalValueOfAllTokens && <Currency value={totalValueOfAllTokens} />}
              {isFetching && <InlineLoader />}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export const StartAssetsResult = () => {
  const {
    startAssetsData: {
      error,
      assets,
      isFetching,
      hasFetched,
      date,
      tokensAndPrices,
      totalValueOfAllTokens,
    },
  } = useStatementContext();

  return (
    <AssetsResult
      error={error}
      assets={assets}
      isFetching={isFetching}
      hasFetched={hasFetched}
      date={date}
      tokensAndPrices={tokensAndPrices}
      totalValueOfAllTokens={totalValueOfAllTokens}
    />
  );
};

export const EndAssetsResult = () => {
  const {
    endAssetsData: {
      error,
      assets,
      isFetching,
      hasFetched,
      date,
      tokensAndPrices,
      totalValueOfAllTokens,
    },
  } = useStatementContext();

  return (
    <AssetsResult
      error={error}
      assets={assets}
      isFetching={isFetching}
      hasFetched={hasFetched}
      date={date}
      tokensAndPrices={tokensAndPrices}
      totalValueOfAllTokens={totalValueOfAllTokens}
    />
  );
};
