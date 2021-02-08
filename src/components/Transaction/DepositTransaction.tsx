import React from 'react';
import {
  getDebitToken,
  getFrom,
  getHash,
  getTitle,
  getTo,
  TransactionStatus,
} from '../../modules/transactions';
import { BaseTransaction } from './BaseTransaction';
import { TransactionProps } from './types';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { validate } from '../../utils/validate';
import { getStatus } from '../../modules/transactions/getDataFromTransaction/getStatus';

export const DepositTransaction = ({ combinedTransaction, index }: TransactionProps) => {
  const title = validate(getTitle(combinedTransaction), 'No title');
  const debitToken = validate(getDebitToken(combinedTransaction), 'No debitToken');
  const from = getFrom(combinedTransaction);
  const to = getTo(combinedTransaction);
  const hash = validate(getHash(combinedTransaction), 'No hash');
  const status = getStatus(combinedTransaction);

  return (
    <BaseTransaction
      index={index}
      icon={faArrowDown}
      title={title}
      date={combinedTransaction.date}
      debitToken={{
        symbol: debitToken.symbol,
        name: debitToken.name,
        value: debitToken.value,
        decimals: debitToken.decimals,
      }}
      from={from}
      to={to}
      hash={hash}
      isError={status === TransactionStatus.Error}
      transaction={combinedTransaction}
    />
  );
};
