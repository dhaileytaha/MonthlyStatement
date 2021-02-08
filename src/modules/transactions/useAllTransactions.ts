import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { tokenMigrations } from '../../data/tokenMigrations';
import { sortTransactionBydate } from '../../utils/array';
import { wait } from '../../utils/wait';
import { TransactionStatus, TransactionType } from './combineTransactions';
import { adjustForMigrations } from './combineTransactions/adjustForMigrations';
import {
  CombinedTransactions,
  combineTransactions,
} from './combineTransactions/combineTransactions';
import { fetchAllERC20Transactions } from './fetchTransactions/fetchAllERC20Transactions';
import { fetchAllInternalTransactions } from './fetchTransactions/fetchAllInternalTransactions';
import { fetchAllTransactions } from './fetchTransactions/fetchAllTransactions';

dayjs.extend(isBetween);

export const useAllTransactions = ({
  addresses,
  startDate,
  endDate,
}: {
  addresses: string[];
  startDate: Date;
  endDate: Date;
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [transactions, setTransactions] = useState<CombinedTransactions>([]);

  const fetchTransactionsForOneAddress = useCallback(async (address: string) => {
    await wait(1000);

    const allTransactions = await fetchAllTransactions({
      address,
    });
    const allErcTransactions = await fetchAllERC20Transactions({
      address,
    });
    const allInternalTransactions = await fetchAllInternalTransactions({
      address,
    });

    const combinedTransactions = combineTransactions(
      address,
      allTransactions,
      allErcTransactions,
      allInternalTransactions
    );

    const adjustedTransactionsForTokenMigrations = adjustForMigrations(combinedTransactions);

    return adjustedTransactionsForTokenMigrations;
  }, []);

  const fetchTransactions = useCallback(async () => {
    let allTransactions: CombinedTransactions = [];

    setIsFetching(true);
    setError(null);
    try {
      for (let i = 0; i < addresses.length; i++) {
        const transactions = await fetchTransactionsForOneAddress(addresses[i]);
        allTransactions = [...allTransactions, ...transactions];
      }

      setTransactions(allTransactions.sort(sortTransactionBydate));
      setHasFetched(true);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsFetching(false);
    }
  }, [addresses]);

  const reset = useCallback(()=>{
    setIsFetching(false);
    setHasFetched(false);
    setError(null);
    setTransactions([]);
  },[])

  useEffect(() => {
    reset()
  }, [addresses, startDate, endDate]);

  const transactionsWithinDateRange = useMemo(() => {
    return transactions.filter((transaction) => {
      return dayjs(transaction.date).isBetween(startDate, endDate, null, '[]');
    });
  }, [transactions, startDate, endDate]);

  return {
    fetchTransactions,
    transactionsWithinDateRange,
    transactions,
    error,
    isFetching,
    hasFetched,
    reset
  };
};
