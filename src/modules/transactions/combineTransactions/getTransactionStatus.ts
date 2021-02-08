import {
  Transaction,
  ERC20Transaction,
  InternalTransaction,
} from '../../../api/etherscan/accounts';

export enum TransactionStatus {
  Success = 'Success',
  Error = 'Error',
}

export const getTransactionStatus = (transaction: Transaction) => {
  if (transaction.isError === '1') {
    return TransactionStatus.Error;
  }

  return TransactionStatus.Success;
};

export const getTransactionStatusForERC20Transaction = (transaction: ERC20Transaction) => {
  return TransactionStatus.Success;
};

export const getTransactionStatusForInternalTransaction = (transaction: InternalTransaction) => {
  return TransactionStatus.Success;
};
