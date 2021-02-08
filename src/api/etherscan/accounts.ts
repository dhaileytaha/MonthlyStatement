import { etherScanGet } from './base';

type AccountBalance = string;

export const getAccountBalance = (address: string) =>
  etherScanGet<AccountBalance>('account', 'balance', {
    address,
    tag: 'latest',
  });

// Data that is shared between a normal transaction and a ERC20 transaction
interface BaseTransaction {
  blockNumber: string;
  contractAddress: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  timeStamp: string;
  to: string;
  value: string;
}

// Note we always get a string returned, even if it is empty("") or a number("12")
export interface Transaction extends BaseTransaction {
  blockHash: string;
  confirmations: string;
  cumulativeGasUsed: string;
  gasPrice: string;
  isError: string;
  nonce: string;
  transactionIndex: string;
  txreceipt_status: string;
}
export type Transactions = Transaction[];

// Returns up to a maximum of the last 10000 transactions only
// Contains also ERC20 transactions (as 'normal' transactions)
export const getAllTransactions = (
  address: string,
  startBlock: number,
  endBlock: number,
  page?: number,
  offset?: number
) =>
  etherScanGet<Transactions>('account', 'txlist', {
    address,
    startBlock,
    endBlock,
    page,
    offset,
    sort: 'asc',
    tag: 'latest',
  }).catch((error) => {
    if (error.message === 'No transactions found') {
      return [];
    } else {
      throw error;
    }
  });

// Note we always get a string returned, even if it is empty("") or a number("12")
export interface ERC20Transaction extends BaseTransaction {
  blockHash: string;
  confirmations: string;
  cumulativeGasUsed: string;
  gasPrice: string;
  nonce: string;
  transactionIndex: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
}
export type ERC20Transactions = ERC20Transaction[];

// Returns up to a maximum of the last 10000 transactions only
export const getAllERC20Transactions = (
  address: string,
  startBlock: number,
  endBlock: number,
  page?: number,
  offset?: number
) =>
  etherScanGet<ERC20Transactions>('account', 'tokentx', {
    address,
    startBlock,
    endBlock,
    page,
    offset,
    sort: 'asc',
    tag: 'latest',
  }).catch((error) => {
    if (error.message === 'No transactions found') {
      return [];
    } else {
      throw error;
    }
  });

export interface InternalTransaction extends BaseTransaction {
  errCode: string;
  traceId: string;
  type: 'call' | 'sucicide'; //Probably more
}
export type InternalTransactions = InternalTransaction[];

// Returns up to a maximum of the last 10000 transactions only
export const getAllInternalTransactions = (
  address: string,
  startBlock: number,
  endBlock: number,
  page?: number,
  offset?: number
) =>
  etherScanGet<InternalTransactions>('account', 'txlistinternal', {
    address,
    startBlock,
    endBlock,
    page,
    offset,
    sort: 'asc',
    tag: 'latest',
  }).catch((error) => {
    if (error.message === 'No transactions found') {
      return [];
    } else {
      throw error;
    }
  });
