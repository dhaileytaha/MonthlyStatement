import React from 'react';
import {
  getCreditToken,
  getFee,
  getFrom,
  getHash,
  getTitle,
  getTo,
  TransactionStatus,
} from '../../modules/transactions';
import { BaseTransaction } from './BaseTransaction';
import { TransactionProps } from './types';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { validate } from '../../utils/validate';
import { getStatus } from '../../modules/transactions/getDataFromTransaction/getStatus';

export const WithdrawTransaction = ({ combinedTransaction, index }: TransactionProps) => {
  const title = validate(getTitle(combinedTransaction), 'No title');
  const creditToken = validate(getCreditToken(combinedTransaction), 'No creditToken');
  const gas = getFee(combinedTransaction);
  const from = getFrom(combinedTransaction);
  const to = getTo(combinedTransaction);
  const hash = validate(getHash(combinedTransaction), 'No hash');
  const status = getStatus(combinedTransaction);

  return (
    <BaseTransaction
      index={index}
      icon={faArrowUp}
      title={title}
      date={combinedTransaction.date}
      creditToken={{
        symbol: creditToken.symbol,
        name: creditToken.name,
        value: creditToken.value,
        decimals: creditToken.decimals,
      }}
      gas={gas}
      from={from}
      to={to}
      hash={hash}
      isError={status === TransactionStatus.Error}
      transaction={combinedTransaction}
    />
  );
};
