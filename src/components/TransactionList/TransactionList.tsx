import React from 'react';
import dayjs from 'dayjs';
import { CombinedTransactions, getHash, TransactionType } from '../../modules/transactions';
import {
  DepositTransaction,
  WithdrawTransaction,
  TradeTransaction,
  ApprovalTransaction,
  ExecutionTransaction,
} from '../Transaction';
import { MigrationTransaction } from '../Transaction/MigrationTransaction';
import { ExportTransactionButton } from '../CSVExports/ExportTransactionButton';

interface TransactionListProps {
  transactions: CombinedTransactions;
  allTransactions: CombinedTransactions;
  startDate: Date;
  endDate: Date;
}

export const TransactionList = ({ transactions, startDate, endDate }: TransactionListProps) => {
  return (
    <div
      style={{
        margin: '2em 0',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', marginTop: '50px', marginBottom: '20px' }}
      >
        <div style={{ width: 50 }}></div>
        <div style={{ flexGrow: 1 }}>
          <h3 style={{ margin: 0, textAlign: 'center' }}>
            All transactions <br />
            from {dayjs(startDate).format('MMM D, YYYY')} to {dayjs(endDate).format('MMM D, YYYY')}
          </h3>
        </div>
        <div style={{ width: 50 }}>
          <ExportTransactionButton />
        </div>
      </div>
      <div style={{ marginTop: '1em' }}>
        {transactions.map((combinedTransaction, index) => {
          const key = `${getHash(combinedTransaction)}-${index}`;

          if (combinedTransaction.type === TransactionType.TokenMigration) {
            return (
              <MigrationTransaction
                key={key}
                index={index}
                combinedTransaction={combinedTransaction}
              />
            );
          }

          if (
            combinedTransaction.type === TransactionType.Deposit ||
            combinedTransaction.type === TransactionType.ERC20Deposit ||
            combinedTransaction.type === TransactionType.InternalOnlyDeposit
          ) {
            return (
              <DepositTransaction
                key={key}
                index={index}
                combinedTransaction={combinedTransaction}
              />
            );
          }

          if (
            combinedTransaction.type === TransactionType.Withdraw ||
            combinedTransaction.type === TransactionType.ERC20Withdraw ||
            combinedTransaction.type === TransactionType.InternalOnlyWithdraw
          ) {
            return (
              <WithdrawTransaction
                key={key}
                index={index}
                combinedTransaction={combinedTransaction}
              />
            );
          }

          if (
            combinedTransaction.type === TransactionType.SwapERC20WithEth ||
            combinedTransaction.type === TransactionType.Swap2ERC20 ||
            combinedTransaction.type === TransactionType.InternalOnlyBoth
          ) {
            return (
              <TradeTransaction key={key} index={index} combinedTransaction={combinedTransaction} />
            );
          }

          if (combinedTransaction.type === TransactionType.Approval) {
            return (
              <ApprovalTransaction
                key={key}
                index={index}
                combinedTransaction={combinedTransaction}
              />
            );
          }

          if (combinedTransaction.type === TransactionType.Execution) {
            return (
              <ExecutionTransaction
                key={key}
                index={index}
                combinedTransaction={combinedTransaction}
              />
            );
          }

          console.warn(
            `Not implemented transaction of type ${combinedTransaction.type}`,
            combinedTransaction
          );

          return null;
        })}
      </div>
    </div>
  );
};
