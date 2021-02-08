import { isSameAddress } from '../../../utils/isSameAddress';
import { CombinedTransaction } from './combineTransactions';

export enum TransactionType {
  Unknown = 'Unknown',
  Withdraw = 'Withdraw',
  Deposit = 'Deposit',
  Swap2ERC20 = 'Swap2ERC20',
  SwapERC20WithEth = 'SwapERC20WithEth',
  NonSupportedERC20 = 'NonSupportedERC20',
  Approval = 'Approval',
  Execution = 'Execution',
  ERC20Deposit = 'ERC20Deposit',
  ERC20Withdraw = 'ERC20Withdraw',
  InternalOnlyBoth = 'InternalOnlyBoth',
  InternalOnlyWithdraw = 'InternalOnlyWithdraw',
  InternalOnlyDeposit = 'InternalOnlyDeposit',
  TokenMigration = 'TokenMigration',
}

// Input Value of an approval transaction (not sure if this is always the case though...)
const APPROVAL_INPUT =
  '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const getTransactionType = (transaction: CombinedTransaction) => {
  const address = transaction.originAddress;
  const hasTransactionValue = transaction.transaction && transaction.transaction.value !== '0';

  const hasInternalIncomingValue =
    transaction.internalTransactions.filter(
      (transaction) => transaction.value !== '0' && isSameAddress(transaction.to, address)
    ).length > 0;
  const hasInternalOutgoingValue =
    transaction.internalTransactions.filter(
      (transaction) => transaction.value !== '0' && isSameAddress(transaction.from, address)
    ).length > 0;

  const hasValue = hasTransactionValue || hasInternalIncomingValue;
  const isReceivingTransactionEther =
    hasValue && transaction.transaction?.to.toLocaleLowerCase() === address.toLocaleLowerCase();

  const isReceivingInternalEther = hasInternalIncomingValue;

  const isReceivingEther = isReceivingTransactionEther || isReceivingInternalEther;

  const isSendingEther =
    hasValue && transaction.transaction?.from.toLocaleLowerCase() === address.toLocaleLowerCase();
  const isApproval = transaction.transaction?.input === APPROVAL_INPUT;

  if (transaction.erc20Transactions.length > 0) {
    const receivingERC20Count = transaction.erc20Transactions.filter(
      ({ to }) => to.toLocaleLowerCase() === address.toLocaleLowerCase()
    ).length;
    const sendingERC20Count = transaction.erc20Transactions.filter(
      ({ from }) => from.toLocaleLowerCase() === address.toLocaleLowerCase()
    ).length;

    if (sendingERC20Count === 1 && receivingERC20Count === 1) {
      return TransactionType.Swap2ERC20;
    }
    if (isReceivingEther && sendingERC20Count === 1) {
      return TransactionType.SwapERC20WithEth;
    }
    if (isSendingEther && receivingERC20Count === 1) {
      return TransactionType.SwapERC20WithEth;
    }

    if (sendingERC20Count === 1 && receivingERC20Count === 0 && !isReceivingEther) {
      return TransactionType.ERC20Withdraw;
    }

    if (receivingERC20Count === 1 && sendingERC20Count === 0 && !isReceivingEther) {
      return TransactionType.ERC20Deposit;
    }

    return TransactionType.NonSupportedERC20;
  }

  if (!transaction.transaction) {
    if (transaction.internalTransactions.length) {
      if (hasInternalIncomingValue && hasInternalOutgoingValue) {
        return TransactionType.InternalOnlyBoth;
      }
      if (hasInternalIncomingValue) {
        return TransactionType.InternalOnlyDeposit;
      }
      if (hasInternalOutgoingValue) {
        return TransactionType.InternalOnlyWithdraw;
      }
    }
    return TransactionType.Unknown;
  }

  if (isReceivingEther) {
    return TransactionType.Deposit;
  }

  if (isSendingEther) {
    return TransactionType.Withdraw;
  }

  if (isApproval) {
    return TransactionType.Approval;
  }

  // If we have a contractAddress and are not receiving, we assume it is an execution to a contract
  if (
    transaction.transaction.contractAddress !== '' ||
    (transaction.transaction.input !== '' && transaction.transaction.input !== '0x')
  ) {
    return TransactionType.Execution;
  }

  return TransactionType.Unknown;
};
