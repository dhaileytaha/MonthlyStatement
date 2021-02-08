import {
  Transaction,
  ERC20Transactions,
  InternalTransactions,
  Transactions,
} from '../../../api/etherscan/accounts';
import { TokenMigration } from '../../../data/tokenMigrations';
import { makeMigrationTransactions } from '../fetchTransactions/makeMigrationTransactions';
import {
  TransactionStatus,
  getTransactionStatus,
  getTransactionStatusForERC20Transaction,
  getTransactionStatusForInternalTransaction,
} from './getTransactionStatus';
import { TransactionType, getTransactionType } from './getTransactionType';

export interface CombinedTransaction {
  originAddress: string;
  type: TransactionType;
  status: TransactionStatus;
  date: Date;
  // Can be null if we have an incomming ERC20 transaction (not initiated by the user)
  transaction: Transaction | null;
  erc20Transactions: ERC20Transactions;
  internalTransactions: InternalTransactions;
  migrationTransaction: TokenMigration | null;
}

export type CombinedTransactions = CombinedTransaction[];

/**
 * Combine transactions and internal ERC20 transfers together
 * For example: an uniswap swap consists of 3 transactions:
 * - The normal transaction to provide gas (no value)
 * - Transfer of token 1
 * - Transfer of token 2
 *
 * An example of an uniswap that swaps ETH to an token
 * - The normal transaction to provide gas AND eth
 * - Transfer of token
 */
export const combineTransactions = (
  address: string,
  transactions: Transactions,
  erc20Transactions: ERC20Transactions,
  internalTransactions: InternalTransactions
): CombinedTransactions => {
  const hashToCombinedTransaction: {
    [transactionHash: string]: CombinedTransaction;
  } = {};

  transactions.forEach((transaction) => {
    hashToCombinedTransaction[transaction.hash] = {
      originAddress: address,
      transaction,
      date: new Date(Number(transaction.timeStamp) * 1000),
      erc20Transactions: [],
      internalTransactions: [],
      migrationTransaction: null,
      status: getTransactionStatus(transaction),
      type: TransactionType.Unknown,
    };
  });

  erc20Transactions.forEach((transaction) => {
    // Make new key for hashToCombinedTransaction when transaction is not present
    // This happens when we have an incomming token transfer, not initiated by the user
    // In that case we set the transaction to null and set the token transfer as part of erc20Transactions
    if (!hashToCombinedTransaction[transaction.hash]) {
      hashToCombinedTransaction[transaction.hash] = {
        originAddress: address,
        transaction: null,
        date: new Date(Number(transaction.timeStamp) * 1000),
        erc20Transactions: [],
        internalTransactions: [],
        migrationTransaction: null,
        status: getTransactionStatusForERC20Transaction(transaction),
        type: TransactionType.Unknown,
      };
    }

    hashToCombinedTransaction[transaction.hash].erc20Transactions.push(transaction);
  });

  internalTransactions.forEach((transaction) => {
    // Make new key for hashToCombinedTransaction when transaction is not present
    // This happens when we have an incomming token transfer, not initiated by the user
    // In that case we set the transaction to null and set the token transfer as part of erc20Transactions
    if (!hashToCombinedTransaction[transaction.hash]) {
      hashToCombinedTransaction[transaction.hash] = {
        originAddress: address,
        transaction: null,
        date: new Date(Number(transaction.timeStamp) * 1000),
        erc20Transactions: [],
        internalTransactions: [],
        migrationTransaction: null,
        status: getTransactionStatusForInternalTransaction(transaction),
        type: TransactionType.Unknown,
      };
    }

    hashToCombinedTransaction[transaction.hash].internalTransactions.push(transaction);
  });

  // Set the status based on the transactions
  const hashToCombinedTransactionWithType = Object.values(hashToCombinedTransaction).map(
    (combinedTransaction) => {
      return {
        ...combinedTransaction,
        type: getTransactionType(combinedTransaction),
      };
    }
  );

  // We need to sort before passing it to makeMigrationTransactions to correctly calculate the assets
  const sortedTransactions = hashToCombinedTransactionWithType.sort(
    (a, b) =>
      // When we have no transaction, we should always have an erc20Transactions
      Number(
        a.transaction?.blockNumber ??
          a.erc20Transactions[0]?.blockNumber ??
          a.internalTransactions[0]?.blockNumber ??
          0
      ) -
      Number(
        b.transaction?.blockNumber ??
          b.erc20Transactions[0]?.blockNumber ??
          b.internalTransactions[0]?.blockNumber ??
          0
      )
  );

  const migrationTransactions = makeMigrationTransactions(address, sortedTransactions);
  const transactionsWithMigrations = [...sortedTransactions, ...migrationTransactions];

  return transactionsWithMigrations.sort(
    (a, b) =>
      // When we have no transaction, we should always have an erc20Transactions
      Number(
        a.transaction?.blockNumber ??
          a.erc20Transactions[0]?.blockNumber ??
          a.internalTransactions[0]?.blockNumber ??
          0
      ) -
      Number(
        b.transaction?.blockNumber ??
          b.erc20Transactions[0]?.blockNumber ??
          b.internalTransactions[0]?.blockNumber ??
          0
      )
  );
};
