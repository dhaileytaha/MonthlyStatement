import dayjs from 'dayjs';
import { tokenMigrations } from '../../../data/tokenMigrations';
import { CombinedTransactions } from './combineTransactions';

/**
 * Check if token is a migrated token and adjust the names accordingly.
 * The provided date is used to check
 */
export const adjustForMigrations = (transactions: CombinedTransactions): CombinedTransactions => {
  return transactions.map((transaction) => {
    if (transaction.erc20Transactions.length === 0) {
      return transaction;
    }

    const newERC20Transactions = transaction.erc20Transactions.map((erc20Transaction) => {
      const tokenMigration = tokenMigrations.find(
        (migration) =>
          migration.oldToken.contractAddress === erc20Transaction.contractAddress ||
          migration.newToken.contractAddress === erc20Transaction.contractAddress
      );

      if (!tokenMigration) {
        return erc20Transaction;
      }

      const isOldToken =
        tokenMigration.oldToken.contractAddress === erc20Transaction.contractAddress;
      const isTransactionAfterMigration = dayjs(transaction.date).isAfter(tokenMigration.date);

      // Old tokens after migration date are considered 'OLD'
      // ex. when you get/send old token after migration has happened
      if (isOldToken && isTransactionAfterMigration) {
        return {
          ...erc20Transaction,
          tokenName: tokenMigration.renamedOldToken.name,
          tokenSymbol: tokenMigration.renamedOldToken.symbol,
        };
      }

      return erc20Transaction;
    });

    return { ...transaction, erc20Transactions: newERC20Transactions };
  });
};
