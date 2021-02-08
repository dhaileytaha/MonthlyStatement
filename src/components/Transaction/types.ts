import { CombinedTransaction } from '../../modules/transactions/combineTransactions/combineTransactions';

export interface TransactionProps {
  combinedTransaction: CombinedTransaction;
  index: number;
}
