import React from 'react';
import {
  getContractAddress,
  getCreditToken,
  getDebitToken,
  getFee,
  getFrom,
  getHash,
  getTitle,
  getTo,
  TransactionStatus,
} from '../../modules/transactions';
import { BaseTransaction } from './BaseTransaction';
import { TransactionProps } from './types';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { validate } from '../../utils/validate';
import { getStatus } from '../../modules/transactions/getDataFromTransaction/getStatus';

export const TradeTransaction = ({ combinedTransaction, index }: TransactionProps) => {
  const title = validate(getTitle(combinedTransaction), 'No title');
  const creditToken = validate(getCreditToken(combinedTransaction), 'No creditToken');
  const debitToken = validate(getDebitToken(combinedTransaction), 'No debitToken');
  const gas = getFee(combinedTransaction);
  const from = getFrom(combinedTransaction);
  const to = getTo(combinedTransaction);
  const hash = validate(getHash(combinedTransaction), 'No hash');
  const contractAddress = getContractAddress(combinedTransaction);
  const status = getStatus(combinedTransaction);

  return (
    <BaseTransaction
      index={index}
      icon={faExchangeAlt}
      title={title}
      date={combinedTransaction.date}
      creditToken={{
        symbol: creditToken.symbol,
        name: creditToken.name,
        value: creditToken.value,
        decimals: creditToken.decimals,
      }}
      debitToken={{
        symbol: debitToken.symbol,
        name: debitToken.name,
        value: debitToken.value,
        decimals: debitToken.decimals,
      }}
      gas={gas}
      from={from}
      to={to}
      hash={hash}
      contract={contractAddress}
      isError={status === TransactionStatus.Error}
      transaction={combinedTransaction}
    />
  );
};
