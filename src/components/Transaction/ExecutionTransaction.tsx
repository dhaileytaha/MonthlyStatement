import React from 'react';
import {
  getFee,
  getFrom,
  getHash,
  getTitle,
  getTo,
  TransactionStatus,
} from '../../modules/transactions';
import { BaseTransaction } from './BaseTransaction';
import { TransactionProps } from './types';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { validate } from '../../utils/validate';
import { getStatus } from '../../modules/transactions/getDataFromTransaction/getStatus';

export const ExecutionTransaction = ({ combinedTransaction, index }: TransactionProps) => {
  const title = validate(getTitle(combinedTransaction), 'No title');
  const gas = getFee(combinedTransaction);
  const from = getFrom(combinedTransaction);
  const to = getTo(combinedTransaction);
  const hash = validate(getHash(combinedTransaction), 'No hash');
  const status = getStatus(combinedTransaction);

  return (
    <BaseTransaction
      index={index}
      icon={faArrowRight}
      title={title}
      date={combinedTransaction.date}
      gas={gas}
      from={from}
      to={to}
      hash={hash}
      isError={status === TransactionStatus.Error}
      transaction={combinedTransaction}
    />
  );
};
