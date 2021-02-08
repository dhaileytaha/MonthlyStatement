import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import React, { useMemo } from 'react';
import { TokenMigration } from '../../data/tokenMigrations';
import { getAssetsFromTransactions } from '../../modules/assets/getAssetsFromTransactions';
import { useDecimalValue } from '../../modules/tokens/useDecimalValue';
import {
  CombinedTransactions,
  getAddress,
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
import { getStatus } from '../../modules/transactions/getDataFromTransaction/getStatus';
import { validate } from '../../utils/validate';
import { BaseTransaction } from './BaseTransaction';
import { TransactionProps } from './types';

export const MigrationTransaction = ({ combinedTransaction, index }: TransactionProps) => {
  const title = validate(getTitle(combinedTransaction), 'No title');
  const creditToken = validate(getCreditToken(combinedTransaction), 'No creditToken');
  const debitToken = validate(getDebitToken(combinedTransaction), 'No debitToken');
  const address = getAddress(combinedTransaction);
  const status = getStatus(combinedTransaction);
  const migration = validate(combinedTransaction.migrationTransaction, 'No migrationTransaction');
  const details = `Contract address of ${migration.oldToken.name} has changed from ${migration.oldToken.contractAddress} to ${migration.newToken.contractAddress}. All old tokens will be considered to have a value of $0 from now on, and have been renamed "${migration.renamedOldToken.name} (${migration.renamedOldToken.symbol})" for clarity.`;

  return (
    <BaseTransaction
      index={index}
      icon={faExclamationCircle}
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
      isError={status === TransactionStatus.Error}
      transaction={combinedTransaction}
      address={address}
      details={details}
      readMore={migration.readMore}
      oldContract={migration.oldToken.contractAddress}
      newContract={migration.newToken.contractAddress}
    />
  );
};
